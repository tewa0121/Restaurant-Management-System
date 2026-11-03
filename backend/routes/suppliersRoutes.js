const express = require('express');
const controller = require('../controllers/supplierController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate, idParam } = require('../utils/validate');
const { paginationQuery } = require('../utils/pagination');
const { ROLES } = require('../utils/constants');

const router = express.Router();
const managers = [ROLES.ADMIN, ROLES.MANAGER];

const supplierFields = {
  name: { type: 'string', minLength: 2, maxLength: 100, label: 'Name' },
  contactPerson: { type: 'string', maxLength: 100, label: 'Contact person' },
  contact: { type: 'string', maxLength: 100, label: 'Contact person' },
  phone: { type: 'string', maxLength: 20, label: 'Phone' },
  email: { type: 'email', label: 'Email' },
  address: { type: 'string', maxLength: 1000, label: 'Address' },
  paymentTerms: { type: 'string', maxLength: 100, label: 'Payment terms' },
};

router.use(verifyToken, authorize(managers));

router.get(
  '/',
  validate({ query: { search: { type: 'string', maxLength: 100 }, ...paginationQuery } }),
  controller.list
);
router.post('/', validate({ body: { ...supplierFields, name: { ...supplierFields.name, required: true } } }), controller.create);
router.get('/:id', validate({ params: idParam }), controller.get);
router.put('/:id', validate({ params: idParam, body: supplierFields }), controller.update);
router.delete('/:id', validate({ params: idParam }), controller.remove);

module.exports = router;