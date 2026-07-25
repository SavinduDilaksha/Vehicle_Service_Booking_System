import { getSession, markNotificationsRead } from "@/app/actions";
import { db } from "@/lib/db";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, Shield, Clock, Star, CheckCircle, ChevronRight, Wrench,
  Phone, Mail, MapPin, Send, Megaphone
} from "lucide-react";
import { submitContactDirect } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getSession();

  const [categories, announcements, notifCount] = await Promise.all([
    db.serviceCategory.findMany({ orderBy: { createdAt: "asc" }, take: 6 }),
    db.announcement.findMany({ orderBy: { publishedAt: "desc" }, take: 3 }),
    session
      ? db.notification.count({ where: { userId: session.userId, isRead: false } })
      : Promise.resolve(0),
  ]);

  const whyUs = [
    { icon: "🔧", title: "Expert Mechanics", desc: "All our technicians are factory-trained with 10+ years of hands-on experience." },
    { icon: "⏱️", title: "Fast Turnaround", desc: "Most services completed same-day so you're never left without your vehicle for long." },
    { icon: "💯", title: "Genuine Parts", desc: "We use only OEM or certified aftermarket parts for every repair." },
    { icon: "💬", title: "Transparent Pricing", desc: "No hidden fees, ever. You get a full quote before we begin any work." },
    { icon: "🔍", title: "Free Inspection", desc: "Complimentary 25-point vehicle health check with every service booking." },
    { icon: "🛡️", title: "Warranty Backed", desc: "All services come with a 3-month or 5,000 km workmanship warranty." },
  ];

  const steps = [
    { num: "01", title: "Book Online", desc: "Select your service, preferred date & time using our easy booking form." },
    { num: "02", title: "Drop Your Car", desc: "Bring your vehicle at the scheduled time. We'll take it from there." },
    { num: "03", title: "Track Progress", desc: "Get real-time updates on your service status through the portal." },
    { num: "04", title: "Pick Up & Drive", desc: "Collect your vehicle once done — fresh, safe, and ready to roll." },
  ];

  return (
    <>
      <Navbar session={session} notifCount={notifCount} />

      {/* ============================================================
          HERO SECTION
      ============================================================ */}
      <section id="home" style={{ position: "relative", height: "100vh", minHeight: 600, display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <img
            src="/images/hero.png"
            alt="Shiny Wave Workshop"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div className="hero-overlay" style={{ position: "absolute", inset: 0 }} />
        </div>

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 640 }}>
            <div className="section-tag" style={{ color: "var(--amber)", marginBottom: "1rem" }}>
              <div style={{ width: 32, height: 2, background: "var(--amber)" }} />
              Premium Auto Services in Sri Lanka
            </div>
            <h1 style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 900,
              color: "white",
              lineHeight: 1.1,
              marginBottom: "1.5rem",
              letterSpacing: "-0.01em",
            }}>
              Your Car Deserves<br />
              <span style={{ color: "var(--amber)" }}>Expert Care</span>
            </h1>
            <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.7, marginBottom: "2.5rem", maxWidth: 520 }}>
              Book your vehicle service appointment online. Real-time tracking, certified mechanics, guaranteed quality — all in one place.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/book" className="btn-primary" style={{ fontSize: "0.95rem", padding: "0.9rem 2.5rem" }}>
                Book Appointment <ArrowRight size={18} />
              </Link>
              <Link href="/services" className="btn-white" style={{ fontSize: "0.95rem", padding: "0.9rem 2rem" }}>
                Our Services
              </Link>
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", gap: "2.5rem", marginTop: "3rem" }}>
              {[["5000+", "Happy Customers"], ["28+", "Expert Mechanics"], ["15+", "Service Types"]].map(([val, label]) => (
                <div key={label}>
                  <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--amber)", lineHeight: 1 }}>{val}</div>
                  <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em", textTransform: "uppercase", marginTop: "0.25rem" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SERVICES SECTION
      ============================================================ */}
      <section id="services" className="section" style={{ background: "var(--grey-50)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-tag" style={{ justifyContent: "center" }}>Our Services</div>
            <h2 className="section-title">What We Do Best</h2>
            <p className="section-subtitle" style={{ margin: "0 auto" }}>
              From routine maintenance to complex repairs, our certified team handles it all with precision.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.5rem" }}>
            {categories.map((cat) => (
              <div key={cat.id} className="card" style={{ cursor: "pointer" }}>
                <div style={{ height: 200, overflow: "hidden", position: "relative", background: "var(--grey-200)" }}>
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, var(--navy), var(--navy-light))" }}>
                      <Wrench size={48} color="rgba(255,255,255,0.3)" />
                    </div>
                  )}
                  {cat.priceRange && (
                    <div style={{ position: "absolute", top: 12, right: 12, background: "var(--amber)", color: "var(--navy)", padding: "0.25rem 0.75rem", borderRadius: 4, fontSize: "0.7rem", fontWeight: 700 }}>
                      {cat.priceRange}
                    </div>
                  )}
                </div>
                <div style={{ padding: "1.5rem" }}>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>{cat.name}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--grey-600)", lineHeight: 1.6, marginBottom: "1rem" }}>
                    {cat.description.substring(0, 100)}...
                  </p>
                  {cat.duration && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: "var(--grey-500)", marginBottom: "1rem" }}>
                      <Clock size={12} /> Est. {cat.duration}
                    </div>
                  )}
                  <Link href={`/services/${cat.slug}`} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", fontWeight: 700, color: "var(--navy)", textDecoration: "none" }}>
                    View Details <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <Link href="/services" className="btn-primary">
              View All Services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/*============================================================
          WHY CHOOSE US
      ============================================================*/}
      <section className="section" style={{ background: "white" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
            <div>
              <div className="section-tag">Why Choose Us</div>
              <h2 className="section-title">We Set the Standard for<br />Vehicle Care</h2>
              <div className="divider-amber" />
              <p className="section-subtitle" style={{ marginBottom: "2rem" }}>
                Over two decades of automotive excellence. We combine traditional craftsmanship with cutting-edge diagnostic technology.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {whyUs.map((item) => (
                  <div key={item.title} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <div style={{ fontSize: "1.5rem", flexShrink: 0 }}>{item.icon}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--navy)", marginBottom: "0.25rem" }}>{item.title}</div>
                      <div style={{ fontSize: "0.78rem", color: "var(--grey-600)", lineHeight: 1.5 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <img src="/images/about-team.png" alt="Shiny Wave Team" style={{ width: "100%", borderRadius: 16, boxShadow: "var(--shadow-xl)" }} />
              <div style={{ position: "absolute", bottom: -24, left: -24, background: "var(--amber)", color: "var(--navy)", padding: "1.5rem 2rem", borderRadius: 12, boxShadow: "var(--shadow-lg)" }}>
                <div style={{ fontSize: "2rem", fontWeight: 900 }}>20+</div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          HOW IT WORKS
      ============================================================ */}
      <section className="section" style={{ background: "var(--navy)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-tag" style={{ justifyContent: "center", color: "var(--amber)" }}>
              <div style={{ width: 28, height: 2, background: "var(--amber)" }} />
              How It Works
            </div>
            <h2 className="section-title" style={{ color: "white" }}>Simple, Fast & Reliable</h2>
            <p style={{ color: "rgba(255,255,255,0.65)", maxWidth: 500, margin: "0 auto" }}>
              Get your vehicle serviced in 4 easy steps. No complications, no surprises.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
            {steps.map((step, i) => (
              <div key={step.num} style={{ position: "relative", textAlign: "center", padding: "2rem 1rem" }}>
                {i < steps.length - 1 && (
                  <div style={{ position: "absolute", top: "2.75rem", right: "-0.75rem", width: "1.5rem", height: 2, background: "rgba(244,163,0,0.3)", zIndex: 1 }} />
                )}
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--amber)", color: "var(--navy)", fontWeight: 900, fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                  {step.num}
                </div>
                <h3 style={{ color: "white", fontSize: "1rem", marginBottom: "0.5rem" }}>{step.title}</h3>
                <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <Link href="/book" className="btn-primary" style={{ fontSize: "1rem", padding: "1rem 3rem" }}>
              Book Your Service Now <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          ANNOUNCEMENTS
      ============================================================ */}
      {announcements.length > 0 && (
        <section className="section" style={{ background: "var(--grey-50)" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <div className="section-tag" style={{ justifyContent: "center" }}>Latest News</div>
              <h2 className="section-title">Announcements</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
              {announcements.map((a) => (
                <div key={a.id} style={{ background: "white", borderRadius: 12, padding: "1.75rem", boxShadow: "var(--shadow-sm)", border: "1px solid var(--grey-100)", borderTop: "4px solid var(--amber)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                    <Megaphone size={16} color="var(--amber)" />
                    <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--grey-400)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      {new Date(a.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  <h3 style={{ fontSize: "1rem", marginBottom: "0.75rem", color: "var(--navy)" }}>{a.title}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--grey-600)", lineHeight: 1.7 }}>{a.message}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================
          ABOUT US
      ============================================================ */}
      <section id="about" className="section" style={{ background: "white" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <div style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)", borderRadius: 16, padding: "3rem", color: "white" }}>
                <div className="section-tag" style={{ color: "var(--amber)", marginBottom: "1.5rem" }}>
                  <div style={{ width: 28, height: 2, background: "var(--amber)" }} />
                  About Shiny Wave
                </div>
                <h2 style={{ color: "white", fontSize: "2rem", marginBottom: "1.25rem", lineHeight: 1.2 }}>
                  Two Decades of Automotive Excellence
                </h2>
                <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.8, marginBottom: "1.5rem", fontSize: "0.9rem" }}>
                  Founded in 2005, Shiny Wave Auto Services has grown from a small workshop into Sri Lanka's most trusted vehicle service network. With over 20 years of experience, we've served more than 50,000 vehicles with unmatched dedication and care.
                </p>
                <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.8, fontSize: "0.9rem", marginBottom: "2rem" }}>
                  Our team of 28 certified mechanics, modern diagnostic equipment, and commitment to using only genuine parts make us the preferred choice for discerning vehicle owners across the island.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  {[["50,000+", "Vehicles Serviced"], ["28", "Expert Mechanics"], ["100%", "Customer Satisfaction"], ["3-Month", "Service Warranty"]].map(([val, label]) => (
                    <div key={label}>
                      <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--amber)" }}>{val}</div>
                      <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className="section-tag">Our Promise</div>
              <h2 className="section-title">Quality That You Can Rely On</h2>
              <div className="divider-amber" />
              {[
                { icon: Shield, title: "ISO Certified Workshop", desc: "Our facility meets international automotive service standards." },
                { icon: Star, title: "Award-Winning Service", desc: "Recognized as the Best Auto Service Center in Western Province 2023." },
                { icon: CheckCircle, title: "Money-Back Guarantee", desc: "If you're not 100% satisfied, we'll make it right — guaranteed." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} style={{ display: "flex", gap: "1.25rem", marginBottom: "1.75rem" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 10, background: "var(--amber-pale)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={22} color="var(--amber)" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: "1rem", marginBottom: "0.4rem" }}>{title}</h4>
                    <p style={{ fontSize: "0.875rem", color: "var(--grey-600)", lineHeight: 1.6 }}>{desc}</p>
                  </div>
                </div>
              ))}
              <Link href="/book" className="btn-primary">Schedule a Visit <ArrowRight size={16} /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          CONTACT
      ============================================================ */}
      <section id="contact" className="section" style={{ background: "var(--grey-50)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-tag" style={{ justifyContent: "center" }}>Contact Us</div>
            <h2 className="section-title">Get In Touch</h2>
            <p className="section-subtitle" style={{ margin: "0 auto" }}>
              Have a question or need help? We're just a message away.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "3rem" }}>
            {/* Contact Info */}
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "2rem" }}>
                {[
                  { icon: MapPin, title: "Visit Us", value: "123, Galle Road, Colombo 03, Sri Lanka" },
                  { icon: Phone, title: "Call Us", value: "+94 11 234 5678 | +94 77 123 4567" },
                  { icon: Mail, title: "Email Us", value: "info@shinywave.lk" },
                ].map(({ icon: Icon, title, value }) => (
                  <div key={title} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--amber-pale)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={20} color="var(--amber)" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--navy)", marginBottom: "0.25rem" }}>{title}</div>
                      <div style={{ fontSize: "0.85rem", color: "var(--grey-600)" }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Map placeholder */}
              <div style={{ borderRadius: 12, overflow: "hidden", height: 200, background: "var(--grey-200)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.6792694977927!2d79.84904!3d6.9219!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNTUnMTguOCJOIDc5wrA1MCc1Ni41IkU!5e0!3m2!1sen!2slk!4v1720000000000!5m2!1sen!2slk"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>

            {/* Contact Form */}
            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

//Client-side contact form
function ContactForm() {
  return (
    <div style={{ background: "white", borderRadius: 16, padding: "2.5rem", boxShadow: "var(--shadow-md)" }}>
      <form action={submitContactDirect} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label className="form-label">Full Name *</label>
            <input name="name" required className="form-input" placeholder="Your name" />
          </div>
          <div>
            <label className="form-label">Email *</label>
            <input name="email" type="email" required className="form-input" placeholder="your@email.com" />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label className="form-label">Phone</label>
            <input name="phone" type="tel" className="form-input" placeholder="07X XXX XXXX" />
          </div>
          <div>
            <label className="form-label">Subject *</label>
            <input name="subject" required className="form-input" placeholder="How can we help?" />
          </div>
        </div>
        <div>
          <label className="form-label">Message *</label>
          <textarea name="message" required rows={5} className="form-input" placeholder="Tell us more about your inquiry..." style={{ resize: "vertical" }} />
        </div>
        <button type="submit" className="btn-primary" style={{ justifyContent: "center" }}>
          Send Message <Send size={16} />
        </button>
      </form>
    </div>
  );
}
