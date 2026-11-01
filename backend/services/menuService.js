// ============================================================================
// services/menuService.js   -  LAYER 3: the BUSINESS RULES of the menu
// ----------------------------------------------------------------------------
// What lives here (and nowhere else):
//   1. VALIDATION   is the price a real number? is the name empty?
//   2. RULES        no duplicate names; a dish that was ordered is archived, not deleted
//   3. MAPPING      database names (image_url) -> the names React uses (image)
// No req / res here: the same functions can be reused by a socket, a job or a test.
// Errors are reported with  throw httpError(status, message).
// ============================================================================
const menuModel = require('../models/menuModel');
const { httpError } = require('../utils/httpError');

// ------------------------------- MAPPERS ------------------------------------
// The frontend mock data used snake_case (image_url, category_id, is_available) and the
// pages/cart use camelCase (image). We send BOTH so every page keeps working while you
// migrate, and we convert price to a real number (MySQL DECIMAL arrives as the text "12.99").
const toItem = (row) => ({
  id: row.id,
  name: row.name,
  description: row.description,
  price: Number(row.price),
  image: row.image_url,            // used by the cart and the dish cards
  image_url: row.image_url,        // used by the old mock data shape
  category: row.category_name,
  categoryId: row.category_id,
  category_id: row.category_id,
  available: !!row.is_available,   // 1/0 from MySQL -> true/false
  is_available: !!row.is_available,
  prepTime: row.preparation_time_minutes,
});

const toCategory = (row) => ({
  id: row.id,
  name: row.name,
  displayOrder: row.display_order,
  active: !!row.is_active,
  itemCount: row.item_count !== undefined ? Number(row.item_count) : undefined,
});

// ----------------------------- VALIDATION -----------------------------------
// "5" -> 5, and anything that is not a positive whole number is rejected.
const parseId = (value, label = 'id') => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw httpError(400, `Invalid ${label}.`);
  return id;
};

// Accepts true/false, 1/0, "true"/"false". Anything else is an error.
const parseBool = (value, label) => {
  if (value === true || value === 1 || value === 'true') return true;
  if (value === false || value === 0 || value === 'false') return false;
  throw httpError(400, `${label} must be true or false.`);
};

// Reads the fields of a dish. partial=true is for updates (every field optional, but
// the ones that ARE sent must still be valid). Returns an object with DATABASE column names.
const validateItem = (body, { partial = false } = {}) => {
  const data = {};

  if (!partial || body.name !== undefined) {
    const name = String(body.name ?? '').trim();
    if (!name) throw httpError(400, 'Dish name is required.');
    if (name.length > 100) throw httpError(400, 'Dish name must be 100 characters or fewer.');
    data.name = name;
  }

  if (!partial || body.price !== undefined) {
    // Number('') is 0 and Number(null) is 0, so we reject empty values by hand first.
    if (body.price === undefined || body.price === null || body.price === '') throw httpError(400, 'Price is required.');
    const price = Number(body.price);
    if (!Number.isFinite(price) || price < 0 || price > 99999999) throw httpError(400, 'Price must be a number of 0 or more.');
    data.price = Math.round(price * 100) / 100; // keep 2 decimals: 12.999 -> 13
  }

  const categoryId = body.categoryId ?? body.category_id;
  if (!partial || categoryId !== undefined) {
    data.category_id = parseId(categoryId, 'category');
  }

  if (body.description !== undefined) {
    const description = body.description === null ? null : String(body.description).trim();
    if (description && description.length > 1000) throw httpError(400, 'Description must be 1000 characters or fewer.');
    data.description = description || null;
  }

  const image = body.image ?? body.image_url;
  if (image !== undefined) {
    const imageUrl = image === null ? null : String(image).trim();
    if (imageUrl && imageUrl.length > 255) throw httpError(400, 'Image path is too long.');
    data.image_url = imageUrl || null;
  }

  const available = body.available ?? body.is_available;
  if (available !== undefined) data.is_available = parseBool(available, 'Available');

  const prep = body.prepTime ?? body.preparation_time_minutes;
  if (prep !== undefined) {
    const minutes = Number(prep);
    if (!Number.isInteger(minutes) || minutes < 1 || minutes > 240) throw httpError(400, 'Preparation time must be 1 to 240 minutes.');
    data.preparation_time_minutes = minutes;
  }

  return data;
};

const validateCategory = (body, { partial = false } = {}) => {
  const data = {};

  if (!partial || body.name !== undefined) {
    const name = String(body.name ?? '').trim();
    if (!name) throw httpError(400, 'Category name is required.');
    if (name.length > 50) throw httpError(400, 'Category name must be 50 characters or fewer.');
    data.name = name;
  }
  if (body.displayOrder !== undefined) {
    const order = Number(body.displayOrder);
    if (!Number.isInteger(order) || order < 0 || order > 1000) throw httpError(400, 'Display order must be a whole number from 0 to 1000.');
    data.display_order = order;
  }
  if (body.active !== undefined) data.is_active = parseBool(body.active, 'Active');
  return data;
};

// Turns database errors into friendly messages. err.code comes from the mysql2 driver.
const translateDbError = (err) => {
  if (err.code === 'ER_NO_REFERENCED_ROW_2') return httpError(400, 'The selected category does not exist.');
  return err; // unknown -> stays a 500 and goes to errorHandler.js
};

// =============================== ITEMS ======================================

// PUBLIC list for customers: only available dishes in active categories.
exports.listMenu = async (restaurantId, { category, search } = {}) => {
  const categoryId = category ? parseId(category, 'category') : undefined;
  const rows = await menuModel.findItems(restaurantId, {
    categoryId,
    search: search ? String(search).trim().slice(0, 100) : undefined,
    onlyAvailable: true,
  });
  return rows.map(toItem);
};

// STAFF list: everything, including dishes marked unavailable.
exports.listAllItems = async (restaurantId, { category, search } = {}) => {
  const categoryId = category ? parseId(category, 'category') : undefined;
  const rows = await menuModel.findItems(restaurantId, {
    categoryId,
    search: search ? String(search).trim().slice(0, 100) : undefined,
    onlyAvailable: false,
  });
  return rows.map(toItem);
};

exports.getItem = async (id, restaurantId) => {
  const row = await menuModel.findItemById(parseId(id), restaurantId);
  if (!row) throw httpError(404, 'Dish not found.');
  return toItem(row);
};

exports.createItem = async (restaurantId, body) => {
  const data = validateItem(body);

  // RULE: two dishes may not share a name (it would confuse waiters and customers).
  if (await menuModel.findItemByName(data.name, restaurantId)) {
    throw httpError(409, 'A dish with this name already exists.');
  }

  try {
    const newId = await menuModel.createItem(restaurantId, data);
    return await exports.getItem(newId, restaurantId); // read it back so the answer is complete
  } catch (err) {
    throw translateDbError(err);
  }
};

exports.updateItem = async (id, restaurantId, body) => {
  const itemId = parseId(id);
  const data = validateItem(body, { partial: true });
  if (Object.keys(data).length === 0) throw httpError(400, 'Nothing to update.');

  if (data.name && (await menuModel.findItemByName(data.name, restaurantId, itemId))) {
    throw httpError(409, 'A dish with this name already exists.');
  }

  try {
    const affected = await menuModel.updateItem(itemId, restaurantId, data);
    if (!affected) throw httpError(404, 'Dish not found.');
  } catch (err) {
    throw translateDbError(err);
  }
  // NOTE: old orders keep the price they were sold at (order_items.unit_price),
  // so changing a price here never changes past bills.
  return exports.getItem(itemId, restaurantId);
};

// The kitchen's main action: "we ran out of this" / "it is back".
exports.setAvailability = async (id, restaurantId, available) => {
  const itemId = parseId(id);
  const affected = await menuModel.updateItem(itemId, restaurantId, { is_available: parseBool(available, 'Available') });
  if (!affected) throw httpError(404, 'Dish not found.');
  return exports.getItem(itemId, restaurantId);
};

// RULE: a dish that appears in old orders cannot be deleted (old bills would lose their lines),
// so we ARCHIVE it (hide it from customers) instead. A dish never ordered is really deleted.
exports.deleteItem = async (id, restaurantId) => {
  const itemId = parseId(id);
  const item = await menuModel.findItemById(itemId, restaurantId);
  if (!item) throw httpError(404, 'Dish not found.');

  if ((await menuModel.countOrderUsage(itemId)) > 0) {
    await menuModel.updateItem(itemId, restaurantId, { is_available: false });
    return { id: itemId, deleted: false, archived: true, message: 'This dish was ordered before, so it was hidden instead of deleted.' };
  }

  await menuModel.deleteItem(itemId, restaurantId);
  return { id: itemId, deleted: true, archived: false };
};

// ============================== CATEGORIES ==================================
exports.listCategories = async (restaurantId, { includeInactive = false } = {}) => {
  const rows = await menuModel.findCategories(restaurantId, { includeInactive });
  return rows.map(toCategory);
};

exports.createCategory = async (restaurantId, body) => {
  const data = validateCategory(body);
  if (await menuModel.findCategoryByName(data.name, restaurantId)) {
    throw httpError(409, 'A category with this name already exists.');
  }
  const newId = await menuModel.createCategory(restaurantId, data);
  return toCategory(await menuModel.findCategoryById(newId, restaurantId));
};

exports.updateCategory = async (id, restaurantId, body) => {
  const categoryId = parseId(id, 'category');
  const data = validateCategory(body, { partial: true });
  if (Object.keys(data).length === 0) throw httpError(400, 'Nothing to update.');

  if (data.name && (await menuModel.findCategoryByName(data.name, restaurantId, categoryId))) {
    throw httpError(409, 'A category with this name already exists.');
  }
  const affected = await menuModel.updateCategory(categoryId, restaurantId, data);
  if (!affected) throw httpError(404, 'Category not found.');
  return toCategory(await menuModel.findCategoryById(categoryId, restaurantId));
};

// RULE: a category that still has dishes cannot be deleted (move or remove the dishes first).
exports.deleteCategory = async (id, restaurantId) => {
  const categoryId = parseId(id, 'category');
  if (!(await menuModel.findCategoryById(categoryId, restaurantId))) throw httpError(404, 'Category not found.');
  if ((await menuModel.countItemsInCategory(categoryId)) > 0) {
    throw httpError(409, 'This category still has dishes. Move or remove them first.');
  }
  await menuModel.deleteCategory(categoryId, restaurantId);
  return { id: categoryId };
};