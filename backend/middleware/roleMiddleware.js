// Any old or new role name -> one standard lowercase name
const ROLE_ALIASES = {
  "super administrator": "admin",
  superadmin: "admin",
  admin: "admin",
  "restaurant manager": "manager",
  manager: "manager",
  cashier: "cashier",
  "kitchen staff": "kitchen",
  kitchen: "kitchen",
  waiter: "waiter",
  customer: "customer",
};

const normalizeRole = (value) => {
  const key = String(value || "")
    .trim()
    .toLowerCase();
  return ROLE_ALIASES[key] || key;
};

// Reads the roles from the token, whether it holds `roles` (array) or `role` (string)
const getUserRoles = (user) => {
  if (!user) return [];
  const list = Array.isArray(user.roles) ? user.roles : [];
  if (user.role) list.push(user.role);
  return list.map(normalizeRole).filter(Boolean);
};

// allowRoles('manager', 'cashier')  or  allowRoles(['manager', 'cashier'])
// -> only those roles. Admin always passes.
// Use it AFTER verifyToken:  router.get('/', verifyToken, allowRoles('waiter'), handler)
exports.allowRoles = (...allowed) => {
  const allowedRoles = allowed.flat().map(normalizeRole);

  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Access denied. No token provided." });
    }

    const roles = getUserRoles(req.user);
    if (roles.includes("admin") || roles.some((r) => allowedRoles.includes(r)))
      return next();

    return res
      .status(403)
      .json({
        success: false,
        message: "You do not have access to this feature.",
      });
  };
};
