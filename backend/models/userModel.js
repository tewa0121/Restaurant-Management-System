// ============================================================================
// models/userModel.js   -  the AUTH MODEL
// ----------------------------------------------------------------------------
// This file is the only place where the auth code touches the database.
// authService.js calls these functions; it never writes SQL itself.
//
// Tables involved (all created by config/database.js):
//
//   users        one row per person who can log in (email, password_hash, ...)
//   roles        the list of roles: Admin, Manager, Waiter, Cashier, Kitchen, Customer
//   user_roles   the LINK table: which user has which role  (many-to-many)
//
//   users ──< user_roles >── roles
//
// Why a link table? One user can have several roles, and one role belongs to
// many users. A single "role" column on users could not store that.
// ============================================================================
const db = require("../config/database");

// A user may have more than one role, but the app wants ONE role per login.
// So when there are several, we pick the most powerful one. This CASE turns
// each role name into a rank (1 = strongest) and we sort by that rank.
const ROLE_RANK_SQL = `
  CASE r.name
    WHEN 'Admin'    THEN 1
    WHEN 'Manager'  THEN 2
    WHEN 'Cashier'  THEN 3
    WHEN 'Waiter'   THEN 4
    WHEN 'Kitchen'  THEN 5
    WHEN 'Customer' THEN 6
    ELSE 99
  END`;

// ----------------------------------------------------------------------------
// findUserByEmail(email)
// Used by LOGIN and by REGISTER (to check the email is not taken yet).
// Returns ONE object, or null when no user has that email.
//
// It includes password_hash because the service must compare it with bcrypt.
// The hash must NEVER be sent to the browser; authService's publicUser() and the
// controller make sure only safe fields leave the server.
// ----------------------------------------------------------------------------
exports.findUserByEmail = async (email) => {
  // r.name AS role   -> the role name from the roles table ("Admin", "Waiter", ...)
  // LEFT JOIN        -> a user with NO role row is still returned (role = null)
  // ORDER BY + LIMIT -> if the user has several roles, return only the strongest one
  const [rows] = await db.execute(
    `SELECT u.id,
            u.restaurant_id,
            u.username,
            u.email,
            u.password_hash,
            u.full_name,
            u.phone,
            u.avatar_url,
            u.is_active,
            r.name AS role
     FROM users u
     LEFT JOIN user_roles ur ON ur.user_id = u.id
     LEFT JOIN roles r       ON r.id = ur.role_id
     WHERE u.email = ?
     ORDER BY ${ROLE_RANK_SQL}
     LIMIT 1`,
    [email], // the value for the placeholder above: sent separately, so it cannot change the SQL (no SQL injection)
  );

  // rows is an array. Empty array = nobody found, so we return null.
  return rows[0] || null;
};

// ----------------------------------------------------------------------------
// findUserById(id)
// Used by GET /auth/me (who am I?) after a token has been verified.
// Same as above but WITHOUT password_hash: this query is meant for display, so
// the hash never even leaves the database.
// ----------------------------------------------------------------------------
exports.findUserById = async (id) => {
  const [rows] = await db.execute(
    `SELECT u.id,
            u.restaurant_id,
            u.username,
            u.email,
            u.full_name,
            u.phone,
            u.avatar_url,
            u.language,
            u.is_active,
            u.last_login,
            r.name AS role
     FROM users u
     LEFT JOIN user_roles ur ON ur.user_id = u.id
     LEFT JOIN roles r       ON r.id = ur.role_id
     WHERE u.id = ?
     ORDER BY ${ROLE_RANK_SQL}
     LIMIT 1`,
    [id],
  );
  return rows[0] || null;
};

// ----------------------------------------------------------------------------
// updateLastLogin(id)
// Called after a successful login. NOW() is the database clock, so it is the
// same for every server and needs no date formatting in JavaScript.
// An UPDATE returns a "result" object (not rows); affectedRows says how many
// rows changed.
// ----------------------------------------------------------------------------
exports.updateLastLogin = async (id) => {
  const [result] = await db.execute(
    "UPDATE users SET last_login = NOW() WHERE id = ?",
    [id],
  );
  return result.affectedRows;
};

// ----------------------------------------------------------------------------
// findLinkedIds(userId)
// A login (users row) is not the same thing as a customer or an employee:
//   - customers.user_id  links a customer profile to a login
//   - employees.user_id  links a staff profile to a login
// Orders store customers.id / employees.id, NOT users.id, so the orders module
// will call this to translate "who is logged in" into those ids.
// The two sub-selects return NULL when the user has no such profile.
// ----------------------------------------------------------------------------
exports.findLinkedIds = async (userId) => {
  const [rows] = await db.execute(
    `SELECT (SELECT id FROM customers WHERE user_id = ? LIMIT 1) AS customer_id,
            (SELECT id FROM employees WHERE user_id = ? LIMIT 1) AS employee_id`,
    [userId, userId],
  );
  return rows[0]; // always one row: { customer_id: 3 | null, employee_id: 7 | null }
};
