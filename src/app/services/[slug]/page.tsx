import { db } from "@/lib/db";
import { getSession } from "@/app/actions";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, DollarSign, CheckCircle, ArrowLeft, Calendar, Wrench } from "lucide-react";

export const dynamic = "force-dynamic";

const serviceIncludes: Record<string, string[]> = {
  "oil-change": ["Full engine oil drain and refill", "New oil filter replacement", "Top-up of all fluids", "Multi-point visual inspection", "Mileage reset & service sticker"],
  "brake-service": ["Front & rear brake pad inspection", "Brake rotor/drum inspection", "Brake fluid level check & top-up", "Brake caliper inspection", "Brake hose inspection", "Road test verification"],
  "wheel-alignment": ["4-wheel computerized alignment", "Tire pressure check & inflate", "Steering wheel centering", "Camber, caster & toe adjustment", "Alignment report printout"],
  "engine-diagnostic": ["OBD-II electronic scan", "Check engine light diagnosis", "Sensor & emissions test", "Battery & alternator check", "Fuel system inspection", "Detailed fault report"],
  "ac-service": ["AC performance test", "Refrigerant recharge (R134a)", "Compressor belt check", "Condenser & evaporator cleaning", "Cabin air filter replacement", "Thermostat verification"],
  "full-detailing": ["Premium exterior hand wash", "Clay bar decontamination", "Machine polish & wax", "Interior deep vacuum", "Dashboard & upholstery conditioning", "Window & glass treatment", "Tire dressing & rim clean"],
};

const defaultIncludes = ["Full service inspection", "Parts replacement (if required)", "Multi-point check", "Service report provided"];

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await getSession();
  const category = await db.serviceCategory.findUnique({ where: { slug } });

  if (!category) notFound();

  const notifCount = session
    ? await db.notification.count({ where: { userId: session.userId, isRead: false } })
    : 0;

  const includes = serviceIncludes[slug] || defaultIncludes;
  const otherServices = await db.serviceCategory.findMany({
    where: { slug: { not: slug } },
    take: 3,
    orderBy: { createdAt: "asc" },
  });

  return (
    <>
      <Navbar session={session} notifCount={notifCount} />

      {/* Hero */}
      <div style={{ background: "var(--navy)", paddingTop: "calc(70px + 3rem)", paddingBottom: "3rem" }}>
        <div className="container">
          <Link href="/services" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
            <ArrowLeft size={16} /> Back to Services
          </Link>
          <div className="section-tag" style={{ color: "var(--amber)" }}>
            <div style={{ width: 28, height: 2, background: "var(--amber)" }} />
            Service Detail
          </div>
          <h1 style={{ color: "white", fontSize: "clamp(2rem, 4vw, 3rem)" }}>{category.name}</h1>
        </div>
      </div>

      <section className="section" style={{ background: "var(--grey-50)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "3rem" }}>
            {/* Main Content */}
            <div>
              {/* Image */}
              <div style={{ borderRadius: 16, overflow: "hidden", height: 360, marginBottom: "2.5rem", background: "var(--grey-200)" }}>
                {category.imageUrl ? (
                  <img src={category.imageUrl} alt={category.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, var(--navy), var(--navy-light))" }}>
                    <Wrench size={64} color="rgba(255,255,255,0.2)" />
                  </div>
                )}
              </div>

              {/* Description */}
              <div style={{ background: "white", borderRadius: 16, padding: "2.5rem", boxShadow: "var(--shadow-sm)", marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.4rem", marginBottom: "1rem" }}>About This Service</h2>
                <div className="divider-amber" />
                <p style={{ color: "var(--grey-600)", lineHeight: 1.8, fontSize: "0.95rem" }}>{category.description}</p>
              </div>

              {/* What's Included */}
              <div style={{ background: "white", borderRadius: 16, padding: "2.5rem", boxShadow: "var(--shadow-sm)" }}>
                <h2 style={{ fontSize: "1.4rem", marginBottom: "1.25rem" }}>What's Included</h2>
                <div className="divider-amber" />
                <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                  {includes.map((item) => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                      <CheckCircle size={18} color="var(--success)" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: "0.9rem", color: "var(--grey-700)" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking Card */}
            <div>
              <div style={{ background: "white", borderRadius: 16, padding: "2rem", boxShadow: "var(--shadow-md)", position: "sticky", top: "90px" }}>
                <div style={{ background: "var(--navy)", borderRadius: 12, padding: "1.5rem", marginBottom: "1.5rem", color: "white" }}>
                  <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--amber)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>Starting From</div>
                  <div style={{ fontSize: "1.75rem", fontWeight: 800 }}>{category.priceRange || "Contact for quote"}</div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", marginBottom: "1.75rem" }}>
                  {category.duration && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 0", borderBottom: "1px solid var(--grey-100)" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--grey-600)" }}>
                        <Clock size={16} /> Estimated Time
                      </span>
                      <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--navy)" }}>{category.duration}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 0", borderBottom: "1px solid var(--grey-100)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--grey-600)" }}>
                      <Calendar size={16} /> Availability
                    </span>
                    <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--success)" }}>Mon – Sat</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 0" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--grey-600)" }}>
                      <CheckCircle size={16} /> Warranty
                    </span>
                    <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--navy)" }}>3 Months</span>
                  </div>
                </div>

                <Link
                  href={`/book?service=${encodeURIComponent(category.name)}`}
                  className="btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Book This Service
                </Link>

                <div style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.8rem", color: "var(--grey-400)" }}>
                  Free cancellation up to 24 hours before
                </div>
              </div>

              {/* Other Services */}
              <div style={{ background: "white", borderRadius: 16, padding: "1.5rem", boxShadow: "var(--shadow-sm)", marginTop: "1.5rem" }}>
                <h4 style={{ marginBottom: "1rem", fontSize: "0.9rem" }}>Other Services</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                  {otherServices.map((s) => (
                    <Link key={s.id} href={`/services/${s.slug}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem", color: "var(--navy)", textDecoration: "none", padding: "0.5rem 0", borderBottom: "1px solid var(--grey-100)" }}>
                      <span>{s.name}</span>
                      <span style={{ color: "var(--amber)", fontSize: "0.75rem", fontWeight: 600 }}>{s.priceRange?.split("–")[0]}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
