const express = require('express');
const controller = require('../controllers/tableController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate, idParam } = require('../utils/validate');
const { ROLES, STAFF_ROLES, TABLE_SHAPES } = require('../utils/constants');

const router = express.Router();
const managers = [ROLES.ADMIN, ROLES.MANAGER];
const floorStaff = [ROLES.ADMIN, ROLES.MANAGER, ROLES.WAITER, ROLES.CASHIER];

const tableFields = {
  tableNumber: { type: 'string', maxLength: 20, label: 'Table number' },
  number: { type: 'string', maxLength: 20, label: 'Table number' },
  name: { type: 'string', maxLength: 20, label: 'Table name' },
  capacity: { type: 'integer', min: 1, max: 100, label: 'Capacity' },
  section: { type: 'string', maxLength: 50, label: 'Section' },
  location: { type: 'string', maxLength: 50, label: 'Location' },
  shape: { type: 'string', lowercase: true, in: TABLE_SHAPES, label: 'Shape' },
  posX: { type: 'integer', min: 0, max: 100000, label: 'Position X' },
  posY: { type: 'integer', min: 0, max: 100000, label: 'Position Y' },
  status: { type: 'string', maxLength: 20, label: 'Status' },
  assignedWaiterId: { type: 'integer', min: 1, nullable: true, label: 'Waiter' },
  parentTableId: { type: 'integer', min: 1, nullable: true, label: 'Parent table' },
  qrCodeUrl: { type: 'string', maxLength: 255, label: 'QR code URL' },
};

router.use(verifyToken);

router.get(
  '/available',
  validate({
    query: {
      date: { type: 'date', required: true, label: 'Date' },
      time: { type: 'time', required: true, label: 'Time' },
      guests: { type: 'integer', min: 1, max: 100, default: 1, label: 'Guests' },
    },
  }),
  controller.available
);

router.get('/mine', authorize(ROLES.WAITER), controller.mine);

router.get(
  '/',
  authorize(STAFF_ROLES),
  validate({
    query: {
      status: { type: 'string', maxLength: 20 },
      section: { type: 'string', maxLength: 50 },
      search: { type: 'string', maxLength: 50 },
    },
  }),
  controller.list
);

router.post(
  '/',
  authorize(managers),
  validate({ body: { ...tableFields, capacity: { ...tableFields.capacity, required: true } } }),
  controller.create
);

router.get('/:id', authorize(STAFF_ROLES), validate({ params: idParam }), controller.get);
router.put('/:id', authorize(managers), validate({ params: idParam, body: tableFields }), controller.update);
router.delete('/:id', authorize(managers), validate({ params: idParam }), controller.remove);

router.patch(
  '/:id/status',
  authorize(floorStaff),
  validate({ params: idParam, body: { status: { type: 'string', required: true, maxLength: 20, label: 'Status' } } }),
  controller.setStatus
);

router.patch(
  '/:id/waiter',
  authorize(managers),
  validate({ params: idParam, body: { waiterId: { type: 'integer', min: 1, nullable: true, label: 'Waiter' } } }),
  controller.assignWaiter
);

router.post(
  '/:id/seat',
  authorize(ROLES.ADMIN, ROLES.MANAGER, ROLES.WAITER),
  validate({
    params: idParam,
    body: {
      guestCount: { type: 'integer', min: 1, max: 100, default: 1, label: 'Guests' },
      customerId: { type: 'integer', min: 1, label: 'Customer' },
      waiterId: { type: 'integer', min: 1, label: 'Waiter' },
    },
  }),
  controller.seat
);

router.post(
  '/:id/release',
  authorize(floorStaff),
  validate({ params: idParam, body: { status: { type: 'string', maxLength: 20, label: 'Status' } } }),
  controller.release
);

module.exports = router;