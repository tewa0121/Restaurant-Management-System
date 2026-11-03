const db = require('../config/database');
const { restaurantId } = require('../config/auth');

const ReportModel = {
  async orderTotals(from, to) {
    const [[row]] = await db.query(
      `SELECT COUNT(*) AS total,
              COALESCE(SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END), 0) AS completed,
              COALESCE(SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END), 0) AS cancelled,
              COALESCE(SUM(CASE WHEN status = 'completed' THEN total_amount END), 0) AS sales,
              COALESCE(SUM(CASE WHEN status = 'completed' THEN tax_amount END), 0) AS tax,
              COALESCE(SUM(CASE WHEN status = 'completed' THEN discount_amount END), 0) AS discount
       FROM orders WHERE restaurant_id = ? AND DATE(ordered_at) BETWEEN ? AND ?`,
      [restaurantId, from, to]
    );
    return row;
  },

  async newCustomers(from, to) {
    const [[row]] = await db.query('SELECT COUNT(*) AS total FROM customers WHERE DATE(registered_at) BETWEEN ? AND ?', [from, to]);
    return Number(row.total);
  },

  async reservationTotals(from, to) {
    const [rows] = await db.query(
      `SELECT r.status, COUNT(*) AS total
       FROM reservations r JOIN \`tables\` t ON t.id = r.table_id
       WHERE t.restaurant_id = ? AND r.reservation_date BETWEEN ? AND ?
       GROUP BY r.status`,
      [restaurantId, from, to]
    );
    return rows;
  },

  async sales(from, to, groupBy) {
    const format = groupBy === 'month' ? '%Y-%m' : '%Y-%m-%d';
    const [rows] = await db.query(
      `SELECT DATE_FORMAT(o.ordered_at, '${format}') AS period,
              COUNT(*) AS orders,
              COALESCE(SUM(CASE WHEN o.status = 'completed' THEN 1 ELSE 0 END), 0) AS completed_orders,
              COALESCE(SUM(CASE WHEN o.status = 'completed' THEN o.subtotal END), 0) AS subtotal,
              COALESCE(SUM(CASE WHEN o.status = 'completed' THEN o.discount_amount END), 0) AS discount,
              COALESCE(SUM(CASE WHEN o.status = 'completed' THEN o.tax_amount END), 0) AS tax,
              COALESCE(SUM(CASE WHEN o.status = 'completed' THEN o.total_amount END), 0) AS sales
       FROM orders o
       WHERE o.restaurant_id = ? AND o.status <> 'cancelled' AND DATE(o.ordered_at) BETWEEN ? AND ?
       GROUP BY DATE_FORMAT(o.ordered_at, '${format}')
       ORDER BY period`,
      [restaurantId, from, to]
    );
    return rows;
  },

  async topItems(from, to, limit) {
    const [rows] = await db.query(
      `SELECT mi.id, mi.name, c.name AS category, SUM(oi.quantity) AS quantity, SUM(oi.subtotal) AS revenue
       FROM order_items oi
       JOIN orders o ON o.id = oi.order_id
       JOIN menu_items mi ON mi.id = oi.menu_item_id
       JOIN menu_categories c ON c.id = mi.category_id
       WHERE o.restaurant_id = ? AND o.status <> 'cancelled' AND DATE(o.ordered_at) BETWEEN ? AND ?
       GROUP BY mi.id, mi.name, c.name
       ORDER BY quantity DESC, revenue DESC LIMIT ?`,
      [restaurantId, from, to, limit]
    );
    return rows;
  },

  async staff(from, to) {
    const [rows] = await db.query(
      `SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS name, e.position,
              COUNT(o.id) AS orders,
              COALESCE(SUM(CASE WHEN o.status = 'completed' THEN 1 ELSE 0 END), 0) AS completed_orders,
              COALESCE(SUM(CASE WHEN o.status = 'completed' THEN o.total_amount ELSE 0 END), 0) AS sales
       FROM orders o JOIN employees e ON e.id = o.waiter_id
       WHERE o.restaurant_id = ? AND o.status <> 'cancelled' AND DATE(o.ordered_at) BETWEEN ? AND ?
       GROUP BY e.id, e.first_name, e.last_name, e.position
       ORDER BY sales DESC, orders DESC`,
      [restaurantId, from, to]
    );
    return rows;
  },

  async inventory(from, to) {
    const [rows] = await db.query(
      `SELECT g.id, g.name, g.unit, g.current_stock, g.min_stock_level,
              COALESCE(SUM(CASE WHEN m.movement_type = 'usage' THEN -m.quantity ELSE 0 END), 0) AS used,
              COALESCE(SUM(CASE WHEN m.movement_type = 'purchase' THEN m.quantity ELSE 0 END), 0) AS purchased,
              COALESCE(SUM(CASE WHEN m.movement_type = 'return' THEN -m.quantity ELSE 0 END), 0) AS returned
       FROM ingredients g
       LEFT JOIN stock_movements m ON m.ingredient_id = g.id AND DATE(m.created_at) BETWEEN ? AND ?
       WHERE g.restaurant_id = ?
       GROUP BY g.id, g.name, g.unit, g.current_stock, g.min_stock_level
       ORDER BY used DESC, g.name`,
      [from, to, restaurantId]
    );
    return rows;
  },
};

module.exports = ReportModel;