const db = require('../config/database');
const { restaurantId } = require('../config/auth');

const PAID = "p.payment_status IN ('completed', 'refunded')";

const TABLES_SUBQUERY = `(SELECT GROUP_CONCAT(t.table_number ORDER BY t.id SEPARATOR ', ')
    FROM order_tables ot JOIN \`tables\` t ON t.id = ot.table_id WHERE ot.order_id = o.id)`;

const DashboardModel = {
  async revenueByDay(from, to) {
    const [rows] = await db.query(
      `SELECT DATE_FORMAT(p.paid_at, '%Y-%m-%d') AS day, SUM(p.amount) AS total
       FROM payments p JOIN invoices i ON i.id = p.invoice_id JOIN orders o ON o.id = i.order_id
       WHERE o.restaurant_id = ? AND ${PAID} AND DATE(p.paid_at) BETWEEN ? AND ?
       GROUP BY DATE_FORMAT(p.paid_at, '%Y-%m-%d')`,
      [restaurantId, from, to]
    );
    return rows;
  },

  async refundsByDay(from, to) {
    const [rows] = await db.query(
      `SELECT DATE_FORMAT(r.processed_at, '%Y-%m-%d') AS day, SUM(r.amount) AS total
       FROM refunds r JOIN invoices i ON i.id = r.invoice_id JOIN orders o ON o.id = i.order_id
       WHERE o.restaurant_id = ? AND r.status = 'approved' AND DATE(r.processed_at) BETWEEN ? AND ?
       GROUP BY DATE_FORMAT(r.processed_at, '%Y-%m-%d')`,
      [restaurantId, from, to]
    );
    return rows;
  },

  async paymentsByHour(day) {
    const [rows] = await db.query(
      `SELECT HOUR(p.paid_at) AS hour, SUM(p.amount) AS total
       FROM payments p JOIN invoices i ON i.id = p.invoice_id JOIN orders o ON o.id = i.order_id
       WHERE o.restaurant_id = ? AND ${PAID} AND DATE(p.paid_at) = ?
       GROUP BY HOUR(p.paid_at)`,
      [restaurantId, day]
    );
    return rows;
  },

  async paymentMethods(from, to) {
    const [rows] = await db.query(
      `SELECT p.payment_method, SUM(p.amount) AS total, COUNT(*) AS count
       FROM payments p JOIN invoices i ON i.id = p.invoice_id JOIN orders o ON o.id = i.order_id
       WHERE o.restaurant_id = ? AND ${PAID} AND DATE(p.paid_at) BETWEEN ? AND ?
       GROUP BY p.payment_method ORDER BY total DESC`,
      [restaurantId, from, to]
    );
    return rows;
  },

  async categorySales(from, to) {
    const [rows] = await db.query(
      `SELECT c.name, SUM(oi.subtotal) AS total
       FROM order_items oi
       JOIN orders o ON o.id = oi.order_id
       JOIN menu_items mi ON mi.id = oi.menu_item_id
       JOIN menu_categories c ON c.id = mi.category_id
       WHERE o.restaurant_id = ? AND o.status <> 'cancelled' AND DATE(o.ordered_at) BETWEEN ? AND ?
       GROUP BY c.id, c.name ORDER BY total DESC`,
      [restaurantId, from, to]
    );
    return rows;
  },

  async countOrders(from, to, { statuses, waiterId } = {}) {
    const where = ['o.restaurant_id = ?', "o.status <> 'cancelled'", 'DATE(o.ordered_at) BETWEEN ? AND ?'];
    const params = [restaurantId, from, to];
    if (statuses) {
      where.push('o.status IN (?)');
      params.push(statuses);
    }
    if (waiterId) {
      where.push('o.waiter_id = ?');
      params.push(waiterId);
    }
    const [[row]] = await db.query(`SELECT COUNT(*) AS total FROM orders o WHERE ${where.join(' AND ')}`, params);
    return Number(row.total);
  },

  async countOrdersByStatus(statuses, { waiterId } = {}) {
    const where = ['o.restaurant_id = ?', 'o.status IN (?)'];
    const params = [restaurantId, statuses];
    if (waiterId) {
      where.push('o.waiter_id = ?');
      params.push(waiterId);
    }
    const [rows] = await db.query(`SELECT o.status, COUNT(*) AS total FROM orders o WHERE ${where.join(' AND ')} GROUP BY o.status`, params);
    const counts = {};
    rows.forEach((row) => {
      counts[row.status] = Number(row.total);
    });
    return counts;
  },

  async orderList({ statuses, waiterId, day, limit }) {
    const where = ['o.restaurant_id = ?'];
    const params = [restaurantId];
    if (statuses) {
      where.push('o.status IN (?)');
      params.push(statuses);
    }
    if (waiterId) {
      where.push('o.waiter_id = ?');
      params.push(waiterId);
    }
    if (day) {
      where.push('DATE(o.ordered_at) = ?');
      params.push(day);
    }
    const [rows] = await db.query(
      `SELECT o.id, o.order_number, o.order_type, o.status, o.total_amount, o.ordered_at, o.waiter_id,
              CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
              (SELECT COALESCE(SUM(oi.quantity), 0) FROM order_items oi WHERE oi.order_id = o.id) AS item_count,
              ${TABLES_SUBQUERY} AS table_numbers,
              COALESCE(kq.priority, 0) AS priority, kq.cooking_started_at, kq.cooking_finished_at
       FROM orders o
       LEFT JOIN customers c ON c.id = o.customer_id
       LEFT JOIN kitchen_queue kq ON kq.order_id = o.id
       WHERE ${where.join(' AND ')}
       ORDER BY o.ordered_at DESC, o.id DESC LIMIT ?`,
      [...params, limit]
    );
    return rows;
  },

  async kitchenFinishedToday(day) {
    const [rows] = await db.query(
      `SELECT o.id, o.order_number, o.status, o.ordered_at, kq.cooking_started_at, kq.cooking_finished_at,
              TIMESTAMPDIFF(MINUTE, kq.cooking_started_at, kq.cooking_finished_at) AS prep_minutes,
              (SELECT COALESCE(SUM(oi.quantity), 0) FROM order_items oi WHERE oi.order_id = o.id) AS item_count,
              ${TABLES_SUBQUERY} AS table_numbers
       FROM orders o JOIN kitchen_queue kq ON kq.order_id = o.id
       WHERE o.restaurant_id = ? AND o.status <> 'cancelled' AND kq.cooking_finished_at IS NOT NULL AND DATE(kq.cooking_finished_at) = ?
       ORDER BY kq.cooking_finished_at DESC, o.id DESC`,
      [restaurantId, day]
    );
    return rows;
  },

  async tableStatusCounts() {
    const [rows] = await db.query('SELECT status, COUNT(*) AS total FROM `tables` WHERE restaurant_id = ? GROUP BY status', [restaurantId]);
    const counts = {};
    rows.forEach((row) => {
      counts[row.status] = Number(row.total);
    });
    return counts;
  },

  async activeOrderPerTable(tableIds) {
    if (!tableIds.length) return [];
    const [rows] = await db.query(
      `SELECT ot.table_id, o.id, o.status, o.ordered_at
       FROM order_tables ot JOIN orders o ON o.id = ot.order_id
       WHERE ot.table_id IN (?) AND o.status IN ('pending', 'preparing', 'ready', 'served')
       ORDER BY o.id`,
      [tableIds]
    );
    return rows;
  },

  async customerCounts(sinceDay) {
    const [[row]] = await db.query(
      `SELECT COUNT(*) AS total,
              COALESCE(SUM(CASE WHEN DATE(registered_at) >= ? THEN 1 ELSE 0 END), 0) AS recent
       FROM customers`,
      [sinceDay]
    );
    return { total: Number(row.total), recent: Number(row.recent) };
  },

  async systemCounts() {
    const [[users]] = await db.query('SELECT COUNT(*) AS total FROM users WHERE is_active = TRUE');
    const [[restaurants]] = await db.query('SELECT COUNT(*) AS total FROM restaurants WHERE is_active = TRUE');
    const [[sessions]] = await db.query('SELECT COUNT(*) AS total FROM user_sessions WHERE revoked_at IS NULL AND expires_at > NOW()');
    return { users: Number(users.total), restaurants: Number(restaurants.total), sessions: Number(sessions.total) };
  },

  async invoiceStats(day) {
    const [[today]] = await db.query(
      `SELECT COUNT(*) AS count, COALESCE(SUM(i.total), 0) AS total
       FROM invoices i JOIN orders o ON o.id = i.order_id
       WHERE o.restaurant_id = ? AND DATE(i.generated_at) = ?`,
      [restaurantId, day]
    );
    const [[pending]] = await db.query(
      `SELECT COUNT(*) AS count FROM invoices i JOIN orders o ON o.id = i.order_id
       WHERE o.restaurant_id = ? AND i.status IN ('unpaid', 'partially_paid', 'held')`,
      [restaurantId]
    );
    return { count: Number(today.count), total: Number(today.total), pending: Number(pending.count) };
  },

  async recentInvoices(limit) {
    const [rows] = await db.query(
      `SELECT i.id, i.invoice_number, i.total, i.paid_amount, i.balance, i.status, i.generated_at,
              CONCAT(c.first_name, ' ', c.last_name) AS customer_name, o.order_type,
              (SELECT p.payment_method FROM payments p WHERE p.invoice_id = i.id ORDER BY p.id DESC LIMIT 1) AS last_method,
              ${TABLES_SUBQUERY} AS table_numbers
       FROM invoices i
       JOIN orders o ON o.id = i.order_id
       LEFT JOIN customers c ON c.id = o.customer_id
       WHERE o.restaurant_id = ?
       ORDER BY i.generated_at DESC, i.id DESC LIMIT ?`,
      [restaurantId, limit]
    );
    return rows;
  },

  async pendingInvoices(limit) {
    const [rows] = await db.query(
      `SELECT i.id, i.invoice_number, i.total, i.paid_amount, i.balance, i.status, i.generated_at,
              CONCAT(c.first_name, ' ', c.last_name) AS customer_name, o.order_type,
              ${TABLES_SUBQUERY} AS table_numbers
       FROM invoices i
       JOIN orders o ON o.id = i.order_id
       LEFT JOIN customers c ON c.id = o.customer_id
       WHERE o.restaurant_id = ? AND i.status IN ('unpaid', 'partially_paid', 'held')
       ORDER BY i.generated_at ASC, i.id ASC LIMIT ?`,
      [restaurantId, limit]
    );
    return rows;
  },

  async refundsTotal(from, to) {
    const [[row]] = await db.query(
      `SELECT COALESCE(SUM(r.amount), 0) AS total
       FROM refunds r JOIN invoices i ON i.id = r.invoice_id JOIN orders o ON o.id = i.order_id
       WHERE o.restaurant_id = ? AND r.status = 'approved' AND DATE(r.processed_at) BETWEEN ? AND ?`,
      [restaurantId, from, to]
    );
    return Number(row.total);
  },

  async reservationsToday(day) {
    const [rows] = await db.query(
      `SELECT r.id, r.reservation_time, r.guest_count, r.status, t.table_number
       FROM reservations r JOIN \`tables\` t ON t.id = r.table_id
       WHERE t.restaurant_id = ? AND r.reservation_date = ? AND r.status IN ('pending', 'confirmed', 'seated')
       ORDER BY r.reservation_time, r.id`,
      [restaurantId, day]
    );
    return rows;
  },

  async reservationCount(day) {
    const [[row]] = await db.query(
      `SELECT COUNT(*) AS total FROM reservations r JOIN \`tables\` t ON t.id = r.table_id
       WHERE t.restaurant_id = ? AND r.reservation_date = ? AND r.status <> 'cancelled'`,
      [restaurantId, day]
    );
    return Number(row.total);
  },

  async lowStock(limit) {
    const [rows] = await db.query(
      `SELECT id, name, unit, current_stock, min_stock_level, image_url
       FROM ingredients WHERE restaurant_id = ? AND current_stock <= min_stock_level
       ORDER BY (current_stock / CASE WHEN min_stock_level = 0 THEN 1 ELSE min_stock_level END), name LIMIT ?`,
      [restaurantId, limit]
    );
    return rows;
  },

  async lowStockCount() {
    const [[row]] = await db.query('SELECT COUNT(*) AS total FROM ingredients WHERE restaurant_id = ? AND current_stock <= min_stock_level', [restaurantId]);
    return Number(row.total);
  },

  async orderItemsDetail(orderIds) {
    if (!orderIds.length) return [];
    const [rows] = await db.query(
      `SELECT oi.order_id, oi.item_status, oi.preparation_progress, mc.name AS category_name
       FROM order_items oi
       JOIN menu_items mi ON mi.id = oi.menu_item_id
       JOIN menu_categories mc ON mc.id = mi.category_id
       WHERE oi.order_id IN (?) ORDER BY oi.id`,
      [orderIds]
    );
    return rows;
  },

  async waiterToday(waiterId, day) {
    const filter = waiterId ? 'AND o.waiter_id = ?' : '';
    const params = waiterId ? [restaurantId, waiterId, day] : [restaurantId, day];
    const [[row]] = await db.query(
      `SELECT COUNT(*) AS taken,
              COALESCE(SUM(CASE WHEN o.status IN ('served', 'completed') THEN 1 ELSE 0 END), 0) AS served,
              COALESCE(SUM(CASE WHEN o.status = 'completed' THEN o.total_amount ELSE 0 END), 0) AS revenue,
              AVG(CASE WHEN o.status IN ('served', 'completed') THEN TIMESTAMPDIFF(MINUTE, o.ordered_at, o.updated_at) END) AS avg_minutes
       FROM orders o
       WHERE o.restaurant_id = ? ${filter} AND o.status <> 'cancelled' AND DATE(o.ordered_at) = ?`,
      params
    );
    return row;
  },

  async popularItems(sinceDay, limit) {
    const [rows] = await db.query(
      `SELECT i.id, i.restaurant_id, i.category_id, c.name AS category_name, i.name, i.description, i.price,
              i.image_url, i.is_available, i.preparation_time_minutes, i.created_at, i.updated_at,
              COALESCE(s.qty, 0) AS orders_count,
              (SELECT AVG(f.rating) FROM feedback f
                 WHERE f.order_id IN (SELECT x.order_id FROM order_items x WHERE x.menu_item_id = i.id)) AS rating,
              (SELECT COUNT(*) FROM feedback f
                 WHERE f.order_id IN (SELECT x.order_id FROM order_items x WHERE x.menu_item_id = i.id)) AS reviews
       FROM menu_items i
       JOIN menu_categories c ON c.id = i.category_id
       LEFT JOIN (
         SELECT oi.menu_item_id, SUM(oi.quantity) AS qty
         FROM order_items oi JOIN orders o ON o.id = oi.order_id
         WHERE o.status <> 'cancelled' AND DATE(o.ordered_at) >= ?
         GROUP BY oi.menu_item_id
       ) s ON s.menu_item_id = i.id
       WHERE i.restaurant_id = ? AND i.is_available = TRUE AND c.is_active = TRUE
       ORDER BY COALESCE(s.qty, 0) DESC, i.id DESC LIMIT ?`,
      [sinceDay, restaurantId, limit]
    );
    return rows;
  },

  async favoriteIds(customerId) {
    const [rows] = await db.query('SELECT menu_item_id FROM favorites WHERE customer_id = ?', [customerId]);
    return new Set(rows.map((row) => Number(row.menu_item_id)));
  },

  async databaseSizeMb() {
    try {
      const [[row]] = await db.query(
        'SELECT COALESCE(SUM(data_length + index_length), 0) / 1024 / 1024 AS size FROM information_schema.tables WHERE table_schema = DATABASE()'
      );
      return Math.round(Number(row.size) * 10) / 10;
    } catch (err) {
      return null;
    }
  },
};

module.exports = DashboardModel;