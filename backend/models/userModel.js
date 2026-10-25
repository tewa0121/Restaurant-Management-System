const db = require('../config/database');

const User = {
  // Find a user by email (only active accounts)
  findByEmail: async (email) => {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND is_active = TRUE', [email]);
    return rows[0];
  },

  // Find a user by ID
  findById: async (id) => {
    const [rows] = await db.query('SELECT id, full_name, email, is_active FROM users WHERE id = ? AND is_active = TRUE', [id]);
    return rows[0];
  },

  // Fetch roles assigned to a user via user_roles and roles tables
  getRoles: async (userId) => {
    const [rows] = await db.query(
      'SELECT r.name FROM user_roles ur JOIN roles r ON r.id = ur.role_id WHERE ur.user_id = ?',
      [userId]
    );
    return rows.map((r) => r.name);
  },

  // Update last login timestamp
  updateLastLogin: async (userId) => {
    await db.query('UPDATE users SET last_login = NOW() WHERE id = ?', [userId]);
  },

  // Create a new active session record
  createSession: async (userId, sessionId, ip, userAgent, expiresAt) => {
    await db.query(
      'INSERT INTO user_sessions (user_id, token_id, ip_address, user_agent, expires_at) VALUES (?, ?, ?, ?, ?)',
      [userId, sessionId, ip, userAgent, expiresAt]
    );
  },

  // Revoke a session on logout
  revokeSession: async (sessionId) => {
    await db.query('UPDATE user_sessions SET revoked_at = NOW() WHERE token_id = ?', [sessionId]);
  }
};

module.exports = User;