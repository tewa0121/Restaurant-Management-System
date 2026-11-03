const MenuModel = require('../models/menuModel');
const CustomerModel = require('../models/customerModel');
const AppError = require('../utils/AppError');
const { logActivity } = require('../utils/activityLog');
const { toOffset, pageMeta } = require('../utils/pagination');
const { mapFields, updateById, isForeignKeyError } = require('../utils/sql');
const { hasRole } = require('../middleware/roleMiddleware');
const { ROLES, STAFF_ROLES } = require('../utils/constants');

const slugify = (value) => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const isStaff = (user) => hasRole(user, STAFF_ROLES);

function toCategoryDto(row) {
  const isActive = Boolean(row.is_active);
  return {
    id: row.id,
    name: row.name,
    slug: slugify(row.name),
    display_order: row.display_order,
    displayOrder: row.display_order,
    is_active: isActive,
    isActive,
    available_items: Number(row.available_items),
    total_items: Number(row.total_items),
    itemCount: Number(row.available_items),
  };
}

function toItemDto(row) {
  const isAvailable = Boolean(row.is_available);
  const dto = {
    id: row.id,
    restaurant_id: row.restaurant_id,
    category_id: row.category_id,
    categoryId: row.category_id,
    category: row.category_name,
    category_name: row.category_name,
    categorySlug: slugify(row.category_name),
    name: row.name,
    description: row.description,
    price: Number(row.price),
    image_url: row.image_url,
    imageUrl: row.image_url,
    image: row.image_url,
    is_available: isAvailable,
    isAvailable,
    available: isAvailable,
    preparation_time_minutes: row.preparation_time_minutes,
    preparationTime: row.preparation_time_minutes,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
  if (row.is_favorite !== undefined) {
    dto.isFavorite = Boolean(row.is_favorite);
    dto.is_favorite = dto.isFavorite;
  }
  return dto;
}

function toModifierDto(row) {
  const isAvailable = Boolean(row.is_available);
  return {
    id: row.id,
    menu_item_id: row.menu_item_id,
    menuItemId: row.menu_item_id,
    name: row.name,
    price_modifier: Number(row.price_modifier),
    priceModifier: Number(row.price_modifier),
    is_available: isAvailable,
    isAvailable,
  };
}

async function customerIdOf(user) {
  if (!user || !user.roles.includes(ROLES.CUSTOMER)) return null;
  const customer = await CustomerModel.findByUserId(user.id);
  return customer ? customer.id : null;
}

async function requireCustomerId(user) {
  const id = await customerIdOf(user);
  if (!id) throw new AppError('Only customers have favorites.', 403, 'FORBIDDEN');
  return id;
}

async function resolveCategoryId({ categoryId, category }) {
  if (categoryId) {
    const row = await MenuModel.findCategory(categoryId);
    if (!row) throw new AppError('Category not found.', 422, 'CATEGORY_NOT_FOUND');
    return row.id;
  }
  if (category) {
    if (/^\d+$/.test(String(category))) {
      const row = await MenuModel.findCategory(Number(category));
      if (!row) throw new AppError('Category not found.', 422, 'CATEGORY_NOT_FOUND');
      return row.id;
    }
    const found = await MenuModel.findCategoryByName(category);
    if (found) return found.id;
    return MenuModel.createCategory({ name: category, displayOrder: await MenuModel.nextCategoryOrder(), isActive: true });
  }
  return null;
}

const requireItem = async (id, customerId) => {
  const row = await MenuModel.findItem(id, customerId);
  if (!row) throw new AppError('Menu item not found.', 404, 'MENU_ITEM_NOT_FOUND');
  return row;
};

const resolveAvailable = (body) => (body.isAvailable !== undefined ? body.isAvailable : body.available);

const MenuService = {
  toItemDto,

  async listCategories({ includeInactive }, user) {
    const rows = await MenuModel.listCategories({ includeInactive: Boolean(includeInactive) && isStaff(user) });
    return rows.map(toCategoryDto);
  },

  async createCategory(body, actor) {
    if (await MenuModel.findCategoryByName(body.name)) {
      throw new AppError('A category with this name already exists.', 409, 'CATEGORY_EXISTS');
    }
    const id = await MenuModel.createCategory({
      name: body.name,
      displayOrder: body.displayOrder === undefined ? await MenuModel.nextCategoryOrder() : body.displayOrder,
      isActive: body.isActive,
    });
    logActivity({ userId: actor.id, action: `Created menu category ${body.name}`, activityType: 'menu', entityType: 'menu_category', entityId: id });
    return toCategoryDto(await MenuModel.findCategory(id));
  },

  async updateCategory(id, body, actor) {
    const existing = await MenuModel.findCategory(id);
    if (!existing) throw new AppError('Category not found.', 404, 'CATEGORY_NOT_FOUND');

    const fields = mapFields(body, { name: 'name', displayOrder: 'display_order', isActive: 'is_active' });
    if (!Object.keys(fields).length) throw new AppError('Nothing to update.', 400, 'NOTHING_TO_UPDATE');

    if (fields.name && fields.name.toLowerCase() !== existing.name.toLowerCase()) {
      if (await MenuModel.findCategoryByName(fields.name)) {
        throw new AppError('A category with this name already exists.', 409, 'CATEGORY_EXISTS');
      }
    }

    await updateById('menu_categories', id, fields);
    logActivity({ userId: actor.id, action: `Updated menu category ${existing.name}`, activityType: 'menu', entityType: 'menu_category', entityId: id, newValue: fields });
    return toCategoryDto(await MenuModel.findCategory(id));
  },

  async removeCategory(id, actor) {
    const existing = await MenuModel.findCategory(id);
    if (!existing) throw new AppError('Category not found.', 404, 'CATEGORY_NOT_FOUND');
    if (Number(existing.total_items) > 0) {
      throw new AppError('This category still has menu items. Move or delete them first.', 409, 'HAS_RELATED_RECORDS');
    }
    await MenuModel.removeCategory(id);
    logActivity({ userId: actor.id, action: `Deleted menu category ${existing.name}`, activityType: 'menu', entityType: 'menu_category', entityId: id });
    return { message: 'Category deleted successfully.' };
  },

  async listItems({ category, search, available, page, limit }, user) {
    const staff = isStaff(user);
    const filters = { category, search, available: staff ? available : undefined, publicOnly: !staff };
    const customerId = await customerIdOf(user);
    const [rows, total] = await Promise.all([
      MenuModel.listItems(filters, { limit, offset: toOffset(page, limit) }, customerId),
      MenuModel.countItems(filters),
    ]);
    return { rows: rows.map(toItemDto), pagination: pageMeta(page, limit, total) };
  },

  async getItem(id, user) {
    const customerId = await customerIdOf(user);
    const row = await requireItem(id, customerId);
    if (!isStaff(user) && !row.is_available) throw new AppError('Menu item not found.', 404, 'MENU_ITEM_NOT_FOUND');
    const modifiers = await MenuModel.listModifiers(id, !isStaff(user));
    return { ...toItemDto(row), modifiers: modifiers.map(toModifierDto) };
  },

  async createItem(body, actor) {
    const categoryId = await resolveCategoryId(body);
    if (!categoryId) throw new AppError('Category is required.', 422, 'VALIDATION_ERROR');

    const id = await MenuModel.createItem({
      categoryId,
      name: body.name,
      description: body.description,
      price: body.price,
      imageUrl: body.imageUrl || body.image,
      isAvailable: resolveAvailable(body),
      preparationTime: body.preparationTime,
    });
    logActivity({ userId: actor.id, action: `Created menu item ${body.name}`, activityType: 'menu', entityType: 'menu_item', entityId: id });
    return MenuService.getItem(id, actor);
  },

  async updateItem(id, body, actor) {
    const existing = await requireItem(id);
    const fields = mapFields(body, {
      name: 'name',
      description: 'description',
      price: 'price',
      preparationTime: 'preparation_time_minutes',
    });

    const imageUrl = body.imageUrl !== undefined ? body.imageUrl : body.image;
    if (imageUrl !== undefined) fields.image_url = imageUrl;

    const available = resolveAvailable(body);
    if (available !== undefined) fields.is_available = available;

    if (body.categoryId !== undefined || body.category !== undefined) {
      const categoryId = await resolveCategoryId(body);
      if (categoryId) fields.category_id = categoryId;
    }
    if (!Object.keys(fields).length) throw new AppError('Nothing to update.', 400, 'NOTHING_TO_UPDATE');

    await updateById('menu_items', id, fields);
    logActivity({
      userId: actor.id,
      action: `Updated menu item ${existing.name}`,
      activityType: 'menu',
      entityType: 'menu_item',
      entityId: id,
      newValue: fields,
    });
    return MenuService.getItem(id, actor);
  },

  async setAvailability(id, body, actor) {
    const existing = await requireItem(id);
    const available = resolveAvailable(body);
    if (available === undefined) throw new AppError('Availability is required.', 422, 'VALIDATION_ERROR');
    await updateById('menu_items', id, { is_available: available });
    logActivity({
      userId: actor.id,
      action: `${available ? 'Enabled' : 'Disabled'} menu item ${existing.name}`,
      activityType: 'menu',
      entityType: 'menu_item',
      entityId: id,
    });
    return MenuService.getItem(id, actor);
  },

  async removeItem(id, actor) {
    const existing = await requireItem(id);
    try {
      await MenuModel.removeItem(id);
    } catch (err) {
      if (isForeignKeyError(err)) {
        throw new AppError(
          'This item appears in existing orders and cannot be deleted. Mark it unavailable instead.',
          409,
          'HAS_RELATED_RECORDS'
        );
      }
      throw err;
    }
    logActivity({ userId: actor.id, action: `Deleted menu item ${existing.name}`, activityType: 'menu', entityType: 'menu_item', entityId: id });
    return { message: 'Menu item deleted successfully.' };
  },

  async listModifiers(itemId, user) {
    await requireItem(itemId);
    const rows = await MenuModel.listModifiers(itemId, !isStaff(user));
    return rows.map(toModifierDto);
  },

  async createModifier(itemId, body, actor) {
    await requireItem(itemId);
    const id = await MenuModel.createModifier({
      itemId,
      name: body.name,
      priceModifier: body.priceModifier,
      isAvailable: resolveAvailable(body),
    });
    logActivity({ userId: actor.id, action: `Added modifier ${body.name}`, activityType: 'menu', entityType: 'menu_item_modifier', entityId: id });
    return toModifierDto(await MenuModel.findModifier(id));
  },

  async updateModifier(id, body, actor) {
    const existing = await MenuModel.findModifier(id);
    if (!existing) throw new AppError('Modifier not found.', 404, 'MODIFIER_NOT_FOUND');

    const fields = mapFields(body, { name: 'name', priceModifier: 'price_modifier' });
    const available = resolveAvailable(body);
    if (available !== undefined) fields.is_available = available;
    if (!Object.keys(fields).length) throw new AppError('Nothing to update.', 400, 'NOTHING_TO_UPDATE');

    await updateById('menu_item_modifiers', id, fields);
    logActivity({ userId: actor.id, action: `Updated modifier ${existing.name}`, activityType: 'menu', entityType: 'menu_item_modifier', entityId: id, newValue: fields });
    return toModifierDto(await MenuModel.findModifier(id));
  },

  async removeModifier(id, actor) {
    const existing = await MenuModel.findModifier(id);
    if (!existing) throw new AppError('Modifier not found.', 404, 'MODIFIER_NOT_FOUND');
    try {
      await MenuModel.removeModifier(id);
    } catch (err) {
      if (isForeignKeyError(err)) {
        throw new AppError('This modifier is used in orders. Mark it unavailable instead.', 409, 'HAS_RELATED_RECORDS');
      }
      throw err;
    }
    logActivity({ userId: actor.id, action: `Deleted modifier ${existing.name}`, activityType: 'menu', entityType: 'menu_item_modifier', entityId: id });
    return { message: 'Modifier deleted successfully.' };
  },

  async listFavorites(user) {
    const customerId = await requireCustomerId(user);
    const rows = await MenuModel.listFavorites(customerId);
    return rows.map(toItemDto);
  },

  async addFavorite(itemId, user) {
    const customerId = await requireCustomerId(user);
    await requireItem(itemId);
    await MenuModel.addFavorite(customerId, itemId);
    return toItemDto(await requireItem(itemId, customerId));
  },

  async removeFavorite(itemId, user) {
    const customerId = await requireCustomerId(user);
    await MenuModel.removeFavorite(customerId, itemId);
    return { message: 'Removed from favorites.' };
  },
};

module.exports = MenuService;