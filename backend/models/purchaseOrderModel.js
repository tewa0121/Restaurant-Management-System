const db = require('../config/database');
const { likeTerm } = require('../utils/sql');
const { restaurantId } = require('../config/auth');

const exec = (conn) => conn || db;

const SELECT_PO = `
  SELECT po.id, po.supplier_id, s.name AS supplier_name, po.po_number,
         DATE_FORMAT(po.order_date, '%Y-%m-%d') AS order_date,
         DATE_FORMAT(po.expected_delivery, '%Y-%m-%d') AS expected_delivery,
         po.status, po.total_amount, po.received_by, CONCAT(e.first_name, ' ', e.last_name) AS received_by_name,
         po.created_at,
         (SELECT COUNT(*) FROM purchase_order_items i WHERE i.purchase_order_id = po.id) AS item_count
  FROM purchase_orders po
  JOIN suppliers s ON s.id = po.supplier_id
  LEFT JOIN employees e ON e.id = po.received_by`;

const PurchaseOrderModel = {
  async list({ status, supplierId, from, to, search }, { limit, offset }, conn) {
    const where = ['s.restaurant_id = ?'];
    const params = [restaurantId];
    if (status) {
      where.push('po.status = ?');
      params.push(status);
    }
    if (supplierId) {
      where.push('po.supplier_id = ?');
      params.push(supplierId);
    }
    if (from) {
      where.push('po.order_date >= ?');
      params.push(from);
    }
    if (to) {
      where.push('po.order_date <= ?');
      params.push(to);
    }
    if (search) {
      const term = likeTerm(search);
      where.push('(po.po_number LIKE ? OR s.name LIKE ?)');
      params.push(term, term);
    }
    const clause = `WHERE ${where.join(' AND ')}`;

    const [rows] = await exec(conn).query(`${SELECT_PO} ${clause} ORDER BY po.created_at DESC, po.id DESC LIMIT ? OFFSET ?`, [
      ...params,
      limit,
      offset,
    ]);
    const [[count]] = await exec(conn).query(
      `SELECT COUNT(*) AS total FROM purchase_orders po JOIN suppliers s ON s.id = po.supplier_id ${clause}`,
      params
    );
    return { rows, total: Number(count.total) };
  },

  async findById(id, conn) {
    const [rows] = await exec(conn).query(`${SELECT_PO} WHERE po.id = ? AND s.restaurant_id = ?`, [id, restaurantId]);
    return rows[0] || null;
  },

  async lockById(id, conn) {
    const [rows] = await exec(conn).query('SELECT id, status, po_number FROM purchase_orders WHERE id = ? FOR UPDATE', [id]);
    return rows[0] || null;
  },

  async items(poId, conn) {
    const [rows] = await exec(conn).query(
      `SELECT i.id, i.purchase_order_id, i.ingredient_id, g.name AS ingredient_name, g.unit,
              i.quantity_ordered, i.quantity_received, i.unit_cost
       FROM purchase_order_items i JOIN ingredients g ON g.id = i.ingredient_id
       WHERE i.purchase_order_id = ? ORDER BY i.id`,
      [poId]
    );
    return rows;
  },

  async insert({ supplierId, poNumber, orderDate, expectedDelivery, status, total }, conn) {
    const [result] = await exec(conn).query(
      `INSERT INTO purchase_orders (supplier_id, po_number, order_date, expected_delivery, status, total_amount)
       VALUES (?, ?, COALESCE(?, CURDATE()), ?, ?, ?)`,
      [supplierId, poNumber, orderDate || null, expectedDelivery || null, status, total]
    );
    return result.insertId;
  },

  async setNumber(id, poNumber, conn) {
    await exec(conn).query('UPDATE purchase_orders SET po_number = ? WHERE id = ?', [poNumber, id]);
  },

  async insertItem({ poId, ingredientId, quantity, unitCost }, conn) {
    await exec(conn).query(
      'INSERT INTO purchase_order_items (purchase_order_id, ingredient_id, quantity_ordered, unit_cost) VALUES (?, ?, ?, ?)',
      [poId, ingredientId, quantity, unitCost]
    );
  },

  async deleteItems(poId, conn) {
    await exec(conn).query('DELETE FROM purchase_order_items WHERE purchase_order_id = ?', [poId]);
  },

  async updateHeader(id, { supplierId, orderDate, expectedDelivery, total }, conn) {
    await exec(conn).query(
      `UPDATE purchase_orders
       SET supplier_id = COALESCE(?, supplier_id), order_date = COALESCE(?, order_date),
           expected_delivery = ?, total_amount = ?
       WHERE id = ?`,
      [supplierId || null, orderDate || null, expectedDelivery || null, total, id]
    );
  },

  async setStatus(id, status, conn) {
    await exec(conn).query('UPDATE purchase_orders SET status = ? WHERE id = ?', [status, id]);
  },

  async markReceived(id, receivedBy, conn) {
    await exec(conn).query("UPDATE purchase_orders SET status = 'received', received_by = ? WHERE id = ?", [receivedBy || null, id]);
  },

  async addReceived(itemId, quantity, conn) {
    await exec(conn).query('UPDATE purchase_order_items SET quantity_received = quantity_received + ? WHERE id = ?', [quantity, itemId]);
  },

  async remove(id, conn) {
    await exec(conn).query('DELETE FROM purchase_orders WHERE id = ?', [id]);
  },
};

module.exports = PurchaseOrderModel;