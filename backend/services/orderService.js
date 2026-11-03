const crypto = require('crypto');
const OrderModel = require('../models/orderModel');
const CustomerModel = require('../models/customerModel');
const TableModel = require('../models/tableModel');
const EmployeeModel = require('../models/employeeModel');
const DiscountModel = require('../models/discountModel');
const SettingsModel = require('../models/settingsModel');
const ReservationModel = require('../models/reservationModel');
const TableService = require('./tableService');
const { round2, calculateDiscount, assertDiscountUsable, calculateTotals } = require('./pricingService');
const AppError = require('../utils/AppError');
const { withTransaction } = require('../utils/transaction');
const { logActivity } = require('../utils/activityLog');
const { notifyUsers, notifyRoles } = require('../utils/notify');
const InventoryService = require('./inventoryService');
const { toOffset, pageMeta } = require('../utils/pagination');
const { normalizeEnum, titleCase } = require('../utils/enums');
const { hasRole } = require('../middleware/roleMiddleware');
const { ROLES, STAFF_ROLES, ORDER_TYPES, ORDER_STATUSES, ITEM_STATUSES } = require('../utils/constants');

const CUSTOMER_ORDER_TYPES = ['takeaway', 'delivery', 'online'];

const TRANSITIONS = {
  pending: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['served', 'completed', 'preparing', 'cancelled'],
  served: ['completed'],
  completed: [],
  cancelled: [],
};

const TRANSITION_ROLES = {
  preparing: [ROLES.KITCHEN, ROLES.MANAGER, ROLES.ADMIN],
  ready: [ROLES.KITCHEN, ROLES.MANAGER, ROLES.ADMIN],
  served: [ROLES.WAITER, ROLES.MANAGER, ROLES.ADMIN],
  completed: [ROLES.CASHIER, ROLES.WAITER, ROLES.MANAGER, ROLES.ADMIN],
  cancelled: [ROLES.WAITER, ROLES.CASHIER, ROLES.MANAGER, ROLES.ADMIN],
};

const isStaff = (user) => hasRole(user, STAFF_ROLES);

function normalizeOrderType(value) {
  const key = String(value || '').trim().toLowerCase().replace(/[\s-]+/g, '_');
  const aliases = { dinein: 'dine_in', eat_in: 'dine_in', pickup: 'takeaway', pick_up: 'takeaway', take_away: 'takeaway' };
  const type = aliases[key] || key;
  if (!ORDER_TYPES.includes(type)) {
    throw new AppError(`Order type must be one of: ${ORDER_TYPES.join(', ')}`, 422, 'VALIDATION_ERROR');
  }
  return type;
}

const cleanName = (value) => (value && value.trim() ? value.trim() : null);

function toItemDto(item, modifiers) {
  const modifierTotal = modifiers.reduce((sum, modifier) => sum + Number(modifier.subtotal), 0);
  return {
    id: item.id,
    order_id: item.order_id,
    menu_item_id: item.menu_item_id,
    menuItemId: item.menu_item_id,
    name: item.item_name,
    category: item.category_name,
    quantity: item.quantity,
    qty: item.quantity,
    unit_price: Number(item.unit_price),
    price: Number(item.unit_price),
    subtotal: Number(item.subtotal),
    lineTotal: round2(Number(item.subtotal) + modifierTotal),
    special_instructions: item.special_instructions,
    specialInstructions: item.special_instructions,
    notes: item.special_instructions,
    item_status: item.item_status,
    status: item.item_status,
    preparation_progress: item.preparation_progress,
    progress: item.preparation_progress,
    modifiers: modifiers.map((modifier) => ({
      id: modifier.id,
      modifier_id: modifier.modifier_id,
      name: modifier.name,
      quantity: modifier.quantity,
      unit_price: Number(modifier.unit_price),
      subtotal: Number(modifier.subtotal),
    })),
  };
}

function toDto(row, { tables, items, delivery }) {
  const customerName = cleanName(row.customer_name);
  const waiterName = cleanName(row.waiter_name);
  const tableList = tables.map((table) => ({
    id: table.id,
    table_number: table.table_number,
    name: `Table ${table.table_number}`,
    section: table.section,
  }));
  const deliveryFee = delivery ? Number(delivery.delivery_fee) : 0;

  return {
    id: row.id,
    order_number: row.order_number,
    orderNumber: row.order_number,
    number: `#${row.order_number}`,
    restaurant_id: row.restaurant_id,
    customer_id: row.customer_id,
    customerId: row.customer_id,
    customer_name: customerName,
    customerName,
    customer_phone: row.customer_phone,
    waiter_id: row.waiter_id,
    waiterId: row.waiter_id,
    waiter_name: waiterName,
    waiterName,
    order_type: row.order_type,
    orderType: row.order_type,
    type: row.order_type,
    status: row.status,
    statusLabel: titleCase(row.status),
    subtotal: Number(row.subtotal),
    tax_amount: Number(row.tax_amount),
    tax: Number(row.tax_amount),
    discount_amount: Number(row.discount_amount),
    discount: Number(row.discount_amount),
    delivery_fee: deliveryFee,
    deliveryFee,
    total_amount: Number(row.total_amount),
    total: Number(row.total_amount),
    notes: row.notes,
    ordered_at: row.ordered_at,
    orderedAt: row.ordered_at,
    updated_at: row.updated_at,
    elapsed_minutes: Math.max(0, Number(row.elapsed_minutes) || 0),
    elapsedMinutes: Math.max(0, Number(row.elapsed_minutes) || 0),
    priority: row.priority === null || row.priority === undefined ? 0 : Number(row.priority),
    cooking_started_at: row.cooking_started_at || null,
    cooking_finished_at: row.cooking_finished_at || null,
    tables: tableList,
    tableIds: tableList.map((table) => table.id),
    tableNames: tableList.map((table) => table.name).join(', '),
    table: tableList.length ? tableList[0].name : null,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    items,
    delivery: delivery
      ? {
          address: delivery.delivery_address,
          phone: delivery.delivery_contact_phone,
          instructions: delivery.delivery_instructions,
          driver_id: delivery.assigned_driver_id,
          estimated_time: delivery.estimated_time,
          delivered_at: delivery.actual_delivered_at,
          fee: deliveryFee,
        }
      : null,
  };
}

async function hydrate(rows) {
  const ids = rows.map((row) => row.id);
  const [tables, items, deliveries] = await Promise.all([
    OrderModel.tablesForOrders(ids),
    OrderModel.itemsForOrders(ids),
    OrderModel.deliveriesForOrders(ids),
  ]);
  const modifiers = await OrderModel.modifiersForItems(items.map((item) => item.id));

  return rows.map((row) =>
    toDto(row, {
      tables: tables.filter((table) => table.order_id === row.id),
      items: items
        .filter((item) => item.order_id === row.id)
        .map((item) => toItemDto(item, modifiers.filter((modifier) => modifier.order_item_id === item.id))),
      delivery: deliveries.find((entry) => entry.order_id === row.id) || null,
    })
  );
}

const requireOrder = async (id, conn) => {
  const row = await OrderModel.findById(id, conn);
  if (!row) throw new AppError('Order not found.', 404, 'ORDER_NOT_FOUND');
  return row;
};

async function requireOwnCustomer(user) {
  const customer = await CustomerModel.findByUserId(user.id);
  if (!customer) throw new AppError('No customer profile is linked to this account.', 404, 'CUSTOMER_NOT_FOUND');
  return customer;
}

async function assertAccess(row, user) {
  if (isStaff(user)) return;
  const customer = await requireOwnCustomer(user);
  if (row.customer_id !== customer.id) throw new AppError('Order not found.', 404, 'ORDER_NOT_FOUND');
}

function parseStatuses(value) {
  if (!value) return undefined;
  return String(value)
    .split(',')
    .map((part) => normalizeEnum(part, ORDER_STATUSES, 'Status'));
}

async function buildLines(items, conn) {
  const normalized = items.map((entry) => ({
    menuItemId: entry.menuItemId || entry.id,
    quantity: entry.quantity || entry.qty || 1,
    note: entry.specialInstructions || entry.notes,
    modifierIds: entry.modifierIds || [],
  }));
  if (normalized.some((entry) => !entry.menuItemId)) {
    throw new AppError('Each item needs a menuItemId.', 422, 'VALIDATION_ERROR');
  }

  const menuRows = await OrderModel.findMenuItems([...new Set(normalized.map((entry) => entry.menuItemId))], conn);
  const menuById = new Map(menuRows.map((row) => [Number(row.id), row]));
  const modifierRows = await OrderModel.findModifiers([...new Set(normalized.flatMap((entry) => entry.modifierIds))], conn);
  const modifierById = new Map(modifierRows.map((row) => [Number(row.id), row]));

  return normalized.map((entry) => {
    const menu = menuById.get(Number(entry.menuItemId));
    if (!menu) throw new AppError(`Menu item ${entry.menuItemId} was not found.`, 422, 'MENU_ITEM_NOT_FOUND');
    if (!menu.is_available || !menu.category_active) {
      throw new AppError(`"${menu.name}" is not available right now.`, 422, 'MENU_ITEM_UNAVAILABLE');
    }

    const modifiers = [...new Set(entry.modifierIds)].map((modifierId) => {
      const modifier = modifierById.get(Number(modifierId));
      if (!modifier || Number(modifier.menu_item_id) !== Number(menu.id)) {
        throw new AppError(`Modifier ${modifierId} is not valid for "${menu.name}".`, 422, 'MODIFIER_INVALID');
      }
      if (!modifier.is_available) throw new AppError(`Modifier "${modifier.name}" is not available.`, 422, 'MODIFIER_UNAVAILABLE');
      return { id: Number(modifier.id), name: modifier.name, price: Number(modifier.price_modifier) };
    });

    const unitPrice = Number(menu.price);
    const modifierTotal = modifiers.reduce((sum, modifier) => sum + modifier.price, 0) * entry.quantity;
    return {
      menuItemId: Number(menu.id),
      name: menu.name,
      quantity: entry.quantity,
      unitPrice,
      note: entry.note,
      modifiers,
      lineTotal: round2(unitPrice * entry.quantity + modifierTotal),
    };
  });
}

async function priceLines({ lines, orderType, discountCode, customerId }, conn) {
  const subtotal = round2(lines.reduce((sum, line) => sum + line.lineTotal, 0));
  const taxRate = await SettingsModel.getNumber('tax_rate', 15, conn);
  const configuredFee = await SettingsModel.getNumber('delivery_fee', 0, conn);

  let discount = null;
  if (discountCode) {
    discount = await DiscountModel.findByCode(discountCode, conn);
    assertDiscountUsable(discount, {
      subtotal,
      customerId,
      hasPreviousOrders: customerId ? await DiscountModel.hasPreviousOrders(customerId, conn) : false,
    });
  }

  const totals = calculateTotals({
    subtotal,
    discountAmount: calculateDiscount(discount, subtotal),
    taxRate,
    deliveryFee: orderType === 'delivery' ? configuredFee : 0,
  });
  return { ...totals, discount, taxRate };
}

async function recomputeTotals(conn, orderId) {
  const order = await requireOrder(orderId, conn);
  const subtotal = round2(await OrderModel.sums(orderId, conn));
  const discount = order.discount_id ? await DiscountModel.findById(order.discount_id, conn) : null;
  const taxRate = await SettingsModel.getNumber('tax_rate', 15, conn);
  const totals = calculateTotals({
    subtotal,
    discountAmount: calculateDiscount(discount, subtotal),
    taxRate,
    deliveryFee: await OrderModel.deliveryFee(orderId, conn),
  });
  await OrderModel.updateTotals(
    orderId,
    { subtotal: totals.subtotal, taxAmount: totals.taxAmount, discountAmount: totals.discountAmount, total: totals.total },
    conn
  );
}

async function insertLines(conn, orderId, lines) {
  for (const line of lines) {
    const itemId = await OrderModel.insertItem(
      { orderId, menuItemId: line.menuItemId, quantity: line.quantity, unitPrice: line.unitPrice, specialInstructions: line.note },
      conn
    );
    for (const modifier of line.modifiers) {
      await OrderModel.insertModifier(
        { orderItemId: itemId, modifierId: modifier.id, quantity: line.quantity, unitPrice: modifier.price },
        conn
      );
    }
  }
}

async function resolveCustomerForStaff(conn, body) {
  if (body.customerId) {
    const customer = await CustomerModel.findById(body.customerId, conn);
    if (!customer) throw new AppError('Customer not found.', 422, 'CUSTOMER_NOT_FOUND');
    return customer.id;
  }
  const name = body.customerName;
  if (!name) return null;

  if (body.customerPhone) {
    const existing = await ReservationModel.findCustomerByPhone(body.customerPhone, conn);
    if (existing) return existing.id;
  }
  const parts = String(name).trim().split(/\s+/);
  return CustomerModel.create(
    { firstName: parts[0], lastName: parts.slice(1).join(' '), email: body.customerEmail, phone: body.customerPhone },
    conn
  );
}

async function resolveTableIds(body) {
  let tableIds = Array.isArray(body.tableIds) && body.tableIds.length ? body.tableIds : body.tableId ? [body.tableId] : [];
  if (!tableIds.length && body.table) {
    const found = await TableModel.findByNumber(TableService.normalizeTableNumber(body.table));
    if (!found) throw new AppError(`Table "${body.table}" was not found.`, 422, 'TABLE_NOT_FOUND');
    tableIds = [found.id];
  }
  if (!tableIds.length) throw new AppError('Select at least one table for a dine-in order.', 422, 'VALIDATION_ERROR');
  return [...new Set(tableIds)];
}

async function resolveDelivery(body, customer) {
  let address = body.deliveryAddress;
  let phone = body.deliveryPhone;

  if (body.addressId && customer) {
    const saved = await CustomerModel.findAddress(body.addressId, customer.id);
    if (!saved) throw new AppError('Delivery address not found.', 422, 'ADDRESS_NOT_FOUND');
    address = address || `${saved.address_line}${saved.city ? `, ${saved.city}` : ''}`;
    phone = phone || saved.phone;
  }
  phone = phone || (customer ? customer.phone : null);

  if (!address || !phone) throw new AppError('Delivery address and contact phone are required.', 422, 'VALIDATION_ERROR');
  return { address, phone, instructions: body.deliveryInstructions };
}

async function syncStatusFromItems(conn, orderId) {
  const order = await requireOrder(orderId, conn);
  if (!['pending', 'preparing', 'ready'].includes(order.status)) return null;

  const counts = await OrderModel.itemStatusCounts(orderId, conn);
  const total = counts.pending + counts.preparing + counts.ready;
  if (!total) return null;

  if (counts.ready === total) {
    if (order.status === 'ready') return null;
        await OrderModel.setStatus(orderId, 'ready', conn);
    await OrderModel.finishCooking(orderId, conn);
    await InventoryService.consumeForOrder(conn, orderId);
    return 'ready';
  }
  if ((counts.preparing > 0 || counts.ready > 0) && order.status !== 'preparing') {
       await OrderModel.setStatus(orderId, 'preparing', conn);
    await OrderModel.startCooking(orderId, conn);
    await InventoryService.consumeForOrder(conn, orderId);
    return 'preparing';
  }
  return null;
}

async function applyStatus(conn, order, next) {
  if (next === 'preparing') {
    await OrderModel.setItemsStatusFrom(order.id, ['pending', 'ready'], 'preparing', 0, conn);
    await OrderModel.startCooking(order.id, conn);
  } else if (next === 'ready') {
    await OrderModel.setItemsStatusFrom(order.id, ['pending', 'preparing'], 'ready', 100, conn);
    await OrderModel.finishCooking(order.id, conn);
  } else if (next === 'completed' && order.customer_id) {
    await OrderModel.bumpCustomerStats(order.customer_id, Number(order.total_amount), conn);
  } else if (next === 'cancelled' && order.discount_id) {
    await DiscountModel.adjustUsed(order.discount_id, -1, conn);
  }
   if (['preparing', 'ready', 'served', 'completed'].includes(next)) await InventoryService.consumeForOrder(conn, order.id);
  await OrderModel.setStatus(order.id, next, conn);
}

async function notifyReady(order) {
  const message = `Order ${order.order_number} is ready to be served.`;
  if (order.waiter_id) {
    const waiter = await EmployeeModel.findById(order.waiter_id);
    if (waiter && waiter.user_id) {
      await notifyUsers([waiter.user_id], { title: 'Order ready', message, type: 'order' });
      return;
    }
  }
  await notifyRoles([ROLES.WAITER], { title: 'Order ready', message, type: 'order' });
}

const STEP_LABELS = {
  pending: 'Order Placed',
  preparing: 'Preparing',
  ready: 'Ready',
  served: 'Served',
  completed: 'Completed',
};

const OrderService = {
  toDto,
  hydrate,

  async preview(body, user) {
    const staff = isStaff(user);
    const orderType = normalizeOrderType(body.orderType || body.type || (staff ? 'dine_in' : 'online'));
    const customer = staff ? null : await requireOwnCustomer(user);
    const customerId = staff ? body.customerId : customer.id;

    const lines = await buildLines(body.items);
    const pricing = await priceLines({ lines, orderType, discountCode: body.discountCode || body.promoCode, customerId });

    return {
      orderType,
      items: lines.map((line) => ({
        menuItemId: line.menuItemId,
        name: line.name,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        modifiers: line.modifiers,
        lineTotal: line.lineTotal,
      })),
      subtotal: pricing.subtotal,
      discount: pricing.discountAmount,
      discountCode: pricing.discount ? pricing.discount.code : null,
      taxRate: pricing.taxRate,
      tax: pricing.taxAmount,
      deliveryFee: pricing.deliveryFee,
      total: pricing.total,
    };
  },

  async create(body, actor) {
    const staff = isStaff(actor);
    const orderType = normalizeOrderType(body.orderType || body.type || (staff ? 'dine_in' : 'online'));

    if (!staff && !CUSTOMER_ORDER_TYPES.includes(orderType)) {
      throw new AppError('Customers can place takeaway, delivery or online orders.', 403, 'FORBIDDEN');
    }

    const ownCustomer = staff ? null : await requireOwnCustomer(actor);
    const tableIds = orderType === 'dine_in' ? await resolveTableIds(body) : [];
    const discountCode = body.discountCode || body.promoCode;

    const created = await withTransaction(async (conn) => {
      const customerId = staff ? await resolveCustomerForStaff(conn, body) : ownCustomer.id;
      const customer = customerId ? await CustomerModel.findById(customerId, conn) : null;

      const lines = await buildLines(body.items, conn);
      const pricing = await priceLines({ lines, orderType, discountCode, customerId }, conn);
      const delivery = orderType === 'delivery' ? await resolveDelivery(body, customer) : null;

      const myEmployee = staff ? await EmployeeModel.findByUserId(actor.id, conn) : null;
      let waiterId = null;
      if (body.waiterId) {
        const waiter = await EmployeeModel.findById(body.waiterId, conn);
        if (!waiter) throw new AppError('Waiter not found.', 422, 'EMPLOYEE_NOT_FOUND');
        waiterId = waiter.id;
      } else if (actor.roles.includes(ROLES.WAITER) && myEmployee) {
        waiterId = myEmployee.id;
      }

      for (const tableId of tableIds) {
        const table = await TableModel.lockById(tableId, conn);
        if (!table) throw new AppError('Table not found.', 422, 'TABLE_NOT_FOUND');
        if (['available', 'reserved'].includes(table.status)) {
          await TableService.seatInTransaction(conn, {
            tableId,
            guestCount: body.guestCount || 1,
            customerId,
            waiterId,
            actor,
          });
        } else if (table.status !== 'occupied') {
          throw new AppError(`Table ${table.table_number} is ${titleCase(table.status).toLowerCase()}.`, 409, 'TABLE_NOT_AVAILABLE');
        }
        if (!waiterId) {
          const refreshed = await TableModel.lockById(tableId, conn);
          waiterId = refreshed.assigned_waiter_id || null;
        }
      }

      const orderId = await OrderModel.insertOrder(
        {
          orderNumber: `T${crypto.randomUUID().replace(/-/g, '').slice(0, 18)}`,
          customerId,
          waiterId,
          discountId: pricing.discount ? pricing.discount.id : null,
          orderType,
          subtotal: pricing.subtotal,
          taxAmount: pricing.taxAmount,
          discountAmount: pricing.discountAmount,
          total: pricing.total,
          notes: body.notes,
        },
        conn
      );
      const orderNumber = `ORD-${String(orderId).padStart(4, '0')}`;
      await OrderModel.setOrderNumber(orderId, orderNumber, conn);

      await insertLines(conn, orderId, lines);
      for (const tableId of tableIds) await OrderModel.insertOrderTable(orderId, tableId, conn);
      await OrderModel.insertKitchenQueue(orderId, conn);
      if (delivery) {
        await OrderModel.insertDelivery(
          { orderId, address: delivery.address, phone: delivery.phone, instructions: delivery.instructions, fee: pricing.deliveryFee },
          conn
        );
      }
      if (pricing.discount) await DiscountModel.adjustUsed(pricing.discount.id, 1, conn);

      return { orderId, orderNumber, itemCount: lines.reduce((sum, line) => sum + line.quantity, 0) };
    });

    logActivity({
      userId: actor.id,
      action: `Created order ${created.orderNumber}`,
      activityType: 'order',
      entityType: 'order',
      entityId: created.orderId,
      newValue: { orderType, items: created.itemCount },
    });
    await notifyRoles([ROLES.KITCHEN], {
      title: 'New order',
      message: `Order ${created.orderNumber} (${orderType.replace('_', ' ')}) with ${created.itemCount} item(s).`,
      type: 'order',
    });
    if (!staff) {
      await notifyRoles([ROLES.MANAGER, ROLES.CASHIER], {
        title: 'New customer order',
        message: `Order ${created.orderNumber} was placed online.`,
        type: 'order',
      });
    }

    return OrderService.get(created.orderId, actor);
  },

  async list({ status, type, tableId, waiterId, customerId, date, from, to, search, mine, page, limit }, user) {
    const filters = {
      statuses: parseStatuses(status),
      type: type ? normalizeOrderType(type) : undefined,
      tableId,
      waiterId,
      customerId,
      date,
      from,
      to,
      search,
    };
    if (mine && user.roles.includes(ROLES.WAITER)) {
      const employee = await EmployeeModel.findByUserId(user.id);
      filters.waiterId = employee ? employee.id : -1;
    }
    const [rows, total] = await Promise.all([
      OrderModel.list(filters, { limit, offset: toOffset(page, limit) }, false),
      OrderModel.count(filters),
    ]);
    return { rows: await hydrate(rows), pagination: pageMeta(page, limit, total) };
  },

  async kitchen({ status, date, page, limit }) {
    const filters = { statuses: parseStatuses(status) || ['pending', 'preparing', 'ready'], date };
    const [rows, total] = await Promise.all([
      OrderModel.list(filters, { limit, offset: toOffset(page, limit) }, true),
      OrderModel.count(filters),
    ]);
    return { rows: await hydrate(rows), pagination: pageMeta(page, limit, total) };
  },

  async listMine(user, { status, page, limit }) {
    const customer = await requireOwnCustomer(user);
    const filters = { customerId: customer.id, statuses: parseStatuses(status) };
    const [rows, total] = await Promise.all([
      OrderModel.list(filters, { limit, offset: toOffset(page, limit) }, false),
      OrderModel.count(filters),
    ]);
    return { rows: await hydrate(rows), pagination: pageMeta(page, limit, total) };
  },

  async get(id, user) {
    const row = await requireOrder(id);
    await assertAccess(row, user);
    const [order] = await hydrate([row]);
    return order;
  },

  async track(id, user) {
    const order = await OrderService.get(id, user);
    const path = order.order_type === 'dine_in' ? ['pending', 'preparing', 'ready', 'served', 'completed'] : ['pending', 'preparing', 'ready', 'completed'];
    const cancelled = order.status === 'cancelled';
    const index = path.indexOf(order.status);

    const steps = path.map((key, position) => ({
      key,
      label: STEP_LABELS[key],
      done: !cancelled && index >= position,
      current: !cancelled && index === position,
    }));

    const itemTotal = order.items.length;
    const readyItems = order.items.filter((item) => item.item_status === 'ready').length;
    let progress = cancelled ? 0 : Math.round(((index + 1) / path.length) * 100);
    if (!cancelled && order.status === 'preparing' && itemTotal) {
      progress = Math.round(((1 + readyItems / itemTotal) / path.length) * 100);
    }

    return { order, steps, currentStep: order.status, progress, cancelled };
  },

  async changeStatus(id, body, actor) {
    const order = await requireOrder(id);
    const next = normalizeEnum(body.status, ORDER_STATUSES, 'Status');

    if (order.status === next) return OrderService.get(id, actor);
    if (!TRANSITIONS[order.status].includes(next)) {
      throw new AppError(`An order that is ${order.status} cannot become ${next}.`, 409, 'INVALID_TRANSITION');
    }
    if (!hasRole(actor, TRANSITION_ROLES[next])) {
      throw new AppError('You do not have permission to make this status change.', 403, 'FORBIDDEN');
    }

    await withTransaction((conn) => applyStatus(conn, order, next));
    logActivity({
      userId: actor.id,
      action: `Order ${order.order_number} status changed to ${next}`,
      activityType: 'order',
      entityType: 'order',
      entityId: id,
      oldValue: { status: order.status },
      newValue: { status: next },
    });
    if (next === 'ready') await notifyReady(order);
    return OrderService.get(id, actor);
  },

  async cancelMine(id, user) {
    const customer = await requireOwnCustomer(user);
    const order = await requireOrder(id);
    if (order.customer_id !== customer.id) throw new AppError('Order not found.', 404, 'ORDER_NOT_FOUND');
    if (order.status !== 'pending') {
      throw new AppError('Only orders that have not started preparing can be cancelled.', 409, 'NOT_CANCELLABLE');
    }

    await withTransaction((conn) => applyStatus(conn, order, 'cancelled'));
    logActivity({ userId: user.id, action: `Customer cancelled order ${order.order_number}`, activityType: 'order', entityType: 'order', entityId: id });
    await notifyRoles([ROLES.KITCHEN, ROLES.MANAGER], {
      title: 'Order cancelled',
      message: `Order ${order.order_number} was cancelled by the customer.`,
      type: 'order',
    });
    return OrderService.get(id, user);
  },

  async update(id, body, actor) {
    const order = await requireOrder(id);
    if (['completed', 'cancelled'].includes(order.status)) {
      throw new AppError('A finished order can no longer be changed.', 409, 'ORDER_CLOSED');
    }
    if (body.notes === undefined && body.waiterId === undefined) throw new AppError('Nothing to update.', 400, 'NOTHING_TO_UPDATE');

    if (body.notes !== undefined) await OrderModel.setNotes(id, body.notes, null);
    if (body.waiterId !== undefined) {
      const waiter = await EmployeeModel.findById(body.waiterId);
      if (!waiter) throw new AppError('Waiter not found.', 422, 'EMPLOYEE_NOT_FOUND');
      await OrderModel.setWaiter(id, waiter.id, null);
    }
    logActivity({ userId: actor.id, action: `Updated order ${order.order_number}`, activityType: 'order', entityType: 'order', entityId: id, newValue: body });
    return OrderService.get(id, actor);
  },

  async setPriority(id, { priority }, actor) {
    const order = await requireOrder(id);
    if (!['pending', 'preparing'].includes(order.status)) {
      throw new AppError('Only pending or preparing orders can be prioritised.', 409, 'INVALID_TRANSITION');
    }
    await OrderModel.setPriority(id, priority);
    logActivity({ userId: actor.id, action: `Set priority ${priority} on order ${order.order_number}`, activityType: 'order', entityType: 'order', entityId: id });
    return OrderService.get(id, actor);
  },

  async addItems(id, body, actor) {
    const order = await requireOrder(id);
    if (!['pending', 'preparing', 'ready', 'served'].includes(order.status)) {
      throw new AppError('Items can only be added to an open order.', 409, 'ORDER_CLOSED');
    }

    const added = await withTransaction(async (conn) => {
      const lines = await buildLines(body.items, conn);
      await insertLines(conn, id, lines);
      if (order.status !== 'pending') {
        await OrderModel.setStatus(id, 'preparing', conn);
        await OrderModel.startCooking(id, conn);
      }
          await recomputeTotals(conn, id);
      if (order.status !== 'pending') await InventoryService.consumeForOrder(conn, id);
      return lines.reduce((sum, line) => sum + line.quantity, 0);
    });

    logActivity({ userId: actor.id, action: `Added ${added} item(s) to order ${order.order_number}`, activityType: 'order', entityType: 'order', entityId: id });
    await notifyRoles([ROLES.KITCHEN], {
      title: 'Items added to order',
      message: `Order ${order.order_number} has ${added} new item(s).`,
      type: 'order',
    });
    return OrderService.get(id, actor);
  },

  async removeItem(id, itemId, actor) {
    const order = await requireOrder(id);
    if (!['pending', 'preparing'].includes(order.status)) {
      throw new AppError('Items can only be removed while the order is pending or preparing.', 409, 'ORDER_CLOSED');
    }
    const item = await OrderModel.findItem(id, itemId);
    if (!item) throw new AppError('Order item not found.', 404, 'ORDER_ITEM_NOT_FOUND');
    if (item.item_status !== 'pending' && !hasRole(actor, [ROLES.MANAGER, ROLES.ADMIN])) {
      throw new AppError('The kitchen has already started this item.', 409, 'ITEM_IN_PROGRESS');
    }
    if ((await OrderModel.countItems(id)) < 2) {
      throw new AppError('An order needs at least one item. Cancel the order instead.', 409, 'LAST_ITEM');
    }

    await withTransaction(async (conn) => {
      await OrderModel.deleteItem(itemId, conn);
      await recomputeTotals(conn, id);
      await syncStatusFromItems(conn, id);
    });
    logActivity({ userId: actor.id, action: `Removed an item from order ${order.order_number}`, activityType: 'order', entityType: 'order', entityId: id });
    return OrderService.get(id, actor);
  },

  async updateItemStatus(id, itemId, body, actor) {
    const order = await requireOrder(id);
    if (!['pending', 'preparing', 'ready'].includes(order.status)) {
      throw new AppError('Item progress can only change while the order is in the kitchen.', 409, 'ORDER_CLOSED');
    }
    const item = await OrderModel.findItem(id, itemId);
    if (!item) throw new AppError('Order item not found.', 404, 'ORDER_ITEM_NOT_FOUND');
    if (body.status === undefined && body.progress === undefined) throw new AppError('Nothing to update.', 400, 'NOTHING_TO_UPDATE');

    let status = body.status !== undefined ? normalizeEnum(body.status, ITEM_STATUSES, 'Status') : item.item_status;
    let progress = body.progress !== undefined ? body.progress : item.preparation_progress;
    if (body.status === undefined) {
      if (progress >= 100) status = 'ready';
      else if (progress > 0 && status === 'pending') status = 'preparing';
    }
    if (status === 'ready') progress = 100;
    if (status === 'pending') progress = 0;

    const newOrderStatus = await withTransaction(async (conn) => {
      await OrderModel.setItemStatus(itemId, status, progress, conn);
      return syncStatusFromItems(conn, id);
    });

    if (newOrderStatus === 'ready') await notifyReady(order);
    return OrderService.get(id, actor);
  },

  async addFeedback(id, body, user) {
    const customer = await requireOwnCustomer(user);
    const order = await requireOrder(id);
    if (order.customer_id !== customer.id) throw new AppError('Order not found.', 404, 'ORDER_NOT_FOUND');
    if (!['served', 'completed'].includes(order.status)) {
      throw new AppError('You can leave feedback once your order has been served.', 409, 'NOT_ALLOWED');
    }
    if (await OrderModel.findFeedback(id, customer.id)) {
      throw new AppError('You have already left feedback for this order.', 409, 'FEEDBACK_EXISTS');
    }
    const feedbackId = await OrderModel.insertFeedback({ customerId: customer.id, orderId: id, rating: body.rating, comment: body.comment });
    return { id: feedbackId, order_id: id, rating: body.rating, comment: body.comment || null };
  },

  async listFeedback({ page, limit }) {
    const [rows, summary] = await Promise.all([
      OrderModel.listFeedback({ limit, offset: toOffset(page, limit) }),
      OrderModel.feedbackSummary(),
    ]);
    return {
      rows: rows.map((row) => ({
        id: row.id,
        customer_id: row.customer_id,
        customer_name: cleanName(row.customer_name),
        order_id: row.order_id,
        order_number: row.order_number,
        rating: row.rating,
        comment: row.comment,
        created_at: row.created_at,
      })),
      summary,
      pagination: pageMeta(page, limit, summary.total),
    };
  },
};

module.exports = OrderService;