const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { jwtSecret } = require('../config/auth');

// Checks the Bearer token AND that its session in user_sessions is still active (logout revokes it).
module.exports = async function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Sign in to continue.' });

  let payload;
  try {
    payload = jwt.verify(token, jwtSecret);
  } catch {
    return res.status(401).json({ message: 'Your session has expired. Sign in again.' });
  }

  try {
    const [rows] = await db.query(
      'SELECT id FROM user_sessions WHERE token_id = ? AND revoked_at IS NULL AND expires_at > NOW()',
      [payload.jti]
    );
    if (!rows.length) return res.status(401).json({ message: 'Your session has expired. Sign in again.' });
    db.query('UPDATE user_sessions SET last_seen_at = NOW() WHERE id = ?', [rows[0].id]).catch(() => {});
    req.user = { id: payload.sub, roles: payload.roles || [], sessionId: payload.jti };
    next();
  } catch (err) {
    next(err);
  }
};