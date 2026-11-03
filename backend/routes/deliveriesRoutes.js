const express = require('express');
const controller = require('../controllers/deliveryController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../utils/validate');
const { paginationQuery } = require('../utils/pagination');
const { ROLES, STAFF_ROLES } = require('../utils/constants');

const router = express.Router();
const dispatchers = [ROLES.ADMIN, ROLES.MANAGER, ROLES.CASHIER];
const orderParam = { orderId: { type: 'integer', required: true, min: 1 } };

router.use(verifyToken);

router.get(
  '/',
  authorize([...dispatchers, ROLES.WAITER]),
  validate({
    query: {
      status: { type: 'string', maxLength: 20 },
      driverId: { type: 'integer', min: 1 },
      date: { type: 'date' },
      search: { type: 'string', maxLength: 100 },
      ...paginationQuery,
    },
  }),
  controller.list
);

router.get('/drivers', authorize(dispatchers), controller.drivers);

router.get('/:orderId', authorize([...STAFF_ROLES, ROLES.CUSTOMER]), validate({ params: orderParam }), controller.get);

router.post(
  '/:orderId/assign',
  authorize(dispatchers),
  validate({
    params: orderParam,
    body: {
      driverId: { type: 'integer', required: true, min: 1, label: 'Driver' },
      estimatedTime: { type: 'integer', min: 1, max: 600, label: 'Estimated time' },
    },
  }),
  controller.assign
);

router.post(
  '/:orderId/status',
  authorize(dispatchers),
  validate({
    params: orderParam,
    body: {
      status: { type: 'string', required: true, maxLength: 20, label: 'Status' },
      lat: { type: 'number', min: -90, max: 90, label: 'Latitude' },
      lng: { type: 'number', min: -180, max: 180, label: 'Longitude' },
    },
  }),
  controller.updateStatus
);

module.exports = router;