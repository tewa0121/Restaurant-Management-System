const InvoiceModel = require('../models/invoiceModel');
const OrderModel = require('../models/orderModel');
const EmployeeModel = require('../models/employeeModel');
const TableModel = require('../models/tableModel');
const CashSessionModel = require('../models/cashSessionModel');
const InvoiceService = require('./invoiceService');
const { round2 } = require('./pricingService');
const AppError = require('../utils/AppError');
const { withTransaction } = require('../utils/transaction');
const { logActivity } = require('../utils/activityLog');
const { toOffset, pageMeta } = require('../utils/pagination');
const { normalizeEnum } = require('../utils/enums');
const { hasRole } = require('../middleware/roleMiddleware');
const { ROLES, PAYMENT_STATUSES } = require('../utils/constants');

const METHOD_ALIASES = {
  cash: 'cash',
  card: 'card',
  credit_card: 'card',
  debit_card: 'card',
  mobile_banking: 'mobile_banking',
  mobile: 'mobile_banking',
  telebirr: 'telebirr',
  tele_birr: 'telebirr',
  cbe_birr: 'cbe_birr',
  cbebirr: 'cbe_birr',
  cbe: 'cbe_birr',
  paypal: 'paypal',
  apple_pay: 'apple_pay',
  applepay: 'apple_pay',
  other: 'other',
};

const REFERENCE_REQUIRED = ['mobile_banking', 'telebirr', 'cbe_birr'];
const managers = [ROLES.MANAGER, ROLES.ADMIN];

function normalizeMethod(value) {
  const key = String(value).trim().toLowerCase().replace(/[\s-]+/g, '_');
  const method = METHOD_ALIASES[key];
  if (!method) throw new AppError(`Payment method must be one of: ${Object.keys(InvoiceService.PAYMENT_LABELS).join(', ')}`, 422, 'VALIDATION_ERROR');
  return method;
}

async function releaseTables(conn, orderId) {
  const tables = await OrderModel.tablesForOrders([orderId], conn);
  for (const entry of tables) {
    const table = await TableModel.lockById(entry.id, conn);
    if (!table || table.status !== 'occupied') continue;
    if (await InvoiceModel.tableHasOtherOpenOrders(entry.id, orderId, conn)) continue;
    await TableModel.releaseAssignments(entry.id, conn);
    await TableModel.setStatus(entry.id, 'cleaning', conn);
  }
}

async function completeOrderIfPaid(conn, invoice) {
  const order = await OrderModel.findById(invoice.order_id, conn);
  if (!order) return false;

  const closable = order.status === 'served' || (order.order_type !== 'dine_in' && order.status === 'ready');
  if (closable) {
    await OrderModel.setStatus(order.id, 'completed', conn);
    if (order.customer_id) await OrderModel.bumpCustomerStats(order.customer_id, Number(order.total_amount), conn);
    await releaseTables(conn, order.id);
    return true;
  }
  if (order.status === 'completed') await releaseTables(conn, order.id);
  return false;
}

const PaymentService = {
  normalizeMethod,
  releaseTables,

  async list({ invoiceId, method, status, mine, date, from, to, search, page, limit }, user) {
    const filters = {
      invoiceId,
      method: method ? normalizeMethod(method) : undefined,
      status: status ? normalizeEnum(status, PAYMENT_STATUSES, 'Status') : undefined,
      date,
      from,
      to,
      search,
    };
    if (mine || !hasRole(user, managers)) {
      const employee = await EmployeeModel.findByUserId(user.id);
      filters.receivedBy = employee ? employee.id : -1;
    }
    const [rows, summary] = await Promise.all([
      InvoiceModel.listPayments(filters, { limit, offset: toOffset(page, limit) }),
      InvoiceModel.paymentSummary(filters),
    ]);
    return { rows: rows.map(InvoiceService.toPaymentDto), summary, pagination: pageMeta(page, limit, summary.count) };
  },

  async get(id, user) {
    const row = await InvoiceModel.findPayment(id);
    if (!row) throw new AppError('Payment not found.', 404, 'PAYMENT_NOT_FOUND');
    if (user && !hasRole(user, managers)) {
      const employee = await EmployeeModel.findByUserId(user.id);
      if (!employee || employee.id !== row.received_by) throw new AppError('Payment not found.', 404, 'PAYMENT_NOT_FOUND');
    }
    return InvoiceService.toPaymentDto(row);
  },

  async pay(body, actor) {
    const method = normalizeMethod(body.method);
    if (REFERENCE_REQUIRED.includes(method) && !body.transactionId) {
      throw new AppError('A transaction reference is required for this payment method.', 422, 'VALIDATION_ERROR');
    }

    const employee = await EmployeeModel.findByUserId(actor.id);
    if (method === 'cash' && !hasRole(actor, managers)) {
      const session = employee ? await CashSessionModel.findOpenByCashier(employee.id) : null;
      if (!session) throw new AppError('Open your cash session before accepting cash.', 409, 'NO_CASH_SESSION');
    }

    const result = await withTransaction(async (conn) => {
      if (!(await InvoiceModel.lockById(body.invoiceId, conn))) throw new AppError('Invoice not found.', 404, 'INVOICE_NOT_FOUND');
      const found = await InvoiceModel.findById(body.invoiceId, conn);
      const invoice = await InvoiceService.syncStale(conn, found);

      if (invoice.status === 'paid') throw new AppError('This invoice is already paid.', 409, 'ALREADY_PAID');
      if (invoice.status === 'refunded') throw new AppError('This invoice has been refunded.', 409, 'INVALID_STATE');
      if (invoice.status === 'held') throw new AppError('This bill is on hold. Resume it before taking payment.', 409, 'INVOICE_HELD');

      const balance = round2(Number(invoice.total) - Number(invoice.paid_amount));
      const amount = body.amount === undefined ? balance : round2(body.amount);
      if (amount <= 0) throw new AppError('The payment amount must be greater than zero.', 422, 'VALIDATION_ERROR');
      if (amount > balance + 0.004) throw new AppError(`The amount exceeds the balance due (${balance.toFixed(2)}).`, 422, 'AMOUNT_EXCEEDS_BALANCE');

      let change = 0;
      if (method === 'cash' && body.tendered !== undefined) {
        if (body.tendered < amount) throw new AppError('The cash tendered is less than the amount being paid.', 422, 'VALIDATION_ERROR');
        change = round2(body.tendered - amount);
      }
      if (body.transactionId && (await InvoiceModel.transactionExists(method, body.transactionId, conn))) {
        throw new AppError('This transaction reference has already been used.', 409, 'DUPLICATE_TRANSACTION');
      }

      const paymentId = await InvoiceModel.insertPayment(
        { invoiceId: invoice.id, amount, method, transactionId: body.transactionId, receivedBy: employee ? employee.id : null },
        conn
      );
      const paid = round2(Number(invoice.paid_amount) + amount);
      const fullyPaid = paid >= Number(invoice.total) - 0.004;
      await InvoiceModel.updatePaymentState(invoice.id, { paidAmount: paid, status: fullyPaid ? 'paid' : 'partially_paid' }, conn);
      const orderCompleted = fullyPaid ? await completeOrderIfPaid(conn, invoice) : false;

      return { paymentId, invoiceId: invoice.id, orderNumber: invoice.order_number, amount, change, orderCompleted };
    });

    logActivity({
      userId: actor.id,
      action: `Received ${result.amount.toFixed(2)} (${method}) for order ${result.orderNumber}`,
      activityType: 'billing',
      entityType: 'payment',
      entityId: result.paymentId,
      newValue: { method, amount: result.amount, invoiceId: result.invoiceId },
    });

    return {
      payment: await PaymentService.get(result.paymentId),
      invoice: await InvoiceService.get(result.invoiceId, actor),
      change: result.change,
      orderCompleted: result.orderCompleted,
    };
  },
};

module.exports = PaymentService;