const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/auth');
const db = require('../config/database');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        code: 'NO_TOKEN',
        message: 'Access denied. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, jwtSecret);

    if (decoded.jti) {
      const [sessions] = await db.query(
        'SELECT * FROM user_sessions WHERE token_id = ? AND revoked_at IS NULL',
        [decoded.jti]
      );
      if (sessions.length === 0) {
        return res.status(401).json({
          success: false,
          code: 'SESSION_REVOKED',
          message: 'Session expired or revoked.',
        });
      }
      req.user = {
        id: decoded.sub,
        roles: decoded.roles,
        role: decoded.role,
        sessionId: decoded.jti,
      };
    } else {
      req.user = {
        id: decoded.sub,
        roles: decoded.roles,
        role: decoded.role,
      };
    }

    return next();
  } catch (err) {
    const code = err.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN';
    return res.status(401).json({
      success: false,
      code,
      message: 'Invalid or expired token.',
    });
  }
};

const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  return verifyToken(req, res, next);
};

module.exports = verifyToken;
module.exports.verifyToken = verifyToken;
module.exports.optionalAuth = optionalAuth;