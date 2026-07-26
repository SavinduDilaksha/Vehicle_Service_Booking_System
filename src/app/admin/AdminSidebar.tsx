"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Calendar, Tag, Megaphone, LogOut, Globe, Wrench } from "lucide-react";
import { logoutUser } from "@/app/actions";

interface Props {
  session: { name: string; email: string };
  msgCount: number;
}

export default function AdminSidebar({ session, msgCount }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/bookings", label: "Bookings", icon: Calendar },
    { href: "/admin/categories", label: "Service Categories", icon: Tag },
    { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
  ];

  const handleLogout = async () => {
    await logoutUser();
    router.push("/auth");
    router.refresh();
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ padding: "1.75rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <div style={{ width: 36, height: 36, background: "var(--amber)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Wrench size={18} color="var(--navy)" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "white", letterSpacing: "0.02em" }}>SHINY WAVE</div>
            <div style={{ fontSize: "0.55rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--amber)" }}>Admin Console</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(244,163,0,0.2)", border: "2px solid var(--amber)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", fontWeight: 700, color: "var(--amber)" }}>
            {session.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "white" }}>{session.name}</div>
            <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)" }}>Administrator</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "1rem 0" }}>
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`sidebar-link ${pathname.startsWith(href) ? "active" : ""}`}
          >
            <Icon size={18} /> {label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: "1rem", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 1rem", borderRadius: 6, color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: "0.8rem" }}>
          <Globe size={15} /> View Website
        </Link>
        <button
          onClick={handleLogout}
          style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, color: "#FCA5A5", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
