const express = require('express');
const controller = require('../controllers/settingsController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../utils/validate');
const { ROLES } = require('../utils/constants');

const router = express.Router();

router.get('/public', controller.getPublic);

router.get('/', verifyToken, authorize(ROLES.ADMIN, ROLES.MANAGER), controller.get);

router.put(
  '/',
  verifyToken,
  authorize(ROLES.ADMIN),
  validate({
    body: {
      restaurantName: { type: 'string', minLength: 2, maxLength: 100, label: 'Restaurant name' },
      address: { type: 'string', maxLength: 1000, label: 'Address' },
      phone: { type: 'string', maxLength: 20, label: 'Phone' },
      currency: { type: 'string', minLength: 1, maxLength: 20, label: 'Currency' },
      taxRate: { type: 'number', min: 0, max: 100, strip: /[^0-9.\-]/g, label: 'Tax rate' },
      deliveryFee: { type: 'number', min: 0, max: 999999, strip: /[^0-9.\-]/g, label: 'Delivery fee' },
      openingTime: { type: 'time', label: 'Opening time' },
      closingTime: { type: 'time', label: 'Closing time' },
      receiptFooter: { type: 'string', maxLength: 500, label: 'Receipt footer' },
      notificationsEnabled: { type: 'boolean', label: 'Notifications' },
    },
  }),
  controller.update
);

module.exports = router;