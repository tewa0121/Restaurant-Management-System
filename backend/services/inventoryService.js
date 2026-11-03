const InventoryModel = require('../models/inventoryModel');
const SupplierModel = require('../models/supplierModel');
const MenuModel = require('../models/menuModel');
const EmployeeModel = require('../models/employeeModel');
const { round2 } = require('./pricingService');
const AppError = require('../utils/AppError');
const { withTransaction } = require('../utils/transaction');
const { logActivity } = require('../utils/activityLog');
const { notifyRoles } = require('../utils/notify');
const { toOffset, pageMeta } = require('../utils/pagination');
const { mapFields, updateById, isForeignKeyError } = require('../utils/sql');
const { normalizeEnum, titleCase } = require('../utils/enums');
const { hasRole } = require('../middleware/roleMiddleware');
const { ROLES, MOVEMENT_TYPES } = require('../utils/constants');

const managers = [ROLES.ADMIN, ROLES.MANAGER];

function toIngredientDto(row) {
  const stock = Number(row.current_stock);
  const min = Number(row.min_stock_level);
  const max = row.max_stock_level === null || row.max_stock_level === undefined ? null : Number(row.max_stock_level);
  const cost = Number(row.cost_per_unit);
  const statusKey = stock <= 0 ? 'out' : stock <= min ? 'low' : 'ok';
  const status = { out: 'Out of Stock', low: 'Low Stock', ok: 'In Stock' }[statusKey];
  const target = max !== null ? max : min * 2;
  let alertLevel = null;
  if (statusKey !== 'ok') alertLevel = stock <= 0 || stock <= min / 2 ? 'Critical' : 'Low';

  return {
    id: row.id,
    name: row.name,
    unit: row.unit,
    current_stock: stock,
    currentStock: stock,
    quantity: `${stock} ${row.unit}`,
    min_stock_level: min,
    minStockLevel: min,
    threshold: min,
    max_stock_level: max,
    maxStockLevel: max,
    cost_per_unit: cost,
    costPerUnit: cost,
    unitPrice: cost,
    stockValue: round2(stock * cost),
    image_url: row.image_url,
    imageUrl: row.image_url,
    image: row.image_url,
    supplier_id: row.supplier_id,
    supplierId: row.supplier_id,
    supplier_name: row.supplier_name,
    supplier: row.supplier_name,
    status,
    statusKey,
    alertLevel,
    isLow: statusKey !== 'ok',
    suggestedQuantity: statusKey === 'ok' ? 0 : Math.max(0, round2(target - stock)),
    last_restocked: row.last_restocked || null,
    lastRestocked: row.last_restocked || null,
    updated_at: row.updated_at,
  };
}

function toMovementDto(row) {
  return {
    id: row.id,
    ingredient_id: row.ingredient_id,
    ingredientId: row.ingredient_id,
    ingredient_name: row.ingredient_name,
    ingredient: row.ingredient_name,
    unit: row.unit,
    movement_type: row.movement_type,
    type: row.movement_type,
    typeLabel: titleCase(row.movement_type),
    quantity: Number(row.quantity),
    reference_id: row.reference_id,
    referenceId: row.reference_id,
    note: row.note,
    created_by: row.created_by,
    created_by_name: row.created_by_name && row.created_by_name.trim() ? row.created_by_name.trim() : null,
    created_at: row.created_at,
    createdAt: row.created_at,
  };
}

function signedDelta(type, quantity) {
  if (type === 'adjustment') return quantity;
  const amount = Math.abs(quantity);
  return type === 'purchase' ? amount : -amount;
}

async function applyMovement(conn, { ingredientId, type, quantity, referenceId, note, createdBy, clamp = false }) {
  const ingredient = await InventoryModel.lockStock(ingredientId, conn);
  if (!ingredient) throw new AppError('Ingredient not found.', 404, 'INGREDIENT_NOT_FOUND');

  const before = Number(ingredient.current_stock);
  let delta = round2(signedDelta(type, quantity));
  let after = round2(before + delta);
  let insufficient = false;

  if (after < 0) {
    if (!clamp) {
      throw new AppError(`Not enough ${ingredient.name} in stock (${before} ${ingredient.unit} available).`, 409, 'INSUFFICIENT_STOCK');
    }
    delta = round2(-before);
    after = 0;
    insufficient = true;
  }

  await InventoryModel.setStock(ingredientId, after, conn);
  await InventoryModel.insertMovement(
    { ingredientId, type, quantity: delta, referenceId, note: insufficient ? `${note || ''} (insufficient stock)`.trim() : note, createdBy },
    conn
  );

  const min = Number(ingredient.min_stock_level);
  return { ingredient, before, after, delta, insufficient, crossedLow: before > min && after <= min };
}

async function announceLowStock(events) {
  const seen = new Set();
  for (const event of events) {
    if (!event.crossedLow || seen.has(event.ingredient.id)) continue;
    seen.add(event.ingredient.id);
    await notifyRoles([ROLES.MANAGER, ROLES.KITCHEN], {
      title: 'Low stock alert',
      message: `${event.ingredient.name} is running low (${event.after} ${event.ingredient.unit} left, minimum ${Number(event.ingredient.min_stock_level)}).`,
      type: 'inventory',
    });
  }
}

async function consumeForOrder(conn, orderId) {
  const lines = await InventoryModel.recipeLinesForOrder(orderId, conn);
  if (!lines.length) return;

  const grouped = new Map();
  lines.forEach((line) => {
    const key = `${line.order_item_id}:${line.ingredient_id}`;
    const entry = grouped.get(key) || { orderItemId: line.order_item_id, ingredientId: line.ingredient_id, needed: 0 };
    entry.needed += Number(line.needed);
    grouped.set(key, entry);
  });

  const references = [...new Set([...grouped.values()].map((entry) => `order-item:${entry.orderItemId}`))];
  const consumed = new Set(
    (await InventoryModel.consumedReferences(references, conn)).map((row) => `${row.reference_id}:${row.ingredient_id}`)
  );

  const events = [];
  for (const entry of grouped.values()) {
    const reference = `order-item:${entry.orderItemId}`;
    if (consumed.has(`${reference}:${entry.ingredientId}`)) continue;
    events.push(
      await applyMovement(conn, {
        ingredientId: entry.ingredientId,
        type: 'usage',
        quantity: round2(entry.needed),
        referenceId: reference,
        note: 'Order consumption',
        clamp: true,
      })
    );
  }
  await announceLowStock(events);
}

const requireIngredient = async (id) => {
  const row = await InventoryModel.findById(id);
  if (!row) throw new AppError('Ingredient not found.', 404, 'INGREDIENT_NOT_FOUND');
  return row;
};

async function validateRecipeLines(lines) {
  const ids = lines.map((line) => line.ingredientId);
  if (new Set(ids).size !== ids.length) throw new AppError('An ingredient can only appear once in a recipe.', 422, 'VALIDATION_ERROR');
  const found = await InventoryModel.findManyByIds(ids);
  if (found.length !== ids.length) throw new AppError('One or more ingredients were not found.', 422, 'INGREDIENT_NOT_FOUND');
}

const mapRecipe = (rows) =>
  rows.map((row) => ({
    ingredient_id: row.ingredient_id,
    ingredientId: row.ingredient_id,
    name: row.name,
    unit: row.unit,
    current_stock: Number(row.current_stock),
    quantity_required: Number(row.quantity_required),
    quantityRequired: Number(row.quantity_required),
  }));

const InventoryService = {
  toIngredientDto,
  applyMovement,
  consumeForOrder,
  announceLowStock,

  async list({ search, status, supplierId, page, limit }) {
    const filters = { search, status, supplierId };
    const [rows, total] = await Promise.all([
      InventoryModel.list(filters, { limit, offset: toOffset(page, limit) }),
      InventoryModel.count(filters),
    ]);
    return { rows: rows.map(toIngredientDto), pagination: pageMeta(page, limit, total) };
  },

  async low() {
    const rows = await InventoryModel.list({ status: 'attention' }, { limit: 500, offset: 0 });
    return rows.map(toIngredientDto);
  },

  async summary() {
    const row = await InventoryModel.summary();
    return {
      totalIngredients: Number(row.total),
      lowStock: Number(row.low_stock),
      outOfStock: Number(row.out_of_stock),
      stockValue: round2(Number(row.stock_value)),
    };
  },

  async get(id) {
    return toIngredientDto(await requireIngredient(id));
  },

  async create(body, actor) {
    if (await InventoryModel.findByName(body.name)) throw new AppError('An ingredient with this name already exists.', 409, 'INGREDIENT_EXISTS');
    if (body.supplierId && !(await SupplierModel.findById(body.supplierId))) {
      throw new AppError('Supplier not found.', 422, 'SUPPLIER_NOT_FOUND');
    }
    if (body.maxStockLevel !== undefined && body.maxStockLevel !== null && body.maxStockLevel < body.minStockLevel) {
      throw new AppError('The maximum stock level cannot be below the minimum.', 422, 'VALIDATION_ERROR');
    }

    const employee = await EmployeeModel.findByUserId(actor.id);
    const id = await withTransaction(async (conn) => {
      const ingredientId = await InventoryModel.create(body, conn);
      if (body.currentStock > 0) {
        await InventoryModel.insertMovement(
          { ingredientId, type: 'adjustment', quantity: body.currentStock, note: 'Opening stock', createdBy: employee ? employee.id : null },
          conn
        );
      }
      return ingredientId;
    });

    logActivity({ userId: actor.id, action: `Created ingredient ${body.name}`, activityType: 'inventory', entityType: 'ingredient', entityId: id });
    return InventoryService.get(id);
  },

  async update(id, body, actor) {
    const existing = await requireIngredient(id);

    const fields = mapFields(body, {
      unit: 'unit',
      minStockLevel: 'min_stock_level',
      maxStockLevel: 'max_stock_level',
      costPerUnit: 'cost_per_unit',
      imageUrl: 'image_url',
      supplierId: 'supplier_id',
    });
    if (body.name !== undefined) {
      if (await InventoryModel.findByName(body.name, id)) throw new AppError('An ingredient with this name already exists.', 409, 'INGREDIENT_EXISTS');
      fields.name = body.name;
    }
    if (body.supplierId && !(await SupplierModel.findById(body.supplierId))) {
      throw new AppError('Supplier not found.', 422, 'SUPPLIER_NOT_FOUND');
    }

    const min = fields.min_stock_level === undefined ? Number(existing.min_stock_level) : fields.min_stock_level;
    const max = fields.max_stock_level === undefined ? existing.max_stock_level : fields.max_stock_level;
    if (max !== null && max !== undefined && Number(max) < Number(min)) {
      throw new AppError('The maximum stock level cannot be below the minimum.', 422, 'VALIDATION_ERROR');
    }

    const stockChange = body.currentStock !== undefined ? round2(body.currentStock - Number(existing.current_stock)) : 0;
    if (!Object.keys(fields).length && !stockChange) throw new AppError('Nothing to update.', 400, 'NOTHING_TO_UPDATE');

    const employee = await EmployeeModel.findByUserId(actor.id);
    const event = await withTransaction(async (conn) => {
      await updateById('ingredients', id, fields, conn);
      if (!stockChange) return null;
      return applyMovement(conn, {
        ingredientId: id,
        type: 'adjustment',
        quantity: stockChange,
        note: 'Stock corrected from the inventory screen',
        createdBy: employee ? employee.id : null,
      });
    });
    if (event) await announceLowStock([event]);

    logActivity({
      userId: actor.id,
      action: `Updated ingredient ${existing.name}`,
      activityType: 'inventory',
      entityType: 'ingredient',
      entityId: id,
      newValue: { ...fields, stockChange },
    });
    return InventoryService.get(id);
  },

  async remove(id, actor) {
    const existing = await requireIngredient(id);
    const usage = await InventoryModel.usageCounts(id);
    if (usage.recipes || usage.modifierRecipes || usage.purchaseLines) {
      throw new AppError('This ingredient is used in recipes or purchase orders and cannot be deleted.', 409, 'HAS_RELATED_RECORDS');
    }
    try {
      await InventoryModel.remove(id);
    } catch (err) {
      if (isForeignKeyError(err)) throw new AppError('This ingredient is in use and cannot be deleted.', 409, 'HAS_RELATED_RECORDS');
      throw err;
    }
    logActivity({ userId: actor.id, action: `Deleted ingredient ${existing.name}`, activityType: 'inventory', entityType: 'ingredient', entityId: id });
    return { message: 'Ingredient deleted successfully.' };
  },

  async addMovement(id, body, actor) {
    const existing = await requireIngredient(id);
    const type = normalizeEnum(body.type, MOVEMENT_TYPES, 'Type');
    if (['purchase', 'return'].includes(type) && !hasRole(actor, managers)) {
      throw new AppError('Only a manager can record purchases or returns.', 403, 'FORBIDDEN');
    }
    if (type !== 'adjustment' && body.quantity <= 0) {
      throw new AppError('The quantity must be greater than zero.', 422, 'VALIDATION_ERROR');
    }
    if (body.quantity === 0) throw new AppError('The quantity cannot be zero.', 422, 'VALIDATION_ERROR');

    const employee = await EmployeeModel.findByUserId(actor.id);
    const event = await withTransaction((conn) =>
      applyMovement(conn, {
        ingredientId: id,
        type,
        quantity: body.quantity,
        referenceId: body.referenceId,
        note: body.note,
        createdBy: employee ? employee.id : null,
      })
    );
    await announceLowStock([event]);

    logActivity({
      userId: actor.id,
      action: `Stock ${type} of ${body.quantity} ${existing.unit} for ${existing.name}`,
      activityType: 'inventory',
      entityType: 'ingredient',
      entityId: id,
      newValue: { type, quantity: body.quantity, note: body.note },
    });
    return InventoryService.get(id);
  },

  async listMovements({ ingredientId, type, from, to, search, page, limit }) {
    const { rows, total } = await InventoryModel.listMovements(
      { ingredientId, type: type ? normalizeEnum(type, MOVEMENT_TYPES, 'Type') : undefined, from, to, search },
      { limit, offset: toOffset(page, limit) }
    );
    return { rows: rows.map(toMovementDto), pagination: pageMeta(page, limit, total) };
  },

  async getItemRecipe(menuItemId) {
    if (!(await MenuModel.findItem(menuItemId))) throw new AppError('Menu item not found.', 404, 'MENU_ITEM_NOT_FOUND');
    return mapRecipe(await InventoryModel.itemRecipe(menuItemId));
  },

  async setItemRecipe(menuItemId, { ingredients }, actor) {
    const item = await MenuModel.findItem(menuItemId);
    if (!item) throw new AppError('Menu item not found.', 404, 'MENU_ITEM_NOT_FOUND');
    await validateRecipeLines(ingredients);

    await withTransaction((conn) => InventoryModel.replaceItemRecipe(menuItemId, ingredients, conn));
    logActivity({ userId: actor.id, action: `Updated recipe for ${item.name}`, activityType: 'inventory', entityType: 'menu_item', entityId: menuItemId });
    return mapRecipe(await InventoryModel.itemRecipe(menuItemId));
  },

  async getModifierRecipe(modifierId) {
    if (!(await MenuModel.findModifier(modifierId))) throw new AppError('Modifier not found.', 404, 'MODIFIER_NOT_FOUND');
    return mapRecipe(await InventoryModel.modifierRecipe(modifierId));
  },

  async setModifierRecipe(modifierId, { ingredients }, actor) {
    const modifier = await MenuModel.findModifier(modifierId);
    if (!modifier) throw new AppError('Modifier not found.', 404, 'MODIFIER_NOT_FOUND');
    await validateRecipeLines(ingredients);

    await withTransaction((conn) => InventoryModel.replaceModifierRecipe(modifierId, ingredients, conn));
    logActivity({ userId: actor.id, action: `Updated recipe for modifier ${modifier.name}`, activityType: 'inventory', entityType: 'menu_item_modifier', entityId: modifierId });
    return mapRecipe(await InventoryModel.modifierRecipe(modifierId));
  },
};

module.exports = InventoryService;