const db = require('../config/database');

exports.findUserByEmail = async (email) => {
  const [rows] = await db.query(
    `SELECT u.id, u.restaurant_id, u.username, u.email, u.password_hash, u.full_name, u.avatar_url, u.is_active, r.name as role 
     FROM users u 
     LEFT JOIN user_roles ur ON u.id = ur.user_id 
     LEFT JOIN roles r ON ur.role_id = r.id 
     WHERE u.email = ?`,
    [email]
  );
  return rows[0] || null;
};

exports.findUserById = async (id) => {
  const [rows] = await db.query(
    `SELECT u.id, u.restaurant_id, u.username, u.email, u.full_name, u.avatar_url, u.language, r.name as role 
     FROM users u 
     LEFT JOIN user_roles ur ON u.id = ur.user_id 
     LEFT JOIN roles r ON ur.role_id = r.id 
     WHERE u.id = ?`,
    [id]
  );
  return rows[0] || null;
};

exports.updateLastLogin = async (id) => {
  await db.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [id]);
};