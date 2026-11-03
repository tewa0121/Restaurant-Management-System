const InvoiceService = require('../services/invoiceService');
const asyncHandler = require('../utils/asyncHandler');
const { ok, list } = require('../utils/response');

exports.list = asyncHandler(async (req, res) => {
  const { rows, pagination } = await InvoiceService.list(req.query);
  list(res, rows, pagination);
});

exports.mine = asyncHandler(async (req, res) => {
  const { rows, pagination } = await InvoiceService.listMine(req.user, req.query);
  list(res, rows, pagination);
});

exports.get = asyncHandler(async (req, res) => {
  ok(res, await InvoiceService.get(req.params.id, req.user));
});

exports.getByOrder = asyncHandler(async (req, res) => {
  ok(res, await InvoiceService.getByOrder(req.params.orderId, req.user));
});

exports.generate = asyncHandler(async (req, res) => {
  const { invoice, created } = await InvoiceService.generate(req.body.orderId, req.user);
  ok(res, invoice, { message: created ? 'Invoice generated.' : 'Invoice already exists for this order.' }, created ? 201 : 200);
});

exports.hold = asyncHandler(async (req, res) => {
  ok(res, await InvoiceService.hold(req.params.id, req.user), { message: 'Bill put on hold.' });
});

exports.resume = asyncHandler(async (req, res) => {
  ok(res, await InvoiceService.resume(req.params.id, req.user), { message: 'Bill resumed.' });
});

exports.remove = asyncHandler(async (req, res) => {
  const result = await InvoiceService.remove(req.params.id, req.user);
  res.status(200).json({ success: true, ...result });
});