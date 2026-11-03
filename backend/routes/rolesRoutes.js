const express = require('express');
const controller = require('../controllers/roleController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate, idParam } = require('../utils/validate');
const { ROLES } = require('../utils/constants');

const router = express.Router();

router.use(verifyToken);

router.get('/', authorize(ROLES.ADMIN, ROLES.MANAGER), controller.list);
router.get('/:id', authorize(ROLES.ADMIN, ROLES.MANAGER), validate({ params: idParam }), controller.get);
router.put(
  '/:id',
  authorize(ROLES.ADMIN),
  validate({
    params: idParam,
    body: { description: { type: 'string', required: true, maxLength: 500, label: 'Description' } },
  }),
  controller.update
);

module.exports = router;