const express = require('express');
const controller = require('../controllers/dashboardController');
const { verifyToken, optionalAuth } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { ROLES } = require('../utils/constants');

const router = express.Router();

router.get('/customer', optionalAuth, controller.customer);

router.get('/admin', verifyToken, authorize(ROLES.ADMIN), controller.admin);
router.get('/manager', verifyToken, authorize(ROLES.ADMIN, ROLES.MANAGER), controller.manager);
router.get('/cashier', verifyToken, authorize(ROLES.ADMIN, ROLES.MANAGER, ROLES.CASHIER), controller.cashier);
router.get('/kitchen', verifyToken, authorize(ROLES.ADMIN, ROLES.MANAGER, ROLES.KITCHEN), controller.kitchen);
router.get('/waiter', verifyToken, authorize(ROLES.ADMIN, ROLES.MANAGER, ROLES.WAITER), controller.waiter);

module.exports = router;