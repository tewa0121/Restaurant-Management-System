require('dotenv').config();

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is missing. Set it in backend/.env before starting the server.');
}

const db = require('./config/database');
const app = require('./app');

const PORT = process.env.PORT || 5000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForSchema(maxAttempts = 60, delayMs = 500) {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const [[row]] = await db.query('SELECT COUNT(*) AS total FROM roles');
      if (row.total >= 6) return true;
    } catch (err) {
      if (attempt === maxAttempts) throw err;
    }
    await sleep(delayMs);
  }
  return false;
}

async function start() {
  try {
    await db.query('SELECT 1');
    console.log('MySQL pool verified');

    const ready = await waitForSchema();
    if (!ready) console.warn('Database schema is not fully seeded yet. Continuing anyway.');

    const server = app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`);
    });

    const shutdown = (signal) => {
      console.log(`${signal} received. Closing server...`);
      server.close(async () => {
        try {
          await db.end();
        } catch (err) {
          console.error('Error closing database pool:', err.message);
        }
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (err) {
    console.error('Startup failed:', err.message);
    process.exit(1);
  }
}

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});

start();