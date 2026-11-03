const db = require('../config/database');
const { likeTerm } = require('../utils/sql');
const { restaurantId } = require('../config/auth');
const { reservationSlotMinutes } = require('../config/business');

const exec = (conn) => conn || db;

const SELECT_TABLE = `
  SELECT t.id, t.restaurant_id, t.table_number, t.capacity, t.pos_x, t.pos_y, t.shape, t.section,
         t.assigned_waiter_id, t.status, t.qr_code_url, t.parent_table_id, t.created_at,
         CONCAT(w.first_name, ' ', w.last_name) AS waiter_name,
         ta.id AS assignment_id, ta.guest_count AS guests, ta.seated_at, ta.waiter_id AS seated_waiter_id
  FROM \`tables\` t
  LEFT JOIN employees w ON w.id = t.assigned_waiter_id
  LEFT JOIN table_assignments ta
    ON ta.id = (SELECT MAX(x.id) FROM table_assignments x WHERE x.table_id = t.id AND x.released_at IS NULL)`;

function buildFilters({ status, section, search, waiterEmployeeId }) {
  const where = ['t.restaurant_id = ?'];
  const params = [restaurantId];

  if (status) {
    where.push('t.status = ?');
    params.push(status);
  }
  if (section) {
    where.push('t.section = ?');
    params.push(section);
  }
  if (search) {
    const term = likeTerm(search);
    where.push('(t.table_number LIKE ? OR t.section LIKE ?)');
    params.push(term, term);
  }
  if (waiterEmployeeId) {
    where.push('(t.assigned_waiter_id = ? OR ta.waiter_id = ?)');
    params.push(waiterEmployeeId, waiterEmployeeId);
  }

  return { clause: `WHERE ${where.join(' AND ')}`, params };
}

const TableModel = {
  async list(filters, conn) {
    const { clause, params } = buildFilters(filters);
    const [rows] = await exec(conn).query(
      `${SELECT_TABLE} ${clause} ORDER BY CAST(t.table_number AS UNSIGNED), t.table_number, t.id`,
      params
    );
    return rows;
  },

  async findById(id, conn) {
    const [rows] = await exec(conn).query(`${SELECT_TABLE} WHERE t.id = ? AND t.restaurant_id = ?`, [id, restaurantId]);
    return rows[0] || null;
  },

  async findByNumber(tableNumber, conn) {
    const [rows] = await exec(conn).query(
      'SELECT id, table_number FROM `tables` WHERE restaurant_id = ? AND table_number = ? LIMIT 1',
      [restaurantId, tableNumber]
    );
    return rows[0] || null;
  },

  async lockById(id, conn) {
    const [rows] = await exec(conn).query(
      'SELECT id, table_number, capacity, status, assigned_waiter_id FROM `tables` WHERE id = ? AND restaurant_id = ? FOR UPDATE',
      [id, restaurantId]
    );
    return rows[0] || null;
  },

  async create(data, conn) {
    const [result] = await exec(conn).query(
      `INSERT INTO \`tables\`
        (restaurant_id, table_number, capacity, pos_x, pos_y, shape, section, assigned_waiter_id, status, qr_code_url, parent_table_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        restaurantId,
        data.tableNumber,
        data.capacity,
        data.posX === undefined ? 0 : data.posX,
        data.posY === undefined ? 0 : data.posY,
        data.shape || 'square',
        data.section || null,
        data.assignedWaiterId || null,
        data.status || 'available',
        data.qrCodeUrl || null,
        data.parentTableId || null,
      ]
    );
    return result.insertId;
  },

  async remove(id, conn) {
    await exec(conn).query('DELETE FROM `tables` WHERE id = ?', [id]);
  },

  async setStatus(id, status, conn) {
    await exec(conn).query('UPDATE `tables` SET status = ? WHERE id = ?', [status, id]);
  },

  async releaseAssignments(tableId, conn) {
    await exec(conn).query('UPDATE table_assignments SET released_at = NOW() WHERE table_id = ? AND released_at IS NULL', [tableId]);
  },

  async createAssignment({ tableId, waiterId, customerId, guestCount }, conn) {
    const [result] = await exec(conn).query(
      'INSERT INTO table_assignments (table_id, waiter_id, customer_id, guest_count) VALUES (?, ?, ?, ?)',
      [tableId, waiterId, customerId || null, guestCount]
    );
    return result.insertId;
  },

  async findAvailable({ date, time, guests, excludeReservationId }, conn) {
    const params = [restaurantId, guests, date, date, time, reservationSlotMinutes];
    let exclude = '';
    if (excludeReservationId) {
      exclude = 'AND r.id <> ?';
      params.push(excludeReservationId);
    }
    const [rows] = await exec(conn).query(
      `${SELECT_TABLE}
       WHERE t.restaurant_id = ? AND t.status <> 'out_of_order' AND t.capacity >= ?
         AND NOT EXISTS (
           SELECT 1 FROM reservations r
           WHERE r.table_id = t.id AND r.reservation_date = ? AND r.status IN ('pending', 'confirmed', 'seated')
             AND ABS(TIMESTAMPDIFF(MINUTE, TIMESTAMP(r.reservation_date, r.reservation_time), TIMESTAMP(?, ?))) < ?
             ${exclude}
         )
       ORDER BY t.capacity, CAST(t.table_number AS UNSIGNED), t.id`,
      params
    );
    return rows;
  },
};

module.exports = TableModel;