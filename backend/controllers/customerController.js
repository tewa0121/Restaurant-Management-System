const CustomerService = require('../services/customerService');
const asyncHandler = require('../utils/asyncHandler');
const { ok, list } = require('../utils/response');

exports.list = asyncHandler(async (req, res) => {
  const { rows, pagination } = await CustomerService.list(req.query);
  list(res, rows, pagination);
});

exports.get = asyncHandler(async (req, res) => {
  ok(res, await CustomerService.get(req.params.id));
});

exports.me = asyncHandler(async (req, res) => {
  ok(res, await CustomerService.getMine(req.user.id));
});

exports.create = asyncHandler(async (req, res) => {
  ok(res, await CustomerService.create(req.body, req.user), { message: 'Customer created successfully.' }, 201);
});

exports.update = asyncHandler(async (req, res) => {
  ok(res, await CustomerService.update(req.params.id, req.body, req.user), { message: 'Customer updated successfully.' });
});

exports.remove = asyncHandler(async (req, res) => {
  const result = await CustomerService.remove(req.params.id, req.user);
  res.status(200).json({ success: true, ...result });
});

exports.adjustLoyalty = asyncHandler(async (req, res) => {
  ok(res, await CustomerService.adjustLoyalty(req.params.id, req.body, req.user), { message: 'Loyalty points updated.' });
});

exports.listAddresses = asyncHandler(async (req, res) => {
  ok(res, await CustomerService.listAddresses(req.user.id));
});

exports.createAddress = asyncHandler(async (req, res) => {
  ok(res, await CustomerService.createAddress(req.user.id, req.body), { message: 'Address saved.' }, 201);
});

exports.updateAddress = asyncHandler(async (req, res) => {
  ok(res, await CustomerService.updateAddress(req.user.id, req.params.id, req.body), { message: 'Address updated.' });
});

exports.removeAddress = asyncHandler(async (req, res) => {
  const result = await CustomerService.removeAddress(req.user.id, req.params.id);
  res.status(200).json({ success: true, ...result });
});