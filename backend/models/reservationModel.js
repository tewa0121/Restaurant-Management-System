const db = require('../config/database');
const { likeTerm } = require('../utils/sql');
const { restaurantId } = require('../config/auth');
const { reservationSlotMinutes } = require('../config/business');

const exec = (conn) => conn || db;

const SELECT_RESERVATION = `
  SELECT r.id, r.customer_id, CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
         c.phone AS customer_phone, c.email AS customer_email,
         r.table_id, t.table_number, t.section,
         DATE_FORMAT(r.reservation_date, '%Y-%m-%d') AS reservation_date, r.reservation_time,
         r.guest_count, r.special_request, r.status, r.created_by, r.created_at
  FROM reservations r
  JOIN customers c ON c.id = r.customer_id
  JOIN \`tables\` t ON t.id = r.table_id`;

function buildFilters({ date, from, to, status, tableId, customerId, search }) {
  const where = ['t.restaurant_id = ?'];
  const params = [restaurantId];

  if (date) {
    where.push('r.reservation_date = ?');
    params.push(date);
  }
  if (from) {
    where.push('r.reservation_date >= ?');
    params.push(from);
  }
  if (to) {
    where.push('r.reservation_date <= ?');
    params.push(to);
  }
  if (status) {
    where.push('r.status = ?');
    params.push(status);
  }
  if (tableId) {
    where.push('r.table_id = ?');
    params.push(tableId);
  }
  if (customerId) {
    where.push('r.customer_id = ?');
    params.push(customerId);
  }
  if (search) {
    const term = likeTerm(search);
    where.push("(CONCAT(c.first_name, ' ', c.last_name) LIKE ? OR c.phone LIKE ? OR t.table_number LIKE ?)");
    params.push(term, term, term);
  }

  return { clause: `WHERE ${where.join(' AND ')}`, params };
}

const ReservationModel = {
  async list(filters, { limit, offset }, conn) {
    const { clause, params } = buildFilters(filters);
    const [rows] = await exec(conn).query(
      `${SELECT_RESERVATION} ${clause}
       ORDER BY r.reservation_date DESC, r.reservation_time ASC, r.id DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    return rows;
  },

  async count(filters, conn) {
    const { clause, params } = buildFilters(filters);
    const [[row]] = await exec(conn).query(
      `SELECT COUNT(*) AS total
       FROM reservations r
       JOIN customers c ON c.id = r.customer_id
       JOIN \`tables\` t ON t.id = r.table_id ${clause}`,
      params
    );
    return Number(row.total);
  },

  async findById(id, conn) {
    const [rows] = await exec(conn).query(`${SELECT_RESERVATION} WHERE r.id = ? AND t.restaurant_id = ?`, [id, restaurantId]);
    return rows[0] || null;
  },

  async findConflict({ tableId, date, time, excludeId }, conn) {
    const params = [tableId, date, date, time, reservationSlotMinutes];
    let exclude = '';
    if (excludeId) {
      exclude = 'AND r.id <> ?';
      params.push(excludeId);
    }
    const [rows] = await exec(conn).query(
      `SELECT r.id FROM reservations r
       WHERE r.table_id = ? AND r.reservation_date = ? AND r.status IN ('pending', 'confirmed', 'seated')
         AND ABS(TIMESTAMPDIFF(MINUTE, TIMESTAMP(r.reservation_date, r.reservation_time), TIMESTAMP(?, ?))) < ?
         ${exclude}
       LIMIT 1`,
      params
    );
    return rows[0] || null;
  },

  async create({ customerId, tableId, date, time, guests, specialRequest, status, createdBy }, conn) {
    const [result] = await exec(conn).query(
      `INSERT INTO reservations
        (customer_id, table_id, reservation_date, reservation_time, guest_count, special_request, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [customerId, tableId, date, time, guests, specialRequest || null, status, createdBy || null]
    );
    return result.insertId;
  },

  async remove(id, conn) {
    await exec(conn).query('DELETE FROM reservations WHERE id = ?', [id]);
  },

  async setStatus(id, status, conn) {
    await exec(conn).query('UPDATE reservations SET status = ? WHERE id = ?', [status, id]);
  },

  async findCustomerByPhone(phone, conn) {
    const [rows] = await exec(conn).query('SELECT id FROM customers WHERE phone = ? LIMIT 1', [phone]);
    return rows[0] || null;
  },

  async hasConfirmedToday(tableId, today, conn) {
    const [rows] = await exec(conn).query(
      "SELECT id FROM reservations WHERE table_id = ? AND reservation_date = ? AND status = 'confirmed' LIMIT 1",
      [tableId, today]
    );
    return rows.length > 0;
  },

  async upcomingForTable(tableId, today, conn) {
    const [rows] = await exec(conn).query(
      `${SELECT_RESERVATION}
       WHERE r.table_id = ? AND r.reservation_date >= ? AND r.status IN ('pending', 'confirmed')
       ORDER BY r.reservation_date, r.reservation_time LIMIT 10`,
      [tableId, today]
    );
    return rows;
  },
};

module.exports = ReservationModel;