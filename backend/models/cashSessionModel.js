const db = require('../config/database');

const exec = (conn) => conn || db;

const SELECT_SESSION = `
  SELECT s.id, s.cashier_id, CONCAT(e.first_name, ' ', e.last_name) AS cashier_name, s.opened_at, s.opening_amount,
         s.closed_at, s.counted_amount, s.expected_amount, s.notes
  FROM cash_sessions s
  JOIN employees e ON e.id = s.cashier_id`;

const CashSessionModel = {
  async findOpenByCashier(cashierId, conn) {
    const [rows] = await exec(conn).query(
      `${SELECT_SESSION} WHERE s.cashier_id = ? AND s.closed_at IS NULL ORDER BY s.id DESC LIMIT 1`,
      [cashierId]
    );
    return rows[0] || null;
  },

  async findById(id, conn) {
    const [rows] = await exec(conn).query(`${SELECT_SESSION} WHERE s.id = ?`, [id]);
    return rows[0] || null;
  },

  async list({ cashierId, open }, { limit, offset }, conn) {
    const where = [];
    const params = [];
    if (cashierId) {
      where.push('s.cashier_id = ?');
      params.push(cashierId);
    }
    if (open === true) where.push('s.closed_at IS NULL');
    if (open === false) where.push('s.closed_at IS NOT NULL');
    const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const [rows] = await exec(conn).query(`${SELECT_SESSION} ${clause} ORDER BY s.opened_at DESC, s.id DESC LIMIT ? OFFSET ?`, [
      ...params,
      limit,
      offset,
    ]);
    return rows;
  },

  async count({ cashierId, open }, conn) {
    const where = [];
    const params = [];
    if (cashierId) {
      where.push('cashier_id = ?');
      params.push(cashierId);
    }
    if (open === true) where.push('closed_at IS NULL');
    if (open === false) where.push('closed_at IS NOT NULL');
    const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const [[row]] = await exec(conn).query(`SELECT COUNT(*) AS total FROM cash_sessions ${clause}`, params);
    return Number(row.total);
  },

  async insert({ cashierId, openingAmount, notes }, conn) {
    const [result] = await exec(conn).query(
      'INSERT INTO cash_sessions (cashier_id, opening_amount, notes) VALUES (?, ?, ?)',
      [cashierId, openingAmount, notes || null]
    );
    return result.insertId;
  },

  async close(id, { countedAmount, expectedAmount, notes }, conn) {
    await exec(conn).query(
      `UPDATE cash_sessions
       SET closed_at = NOW(), counted_amount = ?, expected_amount = ?, notes = COALESCE(?, notes)
       WHERE id = ?`,
      [countedAmount, expectedAmount, notes || null, id]
    );
  },

  async cashIn(sessionId, conn) {
    const [[row]] = await exec(conn).query(
      `SELECT COALESCE(SUM(p.amount), 0) AS total, COUNT(p.id) AS count
       FROM cash_sessions s
       JOIN payments p ON p.received_by = s.cashier_id AND p.payment_method = 'cash'
         AND p.paid_at >= s.opened_at AND p.paid_at <= COALESCE(s.closed_at, NOW())
       WHERE s.id = ?`,
      [sessionId]
    );
    return { total: Number(row.total), count: Number(row.count) };
  },

  async cashOut(sessionId, conn) {
    const [[row]] = await exec(conn).query(
      `SELECT COALESCE(SUM(r.amount), 0) AS total
       FROM cash_sessions s
       JOIN payments p ON p.received_by = s.cashier_id AND p.payment_method = 'cash'
       JOIN refunds r ON r.payment_id = p.id AND r.status = 'approved'
         AND r.processed_at >= s.opened_at AND r.processed_at <= COALESCE(s.closed_at, NOW())
       WHERE s.id = ?`,
      [sessionId]
    );
    return Number(row.total);
  },

  async byMethod(sessionId, conn) {
    const [rows] = await exec(conn).query(
      `SELECT p.payment_method, COALESCE(SUM(p.amount), 0) AS total, COUNT(p.id) AS count
       FROM cash_sessions s
       JOIN payments p ON p.received_by = s.cashier_id AND p.paid_at >= s.opened_at AND p.paid_at <= COALESCE(s.closed_at, NOW())
       WHERE s.id = ?
       GROUP BY p.payment_method
       ORDER BY p.payment_method`,
      [sessionId]
    );
    return rows;
  },
};

module.exports = CashSessionModel;