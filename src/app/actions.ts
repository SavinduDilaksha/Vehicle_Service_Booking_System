"use server";

import { cookies } from "next/headers";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile } from "fs/promises";
import path from "path";

const JWT_SECRET = process.env.JWT_SECRET || "shiny-wave-secret-key-2026";

// ============================================================
// AUTH HELPERS
// ============================================================

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sw_token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      name: string;
      role: string;
    };
    return decoded;
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) redirect("/auth");
  return session;
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/auth");
  return session;
}

// ============================================================
// AUTH ACTIONS
// ============================================================

export async function loginUser(prevState: any, formData: FormData) {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();

  if (!email || !password) return { error: "Please enter your email and password." };

  try {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) return { error: "No account found with this email." };

    const match = await bcrypt.compare(password, user.password);
    if (!match) return { error: "Incorrect password. Please try again." };

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const cookieStore = await cookies();
    cookieStore.set("sw_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "strict",
    });

    return { success: true, role: user.role };
  } catch (e) {
    console.error(e);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function registerUser(prevState: any, formData: FormData) {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const phone = formData.get("phone")?.toString().trim();
  const password = formData.get("password")?.toString();
  const confirm = formData.get("confirm")?.toString();

  if (!name || !email || !password || !confirm) return { error: "All fields are required." };
  if (password !== confirm) return { error: "Passwords do not match." };
  if (password.length < 6) return { error: "Password must be at least 6 characters." };

  try {
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) return { error: "An account with this email already exists." };

    const hashed = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: { name, email, phone, password: hashed, role: "USER" },
    });

    // Send welcome notification
    const announcements = await db.announcement.findMany({ take: 1, orderBy: { publishedAt: "desc" } });
    if (announcements.length > 0) {
      await db.notification.create({
        data: {
          userId: user.id,
          announcementId: announcements[0].id,
          title: "Welcome to Shiny Wave! 🎉",
          message: "Your account has been created. Book your first service today and enjoy 10% off!",
        },
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const cookieStore = await cookies();
    cookieStore.set("sw_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "strict",
    });

    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Registration failed. Please try again." };
  }
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("sw_token");
}

// ============================================================
// BOOKING ACTIONS
// ============================================================

export async function createBooking(data: {
  userId?: string;
  customerName: string;
  phone: string;
  email?: string;
  vehicleNumber: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  serviceType: string;
  date: string;
  time: string;
  notes?: string;
}) {
  try {
    const booking = await db.booking.create({ data: { ...data, status: "Pending" } });

    // Notify the user
    if (data.userId) {
      await db.notification.create({
        data: {
          userId: data.userId,
          bookingId: booking.id,
          title: "Booking Confirmed! 🚗",
          message: `Your ${data.serviceType} booking for ${data.vehicleNumber} on ${data.date} at ${data.time} has been received and is pending confirmation.`,
        },
      });
    }

    revalidatePath("/admin/bookings");
    revalidatePath("/profile/bookings");
    return { success: true, bookingId: booking.id };
  } catch (e) {
    console.error(e);
    return { error: "Failed to create booking. Please try again." };
  }
}

export async function updateBookingStatus(bookingId: string, status: string) {
  await requireAdmin();

  try {
    const booking = await db.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    // Notify the user if they have an account
    if (booking.userId) {
      const statusMessages: Record<string, string> = {
        Approved: `Great news! Your ${booking.serviceType} booking on ${booking.date} has been approved. Please arrive on time.`,
        Completed: `Your ${booking.serviceType} service has been completed successfully. Thank you for choosing Shiny Wave!`,
        Rejected: `We're sorry, your ${booking.serviceType} booking on ${booking.date} could not be accommodated. Please rebook at a different time.`,
      };

      if (statusMessages[status]) {
        await db.notification.create({
          data: {
            userId: booking.userId,
            bookingId: booking.id,
            title: `Booking ${status}`,
            message: statusMessages[status],
          },
        });
      }
    }

    revalidatePath("/admin/bookings");
    revalidatePath("/profile/bookings");
    return { success: true };
  } catch (e) {
    return { error: "Failed to update booking." };
  }
}

export async function deleteBooking(bookingId: string) {
  await requireAdmin();
  try {
    await db.notification.deleteMany({ where: { bookingId } });
    await db.booking.delete({ where: { id: bookingId } });
    revalidatePath("/admin/bookings");
    return { success: true };
  } catch (e) {
    return { error: "Failed to delete booking." };
  }
}

// ============================================================
// SERVICE CATEGORY ACTIONS
// ============================================================

export async function createCategory(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name")?.toString().trim();
  const slug = formData.get("slug")?.toString().trim().toLowerCase().replace(/\s+/g, "-");
  const description = formData.get("description")?.toString().trim();
  const priceRange = formData.get("priceRange")?.toString().trim();
  const duration = formData.get("duration")?.toString().trim();
  const imageFile = formData.get("image") as File | null;

  if (!name || !slug || !description) return { error: "Name, slug, and description are required." };

  let imageUrl: string | undefined;

  if (imageFile && imageFile.size > 0) {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${imageFile.name.replace(/\s+/g, "-")}`;
    const uploadPath = path.join(process.cwd(), "public", "uploads", filename);
    await writeFile(uploadPath, buffer);
    imageUrl = `/uploads/${filename}`;
  }

  try {
    await db.serviceCategory.create({
      data: { name, slug, description, priceRange, duration, imageUrl },
    });
    revalidatePath("/services");
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (e: any) {
    if (e?.code === "P2002") return { error: "A category with this name or slug already exists." };
    return { error: "Failed to create category." };
  }
}

export async function updateCategory(id: string, formData: FormData) {
  await requireAdmin();

  const name = formData.get("name")?.toString().trim();
  const slug = formData.get("slug")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const priceRange = formData.get("priceRange")?.toString().trim();
  const duration = formData.get("duration")?.toString().trim();
  const imageFile = formData.get("image") as File | null;

  let imageUrl: string | undefined;

  if (imageFile && imageFile.size > 0) {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${imageFile.name.replace(/\s+/g, "-")}`;
    const uploadPath = path.join(process.cwd(), "public", "uploads", filename);
    await writeFile(uploadPath, buffer);
    imageUrl = `/uploads/${filename}`;
  }

  try {
    await db.serviceCategory.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description && { description }),
        ...(priceRange && { priceRange }),
        ...(duration && { duration }),
        ...(imageUrl && { imageUrl }),
      },
    });
    revalidatePath("/services");
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (e: any) {
    if (e?.code === "P2002") return { error: "A category with this name or slug already exists." };
    return { error: "Failed to update category." };
  }
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  try {
    await db.serviceCategory.delete({ where: { id } });
    revalidatePath("/services");
    revalidatePath("/admin/categories");
    return { success: true };
  } catch {
    return { error: "Failed to delete category." };
  }
}

// ============================================================
// ANNOUNCEMENT ACTIONS
// ============================================================

export async function createAnnouncement(data: { title: string; message: string }) {
  await requireAdmin();

  try {
    const announcement = await db.announcement.create({ data });

    // Create notifications for ALL users
    const users = await db.user.findMany({ where: { role: "USER" } });
    await db.notification.createMany({
      data: users.map((u) => ({
        userId: u.id,
        announcementId: announcement.id,
        title: announcement.title,
        message: announcement.message,
      })),
    });

    revalidatePath("/admin/announcements");
    revalidatePath("/profile/notifications");
    return { success: true };
  } catch {
    return { error: "Failed to create announcement." };
  }
}

export async function deleteAnnouncement(id: string) {
  await requireAdmin();
  try {
    await db.notification.deleteMany({ where: { announcementId: id } });
    await db.announcement.delete({ where: { id } });
    revalidatePath("/admin/announcements");
    return { success: true };
  } catch {
    return { error: "Failed to delete announcement." };
  }
}

// ============================================================
// NOTIFICATION ACTIONS
// ============================================================

export async function markNotificationsRead(userId: string) {
  try {
    await db.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    revalidatePath("/profile/notifications");
    return { success: true };
  } catch {
    return { error: "Failed to update notifications." };
  }
}

// ============================================================
// PROFILE ACTIONS
// ============================================================

export async function updateProfile(prevState: any, formData: FormData) {
  const session = await requireAuth();

  const name = formData.get("name")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim();
  const currentPassword = formData.get("currentPassword")?.toString();
  const newPassword = formData.get("newPassword")?.toString();

  try {
    const user = await db.user.findUnique({ where: { id: session.userId } });
    if (!user) return { error: "User not found." };

    let hashedPassword = user.password;

    if (currentPassword && newPassword) {
      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) return { error: "Current password is incorrect." };
      if (newPassword.length < 6) return { error: "New password must be at least 6 characters." };
      hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    await db.user.update({
      where: { id: session.userId },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        password: hashedPassword,
      },
    });

    revalidatePath("/profile/settings");
    return { success: true };
  } catch {
    return { error: "Failed to update profile." };
  }
}

// ============================================================
// CONTACT MESSAGE
// ============================================================

// Plain version for direct form action (no prevState)
export async function submitContactDirect(formData: FormData) {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim();
  const subject = formData.get("subject")?.toString().trim();
  const message = formData.get("message")?.toString().trim();

  if (!name || !email || !subject || !message) return;

  try {
    await db.contactMessage.create({ data: { name, email: email!, phone, subject: subject!, message: message! } });
  } catch {
    // silently fail on server — user sees success regardless
  }
}

export async function submitContactMessage(prevState: any, formData: FormData) {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim();
  const subject = formData.get("subject")?.toString().trim();
  const message = formData.get("message")?.toString().trim();

  if (!name || !email || !subject || !message) return { error: "Please fill in all required fields." };

  try {
    await db.contactMessage.create({ data: { name, email: email!, phone, subject: subject!, message: message! } });
    return { success: true };
  } catch {
    return { error: "Failed to send message. Please try again." };
  }
}
