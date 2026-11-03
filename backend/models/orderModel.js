const db = require('../config/database');
const { likeTerm } = require('../utils/sql');
const { restaurantId } = require('../config/auth');

const exec = (conn) => conn || db;

const SELECT_ORDER = `
  SELECT o.id, o.restaurant_id, o.order_number, o.customer_id, o.waiter_id, o.discount_id, o.order_type, o.status,
         o.subtotal, o.tax_amount, o.discount_amount, o.total_amount, o.notes, o.ordered_at, o.updated_at,
         CONCAT(c.first_name, ' ', c.last_name) AS customer_name, c.phone AS customer_phone,
         CONCAT(w.first_name, ' ', w.last_name) AS waiter_name,
         kq.priority, kq.cooking_started_at, kq.cooking_finished_at, kq.notified_waiter,
         TIMESTAMPDIFF(MINUTE, o.ordered_at, NOW()) AS elapsed_minutes
  FROM orders o
  LEFT JOIN customers c ON c.id = o.customer_id
  LEFT JOIN employees w ON w.id = o.waiter_id
  LEFT JOIN kitchen_queue kq ON kq.order_id = o.id`;

function buildFilters({ statuses, type, tableId, waiterId, customerId, date, from, to, search }) {
  const where = ['o.restaurant_id = ?'];
  const params = [restaurantId];

  if (statuses && statuses.length) {
    where.push('o.status IN (?)');
    params.push(statuses);
  }
  if (type) {
    where.push('o.order_type = ?');
    params.push(type);
  }
  if (tableId) {
    where.push('EXISTS (SELECT 1 FROM order_tables ot WHERE ot.order_id = o.id AND ot.table_id = ?)');
    params.push(tableId);
  }
  if (waiterId) {
    where.push('o.waiter_id = ?');
    params.push(waiterId);
  }
  if (customerId) {
    where.push('o.customer_id = ?');
    params.push(customerId);
  }
  if (date) {
    where.push('DATE(o.ordered_at) = ?');
    params.push(date);
  }
  if (from) {
    where.push('DATE(o.ordered_at) >= ?');
    params.push(from);
  }
  if (to) {
    where.push('DATE(o.ordered_at) <= ?');
    params.push(to);
  }
  if (search) {
    const term = likeTerm(search);
    where.push("(o.order_number LIKE ? OR CONCAT(c.first_name, ' ', c.last_name) LIKE ?)");
    params.push(term, term);
  }

  return { clause: `WHERE ${where.join(' AND ')}`, params };
}

const OrderModel = {
  async list(filters, { limit, offset }, kitchenOrder, conn) {
    const { clause, params } = buildFilters(filters);
    const order = kitchenOrder
      ? 'ORDER BY COALESCE(kq.priority, 0) DESC, o.ordered_at ASC, o.id ASC'
      : 'ORDER BY o.ordered_at DESC, o.id DESC';
    const [rows] = await exec(conn).query(`${SELECT_ORDER} ${clause} ${order} LIMIT ? OFFSET ?`, [...params, limit, offset]);
    return rows;
  },

  async count(filters, conn) {
    const { clause, params } = buildFilters(filters);
    const [[row]] = await exec(conn).query(
      `SELECT COUNT(*) AS total FROM orders o LEFT JOIN customers c ON c.id = o.customer_id ${clause}`,
      params
    );
    return Number(row.total);
  },

  async findById(id, conn) {
    const [rows] = await exec(conn).query(`${SELECT_ORDER} WHERE o.id = ? AND o.restaurant_id = ?`, [id, restaurantId]);
    return rows[0] || null;
  },

  async itemsForOrders(orderIds, conn) {
    if (!orderIds.length) return [];
    const [rows] = await exec(conn).query(
      `SELECT oi.id, oi.order_id, oi.menu_item_id, mi.name AS item_name, mc.name AS category_name, oi.quantity,
              oi.unit_price, oi.subtotal, oi.special_instructions, oi.item_status, oi.preparation_progress
       FROM order_items oi
       JOIN menu_items mi ON mi.id = oi.menu_item_id
       JOIN menu_categories mc ON mc.id = mi.category_id
       WHERE oi.order_id IN (?)
       ORDER BY oi.id`,
      [orderIds]
    );
    return rows;
  },

  async modifiersForItems(itemIds, conn) {
    if (!itemIds.length) return [];
    const [rows] = await exec(conn).query(
      `SELECT oim.id, oim.order_item_id, oim.modifier_id, m.name, oim.quantity, oim.unit_price, oim.subtotal
       FROM order_item_modifiers oim
       JOIN menu_item_modifiers m ON m.id = oim.modifier_id
       WHERE oim.order_item_id IN (?)
       ORDER BY oim.id`,
      [itemIds]
    );
    return rows;
  },

  async tablesForOrders(orderIds, conn) {
    if (!orderIds.length) return [];
    const [rows] = await exec(conn).query(
      `SELECT ot.order_id, t.id, t.table_number, t.section
       FROM order_tables ot JOIN \`tables\` t ON t.id = ot.table_id
       WHERE ot.order_id IN (?)
       ORDER BY t.id`,
      [orderIds]
    );
    return rows;
  },

  async deliveriesForOrders(orderIds, conn) {
    if (!orderIds.length) return [];
    const [rows] = await exec(conn).query(
      `SELECT order_id, delivery_address, delivery_contact_phone, delivery_instructions, assigned_driver_id,
              estimated_time, actual_delivered_at, delivery_fee
       FROM delivery_orders WHERE order_id IN (?)`,
      [orderIds]
    );
    return rows;
  },

  async findMenuItems(ids, conn) {
    if (!ids.length) return [];
    const [rows] = await exec(conn).query(
      `SELECT i.id, i.name, i.price, i.is_available, c.is_active AS category_active
       FROM menu_items i JOIN menu_categories c ON c.id = i.category_id
       WHERE i.id IN (?) AND i.restaurant_id = ?`,
      [ids, restaurantId]
    );
    return rows;
  },

  async findModifiers(ids, conn) {
    if (!ids.length) return [];
    const [rows] = await exec(conn).query(
      'SELECT id, menu_item_id, name, price_modifier, is_available FROM menu_item_modifiers WHERE id IN (?)',
      [ids]
    );
    return rows;
  },

  async insertOrder(data, conn) {
    const [result] = await exec(conn).query(
      `INSERT INTO orders
        (restaurant_id, order_number, customer_id, waiter_id, discount_id, order_type, status,
         subtotal, tax_amount, discount_amount, total_amount, notes)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?)`,
      [
        restaurantId,
        data.orderNumber,
        data.customerId || null,
        data.waiterId || null,
        data.discountId || null,
        data.orderType,
        data.subtotal,
        data.taxAmount,
        data.discountAmount,
        data.total,
        data.notes || null,
      ]
    );
    return result.insertId;
  },

  async setOrderNumber(id, orderNumber, conn) {
    await exec(conn).query('UPDATE orders SET order_number = ? WHERE id = ?', [orderNumber, id]);
  },

  async insertItem({ orderId, menuItemId, quantity, unitPrice, specialInstructions }, conn) {
    const [result] = await exec(conn).query(
      'INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, special_instructions) VALUES (?, ?, ?, ?, ?)',
      [orderId, menuItemId, quantity, unitPrice, specialInstructions || null]
    );
    return result.insertId;
  },

  async insertModifier({ orderItemId, modifierId, quantity, unitPrice }, conn) {
    await exec(conn).query(
      'INSERT INTO order_item_modifiers (order_item_id, modifier_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
      [orderItemId, modifierId, quantity, unitPrice]
    );
  },

  async insertOrderTable(orderId, tableId, conn) {
    await exec(conn).query('INSERT INTO order_tables (order_id, table_id) VALUES (?, ?)', [orderId, tableId]);
  },

  async insertKitchenQueue(orderId, conn) {
    await exec(conn).query('INSERT INTO kitchen_queue (order_id, priority) VALUES (?, 0)', [orderId]);
  },

  async insertDelivery({ orderId, address, phone, instructions, fee }, conn) {
    await exec(conn).query(
      `INSERT INTO delivery_orders (order_id, delivery_address, delivery_contact_phone, delivery_instructions, delivery_fee)
       VALUES (?, ?, ?, ?, ?)`,
      [orderId, address, phone, instructions || null, fee]
    );
  },

  async findItem(orderId, itemId, conn) {
    const [rows] = await exec(conn).query(
      'SELECT id, order_id, menu_item_id, quantity, unit_price, subtotal, item_status, preparation_progress FROM order_items WHERE id = ? AND order_id = ?',
      [itemId, orderId]
    );
    return rows[0] || null;
  },

  async countItems(orderId, conn) {
    const [[row]] = await exec(conn).query('SELECT COUNT(*) AS total FROM order_items WHERE order_id = ?', [orderId]);
    return Number(row.total);
  },

  async deleteItem(itemId, conn) {
    await exec(conn).query('DELETE FROM order_items WHERE id = ?', [itemId]);
  },

  async setItemStatus(itemId, status, progress, conn) {
    await exec(conn).query('UPDATE order_items SET item_status = ?, preparation_progress = ? WHERE id = ?', [status, progress, itemId]);
  },

  async setItemProgress(itemId, progress, conn) {
    await exec(conn).query('UPDATE order_items SET preparation_progress = ? WHERE id = ?', [progress, itemId]);
  },

  async setItemsStatusFrom(orderId, fromStatuses, status, progress, conn) {
    await exec(conn).query(
      'UPDATE order_items SET item_status = ?, preparation_progress = ? WHERE order_id = ? AND item_status IN (?)',
      [status, progress, orderId, fromStatuses]
    );
  },

  async itemStatusCounts(orderId, conn) {
    const [rows] = await exec(conn).query(
      'SELECT item_status, COUNT(*) AS total FROM order_items WHERE order_id = ? GROUP BY item_status',
      [orderId]
    );
    const counts = { pending: 0, preparing: 0, ready: 0 };
    rows.forEach((row) => {
      counts[row.item_status] = Number(row.total);
    });
    return counts;
  },

  async sums(orderId, conn) {
    const [[items]] = await exec(conn).query(
      'SELECT COALESCE(SUM(subtotal), 0) AS total FROM order_items WHERE order_id = ?',
      [orderId]
    );
    const [[modifiers]] = await exec(conn).query(
      `SELECT COALESCE(SUM(oim.subtotal), 0) AS total
       FROM order_item_modifiers oim JOIN order_items oi ON oi.id = oim.order_item_id
       WHERE oi.order_id = ?`,
      [orderId]
    );
    return Number(items.total) + Number(modifiers.total);
  },

  async deliveryFee(orderId, conn) {
    const [rows] = await exec(conn).query('SELECT delivery_fee FROM delivery_orders WHERE order_id = ?', [orderId]);
    return rows[0] ? Number(rows[0].delivery_fee) : 0;
  },

  async updateTotals(orderId, { subtotal, taxAmount, discountAmount, total }, conn) {
    await exec(conn).query(
      'UPDATE orders SET subtotal = ?, tax_amount = ?, discount_amount = ?, total_amount = ? WHERE id = ?',
      [subtotal, taxAmount, discountAmount, total, orderId]
    );
  },

  async setStatus(orderId, status, conn) {
    await exec(conn).query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
  },

  async setWaiter(orderId, waiterId, conn) {
    await exec(conn).query('UPDATE orders SET waiter_id = ? WHERE id = ?', [waiterId, orderId]);
  },

  async setNotes(orderId, notes, conn) {
    await exec(conn).query('UPDATE orders SET notes = ? WHERE id = ?', [notes, orderId]);
  },

  async startCooking(orderId, conn) {
    await exec(conn).query(
      'UPDATE kitchen_queue SET cooking_started_at = COALESCE(cooking_started_at, NOW()), cooking_finished_at = NULL, notified_waiter = FALSE WHERE order_id = ?',
      [orderId]
    );
  },

  async finishCooking(orderId, conn) {
    await exec(conn).query(
      'UPDATE kitchen_queue SET cooking_finished_at = NOW(), notified_waiter = TRUE WHERE order_id = ?',
      [orderId]
    );
  },

  async setPriority(orderId, priority, conn) {
    await exec(conn).query('UPDATE kitchen_queue SET priority = ? WHERE order_id = ?', [priority, orderId]);
  },

  async bumpCustomerStats(customerId, total, conn) {
    await exec(conn).query(
      'UPDATE customers SET total_orders = total_orders + 1, total_spent = total_spent + ? WHERE id = ?',
      [total, customerId]
    );
  },

  async findFeedback(orderId, customerId, conn) {
    const [rows] = await exec(conn).query('SELECT id FROM feedback WHERE order_id = ? AND customer_id = ? LIMIT 1', [orderId, customerId]);
    return rows[0] || null;
  },

  async insertFeedback({ customerId, orderId, rating, comment }, conn) {
    const [result] = await exec(conn).query(
      'INSERT INTO feedback (customer_id, order_id, rating, comment) VALUES (?, ?, ?, ?)',
      [customerId, orderId, rating, comment || null]
    );
    return result.insertId;
  },

  async listFeedback({ limit, offset }, conn) {
    const [rows] = await exec(conn).query(
      `SELECT f.id, f.customer_id, CONCAT(c.first_name, ' ', c.last_name) AS customer_name, f.order_id,
              o.order_number, f.rating, f.comment, f.created_at
       FROM feedback f
       JOIN customers c ON c.id = f.customer_id
       LEFT JOIN orders o ON o.id = f.order_id
       ORDER BY f.created_at DESC, f.id DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows;
  },

  async feedbackSummary(conn) {
    const [[row]] = await exec(conn).query('SELECT COUNT(*) AS total, COALESCE(AVG(rating), 0) AS average FROM feedback');
    return { total: Number(row.total), average: Math.round(Number(row.average) * 10) / 10 };
  },
};

module.exports = OrderModel;