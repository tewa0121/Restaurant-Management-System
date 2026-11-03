const AppError = require('../utils/AppError');

const normalize = (value) => String(value).trim().toLowerCase();

const authorize = (...allowed) => {
  const allowedRoles = allowed.flat().map(normalize);

  return (req, res, next) => {
    if (!req.user) return next(new AppError('Authentication required.', 401, 'NO_TOKEN'));

    const userRoles = (req.user.roles || []).map(normalize);
    if (userRoles.includes('admin') || userRoles.some((role) => allowedRoles.includes(role))) {
      return next();
    }

    return next(new AppError('You do not have permission to perform this action.', 403, 'FORBIDDEN'));
  };
};

const hasRole = (user, ...roles) => {
  if (!user) return false;
  const userRoles = (user.roles || []).map(normalize);
  const wanted = roles.flat().map(normalize);
  return userRoles.includes('admin') || userRoles.some((role) => wanted.includes(role));
};

module.exports = { authorize, hasRole };