const InventoryService = require('../services/inventoryService');
const asyncHandler = require('../utils/asyncHandler');
const { ok, list } = require('../utils/response');

exports.summary = asyncHandler(async (req, res) => {
  ok(res, await InventoryService.summary());
});

exports.low = asyncHandler(async (req, res) => {
  ok(res, await InventoryService.low());
});

exports.list = asyncHandler(async (req, res) => {
  const { rows, pagination } = await InventoryService.list(req.query);
  list(res, rows, pagination);
});

exports.get = asyncHandler(async (req, res) => {
  ok(res, await InventoryService.get(req.params.id));
});

exports.create = asyncHandler(async (req, res) => {
  ok(res, await InventoryService.create(req.body, req.user), { message: 'Ingredient created successfully.' }, 201);
});

exports.update = asyncHandler(async (req, res) => {
  ok(res, await InventoryService.update(req.params.id, req.body, req.user), { message: 'Ingredient updated successfully.' });
});

exports.remove = asyncHandler(async (req, res) => {
  const result = await InventoryService.remove(req.params.id, req.user);
  res.status(200).json({ success: true, ...result });
});

exports.addMovement = asyncHandler(async (req, res) => {
  ok(res, await InventoryService.addMovement(req.params.id, req.body, req.user), { message: 'Stock updated.' }, 201);
});

exports.listMovements = asyncHandler(async (req, res) => {
  const { rows, pagination } = await InventoryService.listMovements(req.query);
  list(res, rows, pagination);
});

exports.getItemRecipe = asyncHandler(async (req, res) => {
  ok(res, await InventoryService.getItemRecipe(req.params.menuItemId));
});

exports.setItemRecipe = asyncHandler(async (req, res) => {
  ok(res, await InventoryService.setItemRecipe(req.params.menuItemId, req.body, req.user), { message: 'Recipe saved.' });
});

exports.getModifierRecipe = asyncHandler(async (req, res) => {
  ok(res, await InventoryService.getModifierRecipe(req.params.modifierId));
});

exports.setModifierRecipe = asyncHandler(async (req, res) => {
  ok(res, await InventoryService.setModifierRecipe(req.params.modifierId, req.body, req.user), { message: 'Recipe saved.' });
});