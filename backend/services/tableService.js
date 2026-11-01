// ============================================================================
// services/tableService.js   LAYER 3 of 5  -  the BUSINESS RULES
// ----------------------------------------------------------------------------
// Rules for a service:
//   1. No req / res here. It receives plain values and returns plain values,
//      so it could be reused by a controller, a socket, a scheduled job, or a test.
//   2. It validates input and enforces rules ("cannot delete a busy table").
//   3. It calls models for data, and converts database rows into the shape the
//      frontend expects (this conversion is called "mapping").
//   4. When something is wrong it THROWS httpError(status, message).
// ============================================================================
const tableModel = require("../models/tableModel");
const { httpError } = require("../utils/httpError");

// Must match the ENUM in the tables schema in config/database.js
const TABLE_STATUSES = [
  "available",
  "reserved",
  "occupied",
  "cleaning",
  "out_of_order",
];
const TABLE_SHAPES = ["square", "round", "rectangle"];

// ---- MAPPER ----------------------------------------------------------------
// Database column names -> field names the React pages already use.
// Doing it here means the frontend never has to know the database naming.
const toTable = (row) => ({
  id: row.id,
  number: String(row.table_number), // table_number -> number
  capacity: row.capacity,
  status: row.status, // stays lowercase; the UI formats the label
  zone: row.section, // section -> zone
  shape: row.shape,
  assignedWaiterId: row.assigned_waiter_id,
  waiterName: row.waiter_name || null,
  posX: row.pos_x,
  posY: row.pos_y,
});

// ---- VALIDATION HELPERS -----------------------------------------------------
// Turns an id from the URL ("5") into a number and rejects garbage like "abc".
const parseId = (value) => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw httpError(400, "Invalid id.");
  return id;
};

// Checks the fields of a request body. `partial = true` is for updates, where
// every field is optional, but the ones that ARE sent must still be valid.
const validate = (body, { partial = false } = {}) => {
  const data = {};

  if (!partial || body.number !== undefined) {
    const number = String(body.number ?? "").trim();
    if (!number) throw httpError(400, "Table number is required.");
    data.table_number = number;
  }

  if (!partial || body.capacity !== undefined) {
    const capacity = Number(body.capacity);
    if (!Number.isInteger(capacity) || capacity < 1 || capacity > 50) {
      throw httpError(400, "Capacity must be a whole number between 1 and 50.");
    }
    data.capacity = capacity;
  }

  // The frontend calls it "zone"; the database calls it "section". Accept either.
  const section = body.zone ?? body.section;
  if (section !== undefined)
    data.section = section ? String(section).trim() : null;

  if (body.shape !== undefined) {
    if (!TABLE_SHAPES.includes(body.shape))
      throw httpError(400, `Shape must be one of: ${TABLE_SHAPES.join(", ")}.`);
    data.shape = body.shape;
  }

  if (body.assignedWaiterId !== undefined) {
    // null is allowed: it means "remove the waiter from this table"
    data.assigned_waiter_id =
      body.assignedWaiterId === null ? null : parseId(body.assignedWaiterId);
  }

  return data;
};

// Turns MySQL error codes into friendly messages.
// err.code is set by the mysql2 driver (e.g. ER_DUP_ENTRY = "unique value already exists").
const translateDbError = (err) => {
  if (err.code === "ER_DUP_ENTRY")
    return httpError(409, "A table with this number already exists.");
  if (err.code === "ER_NO_REFERENCED_ROW_2")
    return httpError(400, "The selected waiter does not exist.");
  return err; // unknown error: let it bubble up as a 500
};

// ---- PUBLIC FUNCTIONS (called by the controller) -----------------------------
exports.listTables = async (restaurantId, filters) => {
  // Reject an invalid status filter instead of silently returning nothing.
  if (filters.status && !TABLE_STATUSES.includes(filters.status)) {
    throw httpError(
      400,
      `Status must be one of: ${TABLE_STATUSES.join(", ")}.`,
    );
  }
  const rows = await tableModel.findAll(restaurantId, filters);
  return rows.map(toTable);
};

exports.getTable = async (id, restaurantId) => {
  const row = await tableModel.findById(parseId(id), restaurantId);
  if (!row) throw httpError(404, "Table not found.");
  return toTable(row);
};

exports.createTable = async (restaurantId, body) => {
  const data = validate(body); // throws 400 if something is wrong
  try {
    const newId = await tableModel.create(restaurantId, data);
    return exports.getTable(newId, restaurantId); // read it back so the response is complete
  } catch (err) {
    throw translateDbError(err);
  }
};

exports.updateTable = async (id, restaurantId, body) => {
  const tableId = parseId(id);
  const data = validate(body, { partial: true });
  if (Object.keys(data).length === 0)
    throw httpError(400, "Nothing to update.");

  try {
    const affected = await tableModel.update(tableId, restaurantId, data);
    if (!affected) throw httpError(404, "Table not found.");
  } catch (err) {
    throw translateDbError(err);
  }
  return exports.getTable(tableId, restaurantId);
};

// The waiter's main action: change the status of a table.
exports.updateStatus = async (id, restaurantId, status) => {
  const tableId = parseId(id);
  if (!TABLE_STATUSES.includes(status)) {
    throw httpError(
      400,
      `Status must be one of: ${TABLE_STATUSES.join(", ")}.`,
    );
  }

  // BUSINESS RULE: a table cannot be set to "available" while a guest still has an open order.
  if (status === "available") {
    const open = await tableModel.countActiveOrders(tableId);
    if (open > 0)
      throw httpError(409, "This table still has an unfinished order.");
  }

  const affected = await tableModel.update(tableId, restaurantId, { status });
  if (!affected) throw httpError(404, "Table not found.");
  return exports.getTable(tableId, restaurantId);
};

exports.deleteTable = async (id, restaurantId) => {
  const tableId = parseId(id);

  // BUSINESS RULE: deleting a table would CASCADE and silently erase its reservations and
  // order links (see ON DELETE CASCADE in the schema). So we refuse if anything is active.
  const [orders, reservations] = await Promise.all([
    tableModel.countActiveOrders(tableId),
    tableModel.countActiveReservations(tableId),
  ]);
  if (orders > 0 || reservations > 0) {
    throw httpError(
      409,
      'This table has active orders or reservations. Set it to "out of order" instead.',
    );
  }

  const affected = await tableModel.remove(tableId, restaurantId);
  if (!affected) throw httpError(404, "Table not found.");
  return { id: tableId };
};
