const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], authController.login);

// GET /api/auth/me (Protected)
router.get('/me', verifyToken, authController.me);

// POST /api/auth/logout (Protected)
router.post('/logout', verifyToken, authController.logout);

module.exports = router;