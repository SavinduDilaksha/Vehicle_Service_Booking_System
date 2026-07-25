import { requireAuth, markNotificationsRead } from "@/app/actions";
import { db } from "@/lib/db";
import { Bell, CheckCheck, Megaphone, Car } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const session = await requireAuth();

  const notifications = await db.notification.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", color: "var(--navy)", marginBottom: "0.5rem" }}>Notifications</h1>
          <p style={{ color: "var(--grey-500)", fontSize: "0.875rem" }}>
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}` : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <form action={async () => {
            "use server";
            await markNotificationsRead(session.userId);
          }}>
            <button type="submit" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1.25rem", background: "white", border: "1px solid var(--grey-200)", borderRadius: 8, fontFamily: "'Poppins', sans-serif", fontSize: "0.85rem", fontWeight: 600, color: "var(--navy)", cursor: "pointer" }}>
              <CheckCheck size={16} /> Mark All Read
            </button>
          </form>
        )}
      </div>

      {notifications.length === 0 ? (
        <div style={{ background: "white", borderRadius: 16, padding: "4rem", textAlign: "center", boxShadow: "var(--shadow-sm)" }}>
          <Bell size={48} color="var(--grey-300)" style={{ margin: "0 auto 1.25rem" }} />
          <h3 style={{ color: "var(--grey-600)", marginBottom: "0.5rem" }}>No Notifications</h3>
          <p style={{ color: "var(--grey-400)", fontSize: "0.875rem" }}>You'll receive notifications for booking updates and announcements.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {notifications.map((n) => (
            <div
              key={n.id}
              style={{
                background: "white",
                borderRadius: 12,
                padding: "1.25rem 1.5rem",
                boxShadow: "var(--shadow-sm)",
                border: `1px solid ${n.isRead ? "var(--grey-100)" : "var(--amber)"}`,
                borderLeft: `4px solid ${n.bookingId ? "var(--info)" : "var(--amber)"}`,
                opacity: n.isRead ? 0.75 : 1,
              }}
            >
              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                  background: n.bookingId ? "#EFF6FF" : "var(--amber-pale)",
                }}>
                  {n.bookingId ? <Car size={18} color="var(--info)" /> : <Megaphone size={18} color="var(--amber)" />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                    <h3 style={{ fontSize: "0.95rem", color: "var(--navy)" }}>{n.title}</h3>
                    {!n.isRead && (
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--amber)", flexShrink: 0 }} />
                    )}
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "var(--grey-600)", lineHeight: 1.6, marginBottom: "0.5rem" }}>{n.message}</p>
                  <span style={{ fontSize: "0.72rem", color: "var(--grey-400)" }}>
                    {new Date(n.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
