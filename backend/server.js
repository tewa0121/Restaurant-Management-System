// backend/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// 👇 HARDCODED FALLBACK
process.env.JWT_SECRET =
  process.env.JWT_SECRET ||
  "48af5bb2a64d0083662cd4703bd95bdd5c6afedb85dfa0ca088f7f51f6bd7d9b";

// Import DB (This triggers your database.js)
const db = require("./config/database");

// Import Middleware
const { notFound, errorHandler } = require("./middleware/errorHandler");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount Routes
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Restaurant API is running" });
});

// Error Handling Middleware (must stay AFTER all the routes)
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
