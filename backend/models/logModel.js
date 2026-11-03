const db = require('../config/database');
const { likeTerm } = require('../utils/sql');

const exec = (conn) => conn || db;

const SELECT_LOG = `
  SELECT l.id, l.user_id, u.full_name AS user_name, l.action, l.activity_type, l.entity_type, l.entity_id,
         l.old_value, l.new_value, l.ip_address, l.created_at
  FROM system_logs l
  LEFT JOIN users u ON u.id = l.user_id`;

function buildFilters({ search, userId, activityType, entityType, from, to }) {
  const where = [];
  const params = [];

  if (search) {
    const term = likeTerm(search);
    where.push('(l.action LIKE ? OR u.full_name LIKE ?)');
    params.push(term, term);
  }
  if (userId) {
    where.push('l.user_id = ?');
    params.push(userId);
  }
  if (activityType) {
    where.push('l.activity_type = ?');
    params.push(activityType);
  }
  if (entityType) {
    where.push('l.entity_type = ?');
    params.push(entityType);
  }
  if (from) {
    where.push('DATE(l.created_at) >= ?');
    params.push(from);
  }
  if (to) {
    where.push('DATE(l.created_at) <= ?');
    params.push(to);
  }

  return { clause: where.length ? `WHERE ${where.join(' AND ')}` : '', params };
}

const LogModel = {
  async list(filters, { limit, offset }, conn) {
    const { clause, params } = buildFilters(filters);
    const [rows] = await exec(conn).query(`${SELECT_LOG} ${clause} ORDER BY l.created_at DESC, l.id DESC LIMIT ? OFFSET ?`, [
      ...params,
      limit,
      offset,
    ]);
    const [[count]] = await exec(conn).query(
      `SELECT COUNT(*) AS total FROM system_logs l LEFT JOIN users u ON u.id = l.user_id ${clause}`,
      params
    );
    return { rows, total: Number(count.total) };
  },

  async findById(id, conn) {
    const [rows] = await exec(conn).query(`${SELECT_LOG} WHERE l.id = ?`, [id]);
    return rows[0] || null;
  },

  async activityTypes(conn) {
    const [rows] = await exec(conn).query(
      'SELECT DISTINCT activity_type FROM system_logs WHERE activity_type IS NOT NULL ORDER BY activity_type'
    );
    return rows.map((row) => row.activity_type);
  },
};

module.exports = LogModel;