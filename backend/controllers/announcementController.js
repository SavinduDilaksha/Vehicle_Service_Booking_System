const Announcement = require('../models/Announcement');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc Get All Announcements
// @route GET /api/announcements
exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ publishedAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create Announcement (Admin)
// @route POST /api/announcements
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, message } = req.body;
    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required' });
    }

    const announcement = await Announcement.create({ title, message });

    // Broadcast notification to all non-admin users
    const users = await User.find({ role: 'USER' });
    const notifications = users.map((u) => ({
      userId: u._id,
      announcementId: announcement._id,
      title: announcement.title,
      message: announcement.message,
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete Announcement (Admin)
// @route DELETE /api/announcements/:id
exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    await Notification.deleteMany({ announcementId: announcement._id });
    await announcement.deleteOne();

    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
