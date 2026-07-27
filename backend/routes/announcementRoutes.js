const express = require('express');
const router = express.Router();
const {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
} = require('../controllers/announcementController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getAnnouncements);
router.post('/', protect, admin, createAnnouncement);
router.delete('/:id', protect, admin, deleteAnnouncement);

module.exports = router;
