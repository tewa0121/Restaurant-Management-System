const CashSessionService = require('../services/cashSessionService');
const asyncHandler = require('../utils/asyncHandler');
const { ok, list } = require('../utils/response');

exports.open = asyncHandler(async (req, res) => {
  ok(res, await CashSessionService.open(req.body, req.user), { message: 'Cash session opened.' }, 201);
});

exports.current = asyncHandler(async (req, res) => {
  const session = await CashSessionService.current(req.user);
  ok(res, session, { isOpen: Boolean(session) });
});

exports.list = asyncHandler(async (req, res) => {
  const { rows, pagination } = await CashSessionService.list(req.query, req.user);
  list(res, rows, pagination);
});

exports.get = asyncHandler(async (req, res) => {
  ok(res, await CashSessionService.get(req.params.id, req.user));
});

exports.close = asyncHandler(async (req, res) => {
  ok(res, await CashSessionService.close(req.params.id, req.body, req.user), { message: 'Cash session closed.' });
});