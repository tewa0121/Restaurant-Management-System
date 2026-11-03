const express = require('express');
const controller = require('../controllers/menuController');
const { verifyToken, optionalAuth } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate, idParam } = require('../utils/validate');
const { ROLES } = require('../utils/constants');

const router = express.Router();
const managers = [ROLES.ADMIN, ROLES.MANAGER];
const modifierParams = { ...idParam, modifierId: { type: 'integer', required: true, min: 1 } };

const categoryFields = {
  name: { type: 'string', minLength: 2, maxLength: 50, label: 'Name' },
  displayOrder: { type: 'integer', min: 0, max: 9999, label: 'Display order' },
  isActive: { type: 'boolean', label: 'Active flag' },
};

const itemFields = {
  name: { type: 'string', minLength: 2, maxLength: 100, label: 'Name' },
  categoryId: { type: 'integer', min: 1, label: 'Category' },
  category: { type: 'string', maxLength: 50, label: 'Category' },
  description: { type: 'string', maxLength: 2000, label: 'Description' },
  price: { type: 'number', min: 0, max: 999999, strip: /[^0-9.\-]/g, label: 'Price' },
  imageUrl: { type: 'string', maxLength: 255, label: 'Image URL' },
  image: { type: 'string', maxLength: 255, label: 'Image URL' },
  isAvailable: { type: 'boolean', label: 'Availability' },
  available: { type: 'boolean', label: 'Availability' },
  preparationTime: { type: 'integer', min: 0, max: 600, label: 'Preparation time' },
};

const modifierFields = {
  name: { type: 'string', minLength: 1, maxLength: 100, label: 'Name' },
  priceModifier: { type: 'number', min: -999999, max: 999999, strip: /[^0-9.\-]/g, label: 'Price modifier' },
  isAvailable: { type: 'boolean', label: 'Availability' },
  available: { type: 'boolean', label: 'Availability' },
};

router.get(
  '/categories',
  optionalAuth,
  validate({ query: { includeInactive: { type: 'boolean', default: false } } }),
  controller.listCategories
);
router.get(
  '/items',
  optionalAuth,
  validate({
    query: {
      category: { type: 'string', maxLength: 50 },
      search: { type: 'string', maxLength: 100 },
      available: { type: 'boolean' },
      page: { type: 'integer', min: 1, default: 1 },
      limit: { type: 'integer', min: 1, max: 200, default: 100 },
    },
  }),
  controller.listItems
);
router.get('/items/:id', optionalAuth, validate({ params: idParam }), controller.getItem);
router.get('/items/:id/modifiers', optionalAuth, validate({ params: idParam }), controller.listModifiers);

router.get('/favorites', verifyToken, authorize(ROLES.CUSTOMER), controller.listFavorites);
router.post('/favorites/:id', verifyToken, authorize(ROLES.CUSTOMER), validate({ params: idParam }), controller.addFavorite);
router.delete('/favorites/:id', verifyToken, authorize(ROLES.CUSTOMER), validate({ params: idParam }), controller.removeFavorite);

router.post(
  '/categories',
  verifyToken,
  authorize(managers),
  validate({ body: { ...categoryFields, name: { ...categoryFields.name, required: true } } }),
  controller.createCategory
);
router.put('/categories/:id', verifyToken, authorize(managers), validate({ params: idParam, body: categoryFields }), controller.updateCategory);
router.delete('/categories/:id', verifyToken, authorize(managers), validate({ params: idParam }), controller.removeCategory);

router.post(
  '/items',
  verifyToken,
  authorize(managers),
  validate({
    body: {
      ...itemFields,
      name: { ...itemFields.name, required: true },
      price: { ...itemFields.price, required: true },
    },
  }),
  controller.createItem
);
router.put('/items/:id', verifyToken, authorize(managers), validate({ params: idParam, body: itemFields }), controller.updateItem);
router.patch(
  '/items/:id/availability',
  verifyToken,
  authorize(ROLES.ADMIN, ROLES.MANAGER, ROLES.KITCHEN),
  validate({
    params: idParam,
    body: {
      isAvailable: { type: 'boolean', label: 'Availability' },
      available: { type: 'boolean', label: 'Availability' },
    },
  }),
  controller.setAvailability
);
router.delete('/items/:id', verifyToken, authorize(managers), validate({ params: idParam }), controller.removeItem);

router.post(
  '/items/:id/modifiers',
  verifyToken,
  authorize(managers),
  validate({ params: idParam, body: { ...modifierFields, name: { ...modifierFields.name, required: true } } }),
  controller.createModifier
);
router.put(
  '/modifiers/:modifierId',
  verifyToken,
  authorize(managers),
  validate({ params: { modifierId: modifierParams.modifierId }, body: modifierFields }),
  controller.updateModifier
);
router.delete(
  '/modifiers/:modifierId',
  verifyToken,
  authorize(managers),
  validate({ params: { modifierId: modifierParams.modifierId } }),
  controller.removeModifier
);

module.exports = router;