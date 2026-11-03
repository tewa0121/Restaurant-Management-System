const MenuService = require('../services/menuService');
const asyncHandler = require('../utils/asyncHandler');
const { ok, list } = require('../utils/response');

exports.listCategories = asyncHandler(async (req, res) => {
  ok(res, await MenuService.listCategories(req.query, req.user));
});

exports.createCategory = asyncHandler(async (req, res) => {
  ok(res, await MenuService.createCategory(req.body, req.user), { message: 'Category created successfully.' }, 201);
});

exports.updateCategory = asyncHandler(async (req, res) => {
  ok(res, await MenuService.updateCategory(req.params.id, req.body, req.user), { message: 'Category updated successfully.' });
});

exports.removeCategory = asyncHandler(async (req, res) => {
  const result = await MenuService.removeCategory(req.params.id, req.user);
  res.status(200).json({ success: true, ...result });
});

exports.listItems = asyncHandler(async (req, res) => {
  const { rows, pagination } = await MenuService.listItems(req.query, req.user);
  list(res, rows, pagination);
});

exports.getItem = asyncHandler(async (req, res) => {
  ok(res, await MenuService.getItem(req.params.id, req.user));
});

exports.createItem = asyncHandler(async (req, res) => {
  ok(res, await MenuService.createItem(req.body, req.user), { message: 'Menu item created successfully.' }, 201);
});

exports.updateItem = asyncHandler(async (req, res) => {
  ok(res, await MenuService.updateItem(req.params.id, req.body, req.user), { message: 'Menu item updated successfully.' });
});

exports.setAvailability = asyncHandler(async (req, res) => {
  ok(res, await MenuService.setAvailability(req.params.id, req.body, req.user), { message: 'Availability updated.' });
});

exports.removeItem = asyncHandler(async (req, res) => {
  const result = await MenuService.removeItem(req.params.id, req.user);
  res.status(200).json({ success: true, ...result });
});

exports.listModifiers = asyncHandler(async (req, res) => {
  ok(res, await MenuService.listModifiers(req.params.id, req.user));
});

exports.createModifier = asyncHandler(async (req, res) => {
  ok(res, await MenuService.createModifier(req.params.id, req.body, req.user), { message: 'Modifier added.' }, 201);
});

exports.updateModifier = asyncHandler(async (req, res) => {
  ok(res, await MenuService.updateModifier(req.params.modifierId, req.body, req.user), { message: 'Modifier updated.' });
});

exports.removeModifier = asyncHandler(async (req, res) => {
  const result = await MenuService.removeModifier(req.params.modifierId, req.user);
  res.status(200).json({ success: true, ...result });
});

exports.listFavorites = asyncHandler(async (req, res) => {
  ok(res, await MenuService.listFavorites(req.user));
});

exports.addFavorite = asyncHandler(async (req, res) => {
  ok(res, await MenuService.addFavorite(req.params.id, req.user), { message: 'Added to favorites.' }, 201);
});

exports.removeFavorite = asyncHandler(async (req, res) => {
  const result = await MenuService.removeFavorite(req.params.id, req.user);
  res.status(200).json({ success: true, ...result });
});