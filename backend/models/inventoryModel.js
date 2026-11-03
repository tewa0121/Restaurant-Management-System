const db = require('../config/database');
const { likeTerm } = require('../utils/sql');
const { restaurantId } = require('../config/auth');

const exec = (conn) => conn || db;

const SELECT_INGREDIENT = `
  SELECT g.id, g.restaurant_id, g.name, g.unit, g.current_stock, g.min_stock_level, g.max_stock_level,
         g.cost_per_unit, g.image_url, g.supplier_id, s.name AS supplier_name, g.updated_at,
         (SELECT MAX(m.created_at) FROM stock_movements m
            WHERE m.ingredient_id = g.id AND m.movement_type = 'purchase') AS last_restocked
  FROM ingredients g
  LEFT JOIN suppliers s ON s.id = g.supplier_id`;

function buildFilters({ search, status, supplierId }) {
  const where = ['g.restaurant_id = ?'];
  const params = [restaurantId];

  if (search) {
    where.push('g.name LIKE ?');
    params.push(likeTerm(search));
  }
  if (supplierId) {
    where.push('g.supplier_id = ?');
    params.push(supplierId);
  }
  if (status === 'out') where.push('g.current_stock <= 0');
  if (status === 'low') where.push('g.current_stock > 0 AND g.current_stock <= g.min_stock_level');
  if (status === 'ok') where.push('g.current_stock > g.min_stock_level');
  if (status === 'attention') where.push('g.current_stock <= g.min_stock_level');

  return { clause: `WHERE ${where.join(' AND ')}`, params };
}

const InventoryModel = {
  async list(filters, { limit, offset }, conn) {
    const { clause, params } = buildFilters(filters);
    const [rows] = await exec(conn).query(`${SELECT_INGREDIENT} ${clause} ORDER BY g.name, g.id LIMIT ? OFFSET ?`, [
      ...params,
      limit,
      offset,
    ]);
    return rows;
  },

  async count(filters, conn) {
    const { clause, params } = buildFilters(filters);
    const [[row]] = await exec(conn).query(`SELECT COUNT(*) AS total FROM ingredients g ${clause}`, params);
    return Number(row.total);
  },

  async summary(conn) {
    const [[row]] = await exec(conn).query(
      `SELECT COUNT(*) AS total,
              COALESCE(SUM(CASE WHEN current_stock <= 0 THEN 1 ELSE 0 END), 0) AS out_of_stock,
              COALESCE(SUM(CASE WHEN current_stock > 0 AND current_stock <= min_stock_level THEN 1 ELSE 0 END), 0) AS low_stock,
              COALESCE(SUM(current_stock * cost_per_unit), 0) AS stock_value
       FROM ingredients WHERE restaurant_id = ?`,
      [restaurantId]
    );
    return row;
  },

  async findById(id, conn) {
    const [rows] = await exec(conn).query(`${SELECT_INGREDIENT} WHERE g.id = ? AND g.restaurant_id = ?`, [id, restaurantId]);
    return rows[0] || null;
  },

  async findByName(name, excludeId, conn) {
    const [rows] = await exec(conn).query(
      'SELECT id FROM ingredients WHERE restaurant_id = ? AND LOWER(name) = LOWER(?) AND id <> ? LIMIT 1',
      [restaurantId, name, excludeId || 0]
    );
    return rows[0] || null;
  },

  async findManyByIds(ids, conn) {
    if (!ids.length) return [];
    const [rows] = await exec(conn).query('SELECT id, name, unit, cost_per_unit FROM ingredients WHERE restaurant_id = ? AND id IN (?)', [
      restaurantId,
      ids,
    ]);
    return rows;
  },

  async create(data, conn) {
    const [result] = await exec(conn).query(
      `INSERT INTO ingredients
        (restaurant_id, name, unit, current_stock, min_stock_level, max_stock_level, cost_per_unit, image_url, supplier_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        restaurantId,
        data.name,
        data.unit,
        data.currentStock || 0,
        data.minStockLevel,
        data.maxStockLevel === undefined ? null : data.maxStockLevel,
        data.costPerUnit === undefined ? 0 : data.costPerUnit,
        data.imageUrl || null,
        data.supplierId || null,
      ]
    );
    return result.insertId;
  },

  async remove(id, conn) {
    await exec(conn).query('DELETE FROM ingredients WHERE id = ?', [id]);
  },

  async usageCounts(id, conn) {
    const [[row]] = await exec(conn).query(
      `SELECT (SELECT COUNT(*) FROM menu_item_ingredients WHERE ingredient_id = ?) AS recipes,
              (SELECT COUNT(*) FROM modifier_ingredients WHERE ingredient_id = ?) AS modifier_recipes,
              (SELECT COUNT(*) FROM purchase_order_items WHERE ingredient_id = ?) AS purchase_lines`,
      [id, id, id]
    );
    return { recipes: Number(row.recipes), modifierRecipes: Number(row.modifier_recipes), purchaseLines: Number(row.purchase_lines) };
  },

  async lockStock(id, conn) {
    const [rows] = await exec(conn).query(
      'SELECT id, name, unit, current_stock, min_stock_level FROM ingredients WHERE id = ? AND restaurant_id = ? FOR UPDATE',
      [id, restaurantId]
    );
    return rows[0] || null;
  },

  async setStock(id, stock, conn) {
    await exec(conn).query('UPDATE ingredients SET current_stock = ? WHERE id = ?', [stock, id]);
  },

  async insertMovement({ ingredientId, type, quantity, referenceId, note, createdBy }, conn) {
    const [result] = await exec(conn).query(
      'INSERT INTO stock_movements (ingredient_id, movement_type, quantity, reference_id, note, created_by) VALUES (?, ?, ?, ?, ?, ?)',
      [ingredientId, type, quantity, referenceId || null, note || null, createdBy || null]
    );
    return result.insertId;
  },

  async listMovements({ ingredientId, type, from, to, search }, { limit, offset }, conn) {
    const where = ['g.restaurant_id = ?'];
    const params = [restaurantId];
    if (ingredientId) {
      where.push('m.ingredient_id = ?');
      params.push(ingredientId);
    }
    if (type) {
      where.push('m.movement_type = ?');
      params.push(type);
    }
    if (from) {
      where.push('DATE(m.created_at) >= ?');
      params.push(from);
    }
    if (to) {
      where.push('DATE(m.created_at) <= ?');
      params.push(to);
    }
    if (search) {
      const term = likeTerm(search);
      where.push('(m.note LIKE ? OR m.reference_id LIKE ? OR g.name LIKE ?)');
      params.push(term, term, term);
    }
    const clause = `WHERE ${where.join(' AND ')}`;

    const [rows] = await exec(conn).query(
      `SELECT m.id, m.ingredient_id, g.name AS ingredient_name, g.unit, m.movement_type, m.quantity, m.reference_id,
              m.note, m.created_by, CONCAT(e.first_name, ' ', e.last_name) AS created_by_name, m.created_at
       FROM stock_movements m
       JOIN ingredients g ON g.id = m.ingredient_id
       LEFT JOIN employees e ON e.id = m.created_by
       ${clause} ORDER BY m.created_at DESC, m.id DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    const [[count]] = await exec(conn).query(
      `SELECT COUNT(*) AS total FROM stock_movements m JOIN ingredients g ON g.id = m.ingredient_id ${clause}`,
      params
    );
    return { rows, total: Number(count.total) };
  },

  async itemRecipe(menuItemId, conn) {
    const [rows] = await exec(conn).query(
      `SELECT r.ingredient_id, g.name, g.unit, g.current_stock, r.quantity_required
       FROM menu_item_ingredients r JOIN ingredients g ON g.id = r.ingredient_id
       WHERE r.menu_item_id = ? ORDER BY g.name`,
      [menuItemId]
    );
    return rows;
  },

  async modifierRecipe(modifierId, conn) {
    const [rows] = await exec(conn).query(
      `SELECT r.ingredient_id, g.name, g.unit, g.current_stock, r.quantity_required
       FROM modifier_ingredients r JOIN ingredients g ON g.id = r.ingredient_id
       WHERE r.modifier_id = ? ORDER BY g.name`,
      [modifierId]
    );
    return rows;
  },

  async replaceItemRecipe(menuItemId, lines, conn) {
    await exec(conn).query('DELETE FROM menu_item_ingredients WHERE menu_item_id = ?', [menuItemId]);
    for (const line of lines) {
      await exec(conn).query(
        'INSERT INTO menu_item_ingredients (menu_item_id, ingredient_id, quantity_required) VALUES (?, ?, ?)',
        [menuItemId, line.ingredientId, line.quantityRequired]
      );
    }
  },

  async replaceModifierRecipe(modifierId, lines, conn) {
    await exec(conn).query('DELETE FROM modifier_ingredients WHERE modifier_id = ?', [modifierId]);
    for (const line of lines) {
      await exec(conn).query(
        'INSERT INTO modifier_ingredients (modifier_id, ingredient_id, quantity_required) VALUES (?, ?, ?)',
        [modifierId, line.ingredientId, line.quantityRequired]
      );
    }
  },

  async recipeLinesForOrder(orderId, conn) {
    const [rows] = await exec(conn).query(
      `SELECT oi.id AS order_item_id, oi.quantity * r.quantity_required AS needed, r.ingredient_id
       FROM order_items oi
       JOIN menu_item_ingredients r ON r.menu_item_id = oi.menu_item_id
       WHERE oi.order_id = ?
       UNION ALL
       SELECT oi.id AS order_item_id, oim.quantity * r.quantity_required AS needed, r.ingredient_id
       FROM order_item_modifiers oim
       JOIN order_items oi ON oi.id = oim.order_item_id
       JOIN modifier_ingredients r ON r.modifier_id = oim.modifier_id
       WHERE oi.order_id = ?`,
      [orderId, orderId]
    );
    return rows;
  },

  async consumedReferences(referenceIds, conn) {
    if (!referenceIds.length) return [];
    const [rows] = await exec(conn).query(
      "SELECT reference_id, ingredient_id FROM stock_movements WHERE movement_type = 'usage' AND reference_id IN (?)",
      [referenceIds]
    );
    return rows;
  },
};

module.exports = InventoryModel;