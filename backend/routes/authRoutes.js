const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const authenticate = require('../middleware/authMiddleware');
const { login, me, logout } = require('../controllers/authController');

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { message: 'Too many sign-in attempts. Try again in 15 minutes.' } });

router.post('/login', loginLimiter, [body('email').isEmail(), body('password').isLength({ min: 1 })], login);
router.get('/me', authenticate, me);
router.post('/logout', authenticate, logout);
module.exports = router;