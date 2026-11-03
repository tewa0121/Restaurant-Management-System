const UserService = require('../services/userService');
const asyncHandler = require('../utils/asyncHandler');
const { ok, list } = require('../utils/response');

exports.list = asyncHandler(async (req, res) => {
  const { rows, pagination } = await UserService.list(req.query);
  list(res, rows, pagination);
});

exports.get = asyncHandler(async (req, res) => {
  ok(res, await UserService.get(req.params.id));
});

exports.create = asyncHandler(async (req, res) => {
  const { user, temporaryPassword } = await UserService.create(req.body, req.user);
  const extra = { message: 'User created successfully.' };
  if (temporaryPassword) extra.temporaryPassword = temporaryPassword;
  ok(res, user, extra, 201);
});

exports.update = asyncHandler(async (req, res) => {
  ok(res, await UserService.update(req.params.id, req.body, req.user), { message: 'User updated successfully.' });
});

exports.setStatus = asyncHandler(async (req, res) => {
  ok(res, await UserService.update(req.params.id, req.body, req.user), { message: 'User status updated.' });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const result = await UserService.resetPassword(req.params.id, req.body.password, req.user);
  res.status(200).json({ success: true, ...result });
});

exports.remove = asyncHandler(async (req, res) => {
  const result = await UserService.remove(req.params.id, req.user);
  res.status(200).json({ success: true, ...result });
});