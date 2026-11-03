const EmployeeModel = require('../models/employeeModel');
const UserModel = require('../models/userModel');
const UserService = require('./userService');
const AppError = require('../utils/AppError');
const { withTransaction } = require('../utils/transaction');
const { logActivity } = require('../utils/activityLog');
const { toOffset, pageMeta } = require('../utils/pagination');
const { mapFields, updateById, isForeignKeyError } = require('../utils/sql');
const { normalizeRoleName } = require('../utils/roleNames');
const { ROLES, SHIFT_ROLES } = require('../utils/constants');

const splitName = (fullName) => {
  const parts = String(fullName).trim().split(/\s+/);
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
};

const resolveNames = (body) => {
  if (body.firstName) return { firstName: body.firstName, lastName: body.lastName || '' };
  const full = body.fullName || body.name;
  return full ? splitName(full) : {};
};

function toDto(row) {
  const isActive = Boolean(row.is_active);
  const salary = row.salary === null || row.salary === undefined ? null : Number(row.salary);
  const name = `${row.first_name} ${row.last_name}`.trim();

  return {
    id: row.id,
    user_id: row.user_id,
    userId: row.user_id,
    employee_code: row.employee_code,
    employeeCode: row.employee_code,
    first_name: row.first_name,
    last_name: row.last_name,
    firstName: row.first_name,
    lastName: row.last_name,
    name,
    full_name: name,
    position: row.position,
    role: row.position,
    department: row.department,
    hire_date: row.hire_date,
    hireDate: row.hire_date,
    salary,
    phone: row.phone,
    email: row.email,
    address: row.address,
    emergency_contact: row.emergency_contact,
    emergencyContact: row.emergency_contact,
    photo_url: row.photo_url,
    photoUrl: row.photo_url,
    is_active: isActive,
    isActive,
    status: isActive ? 'Active' : 'Inactive',
    shift_status: row.shift_status,
    shiftStatus: row.shift_status,
    loginRoles: row.role_names ? row.role_names.split(',') : [],
    created_at: row.created_at,
    createdAt: row.created_at,
  };
}

const requireEmployee = async (id) => {
  const row = await EmployeeModel.findById(id);
  if (!row) throw new AppError('Employee not found.', 404, 'EMPLOYEE_NOT_FOUND');
  return row;
};

const todayString = () => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

const EmployeeService = {
  toDto,

  async list({ search, position, department, status, shiftStatus, page, limit }) {
    const filters = { search, position, department, status, shiftStatus };
    const [rows, total] = await Promise.all([
      EmployeeModel.list(filters, { limit, offset: toOffset(page, limit) }),
      EmployeeModel.count(filters),
    ]);
    return { rows: rows.map(toDto), pagination: pageMeta(page, limit, total) };
  },

  async get(id) {
    return toDto(await requireEmployee(id));
  },

  async getMine(userId) {
    const row = await EmployeeModel.findByUserId(userId);
    if (!row) throw new AppError('No employee profile is linked to this account.', 404, 'EMPLOYEE_NOT_FOUND');
    return toDto(row);
  },

  async create(body, actor) {
    const { firstName, lastName } = resolveNames(body);
    if (!firstName) throw new AppError('Employee name is required.', 422, 'VALIDATION_ERROR');

    const position = body.position || body.role;
    if (!position) throw new AppError('Position is required.', 422, 'VALIDATION_ERROR');

    let loginRole = null;
    if (body.createLogin) {
      if (!body.email) throw new AppError('Email is required to create a login.', 422, 'VALIDATION_ERROR');
      loginRole = normalizeRoleName(body.loginRole || position);
      if (!loginRole || loginRole === ROLES.CUSTOMER) {
        throw new AppError('Choose a login role: Admin, Manager, Waiter, Cashier or Kitchen.', 422, 'UNKNOWN_ROLE');
      }
      if (loginRole === ROLES.ADMIN && !actor.roles.includes(ROLES.ADMIN)) {
        throw new AppError('Only an administrator can create administrator accounts.', 403, 'FORBIDDEN');
      }
    }

    let created = null;
    for (let attempt = 0; attempt < 3 && !created; attempt += 1) {
      try {
        created = await withTransaction(async (conn) => {
          let account = null;
          if (loginRole) {
            account = await UserService.createAccount(
              {
                email: body.email,
                fullName: `${firstName} ${lastName}`.trim(),
                phone: body.phone,
                roles: [loginRole],
                password: body.password,
                isActive: body.isActive === undefined ? true : body.isActive,
                assignedBy: actor.id,
              },
              conn
            );
          }

          const id = await EmployeeModel.create(
            {
              userId: account ? account.id : null,
              employeeCode: await EmployeeModel.nextCode(conn),
              firstName,
              lastName,
              position,
              department: body.department,
              hireDate: body.hireDate,
              salary: body.salary,
              phone: body.phone,
              email: body.email,
              address: body.address,
              emergencyContact: body.emergencyContact,
              photoUrl: body.photoUrl,
              isActive: body.isActive,
            },
            conn
          );
          return { id, temporaryPassword: account ? account.temporaryPassword : null };
        });
      } catch (err) {
        const codeClash = err.code === 'ER_DUP_ENTRY' && /employee_code/.test(err.message || '');
        if (!codeClash || attempt === 2) throw err;
      }
    }

    logActivity({
      userId: actor.id,
      action: `Created employee ${firstName} ${lastName}`.trim(),
      activityType: 'employee',
      entityType: 'employee',
      entityId: created.id,
      newValue: { position, loginRole },
    });

    return { employee: await EmployeeService.get(created.id), temporaryPassword: created.temporaryPassword };
  },

  async update(id, body, actor) {
    const existing = await requireEmployee(id);

    const fields = mapFields(body, {
      department: 'department',
      salary: 'salary',
      phone: 'phone',
      email: 'email',
      address: 'address',
      emergencyContact: 'emergency_contact',
      photoUrl: 'photo_url',
      hireDate: 'hire_date',
    });

    const fullName = body.fullName || body.name;
    if (body.firstName !== undefined) {
      fields.first_name = body.firstName;
      if (body.lastName !== undefined) fields.last_name = body.lastName;
    } else if (fullName) {
      const names = splitName(fullName);
      fields.first_name = names.firstName;
      fields.last_name = names.lastName;
    } else if (body.lastName !== undefined) {
      fields.last_name = body.lastName;
    }

    const position = body.position || body.role;
    if (position) fields.position = position;

    const active = body.isActive !== undefined ? body.isActive : body.status ? body.status === 'active' : undefined;
    if (active !== undefined) fields.is_active = active;

    if (!Object.keys(fields).length) throw new AppError('Nothing to update.', 400, 'NOTHING_TO_UPDATE');

    await withTransaction(async (conn) => {
      await updateById('employees', id, fields, conn);
      if (active !== undefined && existing.user_id) {
        if (active === false && existing.user_id === actor.id) {
          throw new AppError('You cannot deactivate your own account.', 409, 'SELF_ACTION');
        }
        await UserModel.updateProfile(existing.user_id, { is_active: active }, conn);
        if (active === false) await UserModel.revokeAllSessions(existing.user_id, conn);
      }
    });

    logActivity({
      userId: actor.id,
      action: `Updated employee ${existing.employee_code}`,
      activityType: 'employee',
      entityType: 'employee',
      entityId: id,
      newValue: fields,
    });

    return EmployeeService.get(id);
  },

  async remove(id, actor) {
    const existing = await requireEmployee(id);
    if (existing.user_id && existing.user_id === actor.id) {
      throw new AppError('You cannot delete your own employee record.', 409, 'SELF_ACTION');
    }

    try {
      await EmployeeModel.remove(id);
    } catch (err) {
      if (isForeignKeyError(err)) {
        throw new AppError(
          'This employee has related records and cannot be deleted. Mark the employee inactive instead.',
          409,
          'HAS_RELATED_RECORDS'
        );
      }
      throw err;
    }

    logActivity({
      userId: actor.id,
      action: `Deleted employee ${existing.employee_code}`,
      activityType: 'employee',
      entityType: 'employee',
      entityId: id,
    });
    return { message: 'Employee deleted successfully.' };
  },

  async listAttendance(id, query) {
    await requireEmployee(id);
    return EmployeeModel.listAttendance(id, query);
  },

  async recordAttendance(id, body, actor) {
    await requireEmployee(id);
    const record = await EmployeeModel.upsertAttendance({
      employeeId: id,
      date: body.date || todayString(),
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      status: body.status,
      notes: body.notes,
    });
    logActivity({
      userId: actor.id,
      action: `Recorded attendance for employee ${id}`,
      activityType: 'employee',
      entityType: 'attendance',
      entityId: record.id,
    });
    return record;
  },

  async listShifts(query) {
    return EmployeeModel.listShifts(query);
  },

  async listMyShifts(userId, query) {
    const employee = await EmployeeModel.findByUserId(userId);
    if (!employee) throw new AppError('No employee profile is linked to this account.', 404, 'EMPLOYEE_NOT_FOUND');
    return EmployeeModel.listShifts({ ...query, employeeId: employee.id });
  },

  async createShift(id, body, actor) {
    const employee = await requireEmployee(id);
    if (body.endTime <= body.startTime) {
      throw new AppError('Shift end time must be after the start time.', 422, 'VALIDATION_ERROR');
    }

    let role = body.role;
    if (!role) {
      const derived = normalizeRoleName(employee.position);
      const key = derived === ROLES.KITCHEN ? 'kitchen' : derived ? derived.toLowerCase() : null;
      role = SHIFT_ROLES.includes(key) ? key : null;
    }
    if (!role) throw new AppError('Shift role is required (waiter, cashier, kitchen or manager).', 422, 'VALIDATION_ERROR');

    const shiftId = await EmployeeModel.createShift({
      employeeId: id,
      shiftDate: body.shiftDate,
      startTime: body.startTime,
      endTime: body.endTime,
      role,
      assignedBy: actor.id,
    });
    logActivity({
      userId: actor.id,
      action: `Scheduled shift for employee ${id}`,
      activityType: 'employee',
      entityType: 'shift',
      entityId: shiftId,
    });

    const shifts = await EmployeeModel.listShifts({ employeeId: id, date: body.shiftDate });
    return shifts.find((shift) => shift.id === shiftId);
  },

  async removeShift(shiftId, actor) {
    const shift = await EmployeeModel.findShift(shiftId);
    if (!shift) throw new AppError('Shift not found.', 404, 'SHIFT_NOT_FOUND');
    await EmployeeModel.removeShift(shiftId);
    logActivity({ userId: actor.id, action: `Deleted shift ${shiftId}`, activityType: 'employee', entityType: 'shift', entityId: shiftId });
    return { message: 'Shift deleted successfully.' };
  },

  async listReviews(id) {
    await requireEmployee(id);
    return EmployeeModel.listReviews(id);
  },

  async addReview(id, body, actor) {
    await requireEmployee(id);
    const reviewId = await EmployeeModel.createReview({
      employeeId: id,
      reviewedBy: actor.id,
      reviewDate: body.reviewDate,
      rating: body.rating,
      comments: body.comments,
    });
    logActivity({
      userId: actor.id,
      action: `Added performance review for employee ${id}`,
      activityType: 'employee',
      entityType: 'review',
      entityId: reviewId,
    });
    const reviews = await EmployeeModel.listReviews(id);
    return reviews.find((review) => review.id === reviewId);
  },
};

module.exports = EmployeeService;