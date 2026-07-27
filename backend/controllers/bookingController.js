const Booking = require('../models/Booking');
const ServiceCategory = require('../models/ServiceCategory');

// @desc Create Booking (User)
// @route POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const { serviceId, vehicleModel, regNumber, preferredDate, preferredTime, notes } = req.body;

    if (!serviceId || !vehicleModel || !regNumber || !preferredDate || !preferredTime) {
      return res.status(400).json({ message: 'All booking fields are required' });
    }

    const service = await ServiceCategory.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Selected service category not found' });
    }

    const booking = await Booking.create({
      userId: req.user._id,
      serviceId,
      serviceName: service.name,
      vehicleModel,
      regNumber,
      preferredDate,
      preferredTime,
      notes: notes || '',
      status: 'Pending',
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get My Bookings (User)
// @route GET /api/bookings/my
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('serviceId', 'name imageUrl duration priceRange')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get All Bookings (Admin)
// @route GET /api/bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email phone')
      .populate('serviceId', 'name')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update Booking Status (Admin)
// @route PUT /api/bookings/:id/status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Approved', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid booking status' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
