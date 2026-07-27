const express = require('express');
const router = express.Router();
const {
  getServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getServices);
router.get('/:slug', getServiceBySlug);
router.post('/', protect, admin, createService);
router.put('/:id', protect, admin, updateService);
router.delete('/:id', protect, admin, deleteService);

module.exports = router;
