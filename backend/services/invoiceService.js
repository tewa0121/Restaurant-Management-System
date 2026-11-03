const InvoiceModel = require('../models/invoiceModel');
const RefundModel = require('../models/refundModel');
const OrderModel = require('../models/orderModel');
const EmployeeModel = require('../models/employeeModel');
const CustomerModel = require('../models/customerModel');
const OrderService = require('./orderService');
const { round2 } = require('./pricingService');
const AppError = require('../utils/AppError');
const crypto = require('crypto');
const { withTransaction } = require('../utils/transaction');
const { logActivity } = require('../utils/activityLog');
const { toOffset, pageMeta } = require('../utils/pagination');
const { normalizeEnum, titleCase } = require('../utils/enums');
const { hasRole } = require('../middleware/roleMiddleware');
const { STAFF_ROLES, INVOICE_STATUSES } = require('../utils/constants');

const isStaff = (user) => hasRole(user, STAFF_ROLES);
const same = (a, b) => Math.abs(Number(a) - Number(b)) < 0.005;
const cleanName = (value) => (value && value.trim() ? value.trim() : null);

const PAYMENT_LABELS = {
  cash: 'Cash',
  card: 'Card',
  mobile_banking: 'Mobile Banking',
  telebirr: 'Telebirr',
  cbe_birr: 'CBE Birr',
  paypal: 'PayPal',
  apple_pay: 'Apple Pay',
  other: 'Other',
};

function toPaymentDto(row) {
  const amount = Number(row.amount);
  const refunded = Number(row.refunded_amount || 0);
  const receivedByName = cleanName(row.received_by_name);

  return {
    id: row.id,
    invoice_id: row.invoice_id,
    invoiceId: row.invoice_id,
    invoice_number: row.invoice_number,
    invoiceNumber: row.invoice_number,
    order_number: row.order_number,
    orderNumber: row.order_number,
    amount,
    payment_method: row.payment_method,
    method: row.payment_method,
    methodLabel: PAYMENT_LABELS[row.payment_method] || titleCase(row.payment_method),
    transaction_id: row.transaction_id,
    transactionId: row.transaction_id,
    payment_status: row.payment_status,
    status: row.payment_status,
    statusLabel: titleCase(row.payment_status),
    received_by: row.received_by,
    received_by_name: receivedByName,
    cashier: receivedByName,
    paid_at: row.paid_at,
    paidAt: row.paid_at,
    refunded_amount: refunded,
    refundedAmount: refunded,
    refundable: round2(amount - refunded),
  };
}

function toRefundDto(row) {
  return {
    id: row.id,
    payment_id: row.payment_id,
    paymentId: row.payment_id,
    invoice_id: row.invoice_id,
    invoiceId: row.invoice_id,
    invoice_number: row.invoice_number,
    invoiceNumber: row.invoice_number,
    order_number: row.order_number,
    orderNumber: row.order_number,
    payment_method: row.payment_method,
    method: row.payment_method,
    payment_amount: Number(row.payment_amount),
    amount: Number(row.amount),
    reason: row.reason,
    status: row.status,
    statusLabel: titleCase(row.status),
    requested_by: row.requested_by,
    requestedBy: cleanName(row.requested_by_name),
    approved_by: row.approved_by,
    approvedBy: cleanName(row.approved_by_name),
    created_at: row.created_at,
    createdAt: row.created_at,
    processed_at: row.processed_at || null,
    processedAt: row.processed_at || null,
  };
}

function toDto(row) {
  const subtotal = Number(row.subtotal);
  const tax = Number(row.tax);
  const discount = Number(row.discount);
  const total = Number(row.total);
  const paid = Number(row.paid_amount);
  const customerName = cleanName(row.customer_name);

  return {
    id: row.id,
    order_id: row.order_id,
    orderId: row.order_id,
    order_number: row.order_number,
    orderNumber: row.order_number,
    order_status: row.order_status,
    order_type: row.order_type,
    orderType: row.order_type,
    invoice_number: row.invoice_number,
    invoiceNumber: row.invoice_number,
    number: `#${row.invoice_number}`,
    customer_id: row.customer_id,
    customer_name: customerName,
    customerName,
    table_numbers: row.table_numbers || null,
    tables: row.table_numbers ? row.table_numbers.split(', ').map((number) => `Table ${number}`).join(', ') : null,
    subtotal,
    tax,
    discount,
    deliveryFee: Math.max(0, round2(total - (subtotal - discount + tax))),
    total,
    paid_amount: paid,
    paidAmount: paid,
    balance: round2(total - paid),
    status: row.status,
    statusLabel: titleCase(row.status),
    generated_by: row.generated_by,
    generated_by_name: cleanName(row.generated_by_name),
    generated_at: row.generated_at,
    generatedAt: row.generated_at,
  };
}

async function syncStale(conn, invoice) {
  if (!['unpaid', 'held', 'partially_paid'].includes(invoice.status)) return invoice;

  const order = await OrderModel.findById(invoice.order_id, conn);
  if (!order) return invoice;

  const unchanged =
    same(invoice.subtotal, order.subtotal) &&
    same(invoice.tax, order.tax_amount) &&
    same(invoice.discount, order.discount_amount) &&
    same(invoice.total, order.total_amount);
  if (unchanged) return invoice;

  await InvoiceModel.updateAmounts(
    invoice.id,
    { subtotal: order.subtotal, tax: order.tax_amount, discount: order.discount_amount, total: order.total_amount },
    conn
  );
  if (Number(invoice.paid_amount) > 0 && Number(invoice.paid_amount) >= Number(order.total_amount) - 0.004) {
    await InvoiceModel.updatePaymentState(invoice.id, { paidAmount: invoice.paid_amount, status: 'paid' }, conn);
  }
  return InvoiceModel.findById(invoice.id, conn);
}

const requireInvoice = async (id) => {
  const row = await InvoiceModel.findById(id);
  if (!row) throw new AppError('Invoice not found.', 404, 'INVOICE_NOT_FOUND');
  return row;
};

async function buildDetail(row) {
  const [payments, refunds, orderRow] = await Promise.all([
    InvoiceModel.paymentsForInvoice(row.id),
    RefundModel.forInvoice(row.id),
    OrderModel.findById(row.order_id),
  ]);
  const [order] = await OrderService.hydrate([orderRow]);

  return {
    ...toDto(row),
    items: order.items,
    order: {
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      type: order.order_type,
      tables: order.tableNames,
      customer_name: order.customer_name,
      waiter_name: order.waiter_name,
      notes: order.notes,
    },
    payments: payments.map(toPaymentDto),
    refunds: refunds.map(toRefundDto),
  };
}

const InvoiceService = {
  toDto,
  toPaymentDto,
  toRefundDto,
  syncStale,
  PAYMENT_LABELS,

  async list({ status, orderId, date, from, to, search, page, limit }) {
    const filters = {
      status: status ? normalizeEnum(status, INVOICE_STATUSES, 'Status') : undefined,
      orderId,
      date,
      from,
      to,
      search,
    };
    const [rows, total] = await Promise.all([
      InvoiceModel.list(filters, { limit, offset: toOffset(page, limit) }),
      InvoiceModel.count(filters),
    ]);
    return { rows: rows.map(toDto), pagination: pageMeta(page, limit, total) };
  },

  async listMine(user, { status, page, limit }) {
    const customer = await CustomerModel.findByUserId(user.id);
    if (!customer) throw new AppError('No customer profile is linked to this account.', 404, 'CUSTOMER_NOT_FOUND');
    const filters = { customerId: customer.id, status: status ? normalizeEnum(status, INVOICE_STATUSES, 'Status') : undefined };
    const [rows, total] = await Promise.all([
      InvoiceModel.list(filters, { limit, offset: toOffset(page, limit) }),
      InvoiceModel.count(filters),
    ]);
    return { rows: rows.map(toDto), pagination: pageMeta(page, limit, total) };
  },

  async get(id, user) {
    let row = await requireInvoice(id);
    if (!isStaff(user)) {
      const customer = await CustomerModel.findByUserId(user.id);
      if (!customer || row.customer_id !== customer.id) throw new AppError('Invoice not found.', 404, 'INVOICE_NOT_FOUND');
    }
    row = await syncStale(null, row);
    return buildDetail(row);
  },

  async getByOrder(orderId, user) {
    const row = await InvoiceModel.findLatestByOrder(orderId);
    if (!row) throw new AppError('This order has no invoice yet.', 404, 'INVOICE_NOT_FOUND');
    return InvoiceService.get(row.id, user);
  },

  async generate(orderId, actor) {
    const order = await OrderModel.findById(orderId);
    if (!order) throw new AppError('Order not found.', 404, 'ORDER_NOT_FOUND');
    if (order.status === 'cancelled') throw new AppError('A cancelled order cannot be billed.', 409, 'ORDER_CANCELLED');

    const existing = await InvoiceModel.findLatestByOrder(orderId);
    if (existing && existing.status !== 'refunded') {
      const synced = await syncStale(null, existing);
      return { invoice: await buildDetail(synced), created: false };
    }

    const employee = await EmployeeModel.findByUserId(actor.id);
    const id = await withTransaction(async (conn) => {
      const invoiceId = await InvoiceModel.insert(
        {
          orderId,
          invoiceNumber: `T${crypto.randomUUID().replace(/-/g, '').slice(0, 18)}`,
          subtotal: order.subtotal,
          tax: order.tax_amount,
          discount: order.discount_amount,
          total: order.total_amount,
          generatedBy: employee ? employee.id : null,
        },
        conn
      );
      await InvoiceModel.setNumber(invoiceId, `INV-${String(invoiceId).padStart(4, '0')}`, conn);
      return invoiceId;
    });

    logActivity({
      userId: actor.id,
      action: `Generated invoice for order ${order.order_number}`,
      activityType: 'billing',
      entityType: 'invoice',
      entityId: id,
    });
    return { invoice: await buildDetail(await requireInvoice(id)), created: true };
  },

  async hold(id, actor) {
    const row = await requireInvoice(id);
    if (row.status === 'held') return buildDetail(row);
    if (row.status !== 'unpaid') {
      throw new AppError('Only an unpaid bill with no payments can be put on hold.', 409, 'INVALID_STATE');
    }
    await InvoiceModel.setStatus(id, 'held');
    logActivity({ userId: actor.id, action: `Held invoice ${row.invoice_number}`, activityType: 'billing', entityType: 'invoice', entityId: id });
    return buildDetail(await requireInvoice(id));
  },

  async resume(id, actor) {
    const row = await requireInvoice(id);
    if (row.status !== 'held') throw new AppError('This bill is not on hold.', 409, 'INVALID_STATE');
    await InvoiceModel.setStatus(id, 'unpaid');
    logActivity({ userId: actor.id, action: `Resumed invoice ${row.invoice_number}`, activityType: 'billing', entityType: 'invoice', entityId: id });
    return buildDetail(await requireInvoice(id));
  },

  async remove(id, actor) {
    const row = await requireInvoice(id);
    if ((await InvoiceModel.countPayments(id)) > 0) {
      throw new AppError('An invoice with payments cannot be deleted.', 409, 'HAS_RELATED_RECORDS');
    }
    await InvoiceModel.remove(id);
    logActivity({ userId: actor.id, action: `Deleted invoice ${row.invoice_number}`, activityType: 'billing', entityType: 'invoice', entityId: id });
    return { message: 'Invoice deleted successfully.' };
  },
};

module.exports = InvoiceService;