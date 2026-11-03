const CustomerModel = require('../models/customerModel');
const AppError = require('../utils/AppError');
const { withTransaction } = require('../utils/transaction');
const { logActivity } = require('../utils/activityLog');
const { toOffset, pageMeta } = require('../utils/pagination');
const { mapFields, updateById, isForeignKeyError } = require('../utils/sql');

const splitName = (fullName) => {
  const parts = String(fullName).trim().split(/\s+/);
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
};

function toDto(row) {
  const isVip = Boolean(row.is_vip);
  const totalOrders = Number(row.total_orders);
  const totalSpent = Number(row.total_spent);
  const name = `${row.first_name} ${row.last_name}`.trim();
  let status = 'Regular';
  if (isVip) status = 'VIP';
  else if (totalOrders <= 1) status = 'New';

  return {
    id: row.id,
    user_id: row.user_id,
    userId: row.user_id,
    first_name: row.first_name,
    last_name: row.last_name,
    firstName: row.first_name,
    lastName: row.last_name,
    name,
    full_name: name,
    email: row.email,
    phone: row.phone,
    loyalty_points: row.loyalty_points,
    loyaltyPoints: row.loyalty_points,
    total_orders: totalOrders,
    visits: totalOrders,
    total_spent: totalSpent,
    totalSpent,
    is_vip: isVip,
    isVip,
    status,
    registered_at: row.registered_at,
    registeredAt: row.registered_at,
    last_visit: row.last_visit || null,
    lastVisit: row.last_visit || null,
  };
}

function toAddressDto(row) {
  const isDefault = Boolean(row.is_default);
  return {
    id: row.id,
    customer_id: row.customer_id,
    label: row.label,
    address_line: row.address_line,
    addressLine: row.address_line,
    city: row.city,
    phone: row.phone,
    is_default: isDefault,
    isDefault,
    created_at: row.created_at,
  };
}

const resolveVip = (body) => {
  if (body.isVip !== undefined) return body.isVip;
  if (body.status !== undefined) return body.status === 'vip';
  return undefined;
};

const requireCustomer = async (id) => {
  const row = await CustomerModel.findById(id);
  if (!row) throw new AppError('Customer not found.', 404, 'CUSTOMER_NOT_FOUND');
  return row;
};

const requireOwnCustomer = async (userId) => {
  const row = await CustomerModel.findByUserId(userId);
  if (!row) throw new AppError('No customer profile is linked to this account.', 404, 'CUSTOMER_NOT_FOUND');
  return row;
};

const CustomerService = {
  toDto,

  async list({ search, status, page, limit }) {
    const filters = { search, status };
    const [rows, total] = await Promise.all([
      CustomerModel.list(filters, { limit, offset: toOffset(page, limit) }),
      CustomerModel.count(filters),
    ]);
    return { rows: rows.map(toDto), pagination: pageMeta(page, limit, total) };
  },

  async get(id) {
    const row = await requireCustomer(id);
    const [addresses, recentOrders] = await Promise.all([
      CustomerModel.listAddresses(id),
      CustomerModel.recentOrders(id),
    ]);
    return {
      ...toDto(row),
      addresses: addresses.map(toAddressDto),
      recentOrders: recentOrders.map((order) => ({ ...order, total_amount: Number(order.total_amount) })),
    };
  },

  async getMine(userId) {
    const row = await requireOwnCustomer(userId);
    return CustomerService.get(row.id);
  },

  async create(body, actor) {
    const full = body.fullName || body.name;
    const names = body.firstName ? { firstName: body.firstName, lastName: body.lastName || '' } : full ? splitName(full) : null;
    if (!names) throw new AppError('Customer name is required.', 422, 'VALIDATION_ERROR');

    const id = await CustomerModel.create({
      firstName: names.firstName,
      lastName: names.lastName,
      email: body.email,
      phone: body.phone,
      isVip: resolveVip(body),
    });

    logActivity({
      userId: actor.id,
      action: `Created customer ${names.firstName} ${names.lastName}`.trim(),
      activityType: 'customer',
      entityType: 'customer',
      entityId: id,
    });
    return CustomerService.get(id);
  },

  async update(id, body, actor) {
    await requireCustomer(id);

    const fields = mapFields(body, { email: 'email', phone: 'phone' });
    const full = body.fullName || body.name;
    if (body.firstName !== undefined) {
      fields.first_name = body.firstName;
      if (body.lastName !== undefined) fields.last_name = body.lastName;
    } else if (full) {
      const names = splitName(full);
      fields.first_name = names.firstName;
      fields.last_name = names.lastName;
    } else if (body.lastName !== undefined) {
      fields.last_name = body.lastName;
    }

    const vip = resolveVip(body);
    if (vip !== undefined) fields.is_vip = vip;
    if (!Object.keys(fields).length) throw new AppError('Nothing to update.', 400, 'NOTHING_TO_UPDATE');

    await updateById('customers', id, fields);
    logActivity({
      userId: actor.id,
      action: `Updated customer ${id}`,
      activityType: 'customer',
      entityType: 'customer',
      entityId: id,
      newValue: fields,
    });
    return CustomerService.get(id);
  },

  async remove(id, actor) {
    const existing = await requireCustomer(id);
    try {
      await CustomerModel.remove(id);
    } catch (err) {
      if (isForeignKeyError(err)) {
        throw new AppError('This customer has related records and cannot be deleted.', 409, 'HAS_RELATED_RECORDS');
      }
      throw err;
    }
    logActivity({
      userId: actor.id,
      action: `Deleted customer ${existing.first_name} ${existing.last_name}`.trim(),
      activityType: 'customer',
      entityType: 'customer',
      entityId: id,
    });
    return { message: 'Customer deleted successfully.' };
  },

  async adjustLoyalty(id, { points, reason }, actor) {
    await requireCustomer(id);
    await CustomerModel.adjustLoyalty(id, points);
    logActivity({
      userId: actor.id,
      action: `Adjusted loyalty points by ${points}${reason ? ` (${reason})` : ''}`,
      activityType: 'customer',
      entityType: 'customer',
      entityId: id,
      newValue: { points, reason: reason || null },
    });
    return CustomerService.get(id);
  },

  async listAddresses(userId) {
    const customer = await requireOwnCustomer(userId);
    const rows = await CustomerModel.listAddresses(customer.id);
    return rows.map(toAddressDto);
  },

  async createAddress(userId, body) {
    const customer = await requireOwnCustomer(userId);
    const id = await withTransaction(async (conn) => {
      const existing = await CustomerModel.countAddresses(customer.id, conn);
      const makeDefault = body.isDefault === true || existing === 0;
      if (makeDefault) await CustomerModel.clearDefaultAddress(customer.id, conn);
      return CustomerModel.createAddress({ customerId: customer.id, ...body, isDefault: makeDefault }, conn);
    });
    return toAddressDto(await CustomerModel.findAddress(id, customer.id));
  },

  async updateAddress(userId, id, body) {
    const customer = await requireOwnCustomer(userId);
    const address = await CustomerModel.findAddress(id, customer.id);
    if (!address) throw new AppError('Address not found.', 404, 'ADDRESS_NOT_FOUND');

    const fields = mapFields(body, { label: 'label', addressLine: 'address_line', city: 'city', phone: 'phone' });
    if (body.isDefault !== undefined) fields.is_default = body.isDefault;
    if (!Object.keys(fields).length) throw new AppError('Nothing to update.', 400, 'NOTHING_TO_UPDATE');

    await withTransaction(async (conn) => {
      if (body.isDefault === true) await CustomerModel.clearDefaultAddress(customer.id, conn);
      await updateById('customer_addresses', id, fields, conn);
    });
    return toAddressDto(await CustomerModel.findAddress(id, customer.id));
  },

  async removeAddress(userId, id) {
    const customer = await requireOwnCustomer(userId);
    const address = await CustomerModel.findAddress(id, customer.id);
    if (!address) throw new AppError('Address not found.', 404, 'ADDRESS_NOT_FOUND');

    await withTransaction(async (conn) => {
      await CustomerModel.removeAddress(id, conn);
      if (address.is_default) {
        const nextId = await CustomerModel.latestAddressId(customer.id, conn);
        if (nextId) await updateById('customer_addresses', nextId, { is_default: true }, conn);
      }
    });
    return { message: 'Address deleted successfully.' };
  },
};

module.exports = CustomerService;