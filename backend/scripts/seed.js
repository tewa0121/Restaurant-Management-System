// Creates the demo users (one per role), their employee rows, and one customer. Safe to run again.
// Run once after importing database.sql:  npm run seed
require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { ROLES } = require('../utils/constants');

// username, full name, role, employee [code, first, last, position, department] or customer flag
const PEOPLE = [
  ['admin', 'System Administrator', ROLES.ADMIN],
  ['manager', 'John Manager', ROLES.MANAGER, ['EMP-001', 'John', 'Manager', 'Manager', 'Management']],
  ['waiter', 'David Waiter', ROLES.WAITER, ['EMP-002', 'David', 'Waiter', 'Waiter', 'Service']],
  ['cashier', 'Michael Cashier', ROLES.CASHIER, ['EMP-003', 'Michael', 'Cashier', 'Cashier', 'Service']],
  ['kitchen', 'Kitchen Staff', ROLES.KITCHEN, ['EMP-004', 'Kitchen', 'Staff', 'Chef', 'Kitchen']],
  ['customer', 'John Smith', ROLES.CUSTOMER, 'customer'],
];

(async () => {
  const password = process.env.SEED_PASSWORD || 'password123';
  const hash = await bcrypt.hash(password, 10);

  // Ensure roles exist
  for (const name of Object.values(ROLES)) {
    await db.query('INSERT IGNORE INTO roles (name) VALUES (?)', [name]);
  }

  for (const [username, fullName, role, extra] of PEOPLE) {
    // Insert or Update user so hashes/names are always current
    await db.query(
      `INSERT INTO users (restaurant_id, username, email, password_hash, full_name, is_active) 
       VALUES (1, ?, ?, ?, ?, TRUE) 
       ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), full_name = VALUES(full_name), is_active = TRUE`,
      [username, `${username}@resto.com`, hash, fullName]
    );

    const [[user]] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    
    await db.query('INSERT IGNORE INTO user_roles (user_id, role_id) SELECT ?, id FROM roles WHERE name = ?', [user.id, role]);
    
    if (Array.isArray(extra)) {
      await db.query(
        `INSERT INTO employees (restaurant_id, user_id, employee_code, first_name, last_name, position, department, hire_date) 
         VALUES (1, ?, ?, ?, ?, ?, ?, CURDATE()) 
         ON DUPLICATE KEY UPDATE first_name = VALUES(first_name), last_name = VALUES(last_name)`,
        [user.id, ...extra]
      );
    } else if (extra === 'customer') {
      await db.query(
        `INSERT INTO customers (user_id, first_name, last_name, email, phone) 
         VALUES (?, ?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE phone = VALUES(phone)`,
        [user.id, 'John', 'Smith', `${username}@resto.com`, '0911000001']
      );
    }
  }

  console.log(`Seeded users: ${PEOPLE.map((p) => `${p[0]}@resto.com`).join(', ')}`);
  console.log(`Password for all of them: ${password}`);
  process.exit(0);
})().catch((e) => { 
  console.error('Seed failed:', e.message); 
  process.exit(1); 
});