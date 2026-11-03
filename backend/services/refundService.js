const RefundModel = require('../models/refundModel');
const InvoiceModel = require('../models/invoiceModel');
const InvoiceService = require('./invoiceService');
const { round2 } = require('./pricingService');
const AppError = require('../utils/AppError');
const { withTransaction } = require('../utils/transaction');
const { logActivity } = require('../utils/activityLog');
const { toOffset, pageMeta } = require('../utils/pagination');
const { normalizeEnum } = require('../utils/enums');
const { hasRole } = require('../middleware/roleMiddleware');
const { ROLES, REFUND_STATUSES } = require('../utils/constants');

const managers = [ROLES.MANAGER, ROLES.ADMIN];

const requireRefund = async (id) => {
  const row = await RefundModel.findById(id);
  if (!row) throw new AppError('Refund not found.', 404, 'REFUND_NOT_FOUND');
  return row;
};

async function applyApproval(conn, refund, approverId) {
  await RefundModel.lockById(refund.id, conn);
  await InvoiceModel.lockById(refund.invoice_id, conn);

  const payment = await InvoiceModel.findPayment(refund.payment_id, conn);
  const sums = await RefundModel.sumsForPayment(refund.payment_id, conn);
  const alreadyApproved = sums.approved;
  if (alreadyApproved + Number(refund.amount) > Number(payment.amount) + 0.004) {
    throw new AppError('This refund exceeds the amount left on the payment.', 422, 'AMOUNT_EXCEEDS_BALANCE');
  }

  const invoice = await InvoiceModel.findById(refund.invoice_id, conn);
  const amount = Number(refund.amount);
  const newPaid = round2(Number(invoice.paid_amount) - amount);

  if (invoice.status === 'paid') {
    const newTotal = round2(Number(invoice.total) - amount);
    await InvoiceModel.updateTotal(invoice.id, newTotal, conn);
    await InvoiceModel.updatePaymentState(invoice.id, { paidAmount: newPaid, status: newTotal <= 0.004 ? 'refunded' : 'paid' }, conn);
  } else {
    await InvoiceModel.updatePaymentState(invoice.id, { paidAmount: newPaid, status: newPaid <= 0.004 ? 'unpaid' : 'partially_paid' }, conn);
  }

  if (alreadyApproved + amount >= Number(payment.amount) - 0.004) {
    await InvoiceModel.setPaymentStatus(payment.id, 'refunded', conn);
  }
  await RefundModel.setStatus(refund.id, 'approved', approverId, conn);
}

const RefundService = {
  async list({ status, mine, invoiceId, paymentId, page, limit }, user) {
    const filters = {
      status: status ? normalizeEnum(status, REFUND_STATUSES, 'Status') : undefined,
      invoiceId,
      paymentId,
    };
    if (mine || !hasRole(user, managers)) filters.requestedBy = user.id;

    const [rows, total] = await Promise.all([
      RefundModel.list(filters, { limit, offset: toOffset(page, limit) }),
      RefundModel.count(filters),
    ]);
    return { rows: rows.map(InvoiceService.toRefundDto), pagination: pageMeta(page, limit, total) };
  },

  async get(id, user) {
    const row = await requireRefund(id);
    if (!hasRole(user, managers) && row.requested_by !== user.id) throw new AppError('Refund not found.', 404, 'REFUND_NOT_FOUND');
    return InvoiceService.toRefundDto(row);
  },

  async request(body, actor) {
    const payment = await InvoiceModel.findPayment(body.paymentId);
    if (!payment) throw new AppError('Payment not found.', 404, 'PAYMENT_NOT_FOUND');
    if (payment.payment_status !== 'completed') {
      throw new AppError('Only completed payments can be refunded.', 409, 'INVALID_STATE');
    }

    const sums = await RefundModel.sumsForPayment(payment.id);
    const remaining = round2(Number(payment.amount) - sums.approved - sums.pending);
    const amount = body.amount === undefined ? remaining : round2(body.amount);
    if (amount <= 0) throw new AppError('Nothing is left to refund on this payment.', 409, 'INVALID_STATE');
    if (amount > remaining + 0.004) {
      throw new AppError(`The refund cannot exceed the amount left on the payment (${remaining.toFixed(2)}).`, 422, 'AMOUNT_EXCEEDS_BALANCE');
    }

    const autoApprove = hasRole(actor, managers);
    const refundId = await withTransaction(async (conn) => {
      const id = await RefundModel.insert(
        {
          paymentId: payment.id,
          invoiceId: payment.invoice_id,
          amount,
          reason: body.reason,
          requestedBy: actor.id,
          status: 'pending',
          approvedBy: null,
        },
        conn
      );
      if (autoApprove) {
        const created = await RefundModel.findById(id, conn);
        await applyApproval(conn, created, actor.id);
      }
      return id;
    });

    logActivity({
      userId: actor.id,
      action: `Refund of ${amount.toFixed(2)} ${autoApprove ? 'issued' : 'requested'} for invoice ${payment.invoice_number}`,
      activityType: 'billing',
      entityType: 'refund',
      entityId: refundId,
      newValue: { amount, reason: body.reason },
    });
    return InvoiceService.toRefundDto(await requireRefund(refundId));
  },

  async approve(id, actor) {
    const refund = await requireRefund(id);
    if (refund.status !== 'pending') throw new AppError(`This refund is already ${refund.status}.`, 409, 'INVALID_STATE');

    await withTransaction((conn) => applyApproval(conn, refund, actor.id));
    logActivity({
      userId: actor.id,
      action: `Approved refund ${id} for invoice ${refund.invoice_number}`,
      activityType: 'billing',
      entityType: 'refund',
      entityId: id,
    });
    return InvoiceService.toRefundDto(await requireRefund(id));
  },

  async reject(id, actor) {
    const refund = await requireRefund(id);
    if (refund.status !== 'pending') throw new AppError(`This refund is already ${refund.status}.`, 409, 'INVALID_STATE');

    await RefundModel.setStatus(id, 'rejected', actor.id);
    logActivity({
      userId: actor.id,
      action: `Rejected refund ${id} for invoice ${refund.invoice_number}`,
      activityType: 'billing',
      entityType: 'refund',
      entityId: id,
    });
    return InvoiceService.toRefundDto(await requireRefund(id));
  },
};

module.exports = RefundService;