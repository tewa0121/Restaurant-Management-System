require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// This matches your file name exactly
const SQL_FILE = path.join(__dirname, 'database.sql');

(async () => {
  const sql = fs.readFileSync(SQL_FILE, 'utf8');

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true // <--- THIS IS THE CRITICAL LINE
  });

  console.log('Connected to MySQL server...');

  try {
    await conn.query(sql);
    console.log('Migration successful! All tables and indexes created.');
  } catch (err) {
    console.error('Migration failed:', err.sqlMessage || err.message);
  } finally {
    await conn.end();
  }
})();