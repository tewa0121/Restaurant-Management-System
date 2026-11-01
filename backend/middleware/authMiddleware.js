const jwt = require("jsonwebtoken");

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

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user payload to request
    next();
  } catch (err) {
    // 401 = "log in again" (the frontend clears the session on 401). 403 is kept for wrong role.
    const message =
      err.name === "TokenExpiredError"
        ? "Session expired. Please log in again."
        : "Invalid token.";
    return res.status(401).json({ success: false, message });
  }
};

// Works with all of these:
//   requireRole(['admin', 'manager'])
//   requireRole('admin', 'manager')
//   requireRole('admin')
exports.requireRole = (...args) => {
  const allowed = args.flat().map(normalizeRole);

  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Access denied. No token provided." });
    }

    const userRole = normalizeRole(
      req.user.role || (Array.isArray(req.user.roles) ? req.user.roles[0] : ""),
    );

    if (!allowed.includes(userRole)) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Unauthorized access for this role.",
        });
    }
    next();
  };
};
