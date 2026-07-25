import { requireAuth } from "@/app/actions";
import { db } from "@/lib/db";
import Link from "next/link";
import { Calendar, Clock, Bell, Car, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProfileDashboard() {
  const session = await requireAuth();

  const [bookings, notifCount] = await Promise.all([
    db.booking.findMany({ where: { userId: session.userId }, orderBy: { createdAt: "desc" } }),
    db.notification.count({ where: { userId: session.userId, isRead: false } }),
  ]);

  const pending = bookings.filter((b) => b.status === "Pending").length;
  const approved = bookings.filter((b) => b.status === "Approved").length;
  const completed = bookings.filter((b) => b.status === "Completed").length;

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", color: "var(--navy)", marginBottom: "0.5rem" }}>Dashboard</h1>
      <p style={{ color: "var(--grey-500)", fontSize: "0.875rem", marginBottom: "2rem" }}>Overview of your account activity</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem", marginBottom: "2.5rem" }}>
        {[
          { label: "Total Bookings", value: bookings.length, color: "#3B82F6", bg: "#EFF6FF", icon: Calendar },
          { label: "Pending", value: pending, color: "#F59E0B", bg: "#FFFBEB", icon: Clock },
          { label: "Approved", value: approved, color: "#10B981", bg: "#ECFDF5", icon: Car },
          { label: "Notifications", value: notifCount, color: "#8B5CF6", bg: "#F5F3FF", icon: Bell },
        ].map(({ label, value, color, bg, icon: Icon }) => (
          <div key={label} className="metric-card">
            <div className="metric-icon" style={{ background: bg }}>
              <Icon size={18} color={color} />
            </div>
            <div className="metric-value">{value}</div>
            <div className="metric-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div style={{ background: "white", borderRadius: 16, padding: "1.75rem", boxShadow: "var(--shadow-sm)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h2 style={{ fontSize: "1.1rem" }}>Recent Bookings</h2>
          <Link href="/profile/bookings" style={{ fontSize: "0.85rem", color: "var(--amber)", fontWeight: 600, textDecoration: "none" }}>
            View all →
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem 0", color: "var(--grey-400)" }}>
            <Car size={36} style={{ margin: "0 auto 0.75rem" }} />
            <p>No bookings yet</p>
            <Link href="/book" className="btn-primary" style={{ marginTop: "1rem", display: "inline-flex" }}>Book Now</Link>
          </div>
        ) : (
          <div style={{ overflow: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Vehicle</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map((b) => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 600 }}>{b.serviceType}</td>
                    <td>{b.vehicleNumber}</td>
                    <td>{b.date} at {b.time}</td>
                    <td><span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
