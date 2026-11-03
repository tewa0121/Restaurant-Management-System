const db = require('../config/database');

const toJson = (value) => (value === undefined || value === null ? null : JSON.stringify(value));

async function logActivity({ userId = null, action, activityType = null, entityType = null, entityId = null, oldValue, newValue, ip = null }) {
  try {
    await db.query(
      `INSERT INTO system_logs (user_id, action, activity_type, entity_type, entity_id, old_value, new_value, ip_address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, String(action).slice(0, 255), activityType, entityType, entityId, toJson(oldValue), toJson(newValue), ip]
    );
  } catch (err) {
    console.error('Activity log failed:', err.message);
  }
}

module.exports = { logActivity };