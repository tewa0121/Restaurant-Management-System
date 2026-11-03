const CustomerRequestService = require('../services/customerRequestService');
const asyncHandler = require('../utils/asyncHandler');
const { ok, list } = require('../utils/response');

exports.list = asyncHandler(async (req, res) => {
  const { rows, pagination } = await CustomerRequestService.list(req.query, req.user);
  list(res, rows, pagination);
});

exports.mine = asyncHandler(async (req, res) => {
  const { rows, pagination } = await CustomerRequestService.listMine(req.user, req.query);
  list(res, rows, pagination);
});

exports.create = asyncHandler(async (req, res) => {
  ok(res, await CustomerRequestService.create(req.body, req.user), { message: 'Request sent.' }, 201);
});

exports.setStatus = asyncHandler(async (req, res) => {
  ok(res, await CustomerRequestService.setStatus(req.params.id, req.body, req.user), { message: 'Request updated.' });
});

exports.assign = asyncHandler(async (req, res) => {
  ok(res, await CustomerRequestService.assign(req.params.id, req.body, req.user), { message: 'Request assigned.' });
});