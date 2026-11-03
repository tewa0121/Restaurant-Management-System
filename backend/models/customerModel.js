const db = require('../config/database');
const { likeTerm } = require('../utils/sql');

const exec = (conn) => conn || db;

const SELECT_CUSTOMER = `
  SELECT c.id, c.user_id, c.first_name, c.last_name, c.email, c.phone, c.loyalty_points, c.total_orders,
         c.total_spent, c.registered_at, c.is_vip,
         (SELECT MAX(o.ordered_at) FROM orders o WHERE o.customer_id = c.id) AS last_visit
  FROM customers c`;

function buildFilters({ search, status }) {
  const where = [];
  const params = [];

  if (search) {
    const term = likeTerm(search);
    where.push("(CONCAT(c.first_name, ' ', c.last_name) LIKE ? OR c.email LIKE ? OR c.phone LIKE ?)");
    params.push(term, term, term);
  }
  if (status === 'vip') where.push('c.is_vip = TRUE');
  if (status === 'new') where.push('c.is_vip = FALSE AND c.total_orders <= 1');
  if (status === 'regular') where.push('c.is_vip = FALSE AND c.total_orders > 1');

  return { clause: where.length ? `WHERE ${where.join(' AND ')}` : '', params };
}

const CustomerModel = {
  async list(filters, { limit, offset }, conn) {
    const { clause, params } = buildFilters(filters);
    const [rows] = await exec(conn).query(
      `${SELECT_CUSTOMER} ${clause} ORDER BY c.registered_at DESC, c.id DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    return rows;
  },

  async count(filters, conn) {
    const { clause, params } = buildFilters(filters);
    const [[row]] = await exec(conn).query(`SELECT COUNT(*) AS total FROM customers c ${clause}`, params);
    return Number(row.total);
  },

  async findById(id, conn) {
    const [rows] = await exec(conn).query(`${SELECT_CUSTOMER} WHERE c.id = ?`, [id]);
    return rows[0] || null;
  },

  async findByUserId(userId, conn) {
    const [rows] = await exec(conn).query(`${SELECT_CUSTOMER} WHERE c.user_id = ?`, [userId]);
    return rows[0] || null;
  },

  async create({ firstName, lastName, email, phone, isVip }, conn) {
    const [result] = await exec(conn).query(
      'INSERT INTO customers (first_name, last_name, email, phone, is_vip) VALUES (?, ?, ?, ?, ?)',
      [firstName, lastName, email || null, phone || '', Boolean(isVip)]
    );
    return result.insertId;
  },

  async remove(id, conn) {
    await exec(conn).query('DELETE FROM customers WHERE id = ?', [id]);
  },

  async adjustLoyalty(id, points, conn) {
    await exec(conn).query(
      'UPDATE customers SET loyalty_points = CASE WHEN loyalty_points + ? < 0 THEN 0 ELSE loyalty_points + ? END WHERE id = ?',
      [points, points, id]
    );
  },

  async recentOrders(customerId, conn) {
    const [rows] = await exec(conn).query(
      `SELECT id, order_number, status, total_amount, ordered_at
       FROM orders WHERE customer_id = ? ORDER BY ordered_at DESC, id DESC LIMIT 5`,
      [customerId]
    );
    return rows;
  },

  async listAddresses(customerId, conn) {
    const [rows] = await exec(conn).query(
      `SELECT id, customer_id, label, address_line, city, phone, is_default, created_at
       FROM customer_addresses WHERE customer_id = ? ORDER BY is_default DESC, id DESC`,
      [customerId]
    );
    return rows;
  },

  async findAddress(id, customerId, conn) {
    const [rows] = await exec(conn).query(
      `SELECT id, customer_id, label, address_line, city, phone, is_default, created_at
       FROM customer_addresses WHERE id = ? AND customer_id = ?`,
      [id, customerId]
    );
    return rows[0] || null;
  },

  async countAddresses(customerId, conn) {
    const [[row]] = await exec(conn).query('SELECT COUNT(*) AS total FROM customer_addresses WHERE customer_id = ?', [customerId]);
    return Number(row.total);
  },

  async clearDefaultAddress(customerId, conn) {
    await exec(conn).query('UPDATE customer_addresses SET is_default = FALSE WHERE customer_id = ?', [customerId]);
  },

  async createAddress({ customerId, label, addressLine, city, phone, isDefault }, conn) {
    const [result] = await exec(conn).query(
      'INSERT INTO customer_addresses (customer_id, label, address_line, city, phone, is_default) VALUES (?, ?, ?, ?, ?, ?)',
      [customerId, label, addressLine, city || null, phone || null, Boolean(isDefault)]
    );
    return result.insertId;
  },

  async removeAddress(id, conn) {
    await exec(conn).query('DELETE FROM customer_addresses WHERE id = ?', [id]);
  },

  async latestAddressId(customerId, conn) {
    const [rows] = await exec(conn).query('SELECT id FROM customer_addresses WHERE customer_id = ? ORDER BY id DESC LIMIT 1', [customerId]);
    return rows[0] ? rows[0].id : null;
  },
};

module.exports = CustomerModel;