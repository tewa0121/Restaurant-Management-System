const { validationResult } = require('express-validator');
const authService = require('../services/authService');

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user, issue JWT token, and create session
 * @access  Public
 */
exports.login = async (req, res, next) => {
  try {
    // 1. Check for express-validator input errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed. Please check your credentials.',
        errors: errors.array(),
      });
    }

    const { email, password, remember } = req.body;

    // 2. Delegate authentication business logic to authService
    const result = await authService.authenticateUser(email, password, remember, req);

    // 3. Return payload formatted for frontend consumption: { token, user: { id, fullName, email, roles } }
    return res.status(200).json(result);
  } catch (err) {
    if (err.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ message: 'Email or password is incorrect.' });
    }
    if (err.message === 'NO_ROLES_ASSIGNED') {
      return res.status(403).json({
        message: 'This account has no role assigned. Please contact an administrator.',
      });
    }
    if (err.message === 'ACCOUNT_INACTIVE') {
      return res.status(403).json({
        message: 'This account has been deactivated. Please contact support.',
      });
    }

    console.error('❌ Login Error:', err);
    return next(err);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user profile
 * @access  Private (Requires JWT Bearer Token)
 */
exports.me = async (req, res, next) => {
  try {
    // req.user.id is attached by authMiddleware after verifying JWT
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized access.' });
    }

    const profile = await authService.getUserProfile(req.user.id);
    return res.status(200).json(profile);
  } catch (err) {
    if (err.message === 'USER_NOT_FOUND') {
      return res.status(401).json({ message: 'Account not found or inactive.' });
    }

    console.error('❌ Auth Me Error:', err);
    return next(err);
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Revoke current user session in database
 * @access  Private (Requires JWT Bearer Token)
 */
exports.logout = async (req, res, next) => {
  try {
    const sessionId = req.user?.sessionId || req.user?.jti;
    
    if (sessionId) {
      await authService.logoutUser(sessionId);
    }

    return res.status(200).json({ message: 'Signed out successfully.' });
  } catch (err) {
    console.error('❌ Logout Error:', err);
    return next(err);
  }
};