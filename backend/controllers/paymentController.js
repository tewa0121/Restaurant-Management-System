const PaymentService = require('../services/paymentService');
const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/response');

exports.list = asyncHandler(async (req, res) => {
  const { rows, summary, pagination } = await PaymentService.list(req.query, req.user);
  res.status(200).json({ success: true, data: rows, summary, pagination });
});

exports.get = asyncHandler(async (req, res) => {
  ok(res, await PaymentService.get(req.params.id, req.user));
});

exports.pay = asyncHandler(async (req, res) => {
  const { payment, invoice, change, orderCompleted } = await PaymentService.pay(req.body, req.user);
  res.status(201).json({
    success: true,
    message: invoice.status === 'paid' ? 'Payment received. Invoice paid in full.' : 'Payment received.',
    data: payment,
    invoice,
    change,
    orderCompleted,
  });
});