module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_here',
  shortExpiry: '1d',
  longExpiry: '7d',
};