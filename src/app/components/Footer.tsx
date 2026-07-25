import Link from "next/link";
import { Wrench, Phone, Mail, MapPin, Share2, Camera, MessageCircle, Play } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ background: "var(--navy)", color: "rgba(255,255,255,0.75)", fontFamily: "'Poppins', sans-serif" }}>
      {/* Main Footer */}
      <div className="container" style={{ padding: "4rem 1.5rem 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1.5fr", gap: "3rem" }}>
          {/* Brand Column */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <div style={{ width: 40, height: 40, background: "var(--amber)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Wrench size={20} color="var(--navy)" strokeWidth={2.5} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "white", letterSpacing: "0.02em" }}>SHINY WAVE</div>
                <div style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--amber)" }}>Auto Services</div>
              </div>
            </div>
            <p style={{ fontSize: "0.875rem", lineHeight: 1.7, marginBottom: "1.5rem", color: "rgba(255,255,255,0.6)" }}>
              Sri Lanka's trusted vehicle service center. Expert mechanics, modern equipment, and transparent pricing for all your automotive needs.
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
            {[Share2, Camera, MessageCircle, Play].map((Icon, i) => (
                <a key={i} href="#" style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.6)", transition: "all 0.2s", textDecoration: "none" }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/*Quick Links*/}
          <div>
            <h4 style={{ color: "white", fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1.25rem" }}>Quick Links</h4>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {[
                { href: "/", label: "Home" },
                { href: "/services", label: "Services" },
                { href: "/book", label: "Book Appointment" },
                { href: "#about", label: "About Us" },
                { href: "#contact", label: "Contact" },
              ].map((link) => (
                <Link key={link.href} href={link.href} style={{ color: "rgba(255,255,255,0.65)", textDecoration: "none", fontSize: "0.875rem", transition: "color 0.2s" }}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/*Services*/}
          <div>
            <h4 style={{ color: "white", fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1.25rem" }}>Our Services</h4>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {["Oil Change", "Brake Service", "Wheel Alignment", "Engine Diagnostic", "AC Service", "Full Detailing"].map((s) => (
                <Link key={s} href="/services" style={{ color: "rgba(255,255,255,0.65)", textDecoration: "none", fontSize: "0.875rem", transition: "color 0.2s" }}>
                  {s}
                </Link>
              ))}
            </nav>
          </div>

          {/*Contact*/}
          <div>
            <h4 style={{ color: "white", fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1.25rem" }}>Contact Us</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { icon: MapPin, text: "123, Galle Road, Colombo 03, Sri Lanka" },
                { icon: Phone, text: "+94 11 234 5678" },
                { icon: Mail, text: "info@shinywave.lk" },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <Icon size={16} style={{ color: "var(--amber)", flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(244,163,0,0.1)", borderRadius: 8, border: "1px solid rgba(244,163,0,0.2)" }}>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--amber)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Working Hours</div>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.8)" }}>Mon – Sat: 8:00 AM – 6:00 PM</div>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>Sunday: Closed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="container" style={{ padding: "1.25rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>
          <span>© 2026 Shiny Wave Auto Services. All rights reserved.</span>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <Link href="#" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Privacy Policy</Link>
            <Link href="#" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Terms of Service</Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer > div > div > div[style*="grid"] {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          footer > div > div > div[style*="grid"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
