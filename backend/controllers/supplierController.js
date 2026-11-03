const SupplierService = require('../services/supplierService');
const asyncHandler = require('../utils/asyncHandler');
const { ok, list } = require('../utils/response');

exports.list = asyncHandler(async (req, res) => {
  const { rows, pagination } = await SupplierService.list(req.query);
  list(res, rows, pagination);
});

exports.get = asyncHandler(async (req, res) => {
  ok(res, await SupplierService.get(req.params.id));
});

exports.create = asyncHandler(async (req, res) => {
  ok(res, await SupplierService.create(req.body, req.user), { message: 'Supplier created successfully.' }, 201);
});

exports.update = asyncHandler(async (req, res) => {
  ok(res, await SupplierService.update(req.params.id, req.body, req.user), { message: 'Supplier updated successfully.' });
});

exports.remove = asyncHandler(async (req, res) => {
  const result = await SupplierService.remove(req.params.id, req.user);
  res.status(200).json({ success: true, ...result });
});