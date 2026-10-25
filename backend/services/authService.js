const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { jwtSecret, shortExpiry, longExpiry } = require('../config/auth');

// Constant-time comparison dummy hash to prevent timing attacks
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 10);

class AuthService {
  async authenticateUser(email, password, remember, req) {
    // 1. Find user by email
    const user = await User.findByEmail(email);

    // 2. Compare passwords securely
    const passwordOk = await bcrypt.compare(password, user?.password_hash || DUMMY_HASH);
    if (!user || !user.password_hash || !passwordOk) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // 3. Fetch user roles
    const roles = await User.getRoles(user.id);
    if (!roles.length) {
      throw new Error('NO_ROLES_ASSIGNED');
    }

    // 4. Generate JWT token with unique session ID (jti)
    const jti = crypto.randomUUID();
    const token = jwt.sign({ sub: user.id, roles }, jwtSecret, { 
      expiresIn: remember ? longExpiry : shortExpiry, 
      jwtid: jti 
    });

    const decodedToken = jwt.decode(token);
    const expiresAt = decodedToken && decodedToken.exp ? new Date(decodedToken.exp * 1000) : new Date(Date.now() + 86400000);

    // 5. Track session in database
    await User.createSession(
      user.id, 
      jti, 
      req.ip || '127.0.0.1', 
      (req.get('user-agent') || '').slice(0, 255), 
      expiresAt
    );

    // 6. Update last login time
    await User.updateLastLogin(user.id);

    // 7. Return payload formatted for frontend consumption
    return {
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        roles
      }
    };
  }

  async getUserProfile(userId) {
    const user = await User.findById(userId);
    if (!user) throw new Error('USER_NOT_FOUND');

    const roles = await User.getRoles(user.id);
    return {
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        roles
      }
    };
  }

  async logoutUser(sessionId) {
    await User.revokeSession(sessionId);
    return { message: 'Signed out successfully.' };
  }
}

module.exports = new AuthService();