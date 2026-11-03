const express = require('express');
const controller = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const { createRateLimiter } = require('../middleware/rateLimiter');
const { validate } = require('../utils/validate');

const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');

const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many login attempts. Please try again in a few minutes.',
  keyFn: (req) => `${req.ip}:${String((req.body && req.body.email) || '').toLowerCase()}`,
});

const resetLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many requests. Please try again later.',
});

router.post(
  '/login',
  loginLimiter,
  validate({
    body: {
      email: { type: 'string', required: true, maxLength: 100, label: 'Email' },
      password: { type: 'string', required: true, trim: false, maxLength: 128, label: 'Password' },
      remember: { type: 'boolean', default: false },
    },
  }),
  controller.login
);

router.post(
  '/register',
  resetLimiter,
  validate({
    body: {
      fullName: { type: 'string', required: true, minLength: 2, maxLength: 100, label: 'Full name' },
      email: { type: 'email', required: true, label: 'Email' },
      password: { type: 'string', required: true, trim: false, minLength: 6, maxLength: 128, label: 'Password' },
      phone: { type: 'string', maxLength: 20, label: 'Phone' },
    },
  }),
  controller.register
);

router.post(
  '/forgot-password',
  resetLimiter,
  validate({ body: { email: { type: 'string', required: true, maxLength: 100, label: 'Email' } } }),
  controller.forgotPassword
);

router.post(
  '/reset-password',
  resetLimiter,
  validate({
    body: {
      token: { type: 'string', required: true, maxLength: 128, label: 'Reset token' },
      password: { type: 'string', required: true, trim: false, minLength: 6, maxLength: 128, label: 'Password' },
    },
  }),
  controller.resetPassword
);

router.get('/me', verifyToken, controller.me);

router.put(
  '/profile',
  verifyToken,
  validate({
    body: {
      fullName: { type: 'string', minLength: 2, maxLength: 100, label: 'Full name' },
      phone: { type: 'string', maxLength: 20, label: 'Phone' },
      avatarUrl: { type: 'string', maxLength: 255, label: 'Avatar URL' },
      language: { type: 'string', minLength: 2, maxLength: 2, lowercase: true, label: 'Language' },
    },
  }),
  controller.updateProfile
);

router.put(
  '/change-password',
  verifyToken,
  validate({
    body: {
      currentPassword: { type: 'string', required: true, trim: false, label: 'Current password' },
      newPassword: { type: 'string', required: true, trim: false, minLength: 6, maxLength: 128, label: 'New password' },
    },
  }),
  controller.changePassword
);

router.post('/logout', verifyToken, controller.logout);

module.exports = router;