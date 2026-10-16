const mysql = require('mysql2');
require('dotenv').config();

// የዳታቤዝ ፑል (Connection Pool) ከ MAMP Port እና Password ጋር ማዋቀር
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 8889, // MAMP port (8889)
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root', // MAMP default password is root
    database: process.env.DB_NAME || 'restaurant_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ግንኙነቱን መፈተሽ
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MAMP MySQL database successfully as id ' + connection.threadId);
    connection.release();
});

module.exports = pool.promise();