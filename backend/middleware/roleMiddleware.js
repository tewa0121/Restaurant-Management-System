const { ROLES } = require('../utils/constants');

// allowRoles(ROLES.MANAGER, ROLES.CASHIER) -> only those roles (Admin always passes).
exports.allowRoles = (...allowed) => (req, res, next) => {
  const roles = req.user?.roles || [];
  if (roles.includes(ROLES.ADMIN) || roles.some((r) => allowed.includes(r))) return next();
  res.status(403).json({ message: 'You do not have access to this feature.' });
};