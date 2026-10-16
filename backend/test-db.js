const db = require('./config/database');

async function testConnection() {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS solution');
        console.log('Database test query successful! Result:', rows[0].solution);
    } catch (err) {
        console.error('Database test failed:', err);
    }
}

testConnection();