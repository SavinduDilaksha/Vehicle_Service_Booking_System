import { db } from "@/lib/db";
import { getSession } from "@/app/actions";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import { Clock, ChevronRight, Wrench } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const session = await getSession();
  const categories = await db.serviceCategory.findMany({ orderBy: { createdAt: "asc" } });
  const notifCount = session
    ? await db.notification.count({ where: { userId: session.userId, isRead: false } })
    : 0;

  return (
    <>
      <Navbar session={session} notifCount={notifCount} />

      {/*Page Header*/}
      <div style={{ background: "var(--navy)", paddingTop: "calc(70px + 4rem)", paddingBottom: "4rem" }}>
        <div className="container">
          <div className="section-tag" style={{ color: "var(--amber)" }}>
            <div style={{ width: 28, height: 2, background: "var(--amber)" }} />
            What We Offer
          </div>
          <h1 style={{ color: "white", fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "1rem" }}>Our Services</h1>
          <p style={{ color: "rgba(255,255,255,0.65)", maxWidth: 500 }}>
            Comprehensive vehicle care for every need. From routine maintenance to complex diagnostics — we do it all.
          </p>
        </div>
      </div>

      {/*Services Grid*/}
      <section className="section" style={{ background: "var(--grey-50)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "2rem" }}>
            {categories.map((cat) => (
              <div key={cat.id} className="card">
                {/* Image */}
                <div style={{ height: 220, overflow: "hidden", position: "relative", background: "var(--grey-200)" }}>
                  {cat.imageUrl ? (
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.07)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, var(--navy), var(--navy-light))" }}>
                      <Wrench size={56} color="rgba(255,255,255,0.2)" />
                    </div>
                  )}
                  {cat.priceRange && (
                    <div style={{ position: "absolute", top: 16, left: 16, background: "var(--amber)", color: "var(--navy)", padding: "0.3rem 0.9rem", borderRadius: 4, fontSize: "0.75rem", fontWeight: 700 }}>
                      {cat.priceRange}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: "1.75rem" }}>
                  <h2 style={{ fontSize: "1.2rem", marginBottom: "0.625rem" }}>{cat.name}</h2>
                  <p style={{ fontSize: "0.875rem", color: "var(--grey-600)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                    {cat.description}
                  </p>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {cat.duration && (
                      <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "var(--grey-500)" }}>
                        <Clock size={14} /> Est. {cat.duration}
                      </span>
                    )}
                    <Link href={`/services/${cat.slug}`} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.875rem", fontWeight: 700, color: "var(--navy)", textDecoration: "none" }}>
                      View Details <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/*CTA*/}
          <div style={{ marginTop: "4rem", background: "var(--navy)", borderRadius: 20, padding: "3rem", textAlign: "center" }}>
            <h2 style={{ color: "white", fontSize: "1.8rem", marginBottom: "1rem" }}>Not Sure Which Service You Need?</h2>
            <p style={{ color: "rgba(255,255,255,0.65)", marginBottom: "2rem" }}>
              Book a free vehicle inspection and our experts will recommend the right service for your car.
            </p>
            <Link href="/book" className="btn-primary" style={{ fontSize: "1rem", padding: "0.9rem 2.5rem" }}>
              Book Free Inspection
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
