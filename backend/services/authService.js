const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const AppError = require('../utils/AppError');
const { withTransaction } = require('../utils/transaction');
const { logActivity } = require('../utils/activityLog');
const { ROLES, getPrimaryRoleKey } = require('../utils/constants');
const {
  jwtSecret,
  shortExpirySeconds,
  longExpirySeconds,
  resetTokenMinutes,
  bcryptRounds,
  restaurantId,
} = require('../config/auth');

const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', bcryptRounds);

const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

const splitName = (fullName) => {
  const parts = String(fullName).trim().split(/\s+/);
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
};

function buildUser(user, roles, employee, customer) {
  return {
    id: user.id,
    name: user.full_name,
    fullName: user.full_name,
    username: user.username,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar_url,
    language: user.language,
    role: getPrimaryRoleKey(roles),
    roles,
    restaurantId: user.restaurant_id,
    employeeId: employee ? employee.id : null,
    employeeCode: employee ? employee.employee_code : null,
    position: employee ? employee.position : null,
    customerId: customer ? customer.id : null,
  };
}

async function loadProfile(user) {
  const [roles, employee, customer] = await Promise.all([
    UserModel.getRoleNames(user.id),
    UserModel.getEmployeeByUserId(user.id),
    UserModel.getCustomerByUserId(user.id),
  ]);
  return buildUser(user, roles, employee, customer);
}

async function makeUsername(email) {
  const base = (email.split('@')[0].toLowerCase().replace(/[^a-z0-9._-]/g, '') || 'user').slice(0, 30);
  if (!(await UserModel.usernameExists(base))) return base;
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const candidate = `${base.slice(0, 40)}${crypto.randomInt(1000, 9999)}`;
    if (!(await UserModel.usernameExists(candidate))) return candidate;
  }
  return `${base.slice(0, 30)}${Date.now()}`.slice(0, 50);
}

const AuthService = {
  async startSession(user, remember, req) {
    const roles = await UserModel.getRoleNames(user.id);
    if (!roles.length) {
      throw new AppError('This account has no role assigned. Please contact an administrator.', 403, 'NO_ROLE_ASSIGNED');
    }

    const ttlSeconds = remember ? longExpirySeconds : shortExpirySeconds;
    const tokenId = crypto.randomUUID();
    const token = jwt.sign({ roles, role: getPrimaryRoleKey(roles) }, jwtSecret, {
      subject: String(user.id),
      jwtid: tokenId,
      expiresIn: ttlSeconds,
    });

    await UserModel.createSession({
      userId: user.id,
      tokenId,
      ip: (req.ip || '').slice(0, 45),
      userAgent: (req.get('user-agent') || '').slice(0, 255),
      ttlSeconds,
    });
    await UserModel.updateLastLogin(user.id);

    const [employee, customer] = await Promise.all([
      UserModel.getEmployeeByUserId(user.id),
      UserModel.getCustomerByUserId(user.id),
    ]);

    return { token, expiresIn: ttlSeconds, user: buildUser(user, roles, employee, customer) };
  },

  async login({ email, password, remember }, req) {
    const user = await UserModel.findByLogin(email);
    const passwordOk = await bcrypt.compare(password, user && user.password_hash ? user.password_hash : DUMMY_HASH);

    if (!user || !user.password_hash || !passwordOk) {
      throw new AppError('Email or password is incorrect.', 401, 'INVALID_CREDENTIALS');
    }
    if (!user.is_active) {
      throw new AppError('This account has been deactivated. Please contact an administrator.', 403, 'ACCOUNT_INACTIVE');
    }

    const result = await AuthService.startSession(user, remember, req);
    logActivity({
      userId: user.id,
      action: 'User logged in',
      activityType: 'auth',
      entityType: 'user',
      entityId: user.id,
      ip: req.ip,
    });
    return result;
  },

  async register({ fullName, email, password, phone }, req) {
    if (await UserModel.emailExists(email)) {
      throw new AppError('An account with this email already exists.', 409, 'EMAIL_TAKEN');
    }

    const username = await makeUsername(email);
    const passwordHash = await bcrypt.hash(password, bcryptRounds);
    const { firstName, lastName } = splitName(fullName);

    const userId = await withTransaction(async (conn) => {
      const id = await UserModel.createUser(
        { restaurantId, username, email, passwordHash, fullName, phone },
        conn
      );
      await UserModel.assignRole(id, ROLES.CUSTOMER, null, conn);
      await UserModel.createCustomer({ userId: id, firstName, lastName, email, phone }, conn);
      return id;
    });

    const user = await UserModel.findById(userId);
    const result = await AuthService.startSession(user, false, req);
    logActivity({
      userId,
      action: 'Customer account registered',
      activityType: 'auth',
      entityType: 'user',
      entityId: userId,
      ip: req.ip,
    });
    return result;
  },

  async getProfile(userId) {
    const user = await UserModel.findById(userId);
    if (!user || !user.is_active) throw new AppError('Account not found or inactive.', 401, 'USER_NOT_FOUND');
    return loadProfile(user);
  },

  async updateProfile(userId, { fullName, phone, avatarUrl, language }) {
    const user = await UserModel.findById(userId);
    if (!user) throw new AppError('Account not found.', 404, 'USER_NOT_FOUND');

    const fields = {};
    if (fullName !== undefined) fields.full_name = fullName;
    if (phone !== undefined) fields.phone = phone;
    if (avatarUrl !== undefined) fields.avatar_url = avatarUrl;
    if (language !== undefined) fields.language = language;
    if (!Object.keys(fields).length) throw new AppError('Nothing to update.', 400, 'NOTHING_TO_UPDATE');

    await withTransaction(async (conn) => {
      await UserModel.updateProfile(userId, fields, conn);
      const customer = await UserModel.getCustomerByUserId(userId, conn);
      if (customer) {
        const names = fullName !== undefined ? splitName(fullName) : {};
        await UserModel.updateCustomerProfile(
          userId,
          { firstName: names.firstName, lastName: names.lastName, phone },
          conn
        );
      }
    });

    return AuthService.getProfile(userId);
  },

  async changePassword(userId, sessionId, { currentPassword, newPassword }) {
    const user = await UserModel.findById(userId);
    if (!user) throw new AppError('Account not found.', 404, 'USER_NOT_FOUND');

    const ok = await bcrypt.compare(currentPassword, user.password_hash || DUMMY_HASH);
    if (!ok) throw new AppError('Current password is incorrect.', 400, 'WRONG_PASSWORD');

    const passwordHash = await bcrypt.hash(newPassword, bcryptRounds);
    await UserModel.updatePassword(userId, passwordHash);
    await UserModel.revokeOtherSessions(userId, sessionId);
    logActivity({ userId, action: 'Password changed', activityType: 'auth', entityType: 'user', entityId: userId });
    return { message: 'Password changed successfully.' };
  },

  async forgotPassword({ email }) {
    const generic = { message: 'If an account exists for this email, a reset link has been sent.' };
    const user = await UserModel.findByLogin(email);
    if (!user || !user.is_active) return generic;

    const rawToken = crypto.randomBytes(32).toString('hex');
    await UserModel.createResetToken({ userId: user.id, tokenHash: sha256(rawToken), ttlMinutes: resetTokenMinutes });
    logActivity({ userId: user.id, action: 'Password reset requested', activityType: 'auth', entityType: 'user', entityId: user.id });

    if (process.env.NODE_ENV !== 'production') return { ...generic, resetToken: rawToken };
    return generic;
  },

  async resetPassword({ token, password }) {
    const record = await UserModel.findValidResetToken(sha256(token));
    if (!record) throw new AppError('This reset link is invalid or has expired.', 400, 'INVALID_RESET_TOKEN');

    const passwordHash = await bcrypt.hash(password, bcryptRounds);
    await withTransaction(async (conn) => {
      await UserModel.updatePassword(record.user_id, passwordHash, conn);
      await UserModel.markResetTokenUsed(record.id, conn);
      await UserModel.revokeAllSessions(record.user_id, conn);
    });
    logActivity({ userId: record.user_id, action: 'Password reset completed', activityType: 'auth', entityType: 'user', entityId: record.user_id });
    return { message: 'Password updated. You can now log in.' };
  },

  async logout(sessionId, userId) {
    if (sessionId) await UserModel.revokeSession(sessionId);
    logActivity({ userId, action: 'User logged out', activityType: 'auth', entityType: 'user', entityId: userId });
    return { message: 'Signed out successfully.' };
  },
};

module.exports = AuthService;