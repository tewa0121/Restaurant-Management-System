const db = require('../config/database');
const { likeTerm } = require('../utils/sql');
const { restaurantId } = require('../config/auth');

const exec = (conn) => conn || db;

const SELECT_SUPPLIER = `
  SELECT s.id, s.restaurant_id, s.name, s.contact_person, s.phone, s.email, s.address, s.payment_terms,
         (SELECT COUNT(*) FROM ingredients g WHERE g.supplier_id = s.id) AS ingredient_count,
         (SELECT COUNT(*) FROM purchase_orders p WHERE p.supplier_id = s.id AND p.status IN ('draft', 'sent')) AS open_orders
  FROM suppliers s`;

const SupplierModel = {
  async list({ search }, { limit, offset }, conn) {
    const where = ['s.restaurant_id = ?'];
    const params = [restaurantId];
    if (search) {
      const term = likeTerm(search);
      where.push('(s.name LIKE ? OR s.contact_person LIKE ? OR s.phone LIKE ? OR s.email LIKE ?)');
      params.push(term, term, term, term);
    }
    const clause = `WHERE ${where.join(' AND ')}`;
    const [rows] = await exec(conn).query(`${SELECT_SUPPLIER} ${clause} ORDER BY s.name, s.id LIMIT ? OFFSET ?`, [
      ...params,
      limit,
      offset,
    ]);
    const [[count]] = await exec(conn).query(`SELECT COUNT(*) AS total FROM suppliers s ${clause}`, params);
    return { rows, total: Number(count.total) };
  },

  async findById(id, conn) {
    const [rows] = await exec(conn).query(`${SELECT_SUPPLIER} WHERE s.id = ? AND s.restaurant_id = ?`, [id, restaurantId]);
    return rows[0] || null;
  },

  async findByName(name, excludeId, conn) {
    const [rows] = await exec(conn).query(
      'SELECT id FROM suppliers WHERE restaurant_id = ? AND LOWER(name) = LOWER(?) AND id <> ? LIMIT 1',
      [restaurantId, name, excludeId || 0]
    );
    return rows[0] || null;
  },

  async create(data, conn) {
    const [result] = await exec(conn).query(
      'INSERT INTO suppliers (restaurant_id, name, contact_person, phone, email, address, payment_terms) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [restaurantId, data.name, data.contactPerson || null, data.phone || null, data.email || null, data.address || null, data.paymentTerms || null]
    );
    return result.insertId;
  },

  async remove(id, conn) {
    await exec(conn).query('DELETE FROM suppliers WHERE id = ?', [id]);
  },

  async purchaseOrderCount(id, conn) {
    const [[row]] = await exec(conn).query('SELECT COUNT(*) AS total FROM purchase_orders WHERE supplier_id = ?', [id]);
    return Number(row.total);
  },
};

module.exports = SupplierModel;