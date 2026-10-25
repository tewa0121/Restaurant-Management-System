const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/auth');
const db = require('../config/database');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, jwtSecret);

    // Verify session validity if jti exists
    if (decoded.jti) {
      const [sessions] = await db.query(
        'SELECT * FROM user_sessions WHERE token_id = ? AND revoked_at IS NULL',
        [decoded.jti]
      );
      if (sessions.length === 0) {
        return res.status(401).json({ message: 'Session expired or revoked.' });
      }
      req.user = { id: decoded.sub, roles: decoded.roles, sessionId: decoded.jti };
    } else {
      req.user = { id: decoded.sub, roles: decoded.roles };
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = verifyToken;