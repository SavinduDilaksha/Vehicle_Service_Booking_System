import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding started...");

  // Seed Admin User
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@shinywave.lk" },
    update: { password: adminPassword },
    create: {
      name: "System Admin",
      email: "admin@shinywave.lk",
      phone: "0112345678",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin seeded: ${admin.email}`);

  // Seed Demo User
  const userPassword = await bcrypt.hash("user123", 10);
  const demoUser = await prisma.user.upsert({
    where: { email: "kasun@example.com" },
    update: { password: userPassword },
    create: {
      name: "Kasun Perera",
      email: "kasun@example.com",
      phone: "0771234567",
      password: userPassword,
      role: "USER",
    },
  });
  console.log(`✅ Demo user seeded: ${demoUser.email}`);

  // Seed Service Categories
  const categories = [
    {
      name: "Oil Change",
      slug: "oil-change",
      description: "Complete engine oil and filter replacement using premium synthetic or semi-synthetic oils to ensure optimal engine performance.",
      priceRange: "Rs. 2,500 – Rs. 5,000",
      duration: "45 mins",
    },
    {
      name: "Brake Service",
      slug: "brake-service",
      description: "Comprehensive brake inspection, brake pad replacement, rotor resurfacing, and hydraulic fluid top-up for safe braking.",
      priceRange: "Rs. 4,000 – Rs. 12,000",
      duration: "1.5 hrs",
    },
    {
      name: "Wheel Alignment",
      slug: "wheel-alignment",
      description: "Precision computer-aided wheel alignment to ensure even tire wear, straight steering, and maximum fuel efficiency.",
      priceRange: "Rs. 2,000 – Rs. 3,500",
      duration: "1 hr",
    },
    {
      name: "Engine Diagnostic",
      slug: "engine-diagnostic",
      description: "Full electronic OBD-II diagnostic scan to identify check engine light causes, sensor faults, and performance issues.",
      priceRange: "Rs. 1,500 – Rs. 3,000",
      duration: "1 hr",
    },
    {
      name: "AC Service",
      slug: "ac-service",
      description: "Air conditioning inspection, refrigerant recharge, cabin filter replacement, and compressor check for cool, fresh air.",
      priceRange: "Rs. 3,000 – Rs. 8,000",
      duration: "1.5 hrs",
    },
    {
      name: "Full Detailing",
      slug: "full-detailing",
      description: "Premium exterior wash, polish, wax treatment, deep interior vacuum, leather conditioning, and glass treatment.",
      priceRange: "Rs. 5,000 – Rs. 15,000",
      duration: "3–4 hrs",
    },
  ];

  for (const cat of categories) {
    const c = await prisma.serviceCategory.upsert({
      where: { slug: cat.slug },
      update: { description: cat.description, priceRange: cat.priceRange },
      create: cat,
    });
    console.log(`✅ Category seeded: ${c.name}`);
  }

  // Seed Welcome Announcement
  const announcement = await prisma.announcement.create({
    data: {
      title: "Welcome to Shiny Wave Auto Services!",
      message: "We are thrilled to launch our new online booking platform. Book your service appointment online and track progress in real-time. Enjoy 10% off your first booking this month!",
    },
  });

  // Create notification for demo user
  await prisma.notification.create({
    data: {
      userId: demoUser.id,
      announcementId: announcement.id,
      title: announcement.title,
      message: announcement.message,
    },
  });
  console.log(`✅ Announcement seeded: ${announcement.title}`);

  console.log("\n🎉 Seeding completed successfully!");
  console.log("   Admin: admin@shinywave.lk / admin123");
  console.log("   User:  kasun@example.com / user123");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
