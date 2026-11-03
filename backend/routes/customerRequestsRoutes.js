const express = require('express');
const controller = require('../controllers/customerRequestController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate, idParam } = require('../utils/validate');
const { paginationQuery } = require('../utils/pagination');
const { ROLES } = require('../utils/constants');

const router = express.Router();
const floorStaff = [ROLES.ADMIN, ROLES.MANAGER, ROLES.WAITER, ROLES.CASHIER];

router.use(verifyToken);

router.get(
  '/',
  authorize(ROLES.ADMIN, ROLES.MANAGER, ROLES.WAITER),
  validate({
    query: {
      status: { type: 'string', maxLength: 40 },
      tableId: { type: 'integer', min: 1 },
      mine: { type: 'boolean', default: false },
      ...paginationQuery,
    },
  }),
  controller.list
);

router.get(
  '/mine',
  authorize(ROLES.CUSTOMER),
  validate({ query: { status: { type: 'string', maxLength: 40 }, ...paginationQuery } }),
  controller.mine
);

router.post(
  '/',
  authorize([...floorStaff, ROLES.CUSTOMER]),
  validate({
    body: {
      text: { type: 'string', minLength: 2, maxLength: 255, label: 'Request' },
      request: { type: 'string', minLength: 2, maxLength: 255, label: 'Request' },
      message: { type: 'string', minLength: 2, maxLength: 255, label: 'Request' },
      tableId: { type: 'integer', min: 1, label: 'Table' },
      table: { type: 'string', maxLength: 20, label: 'Table' },
      orderId: { type: 'integer', min: 1, label: 'Order' },
      customerId: { type: 'integer', min: 1, label: 'Customer' },
    },
  }),
  controller.create
);

router.patch(
  '/:id/status',
  authorize(ROLES.ADMIN, ROLES.MANAGER, ROLES.WAITER),
  validate({ params: idParam, body: { status: { type: 'string', required: true, maxLength: 20, label: 'Status' } } }),
  controller.setStatus
);

router.patch(
  '/:id/assign',
  authorize(ROLES.ADMIN, ROLES.MANAGER),
  validate({ params: idParam, body: { waiterId: { type: 'integer', required: true, min: 1, label: 'Waiter' } } }),
  controller.assign
);

module.exports = router;