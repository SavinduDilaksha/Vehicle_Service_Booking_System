import { requireAdmin } from "@/app/actions";
import { db } from "@/lib/db";
import { Users, Calendar, Clock, CheckCircle, TrendingUp, MessageSquare } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireAdmin();

  const today = new Date().toISOString().split("T")[0];
  const [totalBookings, pending, approved, completed, totalUsers, todayBookings, messages, recentBookings] = await Promise.all([
    db.booking.count(),
    db.booking.count({ where: { status: "Pending" } }),
    db.booking.count({ where: { status: "Approved" } }),
    db.booking.count({ where: { status: "Completed" } }),
    db.user.count({ where: { role: "USER" } }),
    db.booking.count({ where: { date: today } }),
    db.contactMessage.count({ where: { isRead: false } }),
    db.booking.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
  ]);

  const metrics = [
    { label: "Total Bookings", value: totalBookings, icon: Calendar, color: "#3B82F6", bg: "#EFF6FF" },
    { label: "Pending", value: pending, icon: Clock, color: "#F59E0B", bg: "#FFFBEB" },
    { label: "Approved", value: approved, icon: TrendingUp, color: "#10B981", bg: "#ECFDF5" },
    { label: "Completed", value: completed, icon: CheckCircle, color: "#8B5CF6", bg: "#F5F3FF" },
    { label: "Registered Users", value: totalUsers, icon: Users, color: "#EC4899", bg: "#FDF2F8" },
    { label: "Today's Bookings", value: todayBookings, icon: Calendar, color: "#14B8A6", bg: "#F0FDFA" },
  ];

  return (
    <div style={{ padding: "2.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", color: "var(--navy)", marginBottom: "0.25rem" }}>Dashboard</h1>
        <p style={{ color: "var(--grey-500)", fontSize: "0.875rem" }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Unread Messages Banner */}
      {messages > 0 && (
        <div style={{ background: "var(--amber-pale)", border: "1px solid var(--amber)", borderRadius: 10, padding: "0.875rem 1.25rem", marginBottom: "2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.9rem", color: "var(--navy)", fontWeight: 600 }}>
            <MessageSquare size={18} color="var(--amber)" />
            You have {messages} unread contact message{messages !== 1 ? "s" : ""}
          </div>
        </div>
      )}

      {/* Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem", marginBottom: "2.5rem" }}>
        {metrics.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="metric-card">
            <div className="metric-icon" style={{ background: bg }}>
              <Icon size={20} color={color} />
            </div>
            <div className="metric-value">{value}</div>
            <div className="metric-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div style={{ background: "white", borderRadius: 16, boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        <div style={{ padding: "1.5rem 1.75rem", borderBottom: "1px solid var(--grey-100)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "1.1rem", color: "var(--navy)" }}>Recent Bookings</h2>
          <Link href="/admin/bookings" style={{ fontSize: "0.85rem", color: "var(--amber)", fontWeight: 600, textDecoration: "none" }}>
            Manage All →
          </Link>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Service</th>
              <th>Vehicle</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentBookings.map((b) => (
              <tr key={b.id}>
                <td>
                  <div style={{ fontWeight: 600, color: "var(--navy)" }}>{b.customerName}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--grey-400)" }}>{b.phone}</div>
                </td>
                <td style={{ fontWeight: 500 }}>{b.serviceType}</td>
                <td style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{b.vehicleNumber}</td>
                <td style={{ fontSize: "0.85rem" }}>{b.date} · {b.time}</td>
                <td><span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
