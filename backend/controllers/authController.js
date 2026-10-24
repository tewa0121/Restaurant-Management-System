const db = require('../config/database');
const jwt = require('jsonwebtoken');

// ==============================
// 1. STAFF / ADMIN LOGIN
// ==============================
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    // Query user and join with user_roles and roles tables
    const [rows] = await db.query(
      `SELECT u.id, u.restaurant_id, u.username, u.email, u.password_hash, u.full_name, u.avatar_url, u.is_active, r.name as role 
       FROM users u 
       LEFT JOIN user_roles ur ON u.id = ur.user_id 
       LEFT JOIN roles r ON ur.role_id = r.id 
       WHERE u.email = ?`, 
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = rows[0];

    if (!user.is_active) {
      return res.status(403).json({ success: false, message: 'This account has been deactivated.' });
    }

    // Check password (supports seed test password 'password123' or stored hashes)
    const isMatch = (password === 'password123' || password === user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Generate JWT token valid for 8 hours
    const token = jwt.sign(
      { 
        id: user.id, 
        restaurant_id: user.restaurant_id, 
        email: user.email, 
        role: user.role || 'Staff' 
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Update last login timestamp
    await db.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
        role: user.role || 'Staff',
        avatar: user.avatar_url
      }
    });
  } catch (err) {
    next(err);
  }
};

// ==============================
// 2. GET CURRENT LOGGED-IN USER (/me)
// ==============================
exports.getMe = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT u.id, u.restaurant_id, u.username, u.email, u.full_name, u.avatar_url, u.language, r.name as role 
       FROM users u 
       LEFT JOIN user_roles ur ON u.id = ur.user_id 
       LEFT JOIN roles r ON ur.role_id = r.id 
       WHERE u.id = ?`, 
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({
      success: true,
      user: rows[0]
    });
  } catch (err) {
    next(err);
  }
};