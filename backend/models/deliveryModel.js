const db = require('../config/database');
const { likeTerm } = require('../utils/sql');
const { restaurantId } = require('../config/auth');

const exec = (conn) => conn || db;

const LATEST_STATUS = `(SELECT t.status FROM delivery_tracking t WHERE t.delivery_order_id = d.order_id ORDER BY t.id DESC LIMIT 1)`;

const SELECT_DELIVERY = `
  SELECT d.order_id, o.order_number, o.status AS order_status, o.customer_id, o.total_amount, o.ordered_at,
         CONCAT(c.first_name, ' ', c.last_name) AS customer_name, c.phone AS customer_phone, c.user_id AS customer_user_id,
         d.delivery_address, d.delivery_contact_phone, d.delivery_instructions, d.assigned_driver_id,
         CONCAT(e.first_name, ' ', e.last_name) AS driver_name, e.phone AS driver_phone,
         d.estimated_time, d.actual_delivered_at, d.delivery_fee,
         ${LATEST_STATUS} AS tracking_status,
         (SELECT t.updated_at FROM delivery_tracking t WHERE t.delivery_order_id = d.order_id ORDER BY t.id DESC LIMIT 1) AS tracking_updated_at
  FROM delivery_orders d
  JOIN orders o ON o.id = d.order_id
  LEFT JOIN customers c ON c.id = o.customer_id
  LEFT JOIN employees e ON e.id = d.assigned_driver_id`;

function buildFilters({ status, driverId, date, search }) {
  const where = ['o.restaurant_id = ?'];
  const params = [restaurantId];

  if (status === 'unassigned') where.push('d.assigned_driver_id IS NULL');
  else if (status) {
    where.push(`${LATEST_STATUS} = ?`);
    params.push(status);
  }
  if (driverId) {
    where.push('d.assigned_driver_id = ?');
    params.push(driverId);
  }
  if (date) {
    where.push('DATE(o.ordered_at) = ?');
    params.push(date);
  }
  if (search) {
    const term = likeTerm(search);
    where.push("(o.order_number LIKE ? OR d.delivery_address LIKE ? OR CONCAT(c.first_name, ' ', c.last_name) LIKE ?)");
    params.push(term, term, term);
  }

  return { clause: `WHERE ${where.join(' AND ')}`, params };
}

const DeliveryModel = {
  async list(filters, { limit, offset }, conn) {
    const { clause, params } = buildFilters(filters);
    const [rows] = await exec(conn).query(`${SELECT_DELIVERY} ${clause} ORDER BY o.ordered_at DESC, d.order_id DESC LIMIT ? OFFSET ?`, [
      ...params,
      limit,
      offset,
    ]);
    const [[count]] = await exec(conn).query(
      `SELECT COUNT(*) AS total
       FROM delivery_orders d
       JOIN orders o ON o.id = d.order_id
       LEFT JOIN customers c ON c.id = o.customer_id ${clause}`,
      params
    );
    return { rows, total: Number(count.total) };
  },

  async findByOrder(orderId, conn) {
    const [rows] = await exec(conn).query(`${SELECT_DELIVERY} WHERE d.order_id = ? AND o.restaurant_id = ?`, [orderId, restaurantId]);
    return rows[0] || null;
  },

  async tracking(orderId, conn) {
    const [rows] = await exec(conn).query(
      'SELECT id, status, location_lat, location_lng, updated_at FROM delivery_tracking WHERE delivery_order_id = ? ORDER BY id',
      [orderId]
    );
    return rows;
  },

  async insertTracking({ orderId, status, lat, lng }, conn) {
    await exec(conn).query(
      'INSERT INTO delivery_tracking (delivery_order_id, status, location_lat, location_lng) VALUES (?, ?, ?, ?)',
      [orderId, status, lat === undefined ? null : lat, lng === undefined ? null : lng]
    );
  },

  async assign(orderId, driverId, estimatedTime, conn) {
    await exec(conn).query(
      'UPDATE delivery_orders SET assigned_driver_id = ?, estimated_time = COALESCE(?, estimated_time) WHERE order_id = ?',
      [driverId, estimatedTime === undefined ? null : estimatedTime, orderId]
    );
  },

  async markDelivered(orderId, conn) {
    await exec(conn).query('UPDATE delivery_orders SET actual_delivered_at = NOW() WHERE order_id = ?', [orderId]);
  },

  async drivers(conn) {
    const [rows] = await exec(conn).query(
      `SELECT e.id, e.employee_code, CONCAT(e.first_name, ' ', e.last_name) AS name, e.phone, e.position,
              (SELECT COUNT(*) FROM delivery_orders d
                 JOIN orders o ON o.id = d.order_id
                 WHERE d.assigned_driver_id = e.id AND o.status NOT IN ('completed', 'cancelled')
                   AND COALESCE(${LATEST_STATUS}, 'assigned') NOT IN ('delivered', 'failed')) AS active_deliveries
       FROM employees e
       WHERE e.restaurant_id = ? AND e.is_active = TRUE
         AND (LOWER(e.position) LIKE '%deliver%' OR LOWER(e.position) LIKE '%driver%' OR LOWER(e.position) LIKE '%rider%')
       ORDER BY e.first_name, e.id`,
      [restaurantId]
    );
    return rows;
  },
};

module.exports = DeliveryModel;