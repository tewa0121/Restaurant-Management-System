module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  shortExpirySeconds: 60 * 60 * 24,
  longExpirySeconds: 60 * 60 * 24 * 7,
  resetTokenMinutes: 60,
  bcryptRounds: 10,
  restaurantId: Number(process.env.RESTAURANT_ID) || 1,
};