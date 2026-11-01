// ============================================================================
// models/menuModel.js   -  LAYER 4: the only file that runs SQL for the MENU module
// ----------------------------------------------------------------------------
// Tables:
//   menu_categories   Breakfast, Lunch, Dinner ...
//   menu_items        one row per dish; each item belongs to ONE category (category_id)
//   order_items       (read only here) tells us if a dish was ever ordered
//
//   menu_categories ──< menu_items >── order_items
//
// Reminder of the model rules:
//   - SQL only, no req/res, no business rules
//   - always "?" placeholders (values travel separately from the SQL text)
//   - returns raw rows with database column names (the service renames them)
// ============================================================================
const db = require("../config/database");

// Columns a caller is allowed to change. Anything else sent in the request is ignored.
// This protects restaurant_id, id, created_at ... from being overwritten.
const WRITABLE_ITEM_COLUMNS = [
  "category_id",
  "name",
  "description",
  "price",
  "image_url",
  "is_available",
  "preparation_time_minutes",
];
const WRITABLE_CATEGORY_COLUMNS = ["name", "display_order", "is_active"];

// Builds  "col1 = ?, col2 = ?"  from an object, using ONLY whitelisted column names.
// The column names come from OUR list (never from the user), the values go in placeholders.
const buildSet = (columns, allowed) => {
  const keys = Object.keys(columns).filter((k) => allowed.includes(k));
  return {
    keys,
    clause: keys.map((k) => `${k} = ?`).join(", "),
    values: keys.map((k) => columns[k]),
  };
};

// ============================ MENU ITEMS ====================================

// List dishes. Filters are optional and combined with AND.
//   onlyAvailable  true  -> what a CUSTOMER may see (available dish in an active category)
//                  false -> everything (for the manager / kitchen screens)
exports.findItems = async (
  restaurantId,
  { categoryId, search, onlyAvailable } = {},
) => {
  let sql = `
    SELECT m.*, c.name AS category_name
    FROM menu_items m
    JOIN menu_categories c ON c.id = m.category_id     -- every dish has a category, so a normal JOIN is fine
    WHERE m.restaurant_id = ?`;
  const params = [restaurantId];

  if (onlyAvailable) sql += " AND m.is_available = TRUE AND c.is_active = TRUE";

  if (categoryId) {
    sql += " AND m.category_id = ?";
    params.push(categoryId);
  }

  if (search) {
    // The % signs are added in JavaScript and sent as a VALUE, so the search text can never
    // become SQL. Even  ' OR 1=1 --  is just searched for as ordinary text.
    sql += " AND (m.name LIKE ? OR m.description LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  sql += " ORDER BY c.display_order, c.name, m.name";

  const [rows] = await db.execute(sql, params);
  return rows;
};

exports.findItemById = async (id, restaurantId) => {
  const [rows] = await db.execute(
    `SELECT m.*, c.name AS category_name
     FROM menu_items m
     JOIN menu_categories c ON c.id = m.category_id
     WHERE m.id = ? AND m.restaurant_id = ?`,
    [id, restaurantId],
  );
  return rows[0] || null;
};

// Used for the "no two dishes with the same name" rule.
// excludeId lets an item be updated without clashing with ITSELF (pass 0 when creating).
exports.findItemByName = async (name, restaurantId, excludeId = 0) => {
  const [rows] = await db.execute(
    "SELECT id FROM menu_items WHERE restaurant_id = ? AND LOWER(name) = LOWER(?) AND id <> ? LIMIT 1",
    [restaurantId, name, excludeId],
  );
  return rows[0] || null;
};

exports.createItem = async (restaurantId, data) => {
  const [result] = await db.execute(
    `INSERT INTO menu_items
       (restaurant_id, category_id, name, description, price, image_url, is_available, preparation_time_minutes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      restaurantId,
      data.category_id,
      data.name,
      data.description ?? null, // mysql2 refuses "undefined", so we turn it into NULL
      data.price,
      data.image_url ?? null,
      data.is_available ?? true,
      data.preparation_time_minutes ?? 15,
    ],
  );
  return result.insertId;
};

// Partial update: only the columns that were sent are changed.
exports.updateItem = async (id, restaurantId, columns) => {
  const { clause, values } = buildSet(columns, WRITABLE_ITEM_COLUMNS);
  if (!clause) return 0;
  const [result] = await db.execute(
    `UPDATE menu_items SET ${clause} WHERE id = ? AND restaurant_id = ?`,
    [...values, id, restaurantId],
  );
  return result.affectedRows; // 0 = no such dish in this restaurant
};

exports.deleteItem = async (id, restaurantId) => {
  const [result] = await db.execute(
    "DELETE FROM menu_items WHERE id = ? AND restaurant_id = ?",
    [id, restaurantId],
  );
  return result.affectedRows;
};

// How many times was this dish ever ordered? (order_items.menu_item_id has NO cascade,
// so MySQL refuses to delete a dish that old orders point to. We check first.)
exports.countOrderUsage = async (itemId) => {
  const [rows] = await db.execute(
    "SELECT COUNT(*) AS total FROM order_items WHERE menu_item_id = ?",
    [itemId],
  );
  return rows[0].total;
};

// ============================ CATEGORIES ====================================

// item_count = how many AVAILABLE dishes each category has (LEFT JOIN keeps empty categories too).
exports.findCategories = async (
  restaurantId,
  { includeInactive = false } = {},
) => {
  let sql = `
    SELECT c.*, COUNT(m.id) AS item_count
    FROM menu_categories c
    LEFT JOIN menu_items m ON m.category_id = c.id AND m.is_available = TRUE
    WHERE c.restaurant_id = ?`;
  if (!includeInactive) sql += " AND c.is_active = TRUE";
  sql += " GROUP BY c.id ORDER BY c.display_order, c.name";

  const [rows] = await db.execute(sql, [restaurantId]);
  return rows;
};

exports.findCategoryById = async (id, restaurantId) => {
  const [rows] = await db.execute(
    "SELECT * FROM menu_categories WHERE id = ? AND restaurant_id = ?",
    [id, restaurantId],
  );
  return rows[0] || null;
};

exports.findCategoryByName = async (name, restaurantId, excludeId = 0) => {
  const [rows] = await db.execute(
    "SELECT id FROM menu_categories WHERE restaurant_id = ? AND LOWER(name) = LOWER(?) AND id <> ? LIMIT 1",
    [restaurantId, name, excludeId],
  );
  return rows[0] || null;
};

exports.createCategory = async (restaurantId, { name, display_order }) => {
  const [result] = await db.execute(
    "INSERT INTO menu_categories (restaurant_id, name, display_order) VALUES (?, ?, ?)",
    [restaurantId, name, display_order ?? 0],
  );
  return result.insertId;
};

exports.updateCategory = async (id, restaurantId, columns) => {
  const { clause, values } = buildSet(columns, WRITABLE_CATEGORY_COLUMNS);
  if (!clause) return 0;
  const [result] = await db.execute(
    `UPDATE menu_categories SET ${clause} WHERE id = ? AND restaurant_id = ?`,
    [...values, id, restaurantId],
  );
  return result.affectedRows;
};

exports.countItemsInCategory = async (categoryId) => {
  const [rows] = await db.execute(
    "SELECT COUNT(*) AS total FROM menu_items WHERE category_id = ?",
    [categoryId],
  );
  return rows[0].total;
};

exports.deleteCategory = async (id, restaurantId) => {
  const [result] = await db.execute(
    "DELETE FROM menu_categories WHERE id = ? AND restaurant_id = ?",
    [id, restaurantId],
  );
  return result.affectedRows;
};
