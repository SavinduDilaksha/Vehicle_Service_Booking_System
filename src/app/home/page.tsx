import { requireAuth } from "@/app/actions";
import { db } from "@/lib/db";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";
import { ArrowRight, Calendar, Bell, Car, ChevronRight, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await requireAuth();

  const [bookings, notifCount, user] = await Promise.all([
    db.booking.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    db.notification.count({ where: { userId: session.userId, isRead: false } }),
    db.user.findUnique({ where: { id: session.userId } }),
  ]);

  const upcoming = bookings.filter((b) => b.status !== "Completed" && b.status !== "Rejected");

  return (
    <>
      <Navbar session={session} notifCount={notifCount} />

      {/* Hero greeting */}
      <div style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)", paddingTop: "calc(70px + 3rem)", paddingBottom: "4rem" }}>
        <div className="container">
          <div className="section-tag" style={{ color: "var(--amber)" }}>
            <div style={{ width: 28, height: 2, background: "var(--amber)" }} />
            My Account
          </div>
          <h1 style={{ color: "white", fontSize: "clamp(1.75rem, 3vw, 2.75rem)", marginBottom: "0.75rem" }}>
            Welcome back, <span style={{ color: "var(--amber)" }}>{user?.name.split(" ")[0]}</span>! 👋
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", marginBottom: "2rem" }}>
            Manage your bookings, track service status, and stay updated with notifications.
          </p>
          <Link href="/book" className="btn-primary" style={{ fontSize: "0.95rem" }}>
            Book New Service <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="section" style={{ background: "var(--grey-50)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "3rem" }}>
            {[
              { icon: Calendar, label: "Total Bookings", value: bookings.length, color: "#3B82F6", bg: "#EFF6FF", href: "/profile/bookings" },
              { icon: Bell, label: "Notifications", value: notifCount, color: "#F59E0B", bg: "#FFFBEB", href: "/profile/notifications" },
              { icon: Car, label: "Active Services", value: upcoming.length, color: "#10B981", bg: "#ECFDF5", href: "/profile/bookings" },
            ].map(({ icon: Icon, label, value, color, bg, href }) => (
              <Link key={label} href={href} style={{ textDecoration: "none" }}>
                <div className="metric-card" style={{ cursor: "pointer" }}>
                  <div className="metric-icon" style={{ background: bg }}>
                    <Icon size={20} color={color} />
                  </div>
                  <div className="metric-value">{value}</div>
                  <div className="metric-label">{label}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Recent bookings */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <h2 style={{ fontSize: "1.2rem" }}>Recent Bookings</h2>
                <Link href="/profile/bookings" style={{ fontSize: "0.85rem", color: "var(--amber)", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  View all <ChevronRight size={14} />
                </Link>
              </div>

              {bookings.length === 0 ? (
                <div style={{ background: "white", borderRadius: 16, padding: "3rem", textAlign: "center", boxShadow: "var(--shadow-sm)" }}>
                  <Car size={40} color="var(--grey-300)" style={{ margin: "0 auto 1rem" }} />
                  <p style={{ color: "var(--grey-500)", marginBottom: "1.5rem" }}>No bookings yet</p>
                  <Link href="/book" className="btn-primary">Book Your First Service</Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {bookings.map((b) => (
                    <div key={b.id} style={{ background: "white", borderRadius: 12, padding: "1.25rem 1.5rem", boxShadow: "var(--shadow-sm)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--navy)", marginBottom: "0.25rem" }}>{b.serviceType}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--grey-500)", display: "flex", gap: "1rem" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><Clock size={12} /> {b.date}</span>
                          <span>{b.vehicleNumber}</span>
                        </div>
                      </div>
                      <span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div>
              <h2 style={{ fontSize: "1.2rem", marginBottom: "1.25rem" }}>Quick Actions</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  { href: "/book", label: "Book New Service", icon: Calendar },
                  { href: "/services", label: "Browse Services", icon: Car },
                  { href: "/profile/notifications", label: "View Notifications", icon: Bell },
                  { href: "/profile/settings", label: "Edit Profile", icon: Car },
                  { href: "/profile/history", label: "Booking History", icon: Clock },
                ].map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href} style={{ display: "flex", alignItems: "center", gap: "0.875rem", background: "white", borderRadius: 10, padding: "1rem 1.25rem", textDecoration: "none", boxShadow: "var(--shadow-sm)", color: "var(--navy)", fontWeight: 600, fontSize: "0.875rem", transition: "box-shadow 0.2s" }}>
                    <Icon size={18} color="var(--amber)" />
                    {label}
                    <ChevronRight size={14} style={{ marginLeft: "auto", color: "var(--grey-400)" }} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
