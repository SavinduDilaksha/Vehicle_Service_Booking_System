import { requireAdmin } from "@/app/actions";
import { db } from "@/lib/db";
import AdminAnnouncementsClient from "./AdminAnnouncementsClient";

export const dynamic = "force-dynamic";

export default async function AdminAnnouncementsPage() {
  await requireAdmin();
  const announcements = await db.announcement.findMany({
    orderBy: { publishedAt: "desc" },
    include: { _count: { select: { notifications: true } } },
  });
  const userCount = await db.user.count({ where: { role: "USER" } });

  return <AdminAnnouncementsClient announcements={announcements} userCount={userCount} />;
}
