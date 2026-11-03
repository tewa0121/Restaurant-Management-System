const TableModel = require('../models/tableModel');
const ReservationModel = require('../models/reservationModel');
const EmployeeModel = require('../models/employeeModel');
const CustomerModel = require('../models/customerModel');
const AppError = require('../utils/AppError');
const { withTransaction } = require('../utils/transaction');
const { logActivity } = require('../utils/activityLog');
const { mapFields, updateById, isForeignKeyError } = require('../utils/sql');
const { normalizeEnum, titleCase, todayString } = require('../utils/enums');
const { ROLES, TABLE_STATUSES } = require('../utils/constants');

const normalizeTableNumber = (value) => String(value).trim().replace(/^table\s*/i, '').trim();

const RELEASING_STATUSES = ['available', 'cleaning', 'out_of_order'];

function toDto(row) {
  const waiterName = row.waiter_name && row.waiter_name.trim() ? row.waiter_name.trim() : null;
  const guests = row.guests === null || row.guests === undefined ? 0 : Number(row.guests);

  return {
    id: row.id,
    restaurant_id: row.restaurant_id,
    table_number: row.table_number,
    tableNumber: row.table_number,
    name: `Table ${row.table_number}`,
    capacity: row.capacity,
    section: row.section,
    location: row.section,
    pos_x: row.pos_x,
    pos_y: row.pos_y,
    posX: row.pos_x,
    posY: row.pos_y,
    shape: row.shape,
    status: row.status,
    statusLabel: titleCase(row.status),
    assigned_waiter_id: row.assigned_waiter_id,
    assignedWaiterId: row.assigned_waiter_id,
    waiter_name: waiterName,
    waiterName,
    parent_table_id: row.parent_table_id,
    parentTableId: row.parent_table_id,
    qr_code_url: row.qr_code_url,
    qrCodeUrl: row.qr_code_url,
    guests,
    assignment_id: row.assignment_id || null,
    seated_at: row.seated_at || null,
    seatedAt: row.seated_at || null,
    created_at: row.created_at,
    createdAt: row.created_at,
  };
}

const requireTable = async (id) => {
  const row = await TableModel.findById(id);
  if (!row) throw new AppError('Table not found.', 404, 'TABLE_NOT_FOUND');
  return row;
};

async function requireWaiter(waiterId, conn) {
  const employee = await EmployeeModel.findById(waiterId, conn);
  if (!employee) throw new AppError('Waiter not found.', 422, 'EMPLOYEE_NOT_FOUND');
  return employee;
}

async function applyStatus(conn, tableId, status) {
  if (RELEASING_STATUSES.includes(status)) await TableModel.releaseAssignments(tableId, conn);
  await TableModel.setStatus(tableId, status, conn);
}

async function resolveWaiterId(conn, { waiterId, table, actor }) {
  if (waiterId) return (await requireWaiter(waiterId, conn)).id;

  const mine = await EmployeeModel.findByUserId(actor.id, conn);
  if (actor.roles.includes(ROLES.WAITER) && mine) return mine.id;
  if (table.assigned_waiter_id) return table.assigned_waiter_id;
  if (mine) return mine.id;
  throw new AppError('A waiter is required to seat guests. Assign a waiter to the table first.', 409, 'WAITER_REQUIRED');
}

async function seatInTransaction(conn, { tableId, guestCount, customerId, waiterId, reservationId, actor }) {
  const table = await TableModel.lockById(tableId, conn);
  if (!table) throw new AppError('Table not found.', 404, 'TABLE_NOT_FOUND');
  if (!['available', 'reserved'].includes(table.status)) {
    throw new AppError(`Table ${table.table_number} is ${titleCase(table.status).toLowerCase()} and cannot be seated.`, 409, 'TABLE_NOT_AVAILABLE');
  }
  if (guestCount > table.capacity) {
    throw new AppError(`Table ${table.table_number} seats at most ${table.capacity} guests.`, 422, 'TABLE_TOO_SMALL');
  }
  if (customerId && !(await CustomerModel.findById(customerId, conn))) {
    throw new AppError('Customer not found.', 422, 'CUSTOMER_NOT_FOUND');
  }

  const resolvedWaiterId = await resolveWaiterId(conn, { waiterId, table, actor });

  await TableModel.releaseAssignments(tableId, conn);
  await TableModel.createAssignment({ tableId, waiterId: resolvedWaiterId, customerId, guestCount }, conn);
  await updateById('tables', tableId, { status: 'occupied', assigned_waiter_id: resolvedWaiterId }, conn);
  if (reservationId) await ReservationModel.setStatus(reservationId, 'seated', conn);
}

const TableService = {
  toDto,
  normalizeTableNumber,
  seatInTransaction,

  async list({ status, section, search }) {
    const rows = await TableModel.list({
      status: status ? normalizeEnum(status, TABLE_STATUSES, 'Status') : undefined,
      section,
      search,
    });
    return rows.map(toDto);
  },

  async mine(user) {
    const employee = await EmployeeModel.findByUserId(user.id);
    if (!employee) throw new AppError('No employee profile is linked to this account.', 404, 'EMPLOYEE_NOT_FOUND');
    const rows = await TableModel.list({ waiterEmployeeId: employee.id });
    return rows.map(toDto);
  },

  async available({ date, time, guests }) {
    const rows = await TableModel.findAvailable({ date, time, guests });
    return rows.map(toDto);
  },

  async get(id) {
    const row = await requireTable(id);
    const reservations = await ReservationModel.upcomingForTable(id, todayString());
    return {
      ...toDto(row),
      upcomingReservations: reservations.map((reservation) => ({
        id: reservation.id,
        customer_name: reservation.customer_name,
        reservation_date: reservation.reservation_date,
        reservation_time: reservation.reservation_time,
        guest_count: reservation.guest_count,
        status: reservation.status,
      })),
    };
  },

  async create(body, actor) {
    const rawNumber = body.tableNumber || body.name || body.number;
    const tableNumber = rawNumber ? normalizeTableNumber(rawNumber) : '';
    if (!tableNumber) throw new AppError('Table number is required.', 422, 'VALIDATION_ERROR');
    if (tableNumber.length > 10) throw new AppError('Table number must be at most 10 characters.', 422, 'VALIDATION_ERROR');
    if (await TableModel.findByNumber(tableNumber)) {
      throw new AppError(`Table ${tableNumber} already exists.`, 409, 'TABLE_EXISTS');
    }
    if (body.assignedWaiterId) await requireWaiter(body.assignedWaiterId);
    if (body.parentTableId) await requireTable(body.parentTableId);

    const id = await TableModel.create({
      tableNumber,
      capacity: body.capacity,
      posX: body.posX,
      posY: body.posY,
      shape: body.shape,
      section: body.section || body.location,
      assignedWaiterId: body.assignedWaiterId,
      status: body.status ? normalizeEnum(body.status, TABLE_STATUSES, 'Status') : undefined,
      qrCodeUrl: body.qrCodeUrl,
      parentTableId: body.parentTableId,
    });

    logActivity({ userId: actor.id, action: `Created table ${tableNumber}`, activityType: 'table', entityType: 'table', entityId: id });
    return TableService.get(id);
  },

  async update(id, body, actor) {
    const existing = await requireTable(id);

    const fields = mapFields(body, {
      capacity: 'capacity',
      posX: 'pos_x',
      posY: 'pos_y',
      shape: 'shape',
      qrCodeUrl: 'qr_code_url',
    });
    const section = body.section !== undefined ? body.section : body.location;
    if (section !== undefined) fields.section = section;

    const rawNumber = body.tableNumber || body.name || body.number;
    if (rawNumber) {
      const tableNumber = normalizeTableNumber(rawNumber);
      if (!tableNumber || tableNumber.length > 10) {
        throw new AppError('Table number must be between 1 and 10 characters.', 422, 'VALIDATION_ERROR');
      }
      if (tableNumber !== existing.table_number) {
        if (await TableModel.findByNumber(tableNumber)) {
          throw new AppError(`Table ${tableNumber} already exists.`, 409, 'TABLE_EXISTS');
        }
        fields.table_number = tableNumber;
      }
    }

    if (body.assignedWaiterId !== undefined) {
      if (body.assignedWaiterId) await requireWaiter(body.assignedWaiterId);
      fields.assigned_waiter_id = body.assignedWaiterId;
    }
    if (body.parentTableId !== undefined) {
      if (body.parentTableId === id) throw new AppError('A table cannot be its own parent.', 422, 'VALIDATION_ERROR');
      if (body.parentTableId) await requireTable(body.parentTableId);
      fields.parent_table_id = body.parentTableId;
    }

    const status = body.status ? normalizeEnum(body.status, TABLE_STATUSES, 'Status') : undefined;
    if (!Object.keys(fields).length && !status) throw new AppError('Nothing to update.', 400, 'NOTHING_TO_UPDATE');

    await withTransaction(async (conn) => {
      await updateById('tables', id, fields, conn);
      if (status && status !== existing.status) await applyStatus(conn, id, status);
    });

    logActivity({
      userId: actor.id,
      action: `Updated table ${existing.table_number}`,
      activityType: 'table',
      entityType: 'table',
      entityId: id,
      newValue: { ...fields, status },
    });
    return TableService.get(id);
  },

  async setStatus(id, body, actor) {
    const existing = await requireTable(id);
    const status = normalizeEnum(body.status, TABLE_STATUSES, 'Status');

    await withTransaction(async (conn) => {
      await TableModel.lockById(id, conn);
      await applyStatus(conn, id, status);
    });

    logActivity({
      userId: actor.id,
      action: `Table ${existing.table_number} status changed to ${status}`,
      activityType: 'table',
      entityType: 'table',
      entityId: id,
      oldValue: { status: existing.status },
      newValue: { status },
    });
    return TableService.get(id);
  },

  async assignWaiter(id, body, actor) {
    const existing = await requireTable(id);
    if (body.waiterId === undefined) {
      throw new AppError('waiterId is required (send null to unassign).', 422, 'VALIDATION_ERROR');
    }
    if (body.waiterId) await requireWaiter(body.waiterId);
    await updateById('tables', id, { assigned_waiter_id: body.waiterId });

    logActivity({
      userId: actor.id,
      action: `Assigned waiter to table ${existing.table_number}`,
      activityType: 'table',
      entityType: 'table',
      entityId: id,
      newValue: { waiterId: body.waiterId },
    });
    return TableService.get(id);
  },

  async seat(id, body, actor) {
    const existing = await requireTable(id);
    await withTransaction((conn) =>
      seatInTransaction(conn, {
        tableId: id,
        guestCount: body.guestCount,
        customerId: body.customerId,
        waiterId: body.waiterId,
        reservationId: undefined,
        actor,
      })
    );

    logActivity({
      userId: actor.id,
      action: `Seated ${body.guestCount} guest(s) at table ${existing.table_number}`,
      activityType: 'table',
      entityType: 'table',
      entityId: id,
    });
    return TableService.get(id);
  },

  async release(id, body, actor) {
    const existing = await requireTable(id);
    const status = body.status ? normalizeEnum(body.status, ['cleaning', 'available'], 'Status') : 'cleaning';

    await withTransaction(async (conn) => {
      await TableModel.lockById(id, conn);
      await applyStatus(conn, id, status);
    });

    logActivity({
      userId: actor.id,
      action: `Released table ${existing.table_number}`,
      activityType: 'table',
      entityType: 'table',
      entityId: id,
    });
    return TableService.get(id);
  },

  async remove(id, actor) {
    const existing = await requireTable(id);
    try {
      await TableModel.remove(id);
    } catch (err) {
      if (isForeignKeyError(err)) {
        throw new AppError('This table has orders or history and cannot be deleted. Mark it out of order instead.', 409, 'HAS_RELATED_RECORDS');
      }
      throw err;
    }
    logActivity({ userId: actor.id, action: `Deleted table ${existing.table_number}`, activityType: 'table', entityType: 'table', entityId: id });
    return { message: 'Table deleted successfully.' };
  },
};

module.exports = TableService;