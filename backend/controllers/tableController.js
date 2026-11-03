const TableService = require('../services/tableService');
const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/response');

exports.list = asyncHandler(async (req, res) => {
  ok(res, await TableService.list(req.query));
});

exports.mine = asyncHandler(async (req, res) => {
  ok(res, await TableService.mine(req.user));
});

exports.available = asyncHandler(async (req, res) => {
  ok(res, await TableService.available(req.query));
});

exports.get = asyncHandler(async (req, res) => {
  ok(res, await TableService.get(req.params.id));
});

exports.create = asyncHandler(async (req, res) => {
  ok(res, await TableService.create(req.body, req.user), { message: 'Table created successfully.' }, 201);
});

exports.update = asyncHandler(async (req, res) => {
  ok(res, await TableService.update(req.params.id, req.body, req.user), { message: 'Table updated successfully.' });
});

exports.setStatus = asyncHandler(async (req, res) => {
  ok(res, await TableService.setStatus(req.params.id, req.body, req.user), { message: 'Table status updated.' });
});

exports.assignWaiter = asyncHandler(async (req, res) => {
  ok(res, await TableService.assignWaiter(req.params.id, req.body, req.user), { message: 'Waiter assigned.' });
});

exports.seat = asyncHandler(async (req, res) => {
  ok(res, await TableService.seat(req.params.id, req.body, req.user), { message: 'Guests seated.' });
});

exports.release = asyncHandler(async (req, res) => {
  ok(res, await TableService.release(req.params.id, req.body, req.user), { message: 'Table released.' });
});

exports.remove = asyncHandler(async (req, res) => {
  const result = await TableService.remove(req.params.id, req.user);
  res.status(200).json({ success: true, ...result });
});