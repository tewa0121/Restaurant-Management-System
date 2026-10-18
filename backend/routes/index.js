const router = require('express').Router();
const authenticate = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');
const { ROLES } = require('../utils/constants');

router.get('/health', (req, res) => res.json({ status: 'ok' }));
router.use('/auth', require('./authRoutes'));

// Example of a protected, role-restricted route. Add real modules the same way:
// router.use('/menu', authenticate, require('./menuRoutes'));
router.get('/admin/ping', authenticate, allowRoles(ROLES.ADMIN), (req, res) => res.json({ message: 'Admin access confirmed.' }));

module.exports = router;