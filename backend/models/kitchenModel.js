const db = require('../config/database');

// NOTE: these queries deliberately do not filter on restaurant_id, so they keep
// working unchanged once the multi-restaurant columns are removed (step 6).

const FINISHED = `o.status <> 'cancelled' AND kq.cooking_started_at IS NOT NULL AND kq.cooking_finished_at IS NOT NULL
  AND DATE(kq.cooking_finished_at) BETWEEN ? AND ?`;

const KitchenModel = {
  // One row per day with the number of finished tickets, dishes and prep timing.
  async dailyOutput(from, to, target) {
    const [rows] = await db.query(
      `SELECT DATE_FORMAT(kq.cooking_finished_at, '%Y-%m-%d') AS day,
              COUNT(*) AS orders,
              COALESCE(SUM((SELECT COALESCE(SUM(oi.quantity), 0) FROM order_items oi WHERE oi.order_id = o.id)), 0) AS dishes,
              AVG(TIMESTAMPDIFF(MINUTE, kq.cooking_started_at, kq.cooking_finished_at)) AS avg_minutes,
              SUM(CASE WHEN TIMESTAMPDIFF(MINUTE, kq.cooking_started_at, kq.cooking_finished_at) <= ? THEN 1 ELSE 0 END) AS on_time
       FROM orders o JOIN kitchen_queue kq ON kq.order_id = o.id
       WHERE ${FINISHED}
       GROUP BY DATE_FORMAT(kq.cooking_finished_at, '%Y-%m-%d')
       ORDER BY day`,
      [target, from, to]
    );
    return rows;
  },

  // Tickets finished per hour of the day (used to find the rush hour).
  async hourlyOutput(from, to) {
    const [rows] = await db.query(
      `SELECT HOUR(kq.cooking_finished_at) AS hour, COUNT(*) AS orders
       FROM orders o JOIN kitchen_queue kq ON kq.order_id = o.id
       WHERE ${FINISHED}
       GROUP BY HOUR(kq.cooking_finished_at) ORDER BY hour`,
      [from, to]
    );
    return rows;
  },

  // Average ticket time of the orders that contained each menu category.
  async speedByCategory(from, to, target) {
    const [rows] = await db.query(
      `SELECT c.name AS category, COUNT(*) AS orders,
              AVG(t.minutes) AS avg_minutes, MAX(t.minutes) AS slowest_minutes,
              SUM(CASE WHEN t.minutes <= ? THEN 1 ELSE 0 END) AS on_time
       FROM (
         SELECT DISTINCT o.id AS order_id, mi.category_id,
                TIMESTAMPDIFF(MINUTE, kq.cooking_started_at, kq.cooking_finished_at) AS minutes
         FROM orders o
         JOIN kitchen_queue kq ON kq.order_id = o.id
         JOIN order_items oi ON oi.order_id = o.id
         JOIN menu_items mi ON mi.id = oi.menu_item_id
         WHERE ${FINISHED}
       ) t
       JOIN menu_categories c ON c.id = t.category_id
       GROUP BY c.id, c.name ORDER BY avg_minutes DESC`,
      [target, from, to]
    );
    return rows;
  },

  // Stock that was written off: negative manual adjustments.
  async wastage(from, to) {
    const [rows] = await db.query(
      `SELECT g.id, g.name AS ingredient, g.unit,
              COUNT(*) AS entries,
              SUM(-m.quantity) AS quantity,
              MAX(m.created_at) AS last_at,
              SUBSTRING_INDEX(GROUP_CONCAT(m.note ORDER BY m.created_at DESC SEPARATOR '||'), '||', 1) AS last_note
       FROM stock_movements m JOIN ingredients g ON g.id = m.ingredient_id
       WHERE m.movement_type = 'adjustment' AND m.quantity < 0 AND DATE(m.created_at) BETWEEN ? AND ?
       GROUP BY g.id, g.name, g.unit
       ORDER BY quantity DESC, g.name`,
      [from, to]
    );
    return rows;
  },

  // Best selling dishes in the kitchen for the period.
  async demand(from, to, limit) {
    const [rows] = await db.query(
      `SELECT mi.id, mi.name, c.name AS category,
              SUM(oi.quantity) AS quantity, COUNT(DISTINCT o.id) AS orders
       FROM order_items oi
       JOIN orders o ON o.id = oi.order_id
       JOIN menu_items mi ON mi.id = oi.menu_item_id
       JOIN menu_categories c ON c.id = mi.category_id
       WHERE o.status <> 'cancelled' AND DATE(o.ordered_at) BETWEEN ? AND ?
       GROUP BY mi.id, mi.name, c.name
       ORDER BY quantity DESC, mi.name LIMIT ?`,
      [from, to, limit]
    );
    return rows;
  },
};

module.exports = KitchenModel;
