const DeliveryService = require('../services/deliveryService');
const asyncHandler = require('../utils/asyncHandler');
const { ok, list } = require('../utils/response');

exports.list = asyncHandler(async (req, res) => {
  const { rows, pagination } = await DeliveryService.list(req.query);
  list(res, rows, pagination);
});

exports.drivers = asyncHandler(async (req, res) => {
  ok(res, await DeliveryService.drivers());
});

exports.get = asyncHandler(async (req, res) => {
  ok(res, await DeliveryService.get(req.params.orderId, req.user));
});

exports.assign = asyncHandler(async (req, res) => {
  ok(res, await DeliveryService.assign(req.params.orderId, req.body, req.user), { message: 'Driver assigned.' });
});

exports.updateStatus = asyncHandler(async (req, res) => {
  ok(res, await DeliveryService.updateStatus(req.params.orderId, req.body, req.user), { message: 'Delivery updated.' });
});