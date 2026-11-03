const OrderService = require('../services/orderService');
const asyncHandler = require('../utils/asyncHandler');
const { ok, list } = require('../utils/response');

exports.preview = asyncHandler(async (req, res) => {
  ok(res, await OrderService.preview(req.body, req.user));
});

exports.create = asyncHandler(async (req, res) => {
  ok(res, await OrderService.create(req.body, req.user), { message: 'Order placed successfully.' }, 201);
});

exports.list = asyncHandler(async (req, res) => {
  const { rows, pagination } = await OrderService.list(req.query, req.user);
  list(res, rows, pagination);
});

exports.kitchen = asyncHandler(async (req, res) => {
  const { rows, pagination } = await OrderService.kitchen(req.query);
  list(res, rows, pagination);
});

exports.mine = asyncHandler(async (req, res) => {
  const { rows, pagination } = await OrderService.listMine(req.user, req.query);
  list(res, rows, pagination);
});

exports.get = asyncHandler(async (req, res) => {
  ok(res, await OrderService.get(req.params.id, req.user));
});

exports.track = asyncHandler(async (req, res) => {
  ok(res, await OrderService.track(req.params.id, req.user));
});

exports.changeStatus = asyncHandler(async (req, res) => {
  ok(res, await OrderService.changeStatus(req.params.id, req.body, req.user), { message: 'Order status updated.' });
});

exports.cancelMine = asyncHandler(async (req, res) => {
  ok(res, await OrderService.cancelMine(req.params.id, req.user), { message: 'Order cancelled.' });
});

exports.update = asyncHandler(async (req, res) => {
  ok(res, await OrderService.update(req.params.id, req.body, req.user), { message: 'Order updated.' });
});

exports.setPriority = asyncHandler(async (req, res) => {
  ok(res, await OrderService.setPriority(req.params.id, req.body, req.user), { message: 'Priority updated.' });
});

exports.addItems = asyncHandler(async (req, res) => {
  ok(res, await OrderService.addItems(req.params.id, req.body, req.user), { message: 'Items added.' });
});

exports.removeItem = asyncHandler(async (req, res) => {
  ok(res, await OrderService.removeItem(req.params.id, req.params.itemId, req.user), { message: 'Item removed.' });
});

exports.updateItemStatus = asyncHandler(async (req, res) => {
  ok(res, await OrderService.updateItemStatus(req.params.id, req.params.itemId, req.body, req.user), { message: 'Item updated.' });
});

exports.addFeedback = asyncHandler(async (req, res) => {
  ok(res, await OrderService.addFeedback(req.params.id, req.body, req.user), { message: 'Thank you for your feedback.' }, 201);
});

exports.listFeedback = asyncHandler(async (req, res) => {
  const { rows, summary, pagination } = await OrderService.listFeedback(req.query);
  res.status(200).json({ success: true, data: rows, summary, pagination });
});