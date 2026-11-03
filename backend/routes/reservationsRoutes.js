const express = require('express');
const controller = require('../controllers/reservationController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate, idParam } = require('../utils/validate');
const { paginationQuery } = require('../utils/pagination');
const { ROLES } = require('../utils/constants');

const router = express.Router();
const managers = [ROLES.ADMIN, ROLES.MANAGER];
const floorStaff = [ROLES.ADMIN, ROLES.MANAGER, ROLES.WAITER, ROLES.CASHIER];

const reservationFields = {
  customerId: { type: 'integer', min: 1, label: 'Customer' },
  customerName: { type: 'string', minLength: 2, maxLength: 100, label: 'Customer name' },
  customer: { type: 'string', minLength: 2, maxLength: 100, label: 'Customer name' },
  customerPhone: { type: 'string', maxLength: 20, label: 'Customer phone' },
  phone: { type: 'string', maxLength: 20, label: 'Customer phone' },
  customerEmail: { type: 'email', label: 'Customer email' },
  tableId: { type: 'integer', min: 1, label: 'Table' },
  table: { type: 'string', maxLength: 20, label: 'Table' },
  date: { type: 'date', label: 'Date' },
  time: { type: 'time', label: 'Time' },
  guests: { type: 'integer', min: 1, max: 100, label: 'Guests' },
  guestCount: { type: 'integer', min: 1, max: 100, label: 'Guests' },
  partySize: { type: 'integer', min: 1, max: 100, label: 'Guests' },
  specialRequest: { type: 'string', maxLength: 1000, label: 'Special request' },
  status: { type: 'string', maxLength: 20, label: 'Status' },
};

router.use(verifyToken);

router.get(
  '/',
  authorize(floorStaff),
  validate({
    query: {
      date: { type: 'date' },
      from: { type: 'date' },
      to: { type: 'date' },
      status: { type: 'string', maxLength: 20 },
      tableId: { type: 'integer', min: 1 },
      search: { type: 'string', maxLength: 100 },
      ...paginationQuery,
    },
  }),
  controller.list
);

router.get('/mine', authorize(ROLES.CUSTOMER), validate({ query: paginationQuery }), controller.mine);

router.post(
  '/',
  authorize([...floorStaff, ROLES.CUSTOMER]),
  validate({ body: reservationFields }),
  controller.create
);

router.get('/:id', authorize([...floorStaff, ROLES.CUSTOMER]), validate({ params: idParam }), controller.get);
router.put('/:id', authorize(floorStaff), validate({ params: idParam, body: reservationFields }), controller.update);

router.patch(
  '/:id/status',
  authorize(floorStaff),
  validate({ params: idParam, body: { status: { type: 'string', required: true, maxLength: 20, label: 'Status' } } }),
  controller.setStatus
);

router.patch('/:id/cancel', authorize(ROLES.CUSTOMER), validate({ params: idParam }), controller.cancelMine);
router.delete('/:id', authorize(managers), validate({ params: idParam }), controller.remove);

module.exports = router;