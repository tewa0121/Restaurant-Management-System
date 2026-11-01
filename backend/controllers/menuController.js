// ============================================================================
// controllers/menuController.js   -  LAYER 2: the HTTP translator for the menu
// ----------------------------------------------------------------------------
// Thin on purpose: read req -> call ONE service function -> send the response.
//   req.params  /menu/:id            -> req.params.id
//   req.query   /menu?category=3     -> req.query.category
//   req.body    the JSON the frontend sent
//   req.user    set by verifyToken (ONLY exists on protected routes)
// ============================================================================
const menuService = require('../services/menuService');
const { sendError } = require('../utils/httpError');

// Protected routes use the restaurant from the user's token.
// Public routes (customers browsing, not logged in) have no req.user, so they use restaurant 1.
// (When you later run several restaurants, this one function is the only place to change.)
const restaurantOf = (req) => (req.user && req.user.restaurant_id) || 1;

// ---- Items ----
// GET /api/menu?category=3&search=pizza        PUBLIC
exports.list = async (req, res, next) => {
  try {
    const items = await menuService.listMenu(restaurantOf(req), req.query);
    return res.status(200).json({ success: true, data: items });
  } catch (err) { return sendError(err, res, next); }
};

// GET /api/menu/manage                          manager, kitchen (includes unavailable dishes)
exports.listAll = async (req, res, next) => {
  try {
    const items = await menuService.listAllItems(restaurantOf(req), req.query);
    return res.status(200).json({ success: true, data: items });
  } catch (err) { return sendError(err, res, next); }
};

// GET /api/menu/12                              PUBLIC
exports.getOne = async (req, res, next) => {
  try {
    const item = await menuService.getItem(req.params.id, restaurantOf(req));
    return res.status(200).json({ success: true, data: item });
  } catch (err) { return sendError(err, res, next); }
};

// POST /api/menu
exports.create = async (req, res, next) => {
  try {
    const item = await menuService.createItem(restaurantOf(req), req.body);
    return res.status(201).json({ success: true, data: item }); // 201 = Created
  } catch (err) { return sendError(err, res, next); }
};

// PUT /api/menu/12
exports.update = async (req, res, next) => {
  try {
    const item = await menuService.updateItem(req.params.id, restaurantOf(req), req.body);
    return res.status(200).json({ success: true, data: item });
  } catch (err) { return sendError(err, res, next); }
};

// PATCH /api/menu/12/availability     body: { "available": false }
exports.setAvailability = async (req, res, next) => {
  try {
    const item = await menuService.setAvailability(req.params.id, restaurantOf(req), req.body.available);
    return res.status(200).json({ success: true, data: item });
  } catch (err) { return sendError(err, res, next); }
};

// DELETE /api/menu/12
exports.remove = async (req, res, next) => {
  try {
    const result = await menuService.deleteItem(req.params.id, restaurantOf(req));
    return res.status(200).json({ success: true, data: result });
  } catch (err) { return sendError(err, res, next); }
};

// ---- Categories ----
// GET /api/menu/categories                      PUBLIC
exports.listCategories = async (req, res, next) => {
  try {
    const categories = await menuService.listCategories(restaurantOf(req));
    return res.status(200).json({ success: true, data: categories });
  } catch (err) { return sendError(err, res, next); }
};

exports.createCategory = async (req, res, next) => {
  try {
    const category = await menuService.createCategory(restaurantOf(req), req.body);
    return res.status(201).json({ success: true, data: category });
  } catch (err) { return sendError(err, res, next); }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await menuService.updateCategory(req.params.id, restaurantOf(req), req.body);
    return res.status(200).json({ success: true, data: category });
  } catch (err) { return sendError(err, res, next); }
};

exports.removeCategory = async (req, res, next) => {
  try {
    const result = await menuService.deleteCategory(req.params.id, restaurantOf(req));
    return res.status(200).json({ success: true, data: result });
  } catch (err) { return sendError(err, res, next); }
};