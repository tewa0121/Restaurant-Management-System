// require('dotenv').config();
// const express = require('express');
// const mysql2 = require('mysql2');
// const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const db = require('./config/database');
// const routes = require('./routes');
// const { notFound, errorHandler } = require('./middleware/errorHandler');

// if (!process.env.JWT_SECRET) throw new Error('Set JWT_SECRET in .env before starting the server.');

// const app = express();
// app.use(helmet({ crossOriginResourcePolicy: false }));
// app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
// app.use(express.json());
// app.use(morgan('dev'));
// app.use('/api', routes);
// app.use(notFound);
// app.use(errorHandler);

// const port = process.env.PORT || 5000;
// app.listen(port, () => {
//   console.log(`API running on http://localhost:${port}`);
//   db.query('SELECT 1')
//     .then(() => console.log('MySQL connected'))
//     .catch((e) => console.error('MySQL connection FAILED:', e.message));
// });
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const db = require("./config/database");
const routes = require("./routes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

if (!process.env.JWT_SECRET) {
  throw new Error("❌ Set JWT_SECRET in .env before starting the server.");
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Restaurant Management API is running" });
});

app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

async function start() {
  try {
    // DB schema is already being initialized by config/database.js on require.
    // Just verify the pool responds before binding the port.
    await db.query("SELECT 1");
    console.log("✅ MySQL pool verified");

    const server = app.listen(PORT, () => {
      console.log(`🚀 API running on http://localhost:${PORT}`);
    });

    const shutdown = (signal) => {
      console.log(`\n🛑 ${signal} received. Closing server...`);
      server.close(async () => {
        try {
          await db.end();
          console.log("✅ Database pool closed.");
        } catch (err) {
          console.log("⚠️ Error closing DB pool:", err.message);
        }
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (err) {
    console.error("❌ Startup failed:", err.message);
    process.exit(1);
  }
}

start();
module.exports = app;