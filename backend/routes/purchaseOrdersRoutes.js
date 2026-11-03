const express = require('express');
const controller = require('../controllers/purchaseOrderController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate, idParam } = require('../utils/validate');
const { paginationQuery } = require('../utils/pagination');
const { ROLES } = require('../utils/constants');

const router = express.Router();
const managers = [ROLES.ADMIN, ROLES.MANAGER];
const decimal = { type: 'number', strip: /[^0-9.\-]/g };

const itemSchema = {
  ingredientId: { type: 'integer', required: true, min: 1, label: 'Ingredient' },
  quantity: { ...decimal, required: true, min: 0.01, max: 99999999, label: 'Quantity' },
  unitCost: { ...decimal, min: 0, max: 99999999, label: 'Unit cost' },
};

const headerFields = {
  supplierId: { type: 'integer', min: 1, label: 'Supplier' },
  orderDate: { type: 'date', label: 'Order date' },
  expectedDelivery: { type: 'date', label: 'Expected delivery' },
};

router.use(verifyToken);

router.get(
  '/',
  authorize(managers),
  validate({
    query: {
      status: { type: 'string', maxLength: 20 },
      supplierId: { type: 'integer', min: 1 },
      from: { type: 'date' },
      to: { type: 'date' },
      search: { type: 'string', maxLength: 100 },
      ...paginationQuery,
    },
  }),
  controller.list
);

router.get('/suggestions', authorize(managers), controller.suggestions);

router.post(
  '/',
  authorize(managers),
  validate({
    body: {
      ...headerFields,
      supplierId: { ...headerFields.supplierId, required: true },
      items: { type: 'array', required: true, minItems: 1, maxItems: 100, schema: itemSchema, label: 'Items' },
      send: { type: 'boolean', default: false },
    },
  }),
  controller.create
);

router.get('/:id', authorize([...managers, ROLES.KITCHEN]), validate({ params: idParam }), controller.get);
router.put(
  '/:id',
  authorize(managers),
  validate({
    params: idParam,
    body: { ...headerFields, items: { type: 'array', minItems: 1, maxItems: 100, schema: itemSchema, label: 'Items' } },
  }),
  controller.update
);
router.post('/:id/send', authorize(managers), validate({ params: idParam }), controller.send);
router.post('/:id/cancel', authorize(managers), validate({ params: idParam }), controller.cancel);
router.post(
  '/:id/receive',
  authorize([...managers, ROLES.KITCHEN]),
  validate({
    params: idParam,
    body: {
      receiveAll: { type: 'boolean', default: false },
      items: {
        type: 'array',
        maxItems: 100,
        schema: {
          itemId: { type: 'integer', required: true, min: 1, label: 'Item' },
          quantityReceived: { ...decimal, required: true, min: 0, max: 99999999, label: 'Quantity' },
        },
      },
    },
  }),
  controller.receive
);
router.delete('/:id', authorize(managers), validate({ params: idParam }), controller.remove);

module.exports = router;