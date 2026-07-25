"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, Clock, Bell, Settings, LogOut, Home } from "lucide-react";
import { logoutUser } from "@/app/actions";
import { useRouter } from "next/navigation";

interface Props {
  session: { name: string; email: string; role: string };
  user: { name: string; email: string; phone?: string | null } | null;
  notifCount: number;
}

export default function ProfileSidebar({ session, user, notifCount }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: "/profile", label: "Dashboard", icon: LayoutDashboard },
    { href: "/profile/bookings", label: "My Bookings", icon: Calendar },
    { href: "/profile/history", label: "Booking History", icon: Clock },
    { href: "/profile/notifications", label: "Notifications", icon: Bell, badge: notifCount },
    { href: "/profile/settings", label: "Profile Settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
    router.refresh();
  };

  return (
    <aside style={{ width: 260, minHeight: "calc(100vh - 70px)", background: "var(--navy)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
      {/* User Card */}
      <div style={{ padding: "2rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--amber)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", fontWeight: 800, color: "var(--navy)", marginBottom: "1rem" }}>
          {user?.name.charAt(0).toUpperCase()}
        </div>
        <div style={{ fontWeight: 700, color: "white", fontSize: "1rem" }}>{user?.name}</div>
        <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginTop: "0.25rem" }}>{user?.email}</div>
        {user?.phone && (
          <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginTop: "0.1rem" }}>{user.phone}</div>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "1rem 0" }}>
        <Link href="/home" style={{ display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.75rem 1.5rem", color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", textDecoration: "none", marginBottom: "0.25rem" }}>
          <Home size={14} /> Back to Home
        </Link>
        {links.map(({ href, label, icon: Icon, badge }) => (
          <Link
            key={href}
            href={href}
            className={`sidebar-link ${pathname === href ? "active" : ""}`}
          >
            <Icon size={18} />
            <span style={{ flex: 1 }}>{label}</span>
            {badge && badge > 0 && (
              <span style={{ background: "var(--amber)", color: "var(--navy)", borderRadius: "100px", padding: "0.1rem 0.5rem", fontSize: "0.65rem", fontWeight: 800 }}>{badge}</span>
            )}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: "1rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <button
          onClick={handleLogout}
          style={{ display: "flex", alignItems: "center", gap: "0.875rem", width: "100%", padding: "0.875rem 1rem", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, color: "#FCA5A5", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
