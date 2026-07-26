import { requireAdmin } from "@/app/actions";
import { db } from "@/lib/db";
import AdminBookingsClient from "./AdminBookingsClient";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  await requireAdmin();
  const bookings = await db.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });
  const categories = await db.serviceCategory.findMany({ orderBy: { name: "asc" } });
  const users = await db.user.findMany({ where: { role: "USER" }, orderBy: { name: "asc" } });

  return <AdminBookingsClient bookings={bookings} categories={categories} users={users} />;
}
