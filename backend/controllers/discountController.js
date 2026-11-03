const DiscountService = require('../services/discountService');
const asyncHandler = require('../utils/asyncHandler');
const { ok, list } = require('../utils/response');

exports.list = asyncHandler(async (req, res) => {
  const { rows, pagination } = await DiscountService.list(req.query);
  list(res, rows, pagination);
});

exports.get = asyncHandler(async (req, res) => {
  ok(res, await DiscountService.get(req.params.id));
});

exports.create = asyncHandler(async (req, res) => {
  ok(res, await DiscountService.create(req.body, req.user), { message: 'Promo code created successfully.' }, 201);
});

exports.update = asyncHandler(async (req, res) => {
  ok(res, await DiscountService.update(req.params.id, req.body, req.user), { message: 'Promo code updated successfully.' });
});

exports.remove = asyncHandler(async (req, res) => {
  const result = await DiscountService.remove(req.params.id, req.user);
  res.status(200).json({ success: true, ...result });
});

exports.validate = asyncHandler(async (req, res) => {
  ok(res, await DiscountService.validate(req.body, req.user));
});