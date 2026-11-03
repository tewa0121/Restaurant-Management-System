const LogService = require('../services/logService');
const asyncHandler = require('../utils/asyncHandler');
const { ok, list } = require('../utils/response');

exports.list = asyncHandler(async (req, res) => {
  const { rows, pagination } = await LogService.list(req.query);
  list(res, rows, pagination);
});

exports.get = asyncHandler(async (req, res) => {
  ok(res, await LogService.get(req.params.id));
});

exports.types = asyncHandler(async (req, res) => {
  ok(res, await LogService.types());
});