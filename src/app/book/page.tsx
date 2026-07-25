import { getSession } from "@/app/actions";
import { db } from "@/lib/db";
import BookPageClient from "./BookPageClient";

export const dynamic = "force-dynamic";

export default async function BookPage() {
  const session = await getSession();
  const [categories, notifCount] = await Promise.all([
    db.serviceCategory.findMany({ orderBy: { createdAt: "asc" } }),
    session
      ? db.notification.count({ where: { userId: session.userId, isRead: false } })
      : Promise.resolve(0),
  ]);

  return <BookPageClient session={session} categories={categories} notifCount={notifCount} />;
}
