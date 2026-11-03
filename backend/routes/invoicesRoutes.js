const express = require('express');
const controller = require('../controllers/invoiceController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate, idParam } = require('../utils/validate');
const { paginationQuery } = require('../utils/pagination');
const { ROLES, STAFF_ROLES } = require('../utils/constants');

const router = express.Router();
const billingStaff = [ROLES.ADMIN, ROLES.MANAGER, ROLES.CASHIER];
const floorStaff = [ROLES.ADMIN, ROLES.MANAGER, ROLES.CASHIER, ROLES.WAITER];
const everyone = [...STAFF_ROLES, ROLES.CUSTOMER];

router.use(verifyToken);

router.post(
  '/',
  authorize(floorStaff),
  validate({ body: { orderId: { type: 'integer', required: true, min: 1, label: 'Order' } } }),
  controller.generate
);

router.get(
  '/',
  authorize(billingStaff),
  validate({
    query: {
      status: { type: 'string', maxLength: 20 },
      orderId: { type: 'integer', min: 1 },
      date: { type: 'date' },
      from: { type: 'date' },
      to: { type: 'date' },
      search: { type: 'string', maxLength: 100 },
      ...paginationQuery,
    },
  }),
  controller.list
);

router.get(
  '/mine',
  authorize(ROLES.CUSTOMER),
  validate({ query: { status: { type: 'string', maxLength: 20 }, ...paginationQuery } }),
  controller.mine
);

router.get(
  '/order/:orderId',
  authorize(everyone),
  validate({ params: { orderId: { type: 'integer', required: true, min: 1 } } }),
  controller.getByOrder
);

router.get('/:id', authorize(everyone), validate({ params: idParam }), controller.get);
router.post('/:id/hold', authorize(floorStaff), validate({ params: idParam }), controller.hold);
router.post('/:id/resume', authorize(floorStaff), validate({ params: idParam }), controller.resume);
router.delete('/:id', authorize(ROLES.ADMIN, ROLES.MANAGER), validate({ params: idParam }), controller.remove);

module.exports = router;