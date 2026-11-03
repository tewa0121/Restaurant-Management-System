const CashSessionModel = require('../models/cashSessionModel');
const EmployeeModel = require('../models/employeeModel');
const InvoiceService = require('./invoiceService');
const { round2 } = require('./pricingService');
const AppError = require('../utils/AppError');
const { logActivity } = require('../utils/activityLog');
const { toOffset, pageMeta } = require('../utils/pagination');
const { hasRole } = require('../middleware/roleMiddleware');
const { ROLES } = require('../utils/constants');

const managers = [ROLES.MANAGER, ROLES.ADMIN];

async function toDto(row) {
  const isOpen = !row.closed_at;
  const [cashIn, cashOut, methods] = await Promise.all([
    CashSessionModel.cashIn(row.id),
    CashSessionModel.cashOut(row.id),
    CashSessionModel.byMethod(row.id),
  ]);

  const opening = Number(row.opening_amount);
  const expectedNow = round2(opening + cashIn.total - cashOut);
  const expected = isOpen || row.expected_amount === null ? expectedNow : Number(row.expected_amount);
  const counted = row.counted_amount === null || row.counted_amount === undefined ? null : Number(row.counted_amount);

  return {
    id: row.id,
    cashier_id: row.cashier_id,
    cashierId: row.cashier_id,
    cashier_name: row.cashier_name && row.cashier_name.trim() ? row.cashier_name.trim() : null,
    opened_at: row.opened_at,
    openedAt: row.opened_at,
    closed_at: row.closed_at || null,
    closedAt: row.closed_at || null,
    isOpen,
    status: isOpen ? 'open' : 'closed',
    opening_amount: opening,
    openingAmount: opening,
    cash_in: cashIn.total,
    cashIn: cashIn.total,
    cash_payments: cashIn.count,
    cash_out: cashOut,
    cashOut,
    expected_amount: expected,
    expectedAmount: expected,
    counted_amount: counted,
    countedAmount: counted,
    variance: counted === null ? null : round2(counted - expected),
    notes: row.notes,
    byMethod: methods.map((entry) => ({
      method: entry.payment_method,
      label: InvoiceService.PAYMENT_LABELS[entry.payment_method] || entry.payment_method,
      total: Number(entry.total),
      count: Number(entry.count),
    })),
  };
}

async function requireEmployee(user) {
  const employee = await EmployeeModel.findByUserId(user.id);
  if (!employee) throw new AppError('No employee profile is linked to this account.', 409, 'EMPLOYEE_NOT_FOUND');
  return employee;
}

const requireSession = async (id) => {
  const row = await CashSessionModel.findById(id);
  if (!row) throw new AppError('Cash session not found.', 404, 'SESSION_NOT_FOUND');
  return row;
};

async function assertCanView(session, user) {
  if (hasRole(user, managers)) return;
  const employee = await EmployeeModel.findByUserId(user.id);
  if (!employee || employee.id !== session.cashier_id) throw new AppError('Cash session not found.', 404, 'SESSION_NOT_FOUND');
}

const CashSessionService = {
  async open({ openingAmount, notes }, actor) {
    const employee = await requireEmployee(actor);
    if (await CashSessionModel.findOpenByCashier(employee.id)) {
      throw new AppError('You already have an open cash session.', 409, 'SESSION_OPEN');
    }
    const id = await CashSessionModel.insert({ cashierId: employee.id, openingAmount: openingAmount || 0, notes });
    logActivity({
      userId: actor.id,
      action: `Opened cash session with ${Number(openingAmount || 0).toFixed(2)}`,
      activityType: 'billing',
      entityType: 'cash_session',
      entityId: id,
    });
    return toDto(await requireSession(id));
  },

  async current(user) {
    const employee = await EmployeeModel.findByUserId(user.id);
    if (!employee) return null;
    const row = await CashSessionModel.findOpenByCashier(employee.id);
    return row ? toDto(row) : null;
  },

  async get(id, user) {
    const row = await requireSession(id);
    await assertCanView(row, user);
    return toDto(row);
  },

  async list({ open, page, limit }, user) {
    const filters = { open };
    if (!hasRole(user, managers)) {
      const employee = await requireEmployee(user);
      filters.cashierId = employee.id;
    }
    const [rows, total] = await Promise.all([
      CashSessionModel.list(filters, { limit, offset: toOffset(page, limit) }),
      CashSessionModel.count(filters),
    ]);
    return { rows: await Promise.all(rows.map(toDto)), pagination: pageMeta(page, limit, total) };
  },

  async close(id, { countedAmount, notes }, actor) {
    const row = await requireSession(id);
    await assertCanView(row, actor);
    if (row.closed_at) throw new AppError('This cash session is already closed.', 409, 'SESSION_CLOSED');

    const [cashIn, cashOut] = await Promise.all([CashSessionModel.cashIn(id), CashSessionModel.cashOut(id)]);
    const expected = round2(Number(row.opening_amount) + cashIn.total - cashOut);
    await CashSessionModel.close(id, { countedAmount, expectedAmount: expected, notes });

    logActivity({
      userId: actor.id,
      action: `Closed cash session ${id} (counted ${Number(countedAmount).toFixed(2)}, expected ${expected.toFixed(2)})`,
      activityType: 'billing',
      entityType: 'cash_session',
      entityId: id,
    });
    return toDto(await requireSession(id));
  },
};

module.exports = CashSessionService;