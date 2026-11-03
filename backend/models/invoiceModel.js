const db = require('../config/database');
const { likeTerm } = require('../utils/sql');
const { restaurantId } = require('../config/auth');

const exec = (conn) => conn || db;

const SELECT_INVOICE = `
  SELECT i.id, i.order_id, i.invoice_number, i.subtotal, i.tax, i.discount, i.total, i.paid_amount, i.balance,
         i.status, i.generated_by, i.generated_at,
         o.order_number, o.order_type, o.status AS order_status, o.customer_id, o.waiter_id,
         CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
         CONCAT(g.first_name, ' ', g.last_name) AS generated_by_name,
         (SELECT GROUP_CONCAT(t.table_number ORDER BY t.id SEPARATOR ', ')
            FROM order_tables ot JOIN \`tables\` t ON t.id = ot.table_id
            WHERE ot.order_id = o.id) AS table_numbers
  FROM invoices i
  JOIN orders o ON o.id = i.order_id
  LEFT JOIN customers c ON c.id = o.customer_id
  LEFT JOIN employees g ON g.id = i.generated_by`;

const SELECT_PAYMENT = `
  SELECT p.id, p.invoice_id, i.invoice_number, o.order_number, p.amount, p.payment_method, p.transaction_id,
         p.payment_status, p.received_by, CONCAT(e.first_name, ' ', e.last_name) AS received_by_name, p.paid_at,
         (SELECT COALESCE(SUM(r.amount), 0) FROM refunds r WHERE r.payment_id = p.id AND r.status = 'approved') AS refunded_amount
  FROM payments p
  JOIN invoices i ON i.id = p.invoice_id
  JOIN orders o ON o.id = i.order_id
  LEFT JOIN employees e ON e.id = p.received_by`;

function buildInvoiceFilters({ status, orderId, customerId, date, from, to, search }) {
  const where = ['o.restaurant_id = ?'];
  const params = [restaurantId];

  if (status) {
    where.push('i.status = ?');
    params.push(status);
  }
  if (orderId) {
    where.push('i.order_id = ?');
    params.push(orderId);
  }
  if (customerId) {
    where.push('o.customer_id = ?');
    params.push(customerId);
  }
  if (date) {
    where.push('DATE(i.generated_at) = ?');
    params.push(date);
  }
  if (from) {
    where.push('DATE(i.generated_at) >= ?');
    params.push(from);
  }
  if (to) {
    where.push('DATE(i.generated_at) <= ?');
    params.push(to);
  }
  if (search) {
    const term = likeTerm(search);
    where.push("(i.invoice_number LIKE ? OR o.order_number LIKE ? OR CONCAT(c.first_name, ' ', c.last_name) LIKE ?)");
    params.push(term, term, term);
  }

  return { clause: `WHERE ${where.join(' AND ')}`, params };
}

function buildPaymentFilters({ invoiceId, method, status, receivedBy, date, from, to, search }) {
  const where = ['o.restaurant_id = ?'];
  const params = [restaurantId];

  if (invoiceId) {
    where.push('p.invoice_id = ?');
    params.push(invoiceId);
  }
  if (method) {
    where.push('p.payment_method = ?');
    params.push(method);
  }
  if (status) {
    where.push('p.payment_status = ?');
    params.push(status);
  }
  if (receivedBy) {
    where.push('p.received_by = ?');
    params.push(receivedBy);
  }
  if (date) {
    where.push('DATE(p.paid_at) = ?');
    params.push(date);
  }
  if (from) {
    where.push('DATE(p.paid_at) >= ?');
    params.push(from);
  }
  if (to) {
    where.push('DATE(p.paid_at) <= ?');
    params.push(to);
  }
  if (search) {
    const term = likeTerm(search);
    where.push('(i.invoice_number LIKE ? OR o.order_number LIKE ? OR p.transaction_id LIKE ?)');
    params.push(term, term, term);
  }

  return { clause: `WHERE ${where.join(' AND ')}`, params };
}

const InvoiceModel = {
  async list(filters, { limit, offset }, conn) {
    const { clause, params } = buildInvoiceFilters(filters);
    const [rows] = await exec(conn).query(
      `${SELECT_INVOICE} ${clause} ORDER BY i.generated_at DESC, i.id DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    return rows;
  },

  async count(filters, conn) {
    const { clause, params } = buildInvoiceFilters(filters);
    const [[row]] = await exec(conn).query(
      `SELECT COUNT(*) AS total
       FROM invoices i
       JOIN orders o ON o.id = i.order_id
       LEFT JOIN customers c ON c.id = o.customer_id ${clause}`,
      params
    );
    return Number(row.total);
  },

  async findById(id, conn) {
    const [rows] = await exec(conn).query(`${SELECT_INVOICE} WHERE i.id = ? AND o.restaurant_id = ?`, [id, restaurantId]);
    return rows[0] || null;
  },

  async findLatestByOrder(orderId, conn) {
    const [rows] = await exec(conn).query(
      `${SELECT_INVOICE} WHERE i.order_id = ? AND o.restaurant_id = ? ORDER BY i.id DESC LIMIT 1`,
      [orderId, restaurantId]
    );
    return rows[0] || null;
  },

  async lockById(id, conn) {
    const [rows] = await exec(conn).query('SELECT id FROM invoices WHERE id = ? FOR UPDATE', [id]);
    return rows[0] || null;
  },

  async insert({ orderId, invoiceNumber, subtotal, tax, discount, total, generatedBy }, conn) {
    const [result] = await exec(conn).query(
      `INSERT INTO invoices (order_id, invoice_number, subtotal, tax, discount, total, generated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [orderId, invoiceNumber, subtotal, tax, discount, total, generatedBy || null]
    );
    return result.insertId;
  },

  async setNumber(id, invoiceNumber, conn) {
    await exec(conn).query('UPDATE invoices SET invoice_number = ? WHERE id = ?', [invoiceNumber, id]);
  },

  async updateAmounts(id, { subtotal, tax, discount, total }, conn) {
    await exec(conn).query('UPDATE invoices SET subtotal = ?, tax = ?, discount = ?, total = ? WHERE id = ?', [
      subtotal,
      tax,
      discount,
      total,
      id,
    ]);
  },

  async updateTotal(id, total, conn) {
    await exec(conn).query('UPDATE invoices SET total = ? WHERE id = ?', [total, id]);
  },

  async updatePaymentState(id, { paidAmount, status }, conn) {
    await exec(conn).query('UPDATE invoices SET paid_amount = ?, status = ? WHERE id = ?', [paidAmount, status, id]);
  },

  async setStatus(id, status, conn) {
    await exec(conn).query('UPDATE invoices SET status = ? WHERE id = ?', [status, id]);
  },

  async remove(id, conn) {
    await exec(conn).query('DELETE FROM invoices WHERE id = ?', [id]);
  },

  async countPayments(invoiceId, conn) {
    const [[row]] = await exec(conn).query('SELECT COUNT(*) AS total FROM payments WHERE invoice_id = ?', [invoiceId]);
    return Number(row.total);
  },

  async paymentsForInvoice(invoiceId, conn) {
    const [rows] = await exec(conn).query(`${SELECT_PAYMENT} WHERE p.invoice_id = ? ORDER BY p.id`, [invoiceId]);
    return rows;
  },

  async findPayment(id, conn) {
    const [rows] = await exec(conn).query(`${SELECT_PAYMENT} WHERE p.id = ? AND o.restaurant_id = ?`, [id, restaurantId]);
    return rows[0] || null;
  },

  async listPayments(filters, { limit, offset }, conn) {
    const { clause, params } = buildPaymentFilters(filters);
    const [rows] = await exec(conn).query(`${SELECT_PAYMENT} ${clause} ORDER BY p.paid_at DESC, p.id DESC LIMIT ? OFFSET ?`, [
      ...params,
      limit,
      offset,
    ]);
    return rows;
  },

  async paymentSummary(filters, conn) {
    const { clause, params } = buildPaymentFilters(filters);
    const [[row]] = await exec(conn).query(
      `SELECT COUNT(*) AS count, COALESCE(SUM(p.amount), 0) AS total
       FROM payments p
       JOIN invoices i ON i.id = p.invoice_id
       JOIN orders o ON o.id = i.order_id ${clause}`,
      params
    );
    return { count: Number(row.count), total: Number(row.total) };
  },

  async insertPayment({ invoiceId, amount, method, transactionId, receivedBy }, conn) {
    const [result] = await exec(conn).query(
      `INSERT INTO payments (invoice_id, amount, payment_method, transaction_id, payment_status, received_by)
       VALUES (?, ?, ?, ?, 'completed', ?)`,
      [invoiceId, amount, method, transactionId || null, receivedBy || null]
    );
    return result.insertId;
  },

  async setPaymentStatus(id, status, conn) {
    await exec(conn).query('UPDATE payments SET payment_status = ? WHERE id = ?', [status, id]);
  },

  async transactionExists(method, transactionId, conn) {
    const [rows] = await exec(conn).query(
      'SELECT id FROM payments WHERE payment_method = ? AND transaction_id = ? LIMIT 1',
      [method, transactionId]
    );
    return rows.length > 0;
  },

  async tableHasOtherOpenOrders(tableId, exceptOrderId, conn) {
    const [rows] = await exec(conn).query(
      `SELECT o.id FROM order_tables ot JOIN orders o ON o.id = ot.order_id
       WHERE ot.table_id = ? AND o.id <> ? AND o.status IN ('pending', 'preparing', 'ready', 'served') LIMIT 1`,
      [tableId, exceptOrderId]
    );
    return rows.length > 0;
  },
};

module.exports = InvoiceModel;