// middleware/roleMiddleware.js
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    // Support both req.user.role (string) and req.user.roles (array)
    const userRoles = req.user.roles || [req.user.role];

    // Normalize allowedRoles and userRoles to lowercase for reliable comparison
    const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());
    const hasPermission = userRoles.some(role => 
      role && normalizedAllowed.includes(role.toLowerCase())
    );

    if (!hasPermission) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. Required roles: [${allowedRoles.join(', ')}], but got [${userRoles.join(', ')}]` 
      });
    }

    next();
  };
};

module.exports = { requireRole };