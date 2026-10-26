// routes/index.js
const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes); // Maps all admin endpoints to /api/admin/...

module.exports = router;