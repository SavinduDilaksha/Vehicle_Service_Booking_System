const ServiceCategory = require('../models/ServiceCategory');

// @desc Get all service categories
// @route GET /api/services
exports.getServices = async (req, res) => {
  try {
    const services = await ServiceCategory.find().sort({ createdAt: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single service category by slug
// @route GET /api/services/:slug
exports.getServiceBySlug = async (req, res) => {
  try {
    const service = await ServiceCategory.findOne({ slug: req.params.slug });
    if (!service) {
      return res.status(404).json({ message: 'Service category not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create service category (Admin)
// @route POST /api/services
exports.createService = async (req, res) => {
  try {
    const { name, slug, description, priceRange, duration, imageUrl } = req.body;

    if (!name || !slug || !description) {
      return res.status(400).json({ message: 'Name, slug, and description are required' });
    }

    const existing = await ServiceCategory.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: 'Category with this slug already exists' });
    }

    const category = await ServiceCategory.create({
      name,
      slug,
      description,
      priceRange: priceRange || '',
      duration: duration || '',
      imageUrl: imageUrl || '',
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update service category (Admin)
// @route PUT /api/services/:id
exports.updateService = async (req, res) => {
  try {
    const { name, slug, description, priceRange, duration, imageUrl } = req.body;
    const category = await ServiceCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Service category not found' });
    }

    if (name) category.name = name;
    if (slug) category.slug = slug;
    if (description) category.description = description;
    if (priceRange !== undefined) category.priceRange = priceRange;
    if (duration !== undefined) category.duration = duration;
    if (imageUrl !== undefined) category.imageUrl = imageUrl;

    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete service category (Admin)
// @route DELETE /api/services/:id
exports.deleteService = async (req, res) => {
  try {
    const category = await ServiceCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Service category not found' });
    }

    await category.deleteOne();
    res.json({ message: 'Service category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
