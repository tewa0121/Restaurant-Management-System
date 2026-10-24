const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// 1. Open to ANY logged-in user (Any role)
router.get('/profile', verifyToken, (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Token verified successfully!',
    user: req.user // Displays id, restaurant_id, email, role encoded in JWT
  });
});

// 2. Restricted ONLY to Admin
router.get('/admin-only', verifyToken, requireRole(['Admin']), (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Welcome, Admin! You have clearance.'
  });
});

// 3. Restricted to Kitchen Staff (will block Admin)
router.get('/kitchen-only', verifyToken, requireRole(['Kitchen Staff']), (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Welcome to the Kitchen portal!'
  });
});

module.exports = router;