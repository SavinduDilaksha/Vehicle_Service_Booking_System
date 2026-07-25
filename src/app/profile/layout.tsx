import { requireAuth } from "@/app/actions";
import { db } from "@/lib/db";
import ProfileSidebar from "./ProfileSidebar";
import Navbar from "@/app/components/Navbar";

export const dynamic = "force-dynamic";

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAuth();
  const [notifCount, user] = await Promise.all([
    db.notification.count({ where: { userId: session.userId, isRead: false } }),
    db.user.findUnique({ where: { id: session.userId } }),
  ]);

  return (
    <>
      <Navbar session={session} notifCount={notifCount} />
      <div style={{ paddingTop: "70px", minHeight: "100vh", background: "var(--grey-50)", display: "flex" }}>
        <ProfileSidebar session={session} user={user} notifCount={notifCount} />
        <main style={{ flex: 1, padding: "2.5rem", minWidth: 0 }}>
          {children}
        </main>
      </div>
    </>
  );
}
