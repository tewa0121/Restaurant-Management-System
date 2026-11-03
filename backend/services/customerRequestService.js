const CustomerRequestModel = require('../models/customerRequestModel');
const CustomerModel = require('../models/customerModel');
const TableModel = require('../models/tableModel');
const EmployeeModel = require('../models/employeeModel');
const OrderModel = require('../models/orderModel');
const TableService = require('./tableService');
const AppError = require('../utils/AppError');
const { logActivity } = require('../utils/activityLog');
const { notifyUsers, notifyRoles } = require('../utils/notify');
const { toOffset, pageMeta } = require('../utils/pagination');
const { normalizeEnum, titleCase } = require('../utils/enums');
const { hasRole } = require('../middleware/roleMiddleware');
const { ROLES, STAFF_ROLES, REQUEST_STATUSES } = require('../utils/constants');

const isStaff = (user) => hasRole(user, STAFF_ROLES);

function toDto(row) {
  const waitingMinutes = Math.max(0, Number(row.waiting_minutes) || 0);
  const customerName = row.customer_name && row.customer_name.trim() ? row.customer_name.trim() : null;
  const waiterName = row.waiter_name && row.waiter_name.trim() ? row.waiter_name.trim() : null;
  const tableName = `Table ${row.table_number}`;

  return {
    id: row.id,
    table_id: row.table_id,
    tableId: row.table_id,
    table_number: row.table_number,
    table: tableName,
    tableName,
    order_id: row.order_id,
    orderId: row.order_id,
    order_number: row.order_number,
    orderNumber: row.order_number,
    customer_id: row.customer_id,
    customer_name: customerName,
    customerName,
    assigned_waiter_id: row.assigned_waiter_id,
    assignedWaiterId: row.assigned_waiter_id,
    waiter_name: waiterName,
    waiterName,
    request_text: row.request_text,
    text: row.request_text,
    request: row.request_text,
    message: row.request_text,
    status: row.status,
    statusLabel: titleCase(row.status),
    created_at: row.created_at,
    createdAt: row.created_at,
    resolved_at: row.resolved_at || null,
    waiting_minutes: waitingMinutes,
    waitingMinutes,
  };
}

const requireRequest = async (id) => {
  const row = await CustomerRequestModel.findById(id);
  if (!row) throw new AppError('Request not found.', 404, 'REQUEST_NOT_FOUND');
  return row;
};

async function requireOwnCustomer(user) {
  const customer = await CustomerModel.findByUserId(user.id);
  if (!customer) throw new AppError('No customer profile is linked to this account.', 404, 'CUSTOMER_NOT_FOUND');
  return customer;
}

const parseStatuses = (value) =>
  value
    ? String(value)
        .split(',')
        .map((part) => normalizeEnum(part, REQUEST_STATUSES, 'Status'))
    : undefined;

const CustomerRequestService = {
  toDto,

  async list({ status, tableId, mine, page, limit }, user) {
    const filters = { statuses: parseStatuses(status), tableId };
    if (mine && user.roles.includes(ROLES.WAITER)) {
      const employee = await EmployeeModel.findByUserId(user.id);
      filters.waiterEmployeeId = employee ? employee.id : -1;
    }
    const [rows, total] = await Promise.all([
      CustomerRequestModel.list(filters, { limit, offset: toOffset(page, limit) }),
      CustomerRequestModel.count(filters),
    ]);
    return { rows: rows.map(toDto), pagination: pageMeta(page, limit, total) };
  },

  async listMine(user, { status, page, limit }) {
    const customer = await requireOwnCustomer(user);
    const filters = { customerId: customer.id, statuses: parseStatuses(status) };
    const [rows, total] = await Promise.all([
      CustomerRequestModel.list(filters, { limit, offset: toOffset(page, limit) }),
      CustomerRequestModel.count(filters),
    ]);
    return { rows: rows.map(toDto), pagination: pageMeta(page, limit, total) };
  },

  async create(body, actor) {
    const text = body.text || body.request || body.message;
    if (!text) throw new AppError('Request text is required.', 422, 'VALIDATION_ERROR');

    let tableId = body.tableId;
    let orderId = body.orderId;
    let customerId = null;

    if (isStaff(actor)) {
      if (!tableId && body.table) {
        const found = await TableModel.findByNumber(TableService.normalizeTableNumber(body.table));
        if (!found) throw new AppError(`Table "${body.table}" was not found.`, 422, 'TABLE_NOT_FOUND');
        tableId = found.id;
      }
      if (!tableId) throw new AppError('Table is required.', 422, 'VALIDATION_ERROR');
      customerId = body.customerId || null;
    } else {
      const customer = await requireOwnCustomer(actor);
      const active = await CustomerRequestModel.findActiveTableForCustomer({ customerId: customer.id, tableId, orderId });
      if (!active) {
        throw new AppError('You can only send a request from a table where you have an open order.', 409, 'NO_ACTIVE_TABLE');
      }
      tableId = active.table_id;
      orderId = active.order_id;
      customerId = customer.id;
    }

    const table = await TableModel.findById(tableId);
    if (!table) throw new AppError('Table not found.', 422, 'TABLE_NOT_FOUND');
    if (orderId && !(await OrderModel.findById(orderId))) throw new AppError('Order not found.', 422, 'ORDER_NOT_FOUND');

    const id = await CustomerRequestModel.create({
      tableId,
      orderId,
      customerId,
      assignedWaiterId: table.assigned_waiter_id,
      text,
    });

    const message = `Table ${table.table_number}: ${text}`;
    let notified = false;
    if (table.assigned_waiter_id) {
      const waiter = await EmployeeModel.findById(table.assigned_waiter_id);
      if (waiter && waiter.user_id) {
        await notifyUsers([waiter.user_id], { title: 'Customer request', message, type: 'order' });
        notified = true;
      }
    }
    if (!notified) await notifyRoles([ROLES.WAITER], { title: 'Customer request', message, type: 'order' });

    logActivity({ userId: actor.id, action: `Customer request created for table ${table.table_number}`, activityType: 'request', entityType: 'customer_request', entityId: id });
    return toDto(await requireRequest(id));
  },

  async setStatus(id, { status }, actor) {
    const existing = await requireRequest(id);
    const next = normalizeEnum(status, REQUEST_STATUSES, 'Status');
    if (existing.status === 'done' && next !== 'done') {
      throw new AppError('A completed request cannot be reopened.', 409, 'INVALID_TRANSITION');
    }

    const employee = await EmployeeModel.findByUserId(actor.id);
    await CustomerRequestModel.setStatus(id, next, employee ? employee.id : null);

    logActivity({
      userId: actor.id,
      action: `Customer request ${id} marked ${next}`,
      activityType: 'request',
      entityType: 'customer_request',
      entityId: id,
      oldValue: { status: existing.status },
      newValue: { status: next },
    });
    return toDto(await requireRequest(id));
  },

  async assign(id, { waiterId }, actor) {
    await requireRequest(id);
    const waiter = await EmployeeModel.findById(waiterId);
    if (!waiter) throw new AppError('Waiter not found.', 422, 'EMPLOYEE_NOT_FOUND');
    await CustomerRequestModel.assign(id, waiter.id);
    if (waiter.user_id) {
      await notifyUsers([waiter.user_id], { title: 'Request assigned', message: `A customer request was assigned to you.`, type: 'order' });
    }
    logActivity({ userId: actor.id, action: `Assigned customer request ${id}`, activityType: 'request', entityType: 'customer_request', entityId: id });
    return toDto(await requireRequest(id));
  },
};

module.exports = CustomerRequestService;