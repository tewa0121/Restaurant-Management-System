const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const db = require('../config/database');
const { jwtSecret, shortExpiry, longExpiry } = require('../config/auth');

// Compared when the email is unknown, maintaining constant-time comparison safety (cost factor 10)
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 10);

// Helper to fetch user roles from user_roles and roles tables
const getRoles = async (userId) => {
  const [rows] = await db.query(
    'SELECT r.name FROM user_roles ur JOIN roles r ON r.id = ur.role_id WHERE ur.user_id = ?',
    [userId]
  );
  return rows.map((r) => r.name);
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Enter a valid email and password.' });
    }

    const { email, password, remember } = req.body;
    
    // Query the users table matching active accounts
    const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND is_active = TRUE', [email]);
    const user = rows[0];

    // Verify password hash
    const passwordOk = await bcrypt.compare(password, user?.password_hash || DUMMY_HASH);
    if (!user || !user.password_hash || !passwordOk) {
      return res.status(401).json({ message: 'Email or password is incorrect.' });
    }

    // Fetch assigned roles
    const roles = await getRoles(user.id);
    if (!roles.length) {
      return res.status(403).json({ message: 'This account has no role yet. Ask an admin to assign one.' });
    }

    // Generate session tracking ID (jti) and JWT token
    const jti = crypto.randomUUID();
    const token = jwt.sign({ sub: user.id, roles }, jwtSecret, { 
      expiresIn: remember ? longExpiry : shortExpiry, 
      jwtid: jti 
    });
    
    const decodedToken = jwt.decode(token);
    const expiresAt = decodedToken && decodedToken.exp ? new Date(decodedToken.exp * 1000) : new Date(Date.now() + 86400000);

    // Record session into user_sessions table
    await db.query(
      'INSERT INTO user_sessions (user_id, token_id, ip_address, user_agent, expires_at) VALUES (?, ?, ?, ?, ?)',
      [user.id, jti, req.ip || '127.0.0.1', (req.get('user-agent') || '').slice(0, 255), expiresAt]
    );

    // Update last login timestamp
    await db.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

    // Return response structured precisely for frontend consumption
    return res.json({ 
      token, 
      user: { 
        id: user.id, 
        fullName: user.full_name, 
        email: user.email, 
        roles 
      } 
    });
  } catch (err) { 
    console.error('Login error:', err);
    next(err); 
  }
};

exports.me = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT id, full_name, email FROM users WHERE id = ? AND is_active = TRUE', [req.user.id]);
    if (!rows[0]) return res.status(401).json({ message: 'Account not found.' });
    
    const roles = await getRoles(rows[0].id);
    return res.json({ 
      user: { 
        id: rows[0].id, 
        fullName: rows[0].full_name, 
        email: rows[0].email, 
        roles 
      } 
    });
  } catch (err) { 
    next(err); 
  }
};

exports.logout = async (req, res, next) => {
  try {
    await db.query('UPDATE user_sessions SET revoked_at = NOW() WHERE token_id = ?', [req.user.sessionId]);
    return res.json({ message: 'Signed out.' });
  } catch (err) { 
    next(err); 
  }
};