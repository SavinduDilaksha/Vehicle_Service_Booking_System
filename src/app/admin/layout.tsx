import { requireAdmin } from "@/app/actions";
import { db } from "@/lib/db";
import AdminSidebar from "./AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const msgCount = await db.contactMessage.count({ where: { isRead: false } });

  return (
    <div className="admin-layout">
      <AdminSidebar session={session} msgCount={msgCount} />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
}
