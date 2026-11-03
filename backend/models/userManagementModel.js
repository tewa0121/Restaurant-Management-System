const db = require('../config/database');
const { likeTerm } = require('../utils/sql');

const exec = (conn) => conn || db;

const SELECT_USER = `
  SELECT u.id, u.restaurant_id, u.username, u.email, u.full_name, u.phone, u.avatar_url, u.language,
         u.is_active, u.last_login, u.created_at,
         GROUP_CONCAT(r.name ORDER BY r.id SEPARATOR ',') AS role_names
  FROM users u
  LEFT JOIN user_roles ur ON ur.user_id = u.id
  LEFT JOIN roles r ON r.id = ur.role_id`;

function buildFilters({ search, role, status }) {
  const where = [];
  const params = [];

  if (search) {
    const term = likeTerm(search);
    where.push('(u.full_name LIKE ? OR u.email LIKE ? OR u.username LIKE ? OR u.phone LIKE ?)');
    params.push(term, term, term, term);
  }
  if (role) {
    where.push(
      'EXISTS (SELECT 1 FROM user_roles x JOIN roles y ON y.id = x.role_id WHERE x.user_id = u.id AND y.name = ?)'
    );
    params.push(role);
  }
  if (status === 'active') where.push('u.is_active = TRUE');
  if (status === 'inactive') where.push('u.is_active = FALSE');

  return { clause: where.length ? `WHERE ${where.join(' AND ')}` : '', params };
}

const UserManagementModel = {
  async list(filters, { limit, offset }, conn) {
    const { clause, params } = buildFilters(filters);
    const [rows] = await exec(conn).query(
      `${SELECT_USER} ${clause} GROUP BY u.id ORDER BY u.created_at DESC, u.id DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    return rows;
  },

  async count(filters, conn) {
    const { clause, params } = buildFilters(filters);
    const [[row]] = await exec(conn).query(`SELECT COUNT(*) AS total FROM users u ${clause}`, params);
    return Number(row.total);
  },

  async findById(id, conn) {
    const [rows] = await exec(conn).query(`${SELECT_USER} WHERE u.id = ? GROUP BY u.id`, [id]);
    return rows[0] || null;
  },

  async emailTakenByOther(email, userId, conn) {
    const [rows] = await exec(conn).query('SELECT id FROM users WHERE email = ? AND id <> ? LIMIT 1', [email, userId]);
    return rows.length > 0;
  },

  async findExistingRoleNames(names, conn) {
    if (!names.length) return [];
    const [rows] = await exec(conn).query('SELECT name FROM roles WHERE name IN (?)', [names]);
    return rows.map((row) => row.name);
  },

  async replaceRoles(userId, names, assignedBy, conn) {
    await exec(conn).query('DELETE FROM user_roles WHERE user_id = ?', [userId]);
    for (const name of names) {
      await exec(conn).query(
        'INSERT INTO user_roles (user_id, role_id, assigned_by) SELECT ?, id, ? FROM roles WHERE name = ?',
        [userId, assignedBy || null, name]
      );
    }
  },

  async countOtherActiveAdmins(excludeUserId, conn) {
    const [[row]] = await exec(conn).query(
      `SELECT COUNT(DISTINCT u.id) AS total
       FROM users u
       JOIN user_roles ur ON ur.user_id = u.id
       JOIN roles r ON r.id = ur.role_id
       WHERE r.name = 'Admin' AND u.is_active = TRUE AND u.id <> ?`,
      [excludeUserId]
    );
    return Number(row.total);
  },

  async remove(id, conn) {
    await exec(conn).query('DELETE FROM users WHERE id = ?', [id]);
  },
};

module.exports = UserManagementModel;