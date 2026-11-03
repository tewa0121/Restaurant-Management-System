const db = require('../config/database');

const exec = (conn) => conn || db;

function buildFilters({ userId, unread, type }) {
  const where = ['user_id = ?'];
  const params = [userId];
  if (unread) where.push('is_read = FALSE');
  if (type) {
    where.push('type = ?');
    params.push(type);
  }
  return { clause: `WHERE ${where.join(' AND ')}`, params };
}

const NotificationModel = {
  async list(filters, { limit, offset }, conn) {
    const { clause, params } = buildFilters(filters);
    const [rows] = await exec(conn).query(
      `SELECT id, user_id, title, message, type, is_read, created_at
       FROM notifications ${clause} ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    return rows;
  },

  async count(filters, conn) {
    const { clause, params } = buildFilters(filters);
    const [[row]] = await exec(conn).query(`SELECT COUNT(*) AS total FROM notifications ${clause}`, params);
    return Number(row.total);
  },

  async unreadCount(userId, conn) {
    const [[row]] = await exec(conn).query('SELECT COUNT(*) AS total FROM notifications WHERE user_id = ? AND is_read = FALSE', [userId]);
    return Number(row.total);
  },

  async find(id, userId, conn) {
    const [rows] = await exec(conn).query(
      'SELECT id, user_id, title, message, type, is_read, created_at FROM notifications WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows[0] || null;
  },

  async markRead(id, userId, conn) {
    await exec(conn).query('UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?', [id, userId]);
  },

  async markAllRead(userId, conn) {
    const [result] = await exec(conn).query('UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE', [userId]);
    return result.affectedRows;
  },

  async remove(id, userId, conn) {
    await exec(conn).query('DELETE FROM notifications WHERE id = ? AND user_id = ?', [id, userId]);
  },

  async clearRead(userId, conn) {
    const [result] = await exec(conn).query('DELETE FROM notifications WHERE user_id = ? AND is_read = TRUE', [userId]);
    return result.affectedRows;
  },

  async broadcastToRoles(roleNames, { title, message, type }, conn) {
    const [result] = await exec(conn).query(
      `INSERT INTO notifications (user_id, title, message, type)
       SELECT DISTINCT ur.user_id, ?, ?, ?
       FROM user_roles ur
       JOIN roles r ON r.id = ur.role_id
       JOIN users u ON u.id = ur.user_id
       WHERE r.name IN (?) AND u.is_active = TRUE`,
      [title, message, type, roleNames]
    );
    return result.affectedRows;
  },

  async broadcastToUsers(userIds, { title, message, type }, conn) {
    const [result] = await exec(conn).query(
      `INSERT INTO notifications (user_id, title, message, type)
       SELECT u.id, ?, ?, ? FROM users u WHERE u.id IN (?) AND u.is_active = TRUE`,
      [title, message, type, userIds]
    );
    return result.affectedRows;
  },
};

module.exports = NotificationModel;