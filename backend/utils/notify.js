const db = require('../config/database');

async function notifyUsers(userIds, { title, message, type = 'order' }) {
  const ids = [...new Set((userIds || []).filter(Boolean))];
  if (!ids.length) return;
  try {
    for (const userId of ids) {
      await db.query('INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)', [
        userId,
        String(title).slice(0, 100),
        message,
        type,
      ]);
    }
  } catch (err) {
    console.error('Notification failed:', err.message);
  }
}

async function notifyRoles(roleNames, { title, message, type = 'order' }) {
  if (!roleNames || !roleNames.length) return;
  try {
    await db.query(
      `INSERT INTO notifications (user_id, title, message, type)
       SELECT DISTINCT ur.user_id, ?, ?, ?
       FROM user_roles ur
       JOIN roles r ON r.id = ur.role_id
       JOIN users u ON u.id = ur.user_id
       WHERE r.name IN (?) AND u.is_active = TRUE`,
      [String(title).slice(0, 100), message, type, roleNames]
    );
  } catch (err) {
    console.error('Role notification failed:', err.message);
  }
}

module.exports = { notifyUsers, notifyRoles };