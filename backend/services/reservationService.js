const ReservationModel = require('../models/reservationModel');
const TableModel = require('../models/tableModel');
const CustomerModel = require('../models/customerModel');
const TableService = require('./tableService');
const AppError = require('../utils/AppError');
const { withTransaction } = require('../utils/transaction');
const { logActivity } = require('../utils/activityLog');
const { toOffset, pageMeta } = require('../utils/pagination');
const { updateById } = require('../utils/sql');
const { normalizeEnum, titleCase, todayString, nowTimeString } = require('../utils/enums');
const { hasRole } = require('../middleware/roleMiddleware');
const { RESERVATION_STATUSES, STAFF_ROLES } = require('../utils/constants');
const { maxReservationAdvanceDays } = require('../config/business');

const CREATABLE_STATUSES = RESERVATION_STATUSES.filter((status) => status !== 'seated');

const isStaff = (user) => hasRole(user, STAFF_ROLES);

const splitName = (fullName) => {
  const parts = String(fullName).trim().split(/\s+/);
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
};

function toDto(row) {
  const time = String(row.reservation_time).slice(0, 5);
  const reference = `RES-${String(row.id).padStart(3, '0')}`;
  const tableName = `Table ${row.table_number}`;
  const customerName = row.customer_name && row.customer_name.trim() ? row.customer_name.trim() : '';

  return {
    id: row.id,
    reference,
    customer_id: row.customer_id,
    customerId: row.customer_id,
    customer_name: customerName,
    customerName,
    guestName: customerName,
    customer: customerName,
    customer_phone: row.customer_phone,
    customerPhone: row.customer_phone,
    customer_email: row.customer_email,
    table_id: row.table_id,
    tableId: row.table_id,
    table_number: row.table_number,
    table: tableName,
    tableName,
    section: row.section,
    reservation_date: row.reservation_date,
    date: row.reservation_date,
    reservation_time: row.reservation_time,
    time,
    guest_count: row.guest_count,
    guests: row.guest_count,
    partySize: row.guest_count,
    special_request: row.special_request,
    specialRequest: row.special_request,
    status: row.status,
    statusLabel: titleCase(row.status),
    created_by: row.created_by,
    created_at: row.created_at,
    createdAt: row.created_at,
  };
}

const requireReservation = async (id) => {
  const row = await ReservationModel.findById(id);
  if (!row) throw new AppError('Reservation not found.', 404, 'RESERVATION_NOT_FOUND');
  return row;
};

async function requireOwnCustomer(user) {
  const customer = await CustomerModel.findByUserId(user.id);
  if (!customer) throw new AppError('No customer profile is linked to this account.', 404, 'CUSTOMER_NOT_FOUND');
  return customer;
}

function assertDateAllowed(date) {
  const today = todayString();
  if (date < today) throw new AppError('Reservations cannot be made for a past date.', 422, 'RESERVATION_IN_PAST');

  const limit = new Date();
  limit.setDate(limit.getDate() + maxReservationAdvanceDays);
  const pad = (n) => String(n).padStart(2, '0');
  const limitString = `${limit.getFullYear()}-${pad(limit.getMonth() + 1)}-${pad(limit.getDate())}`;
  if (date > limitString) {
    throw new AppError(`Reservations can be made at most ${maxReservationAdvanceDays} days ahead.`, 422, 'RESERVATION_TOO_FAR');
  }
}

async function syncReservedStatus(conn, tableId) {
  const table = await TableModel.lockById(tableId, conn);
  if (!table) return;
  const hasConfirmed = await ReservationModel.hasConfirmedToday(tableId, todayString(), conn);
  if (hasConfirmed && table.status === 'available') await TableModel.setStatus(tableId, 'reserved', conn);
  else if (!hasConfirmed && table.status === 'reserved') await TableModel.setStatus(tableId, 'available', conn);
}

async function findOrCreateCustomer(conn, body) {
  if (body.customerId) {
    const customer = await CustomerModel.findById(body.customerId, conn);
    if (!customer) throw new AppError('Customer not found.', 422, 'CUSTOMER_NOT_FOUND');
    return customer.id;
  }

  const name = body.customerName || body.customer;
  if (!name) throw new AppError('Customer is required (customerId or customerName).', 422, 'VALIDATION_ERROR');

  const phone = body.customerPhone || body.phone;
  if (phone) {
    const existing = await ReservationModel.findCustomerByPhone(phone, conn);
    if (existing) return existing.id;
  }

  const { firstName, lastName } = splitName(name);
  return CustomerModel.create({ firstName, lastName, email: body.customerEmail, phone }, conn);
}

async function resolveTableId(body, { date, time, guests }) {
  if (body.tableId) return body.tableId;
  if (body.table) {
    const found = await TableModel.findByNumber(TableService.normalizeTableNumber(body.table));
    if (!found) throw new AppError(`Table "${body.table}" was not found.`, 422, 'TABLE_NOT_FOUND');
    return found.id;
  }
  const available = await TableModel.findAvailable({ date, time, guests });
  if (!available.length) {
    throw new AppError('No table is available for that date, time and party size.', 409, 'NO_TABLE_AVAILABLE');
  }
  return available[0].id;
}

async function assertTableFits(conn, { tableId, date, time, guests, excludeId }) {
  const table = await TableModel.lockById(tableId, conn);
  if (!table) throw new AppError('Table not found.', 422, 'TABLE_NOT_FOUND');
  if (table.status === 'out_of_order') throw new AppError(`Table ${table.table_number} is out of order.`, 409, 'TABLE_NOT_AVAILABLE');
  if (guests > table.capacity) {
    throw new AppError(`Table ${table.table_number} seats at most ${table.capacity} guests.`, 422, 'TABLE_TOO_SMALL');
  }
  if (await ReservationModel.findConflict({ tableId, date, time, excludeId }, conn)) {
    throw new AppError('This table is already reserved around that time.', 409, 'TABLE_NOT_AVAILABLE');
  }
}

async function applyStatus(conn, reservation, status, actor) {
  if (reservation.status === status) return;
  if (reservation.status === 'seated') {
    throw new AppError('A seated reservation can no longer be changed.', 409, 'ALREADY_SEATED');
  }

  if (status === 'seated') {
    await TableService.seatInTransaction(conn, {
      tableId: reservation.table_id,
      guestCount: reservation.guest_count,
      customerId: reservation.customer_id,
      reservationId: reservation.id,
      actor,
    });
    return;
  }

  await ReservationModel.setStatus(reservation.id, status, conn);
  await syncReservedStatus(conn, reservation.table_id);
}

const ReservationService = {
  toDto,

  async list({ date, from, to, status, tableId, search, page, limit }) {
    const filters = {
      date,
      from,
      to,
      status: status ? normalizeEnum(status, RESERVATION_STATUSES, 'Status') : undefined,
      tableId,
      search,
    };
    const [rows, total] = await Promise.all([
      ReservationModel.list(filters, { limit, offset: toOffset(page, limit) }),
      ReservationModel.count(filters),
    ]);
    return { rows: rows.map(toDto), pagination: pageMeta(page, limit, total) };
  },

  async listMine(user, { page, limit }) {
    const customer = await requireOwnCustomer(user);
    const filters = { customerId: customer.id };
    const [rows, total] = await Promise.all([
      ReservationModel.list(filters, { limit, offset: toOffset(page, limit) }),
      ReservationModel.count(filters),
    ]);
    return { rows: rows.map(toDto), pagination: pageMeta(page, limit, total) };
  },

  async get(id, user) {
    const row = await requireReservation(id);
    if (!isStaff(user)) {
      const customer = await requireOwnCustomer(user);
      if (row.customer_id !== customer.id) throw new AppError('Reservation not found.', 404, 'RESERVATION_NOT_FOUND');
    }
    return toDto(row);
  },

  async create(body, actor) {
    const staff = isStaff(actor);
    const guests = body.guests || body.guestCount || body.partySize;
    if (!guests) throw new AppError('Number of guests is required.', 422, 'VALIDATION_ERROR');
    if (!body.date) throw new AppError('Date is required.', 422, 'VALIDATION_ERROR');
    if (!body.time) throw new AppError('Time is required.', 422, 'VALIDATION_ERROR');

    assertDateAllowed(body.date);
    if (!staff && body.date === todayString() && body.time <= nowTimeString()) {
      throw new AppError('Please choose a time in the future.', 422, 'RESERVATION_IN_PAST');
    }

    let status = staff ? 'confirmed' : 'pending';
    if (staff && body.status) status = normalizeEnum(body.status, CREATABLE_STATUSES, 'Status');

    const tableId = await resolveTableId(body, { date: body.date, time: body.time, guests });

    const id = await withTransaction(async (conn) => {
      const customerId = staff ? await findOrCreateCustomer(conn, body) : (await requireOwnCustomer(actor)).id;
      await assertTableFits(conn, { tableId, date: body.date, time: body.time, guests });
      const reservationId = await ReservationModel.create(
        {
          customerId,
          tableId,
          date: body.date,
          time: body.time,
          guests,
          specialRequest: body.specialRequest,
          status,
          createdBy: actor.id,
        },
        conn
      );
      await syncReservedStatus(conn, tableId);
      return reservationId;
    });

    logActivity({
      userId: actor.id,
      action: `Created reservation ${id}`,
      activityType: 'reservation',
      entityType: 'reservation',
      entityId: id,
      newValue: { date: body.date, time: body.time, guests, tableId, status },
    });
    return toDto(await requireReservation(id));
  },

  async update(id, body, actor) {
    const existing = await requireReservation(id);
    if (existing.status === 'seated') {
      throw new AppError('A seated reservation can no longer be changed.', 409, 'ALREADY_SEATED');
    }

    const guests = body.guests || body.guestCount || body.partySize;
    const fields = {};
    if (body.date) fields.reservation_date = body.date;
    if (body.time) fields.reservation_time = body.time;
    if (guests) fields.guest_count = guests;
    if (body.specialRequest !== undefined) fields.special_request = body.specialRequest;

    let tableId = existing.table_id;
    if (body.tableId || body.table) {
      tableId = await resolveTableId(body, {
        date: body.date || existing.reservation_date,
        time: body.time || existing.reservation_time,
        guests: guests || existing.guest_count,
      });
      fields.table_id = tableId;
    }

    const status = body.status ? normalizeEnum(body.status, CREATABLE_STATUSES.concat('seated'), 'Status') : undefined;
    if (!Object.keys(fields).length && !status) throw new AppError('Nothing to update.', 400, 'NOTHING_TO_UPDATE');

    if (body.date) assertDateAllowed(body.date);

    await withTransaction(async (conn) => {
      if (Object.keys(fields).length) {
        await assertTableFits(conn, {
          tableId,
          date: body.date || existing.reservation_date,
          time: body.time || existing.reservation_time,
          guests: guests || existing.guest_count,
          excludeId: id,
        });
        await updateById('reservations', id, fields, conn);
      }
      if (status && status !== existing.status) {
        const current = await ReservationModel.findById(id, conn);
        await applyStatus(conn, current, status, actor);
      }
      await syncReservedStatus(conn, tableId);
      if (tableId !== existing.table_id) await syncReservedStatus(conn, existing.table_id);
    });

    logActivity({
      userId: actor.id,
      action: `Updated reservation ${id}`,
      activityType: 'reservation',
      entityType: 'reservation',
      entityId: id,
      newValue: { ...fields, status },
    });
    return toDto(await requireReservation(id));
  },

  async setStatus(id, body, actor) {
    const existing = await requireReservation(id);
    const status = normalizeEnum(body.status, RESERVATION_STATUSES, 'Status');

    await withTransaction((conn) => applyStatus(conn, existing, status, actor));

    logActivity({
      userId: actor.id,
      action: `Reservation ${id} status changed to ${status}`,
      activityType: 'reservation',
      entityType: 'reservation',
      entityId: id,
      oldValue: { status: existing.status },
      newValue: { status },
    });
    return toDto(await requireReservation(id));
  },

  async cancelMine(id, user) {
    const customer = await requireOwnCustomer(user);
    const existing = await requireReservation(id);
    if (existing.customer_id !== customer.id) throw new AppError('Reservation not found.', 404, 'RESERVATION_NOT_FOUND');
    if (!['pending', 'confirmed'].includes(existing.status)) {
      throw new AppError('Only pending or confirmed reservations can be cancelled.', 409, 'NOT_CANCELLABLE');
    }

    await withTransaction((conn) => applyStatus(conn, existing, 'cancelled', user));
    logActivity({
      userId: user.id,
      action: `Customer cancelled reservation ${id}`,
      activityType: 'reservation',
      entityType: 'reservation',
      entityId: id,
    });
    return toDto(await requireReservation(id));
  },

  async remove(id, actor) {
    const existing = await requireReservation(id);
    await withTransaction(async (conn) => {
      await ReservationModel.remove(id, conn);
      await syncReservedStatus(conn, existing.table_id);
    });
    logActivity({ userId: actor.id, action: `Deleted reservation ${id}`, activityType: 'reservation', entityType: 'reservation', entityId: id });
    return { message: 'Reservation deleted successfully.' };
  },
};

module.exports = ReservationService;