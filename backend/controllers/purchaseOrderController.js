const PurchaseOrderService = require('../services/purchaseOrderService');
const asyncHandler = require('../utils/asyncHandler');
const { ok, list } = require('../utils/response');

exports.list = asyncHandler(async (req, res) => {
  const { rows, pagination } = await PurchaseOrderService.list(req.query);
  list(res, rows, pagination);
});

exports.suggestions = asyncHandler(async (req, res) => {
  ok(res, await PurchaseOrderService.suggestions());
});

exports.get = asyncHandler(async (req, res) => {
  ok(res, await PurchaseOrderService.get(req.params.id));
});

exports.create = asyncHandler(async (req, res) => {
  ok(res, await PurchaseOrderService.create(req.body, req.user), { message: 'Purchase order created.' }, 201);
});

exports.update = asyncHandler(async (req, res) => {
  ok(res, await PurchaseOrderService.update(req.params.id, req.body, req.user), { message: 'Purchase order updated.' });
});

exports.send = asyncHandler(async (req, res) => {
  ok(res, await PurchaseOrderService.send(req.params.id, req.user), { message: 'Purchase order sent.' });
});

exports.cancel = asyncHandler(async (req, res) => {
  ok(res, await PurchaseOrderService.cancel(req.params.id, req.user), { message: 'Purchase order cancelled.' });
});

exports.receive = asyncHandler(async (req, res) => {
  ok(res, await PurchaseOrderService.receive(req.params.id, req.body, req.user), { message: 'Goods received and stock updated.' });
});

exports.remove = asyncHandler(async (req, res) => {
  const result = await PurchaseOrderService.remove(req.params.id, req.user);
  res.status(200).json({ success: true, ...result });
});