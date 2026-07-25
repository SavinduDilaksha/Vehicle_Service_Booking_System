"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Phone, Bell, User, ChevronDown, LogOut, Settings, LayoutDashboard, Wrench } from "lucide-react";
import { logoutUser } from "../actions";

interface NavbarProps {
  session: { userId: string; name: string; role: string; email: string } | null;
  notifCount?: number;
}

export default function Navbar({ session, notifCount = 0 }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
  ];

  const isTransparent = isHome && !scrolled;

  return (
    <nav
      className="navbar"
      style={{
        background: isTransparent ? "transparent" : "white",
        boxShadow: isTransparent ? "none" : "0 2px 20px rgba(11,30,61,0.10)",
        borderBottom: isTransparent ? "none" : "1px solid #e9ecef",
      }}
    >
      {/* Top bar */}
      {isTransparent && (
        <div style={{ background: "rgba(11,30,61,0.4)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div className="container" style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "1.5rem", padding: "0.4rem 1.5rem", fontSize: "0.75rem", color: "rgba(255,255,255,0.8)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Phone size={12} /> +94 11 234 5678
            </span>
            <span>Mon – Sat: 8:00 AM – 6:00 PM</span>
          </div>
        </div>
      )}

      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.5rem", height: "70px" }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: 38, height: 38, background: "var(--amber)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Wrench size={20} color="var(--navy)" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: "1.1rem", lineHeight: 1.1, color: isTransparent ? "white" : "var(--navy)", letterSpacing: "0.02em" }}>
              SHINY WAVE
            </div>
            <div style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: isTransparent ? "var(--amber)" : "var(--amber)", lineHeight: 1 }}>
              Auto Services
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }} className="desktop-nav">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: "0.85rem",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: isTransparent ? "rgba(255,255,255,0.9)" : "var(--navy)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {session ? (
            <>
              {/* Notification bell */}
              <Link href="/profile/notifications" style={{ position: "relative", display: "flex", alignItems: "center", color: isTransparent ? "white" : "var(--navy)" }}>
                <Bell size={20} />
                {notifCount > 0 && (
                  <span className="notif-badge">{notifCount > 9 ? "9+" : notifCount}</span>
                )}
              </Link>

              {/* User dropdown */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    background: "none", border: "none", cursor: "pointer",
                    fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "0.85rem",
                    color: isTransparent ? "white" : "var(--navy)",
                    padding: "0.5rem",
                  }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--amber)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700, color: "var(--navy)" }}>
                    {session.name.charAt(0).toUpperCase()}
                  </div>
                  {session.name.split(" ")[0]}
                  <ChevronDown size={14} />
                </button>

                {userMenu && (
                  <div style={{
                    position: "absolute", right: 0, top: "calc(100% + 8px)",
                    background: "white", borderRadius: 10, boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                    border: "1px solid var(--grey-200)", minWidth: 200, zIndex: 100,
                    overflow: "hidden",
                  }}>
                    <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--grey-100)", background: "var(--grey-50)" }}>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--navy)" }}>{session.name}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--grey-500)" }}>{session.email}</div>
                    </div>

                    {session.role === "ADMIN" ? (
                      <Link href="/admin/dashboard" onClick={() => setUserMenu(false)} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", fontSize: "0.85rem", color: "var(--grey-700)", textDecoration: "none", transition: "background 0.2s" }}>
                        <LayoutDashboard size={16} /> Admin Console
                      </Link>
                    ) : (
                      <>
                        <Link href="/profile" onClick={() => setUserMenu(false)} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", fontSize: "0.85rem", color: "var(--grey-700)", textDecoration: "none" }}>
                          <User size={16} /> My Profile
                        </Link>
                        <Link href="/profile/bookings" onClick={() => setUserMenu(false)} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", fontSize: "0.85rem", color: "var(--grey-700)", textDecoration: "none" }}>
                          <LayoutDashboard size={16} /> My Bookings
                        </Link>
                        <Link href="/profile/settings" onClick={() => setUserMenu(false)} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", fontSize: "0.85rem", color: "var(--grey-700)", textDecoration: "none" }}>
                          <Settings size={16} /> Settings
                        </Link>
                      </>
                    )}

                    <button
                      onClick={handleLogout}
                      style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", fontSize: "0.85rem", color: "#dc3545", background: "none", border: "none", cursor: "pointer", width: "100%", borderTop: "1px solid var(--grey-100)" }}
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/auth" className="btn-ghost" style={{ color: isTransparent ? "white" : "var(--navy)", borderColor: isTransparent ? "rgba(255,255,255,0.4)" : "var(--grey-300)" }}>
                Sign In
              </Link>
              <Link href="/book" className="btn-primary" style={{ padding: "0.6rem 1.4rem" }}>
                Book Now
              </Link>
            </>
          )}

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", color: isTransparent ? "white" : "var(--navy)", display: "none" }}
            className="mobile-menu-btn"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ background: "white", borderTop: "1px solid var(--grey-200)", padding: "1rem 1.5rem" }}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{ display: "block", padding: "0.75rem 0", fontWeight: 600, fontSize: "0.9rem", color: "var(--navy)", textDecoration: "none", borderBottom: "1px solid var(--grey-100)" }}>
              {link.label}
            </Link>
          ))}
          <div style={{ paddingTop: "1rem", display: "flex", gap: "0.75rem" }}>
            {session ? (
              <button onClick={handleLogout} className="btn-secondary" style={{ flex: 1 }}>Sign Out</button>
            ) : (
              <>
                <Link href="/auth" className="btn-secondary" style={{ flex: 1, textAlign: "center" }}>Sign In</Link>
                <Link href="/book" className="btn-primary" style={{ flex: 1, textAlign: "center", justifyContent: "center" }}>Book Now</Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
