const db = require('../config/database');

const RoleModel = {
  async list() {
    const [rows] = await db.query(
      `SELECT r.id, r.name, r.description, COUNT(ur.user_id) AS user_count
       FROM roles r
       LEFT JOIN user_roles ur ON ur.role_id = r.id
       GROUP BY r.id, r.name, r.description
       ORDER BY r.id`
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query(
      `SELECT r.id, r.name, r.description, COUNT(ur.user_id) AS user_count
       FROM roles r
       LEFT JOIN user_roles ur ON ur.role_id = r.id
       WHERE r.id = ?
       GROUP BY r.id, r.name, r.description`,
      [id]
    );
    return rows[0] || null;
  },

  async updateDescription(id, description) {
    await db.query('UPDATE roles SET description = ? WHERE id = ?', [description, id]);
  },
};

module.exports = RoleModel;