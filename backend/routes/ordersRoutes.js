const express = require('express');
const controller = require('../controllers/orderController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate, idParam } = require('../utils/validate');
const { paginationQuery } = require('../utils/pagination');
const { ROLES, STAFF_ROLES } = require('../utils/constants');

const router = express.Router();
const floorStaff = [ROLES.ADMIN, ROLES.MANAGER, ROLES.WAITER, ROLES.CASHIER];
const kitchenStaff = [ROLES.ADMIN, ROLES.MANAGER, ROLES.KITCHEN];
const everyone = [...STAFF_ROLES, ROLES.CUSTOMER];
const itemParams = { ...idParam, itemId: { type: 'integer', required: true, min: 1 } };

const itemSchema = {
  menuItemId: { type: 'integer', min: 1, label: 'Menu item' },
  id: { type: 'integer', min: 1, label: 'Menu item' },
  quantity: { type: 'integer', min: 1, max: 99, label: 'Quantity' },
  qty: { type: 'integer', min: 1, max: 99, label: 'Quantity' },
  specialInstructions: { type: 'string', maxLength: 500, label: 'Special instructions' },
  notes: { type: 'string', maxLength: 500, label: 'Notes' },
  modifierIds: { type: 'array', items: { type: 'integer', min: 1 }, maxItems: 20, label: 'Modifiers' },
};

const itemsField = { type: 'array', required: true, minItems: 1, maxItems: 50, schema: itemSchema, label: 'Items' };

const orderFields = {
  orderType: { type: 'string', maxLength: 20, label: 'Order type' },
  type: { type: 'string', maxLength: 20, label: 'Order type' },
  items: itemsField,
  discountCode: { type: 'string', maxLength: 50, label: 'Promo code' },
  promoCode: { type: 'string', maxLength: 50, label: 'Promo code' },
  customerId: { type: 'integer', min: 1, label: 'Customer' },
};

router.use(verifyToken);

router.post('/preview', authorize(everyone), validate({ body: orderFields }), controller.preview);

router.get(
  '/kitchen',
  authorize([...kitchenStaff, ROLES.WAITER]),
  validate({
    query: {
      status: { type: 'string', maxLength: 60 },
      date: { type: 'date' },
      page: { type: 'integer', min: 1, default: 1 },
      limit: { type: 'integer', min: 1, max: 200, default: 100 },
    },
  }),
  controller.kitchen
);

router.get(
  '/mine',
  authorize(ROLES.CUSTOMER),
  validate({ query: { status: { type: 'string', maxLength: 60 }, ...paginationQuery } }),
  controller.mine
);

router.get('/feedback', authorize(ROLES.ADMIN, ROLES.MANAGER), validate({ query: paginationQuery }), controller.listFeedback);

router.post(
  '/',
  authorize([...floorStaff, ROLES.CUSTOMER]),
  validate({
    body: {
      ...orderFields,
      tableIds: { type: 'array', items: { type: 'integer', min: 1 }, maxItems: 10, label: 'Tables' },
      tableId: { type: 'integer', min: 1, label: 'Table' },
      table: { type: 'string', maxLength: 20, label: 'Table' },
      guestCount: { type: 'integer', min: 1, max: 100, label: 'Guests' },
      customerName: { type: 'string', maxLength: 100, label: 'Customer name' },
      customerPhone: { type: 'string', maxLength: 20, label: 'Customer phone' },
      customerEmail: { type: 'email', label: 'Customer email' },
      waiterId: { type: 'integer', min: 1, label: 'Waiter' },
      notes: { type: 'string', maxLength: 2000, label: 'Notes' },
      addressId: { type: 'integer', min: 1, label: 'Address' },
      deliveryAddress: { type: 'string', maxLength: 500, label: 'Delivery address' },
      deliveryPhone: { type: 'string', maxLength: 20, label: 'Delivery phone' },
      deliveryInstructions: { type: 'string', maxLength: 500, label: 'Delivery instructions' },
    },
  }),
  controller.create
);

router.get(
  '/',
  authorize(floorStaff),
  validate({
    query: {
      status: { type: 'string', maxLength: 60 },
      type: { type: 'string', maxLength: 20 },
      tableId: { type: 'integer', min: 1 },
      waiterId: { type: 'integer', min: 1 },
      customerId: { type: 'integer', min: 1 },
      date: { type: 'date' },
      from: { type: 'date' },
      to: { type: 'date' },
      search: { type: 'string', maxLength: 100 },
      mine: { type: 'boolean', default: false },
      ...paginationQuery,
    },
  }),
  controller.list
);

router.get('/:id', authorize(everyone), validate({ params: idParam }), controller.get);
router.get('/:id/track', authorize(everyone), validate({ params: idParam }), controller.track);

router.patch(
  '/:id/status',
  authorize(STAFF_ROLES),
  validate({ params: idParam, body: { status: { type: 'string', required: true, maxLength: 20, label: 'Status' } } }),
  controller.changeStatus
);

router.patch('/:id/cancel', authorize(ROLES.CUSTOMER), validate({ params: idParam }), controller.cancelMine);

router.patch(
  '/:id',
  authorize(floorStaff),
  validate({
    params: idParam,
    body: {
      notes: { type: 'string', maxLength: 2000, label: 'Notes' },
      waiterId: { type: 'integer', min: 1, label: 'Waiter' },
    },
  }),
  controller.update
);

router.patch(
  '/:id/priority',
  authorize(kitchenStaff),
  validate({ params: idParam, body: { priority: { type: 'integer', required: true, min: 0, max: 10, label: 'Priority' } } }),
  controller.setPriority
);

router.post('/:id/items', authorize(floorStaff), validate({ params: idParam, body: { items: itemsField } }), controller.addItems);
router.delete('/:id/items/:itemId', authorize(floorStaff), validate({ params: itemParams }), controller.removeItem);
router.patch(
  '/:id/items/:itemId/status',
  authorize(kitchenStaff),
  validate({
    params: itemParams,
    body: {
      status: { type: 'string', maxLength: 20, label: 'Status' },
      progress: { type: 'integer', min: 0, max: 100, label: 'Progress' },
    },
  }),
  controller.updateItemStatus
);

router.post(
  '/:id/feedback',
  authorize(ROLES.CUSTOMER),
  validate({
    params: idParam,
    body: {
      rating: { type: 'integer', required: true, min: 1, max: 5, label: 'Rating' },
      comment: { type: 'string', maxLength: 2000, label: 'Comment' },
    },
  }),
  controller.addFeedback
);

module.exports = router;