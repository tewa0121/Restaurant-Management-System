const db = require('../config/database');
const { restaurantId } = require('../config/auth');

const RestaurantModel = {
  async get(conn) {
    const [rows] = await (conn || db).query('SELECT id, name, address, phone FROM restaurants WHERE id = ?', [restaurantId]);
    return rows[0] || null;
  },
};

module.exports = RestaurantModel;