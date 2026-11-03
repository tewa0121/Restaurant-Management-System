const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const UserModel = require('../models/userModel');
const { jwtSecret } = require('../config/auth');

const extractToken = (req) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  return scheme && scheme.toLowerCase() === 'bearer' && token ? token : null;
};

async function resolveUser(token) {
  let payload;
  try {
    payload = jwt.verify(token, jwtSecret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') throw new AppError('Your session has expired. Please log in again.', 401, 'TOKEN_EXPIRED');
    throw new AppError('Invalid authentication token.', 401, 'INVALID_TOKEN');
  }

  const active = await UserModel.isSessionActive(payload.jti);
  if (!active) throw new AppError('Your session is no longer active. Please log in again.', 401, 'SESSION_REVOKED');

  return {
    id: Number(payload.sub),
    roles: Array.isArray(payload.roles) ? payload.roles : [],
    role: payload.role,
    sessionId: payload.jti,
  };
}

const verifyToken = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);
  if (!token) throw new AppError('Access denied. No token provided.', 401, 'NO_TOKEN');
  req.user = await resolveUser(token);
  next();
});

const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);
  if (token) {
    try {
      req.user = await resolveUser(token);
    } catch (err) {
      req.user = null;
    }
  }
  next();
});

module.exports = { verifyToken, optionalAuth };