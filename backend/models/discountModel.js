const db = require('../config/database');
const { likeTerm } = require('../utils/sql');
const { restaurantId } = require('../config/auth');

const exec = (conn) => conn || db;

const SELECT_DISCOUNT = `
  SELECT id, restaurant_id, code, description, discount_type, value, min_order_amount, first_order_only,
         DATE_FORMAT(start_date, '%Y-%m-%d') AS start_date, DATE_FORMAT(end_date, '%Y-%m-%d') AS end_date,
         usage_limit, used_count, is_active
  FROM discounts`;

function buildFilters({ search, active }) {
  const where = ['restaurant_id = ?'];
  const params = [restaurantId];

  if (active === true) where.push('is_active = TRUE');
  if (active === false) where.push('is_active = FALSE');
  if (search) {
    const term = likeTerm(search);
    where.push('(code LIKE ? OR description LIKE ?)');
    params.push(term, term);
  }

  return { clause: `WHERE ${where.join(' AND ')}`, params };
}

const DiscountModel = {
  async findByCode(code, conn) {
    const [rows] = await exec(conn).query(`${SELECT_DISCOUNT} WHERE restaurant_id = ? AND LOWER(code) = LOWER(?) LIMIT 1`, [
      restaurantId,
      code,
    ]);
    return rows[0] || null;
  },

  async findById(id, conn) {
    const [rows] = await exec(conn).query(`${SELECT_DISCOUNT} WHERE id = ? AND restaurant_id = ?`, [id, restaurantId]);
    return rows[0] || null;
  },

  async codeTakenByOther(code, excludeId, conn) {
    const [rows] = await exec(conn).query('SELECT id FROM discounts WHERE LOWER(code) = LOWER(?) AND id <> ? LIMIT 1', [
      code,
      excludeId || 0,
    ]);
    return rows.length > 0;
  },

  async list(filters, { limit, offset }, conn) {
    const { clause, params } = buildFilters(filters);
    const [rows] = await exec(conn).query(`${SELECT_DISCOUNT} ${clause} ORDER BY id DESC LIMIT ? OFFSET ?`, [...params, limit, offset]);
    return rows;
  },

  async count(filters, conn) {
    const { clause, params } = buildFilters(filters);
    const [[row]] = await exec(conn).query(`SELECT COUNT(*) AS total FROM discounts ${clause}`, params);
    return Number(row.total);
  },

  async create(data, conn) {
    const [result] = await exec(conn).query(
      `INSERT INTO discounts
        (restaurant_id, code, description, discount_type, value, min_order_amount, first_order_only,
         start_date, end_date, usage_limit, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        restaurantId,
        data.code,
        data.description || null,
        data.discountType,
        data.value,
        data.minOrderAmount === undefined ? 0 : data.minOrderAmount,
        data.firstOrderOnly === undefined ? false : data.firstOrderOnly,
        data.startDate,
        data.endDate,
        data.usageLimit === undefined ? 1 : data.usageLimit,
        data.isActive === undefined ? true : data.isActive,
      ]
    );
    return result.insertId;
  },

  async remove(id, conn) {
    await exec(conn).query('DELETE FROM discounts WHERE id = ?', [id]);
  },

  async hasPreviousOrders(customerId, conn) {
    const [[row]] = await exec(conn).query(
      "SELECT COUNT(*) AS total FROM orders WHERE customer_id = ? AND status <> 'cancelled'",
      [customerId]
    );
    return Number(row.total) > 0;
  },

  async adjustUsed(id, delta, conn) {
    await exec(conn).query(
      'UPDATE discounts SET used_count = CASE WHEN used_count + ? < 0 THEN 0 ELSE used_count + ? END WHERE id = ?',
      [delta, delta, id]
    );
  },
};

module.exports = DiscountModel;