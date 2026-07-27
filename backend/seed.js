const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const ServiceCategory = require('./models/ServiceCategory');
const Announcement = require('./models/Announcement');
const Notification = require('./models/Notification');
const Booking = require('./models/Booking');

const connectDB = require('./config/db');

const seedData = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing old data...');
    await User.deleteMany();
    await ServiceCategory.deleteMany();
    await Announcement.deleteMany();
    await Notification.deleteMany();
    await Booking.deleteMany();

    console.log('🌱 Seeding Admin Account...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@shinywave.lk',
      phone: '0112345678',
      password: adminPassword,
      role: 'ADMIN',
    });
    console.log(`✅ Admin Created: ${admin.email} (Password: admin123)`);

    console.log('🌱 Seeding Demo User Account...');
    const userPassword = await bcrypt.hash('user123', 10);
    const demoUser = await User.create({
      name: 'Kasun Perera',
      email: 'kasun@example.com',
      phone: '0771234567',
      password: userPassword,
      role: 'USER',
    });
    console.log(`✅ Demo User Created: ${demoUser.email} (Password: user123)`);

    console.log('🌱 Seeding Service Categories...');
    const categories = [
      {
        name: 'Oil Change',
        slug: 'oil-change',
        description: 'Complete engine oil and filter replacement using premium synthetic or semi-synthetic oils to ensure optimal engine performance.',
        priceRange: 'Rs. 2,500 – Rs. 5,000',
        duration: '45 mins',
      },
      {
        name: 'Brake Service',
        slug: 'brake-service',
        description: 'Comprehensive brake inspection, brake pad replacement, rotor resurfacing, and hydraulic fluid top-up for safe braking.',
        priceRange: 'Rs. 4,000 – Rs. 12,000',
        duration: '1.5 hrs',
      },
      {
        name: 'Wheel Alignment',
        slug: 'wheel-alignment',
        description: 'Precision computer-aided wheel alignment to ensure even tire wear, straight steering, and maximum fuel efficiency.',
        priceRange: 'Rs. 2,000 – Rs. 3,500',
        duration: '1 hr',
      },
      {
        name: 'Engine Diagnostic',
        slug: 'engine-diagnostic',
        description: 'Full electronic OBD-II diagnostic scan to identify check engine light causes, sensor faults, and performance issues.',
        priceRange: 'Rs. 1,500 – Rs. 3,000',
        duration: '1 hr',
      },
      {
        name: 'AC Service',
        slug: 'ac-service',
        description: 'Air conditioning inspection, refrigerant recharge, cabin filter replacement, and compressor check for cool, fresh air.',
        priceRange: 'Rs. 3,000 – Rs. 8,000',
        duration: '1.5 hrs',
      },
      {
        name: 'Full Detailing',
        slug: 'full-detailing',
        description: 'Premium exterior wash, polish, wax treatment, deep interior vacuum, leather conditioning, and glass treatment.',
        priceRange: 'Rs. 5,000 – Rs. 15,000',
        duration: '3–4 hrs',
      },
    ];

    const createdCategories = await ServiceCategory.insertMany(categories);
    console.log(`✅ ${createdCategories.length} Service Categories Seeded.`);

    console.log('🌱 Seeding Welcome Announcement & Notification...');
    const announcement = await Announcement.create({
      title: 'Welcome to Shiny Wave Auto Services!',
      message: 'We are thrilled to launch our online booking platform. Book your service appointment online and track progress in real-time.',
    });

    await Notification.create({
      userId: demoUser._id,
      announcementId: announcement._id,
      title: announcement.title,
      message: announcement.message,
    });

    console.log('🎉 Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
