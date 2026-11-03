const express = require('express');
const controller = require('../controllers/inventoryController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate, idParam } = require('../utils/validate');
const { paginationQuery } = require('../utils/pagination');
const { ROLES, MOVEMENT_TYPES } = require('../utils/constants');

const router = express.Router();
const managers = [ROLES.ADMIN, ROLES.MANAGER];
const readers = [ROLES.ADMIN, ROLES.MANAGER, ROLES.KITCHEN];
const decimal = { type: 'number', strip: /[^0-9.\-]/g };

const ingredientFields = {
  name: { type: 'string', minLength: 2, maxLength: 100, label: 'Name' },
  unit: { type: 'string', minLength: 1, maxLength: 20, label: 'Unit' },
  currentStock: { ...decimal, min: 0, max: 99999999, label: 'Current stock' },
  minStockLevel: { ...decimal, min: 0, max: 99999999, label: 'Minimum stock' },
  maxStockLevel: { ...decimal, min: 0, max: 99999999, nullable: true, label: 'Maximum stock' },
  costPerUnit: { ...decimal, min: 0, max: 99999999, label: 'Cost per unit' },
  imageUrl: { type: 'string', maxLength: 255, label: 'Image' },
  supplierId: { type: 'integer', min: 1, nullable: true, label: 'Supplier' },
};

const recipeBody = {
  ingredients: {
    type: 'array',
    required: true,
    maxItems: 100,
    schema: {
      ingredientId: { type: 'integer', required: true, min: 1, label: 'Ingredient' },
      quantityRequired: { ...decimal, required: true, min: 0.01, max: 99999999, label: 'Quantity' },
    },
    label: 'Ingredients',
  },
};

router.use(verifyToken);

router.get('/summary', authorize(readers), controller.summary);
router.get('/ingredients/low', authorize(readers), controller.low);

router.get(
  '/ingredients',
  authorize(readers),
  validate({
    query: {
      search: { type: 'string', maxLength: 100 },
      status: { type: 'string', lowercase: true, in: ['low', 'out', 'ok', 'attention'] },
      supplierId: { type: 'integer', min: 1 },
      ...paginationQuery,
    },
  }),
  controller.list
);

router.post(
  '/ingredients',
  authorize(managers),
  validate({
    body: {
      ...ingredientFields,
      name: { ...ingredientFields.name, required: true },
      unit: { ...ingredientFields.unit, required: true },
      minStockLevel: { ...ingredientFields.minStockLevel, required: true },
    },
  }),
  controller.create
);

router.get('/ingredients/:id', authorize(readers), validate({ params: idParam }), controller.get);
router.put('/ingredients/:id', authorize(managers), validate({ params: idParam, body: ingredientFields }), controller.update);
router.delete('/ingredients/:id', authorize(managers), validate({ params: idParam }), controller.remove);

router.post(
  '/ingredients/:id/movements',
  authorize(readers),
  validate({
    params: idParam,
    body: {
      type: { type: 'string', required: true, maxLength: 20, label: 'Type' },
      quantity: { ...decimal, required: true, min: -99999999, max: 99999999, label: 'Quantity' },
      note: { type: 'string', maxLength: 1000, label: 'Note' },
      referenceId: { type: 'string', maxLength: 100, label: 'Reference' },
    },
  }),
  controller.addMovement
);

router.get(
  '/movements',
  authorize(readers),
  validate({
    query: {
      ingredientId: { type: 'integer', min: 1 },
      type: { type: 'string', lowercase: true, in: MOVEMENT_TYPES },
      from: { type: 'date' },
      to: { type: 'date' },
      search: { type: 'string', maxLength: 100 },
      ...paginationQuery,
    },
  }),
  controller.listMovements
);

const menuItemParam = { menuItemId: { type: 'integer', required: true, min: 1 } };
const modifierParam = { modifierId: { type: 'integer', required: true, min: 1 } };

router.get('/recipes/items/:menuItemId', authorize(readers), validate({ params: menuItemParam }), controller.getItemRecipe);
router.put('/recipes/items/:menuItemId', authorize(managers), validate({ params: menuItemParam, body: recipeBody }), controller.setItemRecipe);
router.get('/recipes/modifiers/:modifierId', authorize(readers), validate({ params: modifierParam }), controller.getModifierRecipe);
router.put('/recipes/modifiers/:modifierId', authorize(managers), validate({ params: modifierParam, body: recipeBody }), controller.setModifierRecipe);

module.exports = router;