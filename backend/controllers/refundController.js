const RefundService = require('../services/refundService');
const asyncHandler = require('../utils/asyncHandler');
const { ok, list } = require('../utils/response');

exports.list = asyncHandler(async (req, res) => {
  const { rows, pagination } = await RefundService.list(req.query, req.user);
  list(res, rows, pagination);
});

exports.get = asyncHandler(async (req, res) => {
  ok(res, await RefundService.get(req.params.id, req.user));
});

exports.request = asyncHandler(async (req, res) => {
  const refund = await RefundService.request(req.body, req.user);
  ok(res, refund, { message: refund.status === 'approved' ? 'Refund issued.' : 'Refund requested. A manager must approve it.' }, 201);
});

exports.approve = asyncHandler(async (req, res) => {
  ok(res, await RefundService.approve(req.params.id, req.user), { message: 'Refund approved.' });
});

exports.reject = asyncHandler(async (req, res) => {
  ok(res, await RefundService.reject(req.params.id, req.user), { message: 'Refund rejected.' });
});