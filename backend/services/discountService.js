const DiscountModel = require('../models/discountModel');
const CustomerModel = require('../models/customerModel');
const { calculateDiscount, assertDiscountUsable } = require('./pricingService');
const AppError = require('../utils/AppError');
const { logActivity } = require('../utils/activityLog');
const { toOffset, pageMeta } = require('../utils/pagination');
const { mapFields, updateById, isForeignKeyError } = require('../utils/sql');
const { todayString } = require('../utils/enums');
const { hasRole } = require('../middleware/roleMiddleware');
const { STAFF_ROLES } = require('../utils/constants');

function statusOf(row) {
  const today = todayString();
  if (!row.is_active) return 'Inactive';
  if (today < row.start_date) return 'Scheduled';
  if (today > row.end_date) return 'Expired';
  if (row.usage_limit && Number(row.used_count) >= Number(row.usage_limit)) return 'Used Up';
  return 'Active';
}

function toDto(row) {
  const isActive = Boolean(row.is_active);
  const firstOrderOnly = Boolean(row.first_order_only);
  const usageLimit = row.usage_limit === null || row.usage_limit === undefined ? null : Number(row.usage_limit);

  return {
    id: row.id,
    code: row.code,
    description: row.description,
    discount_type: row.discount_type,
    type: row.discount_type,
    discountType: row.discount_type,
    value: Number(row.value),
    min_order_amount: Number(row.min_order_amount),
    minOrderAmount: Number(row.min_order_amount),
    first_order_only: firstOrderOnly,
    firstOrderOnly,
    start_date: row.start_date,
    startDate: row.start_date,
    end_date: row.end_date,
    endDate: row.end_date,
    usage_limit: usageLimit,
    usageLimit,
    used_count: Number(row.used_count),
    usedCount: Number(row.used_count),
    remaining: usageLimit ? Math.max(0, usageLimit - Number(row.used_count)) : null,
    is_active: isActive,
    isActive,
    status: statusOf(row),
  };
}

const requireDiscount = async (id) => {
  const row = await DiscountModel.findById(id);
  if (!row) throw new AppError('Discount not found.', 404, 'DISCOUNT_NOT_FOUND');
  return row;
};

function assertRules({ discountType, value, startDate, endDate }) {
  if (discountType === 'percentage' && value > 100) {
    throw new AppError('A percentage discount cannot be more than 100.', 422, 'VALIDATION_ERROR');
  }
  if (endDate < startDate) throw new AppError('The end date cannot be before the start date.', 422, 'VALIDATION_ERROR');
}

const DiscountService = {
  toDto,

  async list({ search, active, page, limit }) {
    const filters = { search, active };
    const [rows, total] = await Promise.all([
      DiscountModel.list(filters, { limit, offset: toOffset(page, limit) }),
      DiscountModel.count(filters),
    ]);
    return { rows: rows.map(toDto), pagination: pageMeta(page, limit, total) };
  },

  async get(id) {
    return toDto(await requireDiscount(id));
  },

  async create(body, actor) {
    const code = body.code.toUpperCase();
    if (await DiscountModel.codeTakenByOther(code)) throw new AppError('This promo code already exists.', 409, 'CODE_EXISTS');
    assertRules(body);

    const id = await DiscountModel.create({ ...body, code });
    logActivity({ userId: actor.id, action: `Created promo code ${code}`, activityType: 'discount', entityType: 'discount', entityId: id });
    return DiscountService.get(id);
  },

  async update(id, body, actor) {
    const existing = await requireDiscount(id);

    const fields = mapFields(body, {
      description: 'description',
      discountType: 'discount_type',
      value: 'value',
      minOrderAmount: 'min_order_amount',
      firstOrderOnly: 'first_order_only',
      startDate: 'start_date',
      endDate: 'end_date',
      usageLimit: 'usage_limit',
      isActive: 'is_active',
    });
    if (body.code !== undefined) {
      const code = body.code.toUpperCase();
      if (await DiscountModel.codeTakenByOther(code, id)) throw new AppError('This promo code already exists.', 409, 'CODE_EXISTS');
      fields.code = code;
    }
    if (!Object.keys(fields).length) throw new AppError('Nothing to update.', 400, 'NOTHING_TO_UPDATE');

    assertRules({
      discountType: body.discountType || existing.discount_type,
      value: body.value === undefined ? Number(existing.value) : body.value,
      startDate: body.startDate || existing.start_date,
      endDate: body.endDate || existing.end_date,
    });

    await updateById('discounts', id, fields);
    logActivity({ userId: actor.id, action: `Updated promo code ${existing.code}`, activityType: 'discount', entityType: 'discount', entityId: id, newValue: fields });
    return DiscountService.get(id);
  },

  async remove(id, actor) {
    const existing = await requireDiscount(id);
    if (Number(existing.used_count) > 0) {
      throw new AppError('This promo code has been used. Deactivate it instead of deleting it.', 409, 'HAS_RELATED_RECORDS');
    }
    try {
      await DiscountModel.remove(id);
    } catch (err) {
      if (isForeignKeyError(err)) {
        throw new AppError('This promo code is linked to orders. Deactivate it instead.', 409, 'HAS_RELATED_RECORDS');
      }
      throw err;
    }
    logActivity({ userId: actor.id, action: `Deleted promo code ${existing.code}`, activityType: 'discount', entityType: 'discount', entityId: id });
    return { message: 'Promo code deleted successfully.' };
  },

  async validate({ code, subtotal, customerId }, user) {
    const discount = await DiscountModel.findByCode(code);

    let resolvedCustomerId = customerId || null;
    if (!hasRole(user, STAFF_ROLES)) {
      const customer = await CustomerModel.findByUserId(user.id);
      resolvedCustomerId = customer ? customer.id : null;
    }
    assertDiscountUsable(discount, {
      subtotal,
      customerId: resolvedCustomerId,
      hasPreviousOrders: resolvedCustomerId ? await DiscountModel.hasPreviousOrders(resolvedCustomerId) : false,
    });

    return {
      valid: true,
      code: discount.code,
      description: discount.description,
      discountType: discount.discount_type,
      value: Number(discount.value),
      discountAmount: calculateDiscount(discount, subtotal),
    };
  },
};

module.exports = DiscountService;