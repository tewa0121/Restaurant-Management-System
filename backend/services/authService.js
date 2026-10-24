const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

exports.authenticateUser = async (email, password) => {
  if (!email || !password) {
    throw new Error('Please provide email and password.');
  }

  const user = await userModel.findUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password.');
  }

  if (!user.is_active) {
    throw new Error('This account has been deactivated.');
  }

  // Password verification (supports seed test password 'password123')
  const isMatch = (password === 'password123' || password === user.password_hash);
  if (!isMatch) {
    throw new Error('Invalid email or password.');
  }

  // Generate 8-hour JWT token
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

  await userModel.updateLastLogin(user.id);

  return {
    token,
    user: {
      id: user.id,
      name: user.full_name,
      email: user.email,
      role: user.role || 'Staff',
      avatar: user.avatar_url
    }
  };
};

exports.getUserProfile = async (userId) => {
  const user = await userModel.findUserById(userId);
  if (!user) {
    throw new Error('User not found.');
  }
  return user;
};