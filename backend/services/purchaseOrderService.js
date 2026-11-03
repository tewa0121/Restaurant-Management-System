const crypto = require('crypto');
const PurchaseOrderModel = require('../models/purchaseOrderModel');
const InventoryModel = require('../models/inventoryModel');
const SupplierModel = require('../models/supplierModel');
const EmployeeModel = require('../models/employeeModel');
const InventoryService = require('./inventoryService');
const { round2 } = require('./pricingService');
const AppError = require('../utils/AppError');
const { withTransaction } = require('../utils/transaction');
const { logActivity } = require('../utils/activityLog');
const { toOffset, pageMeta } = require('../utils/pagination');
const { updateById } = require('../utils/sql');
const { normalizeEnum, titleCase } = require('../utils/enums');
const { PURCHASE_ORDER_STATUSES } = require('../utils/constants');

function toItemDto(row) {
  const ordered = Number(row.quantity_ordered);
  const received = Number(row.quantity_received);
  const unitCost = Number(row.unit_cost);
  return {
    id: row.id,
    ingredient_id: row.ingredient_id,
    ingredientId: row.ingredient_id,
    ingredient_name: row.ingredient_name,
    name: row.ingredient_name,
    unit: row.unit,
    quantity_ordered: ordered,
    quantity: ordered,
    quantity_received: received,
    remaining: Math.max(0, round2(ordered - received)),
    unit_cost: unitCost,
    unitCost,
    lineTotal: round2(ordered * unitCost),
  };
}

function toDto(row, items) {
  const dto = {
    id: row.id,
    supplier_id: row.supplier_id,
    supplierId: row.supplier_id,
    supplier_name: row.supplier_name,
    supplier: row.supplier_name,
    po_number: row.po_number,
    poNumber: row.po_number,
    number: `#${row.po_number}`,
    order_date: row.order_date,
    orderDate: row.order_date,
    expected_delivery: row.expected_delivery,
    expectedDelivery: row.expected_delivery,
    status: row.status,
    statusLabel: titleCase(row.status),
    total_amount: Number(row.total_amount),
    total: Number(row.total_amount),
    item_count: Number(row.item_count),
    received_by: row.received_by,
    received_by_name: row.received_by_name && row.received_by_name.trim() ? row.received_by_name.trim() : null,
    created_at: row.created_at,
  };
  if (items) dto.items = items.map(toItemDto);
  return dto;
}

const requirePo = async (id) => {
  const row = await PurchaseOrderModel.findById(id);
  if (!row) throw new AppError('Purchase order not found.', 404, 'PURCHASE_ORDER_NOT_FOUND');
  return row;
};

async function buildLines(items) {
  const ids = items.map((item) => item.ingredientId);
  if (new Set(ids).size !== ids.length) throw new AppError('An ingredient can only appear once per purchase order.', 422, 'VALIDATION_ERROR');
  const found = await InventoryModel.findManyByIds(ids);
  const byId = new Map(found.map((row) => [Number(row.id), row]));

  return items.map((item) => {
    const ingredient = byId.get(Number(item.ingredientId));
    if (!ingredient) throw new AppError(`Ingredient ${item.ingredientId} was not found.`, 422, 'INGREDIENT_NOT_FOUND');
    const unitCost = item.unitCost === undefined ? Number(ingredient.cost_per_unit) : item.unitCost;
    return { ingredientId: ingredient.id, quantity: item.quantity, unitCost };
  });
}

const totalOf = (lines) => round2(lines.reduce((sum, line) => sum + line.quantity * line.unitCost, 0));

const PurchaseOrderService = {
  async list({ status, supplierId, from, to, search, page, limit }) {
    const { rows, total } = await PurchaseOrderModel.list(
      { status: status ? normalizeEnum(status, PURCHASE_ORDER_STATUSES, 'Status') : undefined, supplierId, from, to, search },
      { limit, offset: toOffset(page, limit) }
    );
    return { rows: rows.map((row) => toDto(row)), pagination: pageMeta(page, limit, total) };
  },

  async get(id) {
    const row = await requirePo(id);
    return toDto(row, await PurchaseOrderModel.items(id));
  },

  async create(body, actor) {
    if (!(await SupplierModel.findById(body.supplierId))) throw new AppError('Supplier not found.', 422, 'SUPPLIER_NOT_FOUND');
    const lines = await buildLines(body.items);

    const id = await withTransaction(async (conn) => {
      const poId = await PurchaseOrderModel.insert(
        {
          supplierId: body.supplierId,
          poNumber: `T${crypto.randomUUID().replace(/-/g, '').slice(0, 18)}`,
          orderDate: body.orderDate,
          expectedDelivery: body.expectedDelivery,
          status: body.send ? 'sent' : 'draft',
          total: totalOf(lines),
        },
        conn
      );
      await PurchaseOrderModel.setNumber(poId, `PO-${String(poId).padStart(4, '0')}`, conn);
      for (const line of lines) await PurchaseOrderModel.insertItem({ poId, ...line }, conn);
      return poId;
    });

    logActivity({ userId: actor.id, action: `Created purchase order ${id}`, activityType: 'purchase', entityType: 'purchase_order', entityId: id });
    return PurchaseOrderService.get(id);
  },

  async update(id, body, actor) {
    const existing = await requirePo(id);
    if (existing.status !== 'draft') throw new AppError('Only a draft purchase order can be edited.', 409, 'INVALID_STATE');
    if (body.supplierId && !(await SupplierModel.findById(body.supplierId))) throw new AppError('Supplier not found.', 422, 'SUPPLIER_NOT_FOUND');

    const lines = body.items ? await buildLines(body.items) : null;
    await withTransaction(async (conn) => {
      let total = Number(existing.total_amount);
      if (lines) {
        await PurchaseOrderModel.deleteItems(id, conn);
        for (const line of lines) await PurchaseOrderModel.insertItem({ poId: id, ...line }, conn);
        total = totalOf(lines);
      }
      await PurchaseOrderModel.updateHeader(
        id,
        {
          supplierId: body.supplierId,
          orderDate: body.orderDate,
          expectedDelivery: body.expectedDelivery === undefined ? existing.expected_delivery : body.expectedDelivery,
          total,
        },
        conn
      );
    });

    logActivity({ userId: actor.id, action: `Updated purchase order ${existing.po_number}`, activityType: 'purchase', entityType: 'purchase_order', entityId: id });
    return PurchaseOrderService.get(id);
  },

  async send(id, actor) {
    const existing = await requirePo(id);
    if (existing.status !== 'draft') throw new AppError('Only a draft purchase order can be sent.', 409, 'INVALID_STATE');
    if (!Number(existing.item_count)) throw new AppError('Add at least one item before sending.', 409, 'INVALID_STATE');
    await PurchaseOrderModel.setStatus(id, 'sent');
    logActivity({ userId: actor.id, action: `Sent purchase order ${existing.po_number}`, activityType: 'purchase', entityType: 'purchase_order', entityId: id });
    return PurchaseOrderService.get(id);
  },

  async cancel(id, actor) {
    const existing = await requirePo(id);
    if (!['draft', 'sent'].includes(existing.status)) throw new AppError(`A ${existing.status} purchase order cannot be cancelled.`, 409, 'INVALID_STATE');
    await PurchaseOrderModel.setStatus(id, 'cancelled');
    logActivity({ userId: actor.id, action: `Cancelled purchase order ${existing.po_number}`, activityType: 'purchase', entityType: 'purchase_order', entityId: id });
    return PurchaseOrderService.get(id);
  },

  async remove(id, actor) {
    const existing = await requirePo(id);
    if (!['draft', 'cancelled'].includes(existing.status)) {
      throw new AppError('Only a draft or cancelled purchase order can be deleted.', 409, 'INVALID_STATE');
    }
    await PurchaseOrderModel.remove(id);
    logActivity({ userId: actor.id, action: `Deleted purchase order ${existing.po_number}`, activityType: 'purchase', entityType: 'purchase_order', entityId: id });
    return { message: 'Purchase order deleted successfully.' };
  },

  async receive(id, body, actor) {
    const employee = await EmployeeModel.findByUserId(actor.id);
    const events = [];

    await withTransaction(async (conn) => {
      const locked = await PurchaseOrderModel.lockById(id, conn);
      if (!locked) throw new AppError('Purchase order not found.', 404, 'PURCHASE_ORDER_NOT_FOUND');
      if (locked.status !== 'sent') {
        throw new AppError(locked.status === 'draft' ? 'Send the purchase order before receiving goods.' : `This purchase order is already ${locked.status}.`, 409, 'INVALID_STATE');
      }

      const items = await PurchaseOrderModel.items(id, conn);
      const requested = body.receiveAll
        ? items.map((item) => ({ itemId: item.id, quantityReceived: round2(Number(item.quantity_ordered) - Number(item.quantity_received)) }))
        : body.items || [];
      if (!requested.length) throw new AppError('Nothing to receive.', 422, 'VALIDATION_ERROR');

      for (const line of requested) {
        const item = items.find((entry) => Number(entry.id) === Number(line.itemId));
        if (!item) throw new AppError(`Item ${line.itemId} does not belong to this purchase order.`, 422, 'VALIDATION_ERROR');
        if (line.quantityReceived <= 0) continue;

        const remaining = round2(Number(item.quantity_ordered) - Number(item.quantity_received));
        if (line.quantityReceived > remaining + 0.004) {
          throw new AppError(`Cannot receive more than the ${remaining} ${item.unit} still due for ${item.ingredient_name}.`, 422, 'AMOUNT_EXCEEDS_BALANCE');
        }

        events.push(
          await InventoryService.applyMovement(conn, {
            ingredientId: item.ingredient_id,
            type: 'purchase',
            quantity: line.quantityReceived,
            referenceId: locked.po_number,
            note: `Received against ${locked.po_number}`,
            createdBy: employee ? employee.id : null,
          })
        );
        await PurchaseOrderModel.addReceived(item.id, line.quantityReceived, conn);
        await updateById('ingredients', item.ingredient_id, { cost_per_unit: item.unit_cost }, conn);
      }

      const after = await PurchaseOrderModel.items(id, conn);
      if (after.every((item) => Number(item.quantity_received) >= Number(item.quantity_ordered) - 0.004)) {
        await PurchaseOrderModel.markReceived(id, employee ? employee.id : null, conn);
      }
    });

    logActivity({ userId: actor.id, action: `Received goods for purchase order ${id}`, activityType: 'purchase', entityType: 'purchase_order', entityId: id });
    return PurchaseOrderService.get(id);
  },

  async suggestions() {
    const rows = await InventoryModel.list({ status: 'attention' }, { limit: 500, offset: 0 });
    const groups = new Map();

    rows.map(InventoryService.toIngredientDto).forEach((ingredient) => {
      const key = ingredient.supplier_id || 0;
      const group = groups.get(key) || { supplierId: ingredient.supplier_id, supplierName: ingredient.supplier_name || 'No supplier', items: [] };
      group.items.push({
        ingredientId: ingredient.id,
        name: ingredient.name,
        unit: ingredient.unit,
        currentStock: ingredient.current_stock,
        minStockLevel: ingredient.min_stock_level,
        suggestedQuantity: ingredient.suggestedQuantity,
        unitCost: ingredient.cost_per_unit,
        estimatedCost: round2(ingredient.suggestedQuantity * ingredient.cost_per_unit),
      });
      groups.set(key, group);
    });

    return [...groups.values()].map((group) => ({
      ...group,
      estimatedTotal: round2(group.items.reduce((sum, item) => sum + item.estimatedCost, 0)),
    }));
  },
};

module.exports = PurchaseOrderService;