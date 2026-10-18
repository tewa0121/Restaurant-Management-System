module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  shortExpiry: '12h',   // normal login
  longExpiry: '7d',     // "Remember me"
};