const SupplierModel = require('../models/supplierModel');
const AppError = require('../utils/AppError');
const { logActivity } = require('../utils/activityLog');
const { toOffset, pageMeta } = require('../utils/pagination');
const { mapFields, updateById, isForeignKeyError } = require('../utils/sql');

function toDto(row) {
  return {
    id: row.id,
    name: row.name,
    contact_person: row.contact_person,
    contactPerson: row.contact_person,
    contact: row.contact_person,
    phone: row.phone,
    email: row.email,
    address: row.address,
    payment_terms: row.payment_terms,
    paymentTerms: row.payment_terms,
    status: 'Active',
    ingredientCount: Number(row.ingredient_count),
    openOrders: Number(row.open_orders),
  };
}

const requireSupplier = async (id) => {
  const row = await SupplierModel.findById(id);
  if (!row) throw new AppError('Supplier not found.', 404, 'SUPPLIER_NOT_FOUND');
  return row;
};

const SupplierService = {
  toDto,

  async list({ search, page, limit }) {
    const { rows, total } = await SupplierModel.list({ search }, { limit, offset: toOffset(page, limit) });
    return { rows: rows.map(toDto), pagination: pageMeta(page, limit, total) };
  },

  async get(id) {
    return toDto(await requireSupplier(id));
  },

  async create(body, actor) {
    if (await SupplierModel.findByName(body.name)) throw new AppError('A supplier with this name already exists.', 409, 'SUPPLIER_EXISTS');
    const id = await SupplierModel.create(body);
    logActivity({ userId: actor.id, action: `Created supplier ${body.name}`, activityType: 'supplier', entityType: 'supplier', entityId: id });
    return SupplierService.get(id);
  },

  async update(id, body, actor) {
    const existing = await requireSupplier(id);
    const fields = mapFields(body, {
      contactPerson: 'contact_person',
      phone: 'phone',
      email: 'email',
      address: 'address',
      paymentTerms: 'payment_terms',
    });
    if (body.contact !== undefined && body.contactPerson === undefined) fields.contact_person = body.contact;
    if (body.name !== undefined) {
      if (await SupplierModel.findByName(body.name, id)) throw new AppError('A supplier with this name already exists.', 409, 'SUPPLIER_EXISTS');
      fields.name = body.name;
    }
    if (!Object.keys(fields).length) throw new AppError('Nothing to update.', 400, 'NOTHING_TO_UPDATE');

    await updateById('suppliers', id, fields);
    logActivity({ userId: actor.id, action: `Updated supplier ${existing.name}`, activityType: 'supplier', entityType: 'supplier', entityId: id, newValue: fields });
    return SupplierService.get(id);
  },

  async remove(id, actor) {
    const existing = await requireSupplier(id);
    if ((await SupplierModel.purchaseOrderCount(id)) > 0) {
      throw new AppError('This supplier has purchase orders and cannot be deleted.', 409, 'HAS_RELATED_RECORDS');
    }
    try {
      await SupplierModel.remove(id);
    } catch (err) {
      if (isForeignKeyError(err)) throw new AppError('This supplier is in use and cannot be deleted.', 409, 'HAS_RELATED_RECORDS');
      throw err;
    }
    logActivity({ userId: actor.id, action: `Deleted supplier ${existing.name}`, activityType: 'supplier', entityType: 'supplier', entityId: id });
    return { message: 'Supplier deleted successfully.' };
  },
};

module.exports = SupplierService;