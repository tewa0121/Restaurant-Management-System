const db = require('../config/database');
const { restaurantId } = require('../config/auth');

const exec = (conn) => conn || db;

const SELECT_REFUND = `
  SELECT r.id, r.payment_id, r.invoice_id, i.invoice_number, o.order_number, p.payment_method, p.amount AS payment_amount,
         r.amount, r.reason, r.status, r.requested_by, ru.full_name AS requested_by_name,
         r.approved_by, au.full_name AS approved_by_name, r.created_at, r.processed_at
  FROM refunds r
  JOIN payments p ON p.id = r.payment_id
  JOIN invoices i ON i.id = r.invoice_id
  JOIN orders o ON o.id = i.order_id
  JOIN users ru ON ru.id = r.requested_by
  LEFT JOIN users au ON au.id = r.approved_by`;

function buildFilters({ status, requestedBy, invoiceId, paymentId }) {
  const where = ['o.restaurant_id = ?'];
  const params = [restaurantId];

  if (status) {
    where.push('r.status = ?');
    params.push(status);
  }
  if (requestedBy) {
    where.push('r.requested_by = ?');
    params.push(requestedBy);
  }
  if (invoiceId) {
    where.push('r.invoice_id = ?');
    params.push(invoiceId);
  }
  if (paymentId) {
    where.push('r.payment_id = ?');
    params.push(paymentId);
  }

  return { clause: `WHERE ${where.join(' AND ')}`, params };
}

const RefundModel = {
  async list(filters, { limit, offset }, conn) {
    const { clause, params } = buildFilters(filters);
    const [rows] = await exec(conn).query(`${SELECT_REFUND} ${clause} ORDER BY r.created_at DESC, r.id DESC LIMIT ? OFFSET ?`, [
      ...params,
      limit,
      offset,
    ]);
    return rows;
  },

  async count(filters, conn) {
    const { clause, params } = buildFilters(filters);
    const [[row]] = await exec(conn).query(
      `SELECT COUNT(*) AS total
       FROM refunds r JOIN invoices i ON i.id = r.invoice_id JOIN orders o ON o.id = i.order_id ${clause}`,
      params
    );
    return Number(row.total);
  },

  async findById(id, conn) {
    const [rows] = await exec(conn).query(`${SELECT_REFUND} WHERE r.id = ? AND o.restaurant_id = ?`, [id, restaurantId]);
    return rows[0] || null;
  },

  async forInvoice(invoiceId, conn) {
    const [rows] = await exec(conn).query(`${SELECT_REFUND} WHERE r.invoice_id = ? ORDER BY r.id`, [invoiceId]);
    return rows;
  },

  async sumsForPayment(paymentId, conn) {
    const [[row]] = await exec(conn).query(
      `SELECT COALESCE(SUM(CASE WHEN status = 'approved' THEN amount END), 0) AS approved,
              COALESCE(SUM(CASE WHEN status = 'pending' THEN amount END), 0) AS pending
       FROM refunds WHERE payment_id = ?`,
      [paymentId]
    );
    return { approved: Number(row.approved), pending: Number(row.pending) };
  },

  async insert({ paymentId, invoiceId, amount, reason, requestedBy, status, approvedBy }, conn) {
    const [result] = await exec(conn).query(
      `INSERT INTO refunds (payment_id, invoice_id, amount, reason, status, requested_by, approved_by, processed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, CASE WHEN ? = 'pending' THEN NULL ELSE NOW() END)`,
      [paymentId, invoiceId, amount, reason, status, requestedBy, approvedBy || null, status]
    );
    return result.insertId;
  },

  async lockById(id, conn) {
    const [rows] = await exec(conn).query('SELECT id, status FROM refunds WHERE id = ? FOR UPDATE', [id]);
    return rows[0] || null;
  },

  async setStatus(id, status, approvedBy, conn) {
    await exec(conn).query('UPDATE refunds SET status = ?, approved_by = ?, processed_at = NOW() WHERE id = ?', [
      status,
      approvedBy || null,
      id,
    ]);
  },
};

module.exports = RefundModel;