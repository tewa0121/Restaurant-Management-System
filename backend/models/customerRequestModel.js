const db = require('../config/database');
const { restaurantId } = require('../config/auth');

const exec = (conn) => conn || db;

const SELECT_REQUEST = `
  SELECT cr.id, cr.table_id, t.table_number, cr.order_id, o.order_number, cr.customer_id,
         CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
         cr.assigned_waiter_id, CONCAT(w.first_name, ' ', w.last_name) AS waiter_name,
         cr.request_text, cr.status, cr.created_at, cr.resolved_at,
         TIMESTAMPDIFF(MINUTE, cr.created_at, NOW()) AS waiting_minutes
  FROM customer_requests cr
  JOIN \`tables\` t ON t.id = cr.table_id
  LEFT JOIN orders o ON o.id = cr.order_id
  LEFT JOIN customers c ON c.id = cr.customer_id
  LEFT JOIN employees w ON w.id = cr.assigned_waiter_id`;

function buildFilters({ statuses, tableId, customerId, waiterEmployeeId }) {
  const where = ['t.restaurant_id = ?'];
  const params = [restaurantId];

  if (statuses && statuses.length) {
    where.push('cr.status IN (?)');
    params.push(statuses);
  }
  if (tableId) {
    where.push('cr.table_id = ?');
    params.push(tableId);
  }
  if (customerId) {
    where.push('cr.customer_id = ?');
    params.push(customerId);
  }
  if (waiterEmployeeId) {
    where.push('(cr.assigned_waiter_id = ? OR (cr.assigned_waiter_id IS NULL AND t.assigned_waiter_id = ?))');
    params.push(waiterEmployeeId, waiterEmployeeId);
  }

  return { clause: `WHERE ${where.join(' AND ')}`, params };
}

const CustomerRequestModel = {
  async list(filters, { limit, offset }, conn) {
    const { clause, params } = buildFilters(filters);
    const [rows] = await exec(conn).query(
      `${SELECT_REQUEST} ${clause}
       ORDER BY CASE cr.status WHEN 'new' THEN 0 WHEN 'in_progress' THEN 1 ELSE 2 END, cr.created_at DESC, cr.id DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    return rows;
  },

  async count(filters, conn) {
    const { clause, params } = buildFilters(filters);
    const [[row]] = await exec(conn).query(
      `SELECT COUNT(*) AS total FROM customer_requests cr JOIN \`tables\` t ON t.id = cr.table_id ${clause}`,
      params
    );
    return Number(row.total);
  },

  async findById(id, conn) {
    const [rows] = await exec(conn).query(`${SELECT_REQUEST} WHERE cr.id = ? AND t.restaurant_id = ?`, [id, restaurantId]);
    return rows[0] || null;
  },

  async create({ tableId, orderId, customerId, assignedWaiterId, text }, conn) {
    const [result] = await exec(conn).query(
      'INSERT INTO customer_requests (table_id, order_id, customer_id, assigned_waiter_id, request_text) VALUES (?, ?, ?, ?, ?)',
      [tableId, orderId || null, customerId || null, assignedWaiterId || null, text]
    );
    return result.insertId;
  },

  async setStatus(id, status, assignedWaiterId, conn) {
    await exec(conn).query(
      `UPDATE customer_requests
       SET status = ?, assigned_waiter_id = COALESCE(assigned_waiter_id, ?),
           resolved_at = CASE WHEN ? = 'done' THEN NOW() ELSE NULL END
       WHERE id = ?`,
      [status, assignedWaiterId || null, status, id]
    );
  },

  async assign(id, waiterId, conn) {
    await exec(conn).query('UPDATE customer_requests SET assigned_waiter_id = ? WHERE id = ?', [waiterId, id]);
  },

  async findActiveTableForCustomer({ customerId, tableId, orderId }, conn) {
    const params = [customerId];
    let extra = '';
    if (tableId) {
      extra += ' AND ot.table_id = ?';
      params.push(tableId);
    }
    if (orderId) {
      extra += ' AND o.id = ?';
      params.push(orderId);
    }
    const [rows] = await exec(conn).query(
      `SELECT ot.table_id, o.id AS order_id
       FROM order_tables ot JOIN orders o ON o.id = ot.order_id
       WHERE o.customer_id = ? AND o.status IN ('pending', 'preparing', 'ready', 'served') ${extra}
       ORDER BY o.id DESC LIMIT 1`,
      params
    );
    return rows[0] || null;
  },
};

module.exports = CustomerRequestModel;