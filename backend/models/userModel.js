const db = require('../config/database');

const exec = (conn) => conn || db;

const UserModel = {
  async findByLogin(identifier, conn) {
    const [rows] = await exec(conn).query('SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1', [identifier, identifier]);
    return rows[0] || null;
  },

  async findById(id, conn) {
    const [rows] = await exec(conn).query('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  },

  async emailExists(email, conn) {
    const [rows] = await exec(conn).query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
    return rows.length > 0;
  },

  async usernameExists(username, conn) {
    const [rows] = await exec(conn).query('SELECT id FROM users WHERE username = ? LIMIT 1', [username]);
    return rows.length > 0;
  },

  async getRoleNames(userId, conn) {
    const [rows] = await exec(conn).query(
      'SELECT r.name FROM user_roles ur JOIN roles r ON r.id = ur.role_id WHERE ur.user_id = ? ORDER BY r.id',
      [userId]
    );
    return rows.map((row) => row.name);
  },

  async getEmployeeByUserId(userId, conn) {
    const [rows] = await exec(conn).query(
      'SELECT id, employee_code, position, department FROM employees WHERE user_id = ? LIMIT 1',
      [userId]
    );
    return rows[0] || null;
  },

  async getCustomerByUserId(userId, conn) {
    const [rows] = await exec(conn).query(
      'SELECT id, first_name, last_name, phone, loyalty_points, is_vip FROM customers WHERE user_id = ? LIMIT 1',
      [userId]
    );
    return rows[0] || null;
  },

  async createUser({ restaurantId, username, email, passwordHash, fullName, phone, language = 'en' }, conn) {
    const [result] = await exec(conn).query(
      `INSERT INTO users (restaurant_id, username, email, password_hash, full_name, phone, language, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)`,
      [restaurantId, username, email, passwordHash, fullName, phone || null, language]
    );
    return result.insertId;
  },

  async assignRole(userId, roleName, assignedBy, conn) {
    const [result] = await exec(conn).query(
      'INSERT IGNORE INTO user_roles (user_id, role_id, assigned_by) SELECT ?, id, ? FROM roles WHERE name = ?',
      [userId, assignedBy || null, roleName]
    );
    return result.affectedRows > 0;
  },

  async createCustomer({ userId, firstName, lastName, email, phone }, conn) {
    const [result] = await exec(conn).query(
      'INSERT INTO customers (user_id, first_name, last_name, email, phone) VALUES (?, ?, ?, ?, ?)',
      [userId, firstName, lastName, email, phone || '']
    );
    return result.insertId;
  },

  async updateProfile(userId, fields, conn) {
    const columns = [];
    const values = [];
    Object.keys(fields).forEach((column) => {
      columns.push(`${column} = ?`);
      values.push(fields[column]);
    });
    if (!columns.length) return false;
    values.push(userId);
    const [result] = await exec(conn).query(`UPDATE users SET ${columns.join(', ')} WHERE id = ?`, values);
    return result.affectedRows > 0;
  },

  async updateCustomerProfile(userId, { firstName, lastName, phone }, conn) {
    await exec(conn).query(
      `UPDATE customers
       SET first_name = COALESCE(?, first_name), last_name = COALESCE(?, last_name), phone = COALESCE(?, phone)
       WHERE user_id = ?`,
      [firstName ?? null, lastName ?? null, phone ?? null, userId]
    );
  },

  async updatePassword(userId, passwordHash, conn) {
    await exec(conn).query('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, userId]);
  },

  async updateLastLogin(userId, conn) {
    await exec(conn).query('UPDATE users SET last_login = NOW() WHERE id = ?', [userId]);
  },

  async createSession({ userId, tokenId, ip, userAgent, ttlSeconds }, conn) {
    await exec(conn).query(
      `INSERT INTO user_sessions (user_id, token_id, ip_address, user_agent, expires_at)
       VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL ? SECOND))`,
      [userId, tokenId, ip, userAgent, ttlSeconds]
    );
  },

  async isSessionActive(tokenId, conn) {
    if (!tokenId) return false;
    const [rows] = await exec(conn).query(
      `SELECT s.id
       FROM user_sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token_id = ? AND s.revoked_at IS NULL AND s.expires_at > NOW() AND u.is_active = TRUE
       LIMIT 1`,
      [tokenId]
    );
    return rows.length > 0;
  },

  async revokeSession(tokenId, conn) {
    await exec(conn).query('UPDATE user_sessions SET revoked_at = NOW() WHERE token_id = ? AND revoked_at IS NULL', [tokenId]);
  },

  async revokeOtherSessions(userId, keepTokenId, conn) {
    await exec(conn).query(
      'UPDATE user_sessions SET revoked_at = NOW() WHERE user_id = ? AND revoked_at IS NULL AND token_id <> ?',
      [userId, keepTokenId || '']
    );
  },

  async revokeAllSessions(userId, conn) {
    await exec(conn).query('UPDATE user_sessions SET revoked_at = NOW() WHERE user_id = ? AND revoked_at IS NULL', [userId]);
  },

  async createResetToken({ userId, tokenHash, ttlMinutes }, conn) {
    await exec(conn).query(
      'INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? MINUTE))',
      [userId, tokenHash, ttlMinutes]
    );
  },

  async findValidResetToken(tokenHash, conn) {
    const [rows] = await exec(conn).query(
      'SELECT id, user_id FROM password_reset_tokens WHERE token_hash = ? AND used_at IS NULL AND expires_at > NOW() LIMIT 1',
      [tokenHash]
    );
    return rows[0] || null;
  },

  async markResetTokenUsed(id, conn) {
    await exec(conn).query('UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ?', [id]);
  },
};

module.exports = UserModel;