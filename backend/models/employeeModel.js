const db = require('../config/database');
const { likeTerm } = require('../utils/sql');
const { restaurantId } = require('../config/auth');

const exec = (conn) => conn || db;

const ON_SHIFT_SQL = `EXISTS (
  SELECT 1 FROM shifts s
  WHERE s.employee_id = e.id AND s.shift_date = CURDATE() AND CURTIME() BETWEEN s.start_time AND s.end_time
)`;

const SELECT_EMPLOYEE = `
  SELECT e.id, e.restaurant_id, e.user_id, e.employee_code, e.first_name, e.last_name, e.position, e.department,
         DATE_FORMAT(e.hire_date, '%Y-%m-%d') AS hire_date, e.salary, e.phone, e.email, e.address,
         e.emergency_contact, e.photo_url, e.is_active, e.created_at,
         (SELECT GROUP_CONCAT(r.name ORDER BY r.id SEPARATOR ',')
            FROM user_roles ur JOIN roles r ON r.id = ur.role_id
            WHERE ur.user_id = e.user_id) AS role_names,
         CASE WHEN ${ON_SHIFT_SQL} THEN 'active' ELSE 'off_duty' END AS shift_status
  FROM employees e`;

function buildFilters({ search, position, department, status, shiftStatus }) {
  const where = ['e.restaurant_id = ?'];
  const params = [restaurantId];

  if (search) {
    const term = likeTerm(search);
    where.push(
      "(CONCAT(e.first_name, ' ', e.last_name) LIKE ? OR e.email LIKE ? OR e.phone LIKE ? OR e.employee_code LIKE ?)"
    );
    params.push(term, term, term, term);
  }
  if (position) {
    where.push('e.position = ?');
    params.push(position);
  }
  if (department) {
    where.push('e.department = ?');
    params.push(department);
  }
  if (status === 'active') where.push('e.is_active = TRUE');
  if (status === 'inactive') where.push('e.is_active = FALSE');
  if (shiftStatus === 'active') where.push(ON_SHIFT_SQL);
  if (shiftStatus === 'off_duty') where.push(`NOT ${ON_SHIFT_SQL}`);

  return { clause: `WHERE ${where.join(' AND ')}`, params };
}

const EmployeeModel = {
  async list(filters, { limit, offset }, conn) {
    const { clause, params } = buildFilters(filters);
    const [rows] = await exec(conn).query(
      `${SELECT_EMPLOYEE} ${clause} ORDER BY e.created_at DESC, e.id DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    return rows;
  },

  async count(filters, conn) {
    const { clause, params } = buildFilters(filters);
    const [[row]] = await exec(conn).query(`SELECT COUNT(*) AS total FROM employees e ${clause}`, params);
    return Number(row.total);
  },

  async findById(id, conn) {
    const [rows] = await exec(conn).query(`${SELECT_EMPLOYEE} WHERE e.id = ? AND e.restaurant_id = ?`, [id, restaurantId]);
    return rows[0] || null;
  },

  async findByUserId(userId, conn) {
    const [rows] = await exec(conn).query(`${SELECT_EMPLOYEE} WHERE e.user_id = ? AND e.restaurant_id = ?`, [userId, restaurantId]);
    return rows[0] || null;
  },

  async nextCode(conn) {
    const [[row]] = await exec(conn).query(
      "SELECT COALESCE(MAX(CAST(SUBSTRING(employee_code, 5) AS UNSIGNED)), 0) + 1 AS next FROM employees WHERE employee_code LIKE 'EMP-%'"
    );
    return `EMP-${String(row.next).padStart(3, '0')}`;
  },

  async create(data, conn) {
    const [result] = await exec(conn).query(
      `INSERT INTO employees
        (restaurant_id, user_id, employee_code, first_name, last_name, position, department, hire_date, salary,
         phone, email, address, emergency_contact, photo_url, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, COALESCE(?, CURDATE()), ?, ?, ?, ?, ?, ?, ?)`,
      [
        restaurantId,
        data.userId || null,
        data.employeeCode,
        data.firstName,
        data.lastName,
        data.position,
        data.department || null,
        data.hireDate || null,
        data.salary === undefined ? null : data.salary,
        data.phone || null,
        data.email || null,
        data.address || null,
        data.emergencyContact || null,
        data.photoUrl || null,
        data.isActive === undefined ? true : data.isActive,
      ]
    );
    return result.insertId;
  },

  async remove(id, conn) {
    await exec(conn).query('DELETE FROM employees WHERE id = ?', [id]);
  },

  async listAttendance(employeeId, { from, to }, conn) {
    const where = ['employee_id = ?'];
    const params = [employeeId];
    if (from) {
      where.push('`date` >= ?');
      params.push(from);
    }
    if (to) {
      where.push('`date` <= ?');
      params.push(to);
    }
    const [rows] = await exec(conn).query(
      `SELECT id, employee_id, DATE_FORMAT(\`date\`, '%Y-%m-%d') AS date, check_in, check_out, status, notes
       FROM attendance WHERE ${where.join(' AND ')} ORDER BY \`date\` DESC LIMIT 366`,
      params
    );
    return rows;
  },

  async upsertAttendance({ employeeId, date, checkIn, checkOut, status, notes }, conn) {
    await exec(conn).query(
      `INSERT INTO attendance (employee_id, \`date\`, check_in, check_out, status, notes)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE check_in = VALUES(check_in), check_out = VALUES(check_out),
                               status = VALUES(status), notes = VALUES(notes)`,
      [employeeId, date, checkIn || null, checkOut || null, status, notes || null]
    );
    const [rows] = await exec(conn).query(
      `SELECT id, employee_id, DATE_FORMAT(\`date\`, '%Y-%m-%d') AS date, check_in, check_out, status, notes
       FROM attendance WHERE employee_id = ? AND \`date\` = ?`,
      [employeeId, date]
    );
    return rows[0];
  },

  async listShifts({ employeeId, date, from, to }, conn) {
    const where = ['e.restaurant_id = ?'];
    const params = [restaurantId];
    if (employeeId) {
      where.push('s.employee_id = ?');
      params.push(employeeId);
    }
    if (date) {
      where.push('s.shift_date = ?');
      params.push(date);
    }
    if (from) {
      where.push('s.shift_date >= ?');
      params.push(from);
    }
    if (to) {
      where.push('s.shift_date <= ?');
      params.push(to);
    }
    const [rows] = await exec(conn).query(
      `SELECT s.id, s.employee_id, DATE_FORMAT(s.shift_date, '%Y-%m-%d') AS shift_date, s.start_time, s.end_time,
              s.role, s.assigned_by, CONCAT(e.first_name, ' ', e.last_name) AS employee_name
       FROM shifts s JOIN employees e ON e.id = s.employee_id
       WHERE ${where.join(' AND ')}
       ORDER BY s.shift_date, s.start_time, s.id LIMIT 500`,
      params
    );
    return rows;
  },

  async createShift({ employeeId, shiftDate, startTime, endTime, role, assignedBy }, conn) {
    const [result] = await exec(conn).query(
      'INSERT INTO shifts (employee_id, shift_date, start_time, end_time, role, assigned_by) VALUES (?, ?, ?, ?, ?, ?)',
      [employeeId, shiftDate, startTime, endTime, role, assignedBy || null]
    );
    return result.insertId;
  },

  async findShift(id, conn) {
    const [rows] = await exec(conn).query('SELECT id FROM shifts WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async removeShift(id, conn) {
    await exec(conn).query('DELETE FROM shifts WHERE id = ?', [id]);
  },

  async listReviews(employeeId, conn) {
    const [rows] = await exec(conn).query(
      `SELECT pr.id, pr.employee_id, DATE_FORMAT(pr.review_date, '%Y-%m-%d') AS review_date, pr.rating, pr.comments,
              pr.reviewed_by, u.full_name AS reviewer_name, pr.created_at
       FROM employee_performance_reviews pr
       LEFT JOIN users u ON u.id = pr.reviewed_by
       WHERE pr.employee_id = ?
       ORDER BY pr.review_date DESC, pr.id DESC LIMIT 200`,
      [employeeId]
    );
    return rows;
  },

  async createReview({ employeeId, reviewedBy, reviewDate, rating, comments }, conn) {
    const [result] = await exec(conn).query(
      `INSERT INTO employee_performance_reviews (employee_id, reviewed_by, review_date, rating, comments)
       VALUES (?, ?, COALESCE(?, CURDATE()), ?, ?)`,
      [employeeId, reviewedBy || null, reviewDate || null, rating, comments || null]
    );
    return result.insertId;
  },
};

module.exports = EmployeeModel;