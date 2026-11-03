const db = require('../config/database');
const { likeTerm } = require('../utils/sql');
const { restaurantId } = require('../config/auth');

const exec = (conn) => conn || db;

const ITEM_COLUMNS = `i.id, i.restaurant_id, i.category_id, c.name AS category_name, i.name, i.description, i.price,
  i.image_url, i.is_available, i.preparation_time_minutes, i.created_at, i.updated_at`;

const ITEM_FROM = 'FROM menu_items i JOIN menu_categories c ON c.id = i.category_id';

const favoriteColumn = (customerId) =>
  customerId
    ? { sql: ', EXISTS (SELECT 1 FROM favorites f WHERE f.menu_item_id = i.id AND f.customer_id = ?) AS is_favorite', params: [customerId] }
    : { sql: '', params: [] };

function buildItemFilters({ category, search, available, publicOnly }) {
  const where = ['i.restaurant_id = ?'];
  const params = [restaurantId];

  if (publicOnly) where.push('i.is_available = TRUE AND c.is_active = TRUE');
  if (available === true) where.push('i.is_available = TRUE');
  if (available === false) where.push('i.is_available = FALSE');
  if (category) {
    if (/^\d+$/.test(String(category))) {
      where.push('i.category_id = ?');
      params.push(Number(category));
    } else {
      where.push("(LOWER(c.name) = LOWER(?) OR LOWER(REPLACE(c.name, ' ', '-')) = LOWER(?))");
      params.push(category, category);
    }
  }
  if (search) {
    const term = likeTerm(search);
    where.push('(i.name LIKE ? OR i.description LIKE ?)');
    params.push(term, term);
  }

  return { clause: `WHERE ${where.join(' AND ')}`, params };
}

const MenuModel = {
  async listCategories({ includeInactive }, conn) {
    const [rows] = await exec(conn).query(
      `SELECT c.id, c.restaurant_id, c.name, c.display_order, c.is_active,
              (SELECT COUNT(*) FROM menu_items i WHERE i.category_id = c.id AND i.is_available = TRUE) AS available_items,
              (SELECT COUNT(*) FROM menu_items i WHERE i.category_id = c.id) AS total_items
       FROM menu_categories c
       WHERE c.restaurant_id = ? ${includeInactive ? '' : 'AND c.is_active = TRUE'}
       ORDER BY c.display_order, c.id`,
      [restaurantId]
    );
    return rows;
  },

  async findCategory(id, conn) {
    const [rows] = await exec(conn).query(
      `SELECT c.id, c.restaurant_id, c.name, c.display_order, c.is_active,
              (SELECT COUNT(*) FROM menu_items i WHERE i.category_id = c.id AND i.is_available = TRUE) AS available_items,
              (SELECT COUNT(*) FROM menu_items i WHERE i.category_id = c.id) AS total_items
       FROM menu_categories c WHERE c.id = ? AND c.restaurant_id = ?`,
      [id, restaurantId]
    );
    return rows[0] || null;
  },

  async findCategoryByName(name, conn) {
    const [rows] = await exec(conn).query(
      'SELECT id, name FROM menu_categories WHERE restaurant_id = ? AND LOWER(name) = LOWER(?) LIMIT 1',
      [restaurantId, name]
    );
    return rows[0] || null;
  },

  async nextCategoryOrder(conn) {
    const [[row]] = await exec(conn).query(
      'SELECT COALESCE(MAX(display_order), 0) + 1 AS next FROM menu_categories WHERE restaurant_id = ?',
      [restaurantId]
    );
    return Number(row.next);
  },

  async createCategory({ name, displayOrder, isActive }, conn) {
    const [result] = await exec(conn).query(
      'INSERT INTO menu_categories (restaurant_id, name, display_order, is_active) VALUES (?, ?, ?, ?)',
      [restaurantId, name, displayOrder, isActive === undefined ? true : isActive]
    );
    return result.insertId;
  },

  async removeCategory(id, conn) {
    await exec(conn).query('DELETE FROM menu_categories WHERE id = ?', [id]);
  },

  async listItems(filters, { limit, offset }, customerId, conn) {
    const { clause, params } = buildItemFilters(filters);
    const favorite = favoriteColumn(customerId);
    const [rows] = await exec(conn).query(
      `SELECT ${ITEM_COLUMNS}${favorite.sql} ${ITEM_FROM} ${clause}
       ORDER BY c.display_order, c.id, i.name, i.id LIMIT ? OFFSET ?`,
      [...favorite.params, ...params, limit, offset]
    );
    return rows;
  },

  async countItems(filters, conn) {
    const { clause, params } = buildItemFilters(filters);
    const [[row]] = await exec(conn).query(`SELECT COUNT(*) AS total ${ITEM_FROM} ${clause}`, params);
    return Number(row.total);
  },

  async findItem(id, customerId, conn) {
    const favorite = favoriteColumn(customerId);
    const [rows] = await exec(conn).query(
      `SELECT ${ITEM_COLUMNS}${favorite.sql} ${ITEM_FROM} WHERE i.id = ? AND i.restaurant_id = ?`,
      [...favorite.params, id, restaurantId]
    );
    return rows[0] || null;
  },

  async createItem({ categoryId, name, description, price, imageUrl, isAvailable, preparationTime }, conn) {
    const [result] = await exec(conn).query(
      `INSERT INTO menu_items
        (restaurant_id, category_id, name, description, price, image_url, is_available, preparation_time_minutes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        restaurantId,
        categoryId,
        name,
        description || null,
        price,
        imageUrl || null,
        isAvailable === undefined ? true : isAvailable,
        preparationTime === undefined ? 15 : preparationTime,
      ]
    );
    return result.insertId;
  },

  async removeItem(id, conn) {
    await exec(conn).query('DELETE FROM menu_items WHERE id = ?', [id]);
  },

  async listModifiers(itemId, onlyAvailable, conn) {
    const [rows] = await exec(conn).query(
      `SELECT id, menu_item_id, name, price_modifier, is_available
       FROM menu_item_modifiers WHERE menu_item_id = ? ${onlyAvailable ? 'AND is_available = TRUE' : ''}
       ORDER BY id`,
      [itemId]
    );
    return rows;
  },

  async findModifier(id, conn) {
    const [rows] = await exec(conn).query(
      'SELECT id, menu_item_id, name, price_modifier, is_available FROM menu_item_modifiers WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async createModifier({ itemId, name, priceModifier, isAvailable }, conn) {
    const [result] = await exec(conn).query(
      'INSERT INTO menu_item_modifiers (menu_item_id, name, price_modifier, is_available) VALUES (?, ?, ?, ?)',
      [itemId, name, priceModifier === undefined ? 0 : priceModifier, isAvailable === undefined ? true : isAvailable]
    );
    return result.insertId;
  },

  async removeModifier(id, conn) {
    await exec(conn).query('DELETE FROM menu_item_modifiers WHERE id = ?', [id]);
  },

  async listFavorites(customerId, conn) {
    const [rows] = await exec(conn).query(
      `SELECT ${ITEM_COLUMNS}, TRUE AS is_favorite
       FROM favorites f
       JOIN menu_items i ON i.id = f.menu_item_id
       JOIN menu_categories c ON c.id = i.category_id
       WHERE f.customer_id = ?
       ORDER BY f.created_at DESC, i.id DESC`,
      [customerId]
    );
    return rows;
  },

  async addFavorite(customerId, itemId, conn) {
    await exec(conn).query('INSERT IGNORE INTO favorites (customer_id, menu_item_id) VALUES (?, ?)', [customerId, itemId]);
  },

  async removeFavorite(customerId, itemId, conn) {
    await exec(conn).query('DELETE FROM favorites WHERE customer_id = ? AND menu_item_id = ?', [customerId, itemId]);
  },
};

module.exports = MenuModel;