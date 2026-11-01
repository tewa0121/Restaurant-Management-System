// ============================================================================
// models/tableModel.js   LAYER 4 of 5  -  the ONLY place that talks to MySQL
// ----------------------------------------------------------------------------
// Rules for a model:
//   1. It contains SQL and nothing else (no req/res, no business rules).
//   2. It returns raw database rows (snake_case column names).
//   3. It ALWAYS uses "?" placeholders. The values are sent separately from the
//      SQL text, so a user typing  '; DROP TABLE users; --  cannot change the query.
//      (This protection is called "preventing SQL injection".)
// ============================================================================

// db is the promise pool exported by config/database.js
//   const [rows] = await db.execute(sql, [values])
//   For SELECT, `rows` is an array of objects.
//   For INSERT/UPDATE/DELETE, `result` has insertId and affectedRows.
const db = require("../config/database");

// Only these columns may ever be written by update(). Any other key is ignored.
// This is a WHITELIST: it stops someone sending {"restaurant_id": 99} to move a
// table into another restaurant.
const WRITABLE_COLUMNS = [
  "table_number",
  "capacity",
  "section",
  "shape",
  "assigned_waiter_id",
  "status",
  "pos_x",
  "pos_y",
];

// ---- READ ------------------------------------------------------------------
// List all tables of one restaurant, optionally filtered by status / section.
exports.findAll = async (restaurantId, { status, section } = {}) => {
  // We build the WHERE clause piece by piece, but the VALUES still go in `params`.
  let sql = `
    SELECT t.*,
           CONCAT(e.first_name, ' ', e.last_name) AS waiter_name
    FROM tables t
    LEFT JOIN employees e ON e.id = t.assigned_waiter_id   -- LEFT JOIN: keep tables that have no waiter
    WHERE t.restaurant_id = ?`;
  const params = [restaurantId];

  if (status) {
    sql += " AND t.status = ?";
    params.push(status);
  }
  if (section) {
    sql += " AND t.section = ?";
    params.push(section);
  }

  // table_number is text ("10" sorts before "2"), so we sort by its numeric value first.
  sql += " ORDER BY CAST(t.table_number AS UNSIGNED), t.table_number";

  const [rows] = await db.execute(sql, params);
  return rows;
};

// Find one table. We also check restaurant_id so one restaurant can never read another's table.
exports.findById = async (id, restaurantId) => {
  const [rows] = await db.execute(
    `SELECT t.*, CONCAT(e.first_name, ' ', e.last_name) AS waiter_name
     FROM tables t
     LEFT JOIN employees e ON e.id = t.assigned_waiter_id
     WHERE t.id = ? AND t.restaurant_id = ?`,
    [id, restaurantId],
  );
  return rows[0] || null; // null = "not found", the service decides what to do with that
};

// ---- WRITE -----------------------------------------------------------------
exports.create = async (restaurantId, data) => {
  const [result] = await db.execute(
    `INSERT INTO tables
       (restaurant_id, table_number, capacity, section, shape, assigned_waiter_id, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      restaurantId,
      data.table_number,
      data.capacity,
      data.section ?? null, // ?? null : if the value is undefined, store NULL (mysql2 rejects undefined)
      data.shape ?? "square",
      data.assigned_waiter_id ?? null,
      data.status ?? "available",
    ],
  );
  return result.insertId; // the new row's id
};

// Partial update: only the columns that were sent are changed.
exports.update = async (id, restaurantId, columns) => {
  // Keep only whitelisted keys, so the SQL text we build below is always safe.
  const keys = Object.keys(columns).filter((k) => WRITABLE_COLUMNS.includes(k));
  if (keys.length === 0) return 0;

  const setClause = keys.map((k) => `${k} = ?`).join(", "); // "capacity = ?, status = ?"
  const values = keys.map((k) => columns[k]);

  const [result] = await db.execute(
    `UPDATE tables SET ${setClause} WHERE id = ? AND restaurant_id = ?`,
    [...values, id, restaurantId],
  );
  return result.affectedRows; // 0 means: no such table in this restaurant
};

exports.remove = async (id, restaurantId) => {
  const [result] = await db.execute(
    "DELETE FROM tables WHERE id = ? AND restaurant_id = ?",
    [id, restaurantId],
  );
  return result.affectedRows;
};

// ---- HELPER QUERIES USED BY BUSINESS RULES ---------------------------------
// How many unfinished orders are on this table? (order_tables links orders <-> tables)
exports.countActiveOrders = async (tableId) => {
  const [rows] = await db.execute(
    `SELECT COUNT(*) AS total
     FROM order_tables ot
     JOIN orders o ON o.id = ot.order_id
     WHERE ot.table_id = ? AND o.status NOT IN ('completed', 'cancelled')`,
    [tableId],
  );
  return rows[0].total;
};

// How many upcoming/active reservations does this table have?
exports.countActiveReservations = async (tableId) => {
  const [rows] = await db.execute(
    `SELECT COUNT(*) AS total
     FROM reservations
     WHERE table_id = ?
       AND status IN ('pending', 'confirmed', 'seated')
       AND reservation_date >= CURDATE()`,
    [tableId],
  );
  return rows[0].total;
};
