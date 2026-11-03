const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');
const UserManagementModel = require('../models/userManagementModel');
const AppError = require('../utils/AppError');
const { withTransaction } = require('../utils/transaction');
const { logActivity } = require('../utils/activityLog');
const { toOffset, pageMeta } = require('../utils/pagination');
const { mapFields, updateById, isForeignKeyError } = require('../utils/sql');
const { normalizeRoleName, ROLE_LABELS } = require('../utils/roleNames');
const { generateUsername, generatePassword } = require('../utils/credentials');
const { ROLES, getPrimaryRoleKey } = require('../utils/constants');
const { bcryptRounds, restaurantId } = require('../config/auth');

function toDto(row) {
  const roles = row.role_names ? row.role_names.split(',') : [];
  const primaryKey = getPrimaryRoleKey(roles);
  const role = roles.find((name) => name.toLowerCase() === primaryKey) || roles[0] || null;
  const isActive = Boolean(row.is_active);

  return {
    id: row.id,
    restaurant_id: row.restaurant_id,
    username: row.username,
    email: row.email,
    name: row.full_name,
    full_name: row.full_name,
    fullName: row.full_name,
    phone: row.phone,
    avatar: row.avatar_url,
    avatar_url: row.avatar_url,
    language: row.language,
    role,
    roleLabel: role ? ROLE_LABELS[role] || role : null,
    roles,
    status: isActive ? 'Active' : 'Inactive',
    is_active: isActive,
    isActive,
    last_login: row.last_login,
    lastLogin: row.last_login,
    created_at: row.created_at,
    createdAt: row.created_at,
  };
}

async function resolveRoles(body) {
  const raw = Array.isArray(body.roles) && body.roles.length ? body.roles : body.role ? [body.role] : [];
  const names = [];
  raw.forEach((input) => {
    const name = normalizeRoleName(input);
    if (!name) throw new AppError(`Unknown role: ${input}`, 422, 'UNKNOWN_ROLE');
    if (!names.includes(name)) names.push(name);
  });

  if (names.length) {
    const found = await UserManagementModel.findExistingRoleNames(names);
    const missing = names.filter((name) => !found.includes(name));
    if (missing.length) throw new AppError(`Role not found in database: ${missing.join(', ')}`, 422, 'UNKNOWN_ROLE');
  }
  return names;
}

const resolveActive = (body) => {
  if (body.isActive !== undefined) return body.isActive;
  if (body.status !== undefined) return body.status === 'active';
  return undefined;
};

const splitName = (fullName) => {
  const parts = String(fullName).trim().split(/\s+/);
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
};

async function createAccount({ email, fullName, phone, roles, password, username, isActive = true, language, assignedBy }, conn) {
  if (await UserModel.emailExists(email, conn)) {
    throw new AppError('An account with this email already exists.', 409, 'EMAIL_TAKEN');
  }

  let finalUsername = username;
  if (finalUsername) {
    if (await UserModel.usernameExists(finalUsername, conn)) {
      throw new AppError('This username is already taken.', 409, 'USERNAME_TAKEN');
    }
  } else {
    finalUsername = await generateUsername(email, (candidate) => UserModel.usernameExists(candidate, conn));
  }

  const plainPassword = password || generatePassword();
  const passwordHash = await bcrypt.hash(plainPassword, bcryptRounds);

  const userId = await UserModel.createUser(
    { restaurantId, username: finalUsername, email, passwordHash, fullName, phone, language: language || 'en' },
    conn
  );

  for (const roleName of roles) {
    await UserModel.assignRole(userId, roleName, assignedBy, conn);
  }

  if (roles.includes(ROLES.CUSTOMER)) {
    const { firstName, lastName } = splitName(fullName);
    await UserModel.createCustomer({ userId, firstName, lastName, email, phone }, conn);
  }

  if (!isActive) await UserModel.updateProfile(userId, { is_active: false }, conn);

  return { id: userId, username: finalUsername, temporaryPassword: password ? null : plainPassword };
}

async function assertAdminSafety({ existing, currentRoles, nextRoles, nextActive, actor, action }) {
  const wasActiveAdmin = currentRoles.includes(ROLES.ADMIN) && Boolean(existing.is_active);
  const staysActiveAdmin = nextRoles.includes(ROLES.ADMIN) && nextActive;

  if (existing.id === actor.id && !nextActive) {
    throw new AppError('You cannot deactivate or delete your own account.', 409, 'SELF_ACTION');
  }
  if (wasActiveAdmin && !staysActiveAdmin) {
    if (existing.id === actor.id) {
      throw new AppError(`You cannot ${action} your own administrator access.`, 409, 'SELF_ACTION');
    }
    const others = await UserManagementModel.countOtherActiveAdmins(existing.id);
    if (others < 1) throw new AppError('At least one active administrator must remain.', 409, 'LAST_ADMIN');
  }
}

const UserService = {
  toDto,
  createAccount,

  async list({ search, role, status, page, limit }) {
    let roleName = null;
    if (role) {
      roleName = normalizeRoleName(role);
      if (!roleName) throw new AppError(`Unknown role: ${role}`, 422, 'UNKNOWN_ROLE');
    }
    const filters = { search, role: roleName, status };
    const [rows, total] = await Promise.all([
      UserManagementModel.list(filters, { limit, offset: toOffset(page, limit) }),
      UserManagementModel.count(filters),
    ]);
    return { rows: rows.map(toDto), pagination: pageMeta(page, limit, total) };
  },

  async get(id) {
    const row = await UserManagementModel.findById(id);
    if (!row) throw new AppError('User not found.', 404, 'USER_NOT_FOUND');
    return toDto(row);
  },

  async create(body, actor) {
    const fullName = body.fullName || body.name;
    if (!fullName) throw new AppError('Full name is required.', 422, 'VALIDATION_ERROR');

    const roles = await resolveRoles(body);
    if (!roles.length) throw new AppError('At least one role is required.', 422, 'VALIDATION_ERROR');

    const active = resolveActive(body);
    const account = await withTransaction((conn) =>
      createAccount(
        {
          email: body.email,
          fullName,
          phone: body.phone,
          roles,
          password: body.password,
          username: body.username,
          isActive: active === undefined ? true : active,
          language: body.language,
          assignedBy: actor.id,
        },
        conn
      )
    );

    logActivity({
      userId: actor.id,
      action: `Created user ${body.email}`,
      activityType: 'user',
      entityType: 'user',
      entityId: account.id,
      newValue: { email: body.email, roles },
    });

    return { user: await UserService.get(account.id), temporaryPassword: account.temporaryPassword };
  },

  async update(id, body, actor) {
    const existing = await UserManagementModel.findById(id);
    if (!existing) throw new AppError('User not found.', 404, 'USER_NOT_FOUND');

    const currentRoles = existing.role_names ? existing.role_names.split(',') : [];
    const fields = mapFields(body, { phone: 'phone', avatarUrl: 'avatar_url', language: 'language' });
    const fullName = body.fullName || body.name;
    if (fullName !== undefined) fields.full_name = fullName;

    if (body.email !== undefined && body.email !== existing.email) {
      if (await UserManagementModel.emailTakenByOther(body.email, id)) {
        throw new AppError('Another account already uses this email.', 409, 'EMAIL_TAKEN');
      }
      fields.email = body.email;
    }

    const active = resolveActive(body);
    const nextActive = active === undefined ? Boolean(existing.is_active) : active;
    if (active !== undefined) fields.is_active = active;

    const rolesProvided = body.role !== undefined || (Array.isArray(body.roles) && body.roles.length > 0);
    const nextRoles = rolesProvided ? await resolveRoles(body) : currentRoles;

    await assertAdminSafety({ existing, currentRoles, nextRoles, nextActive, actor, action: 'remove' });

    await withTransaction(async (conn) => {
      await updateById('users', id, fields, conn);

      if (rolesProvided) {
        await UserManagementModel.replaceRoles(id, nextRoles, actor.id, conn);
        if (nextRoles.includes(ROLES.CUSTOMER) && !(await UserModel.getCustomerByUserId(id, conn))) {
          const { firstName, lastName } = splitName(fields.full_name || existing.full_name);
          await UserModel.createCustomer(
            { userId: id, firstName, lastName, email: fields.email || existing.email, phone: fields.phone || existing.phone },
            conn
          );
        }
      }
      if (rolesProvided || active === false) await UserModel.revokeAllSessions(id, conn);
    });

    logActivity({
      userId: actor.id,
      action: `Updated user ${existing.email}`,
      activityType: 'user',
      entityType: 'user',
      entityId: id,
      oldValue: { roles: currentRoles, is_active: Boolean(existing.is_active) },
      newValue: { roles: nextRoles, is_active: nextActive },
    });

    return UserService.get(id);
  },

  async resetPassword(id, password, actor) {
    const existing = await UserModel.findById(id);
    if (!existing) throw new AppError('User not found.', 404, 'USER_NOT_FOUND');

    const passwordHash = await bcrypt.hash(password, bcryptRounds);
    await withTransaction(async (conn) => {
      await UserModel.updatePassword(id, passwordHash, conn);
      await UserModel.revokeAllSessions(id, conn);
    });

    logActivity({
      userId: actor.id,
      action: `Reset password for ${existing.email}`,
      activityType: 'user',
      entityType: 'user',
      entityId: id,
    });
    return { message: 'Password reset successfully. The user must log in again.' };
  },

  async remove(id, actor) {
    const existing = await UserManagementModel.findById(id);
    if (!existing) throw new AppError('User not found.', 404, 'USER_NOT_FOUND');

    const currentRoles = existing.role_names ? existing.role_names.split(',') : [];
    await assertAdminSafety({ existing, currentRoles, nextRoles: [], nextActive: false, actor, action: 'delete' });

    try {
      await UserManagementModel.remove(id);
    } catch (err) {
      if (isForeignKeyError(err)) {
        throw new AppError(
          'This user has related records and cannot be deleted. Deactivate the account instead.',
          409,
          'HAS_RELATED_RECORDS'
        );
      }
      throw err;
    }

    logActivity({
      userId: actor.id,
      action: `Deleted user ${existing.email}`,
      activityType: 'user',
      entityType: 'user',
      entityId: id,
      oldValue: { email: existing.email, roles: currentRoles },
    });
    return { message: 'User deleted successfully.' };
  },
};

module.exports = UserService;