const fs = require('fs');
const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 8889,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    multipleStatements: true // በአንድ ጊዜ ብዙ SQL ትዕዛዞችን ለማስኬድ
});

const sql = fs.readFileSync('./database.sql', 'utf8');

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to MAMP MySQL server...");

    connection.query(sql, (err, results) => {
        if (err) throw err;
        console.log("Database 'restaurant_db' and all tables created successfully in MAMP!");
        connection.end();
    });
});