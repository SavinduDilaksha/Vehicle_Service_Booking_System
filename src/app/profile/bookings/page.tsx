import { requireAuth } from "@/app/actions";
import { db } from "@/lib/db";
import Link from "next/link";
import { Car, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MyBookingsPage() {
  const session = await requireAuth();
  const bookings = await db.booking.findMany({
    where: { userId: session.userId, status: { in: ["Pending", "Approved"] } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", color: "var(--navy)", marginBottom: "0.5rem" }}>My Bookings</h1>
      <p style={{ color: "var(--grey-500)", fontSize: "0.875rem", marginBottom: "2rem" }}>Your active and pending service appointments</p>

      {bookings.length === 0 ? (
        <div style={{ background: "white", borderRadius: 16, padding: "4rem", textAlign: "center", boxShadow: "var(--shadow-sm)" }}>
          <Car size={48} color="var(--grey-300)" style={{ margin: "0 auto 1.25rem" }} />
          <h3 style={{ color: "var(--grey-600)", marginBottom: "0.5rem" }}>No Active Bookings</h3>
          <p style={{ color: "var(--grey-400)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>You have no pending or approved bookings right now.</p>
          <Link href="/book" className="btn-primary">Book a Service</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {bookings.map((b) => (
            <div key={b.id} style={{ background: "white", borderRadius: 16, padding: "1.75rem 2rem", boxShadow: "var(--shadow-sm)", border: "1px solid var(--grey-100)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <h3 style={{ fontSize: "1.1rem" }}>{b.serviceType}</h3>
                    <span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span>
                  </div>
                  <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.85rem", color: "var(--grey-600)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Clock size={14} /> {b.date} at {b.time}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Car size={14} /> {b.vehicleNumber}
                      {b.vehicleBrand && ` — ${b.vehicleBrand} ${b.vehicleModel || ""}`}
                    </span>
                  </div>
                  {b.notes && (
                    <p style={{ fontSize: "0.8rem", color: "var(--grey-400)", marginTop: "0.5rem", fontStyle: "italic" }}>
                      Note: {b.notes}
                    </p>
                  )}
                </div>
                <div style={{ textAlign: "right", fontSize: "0.75rem", color: "var(--grey-400)" }}>
                  Ref: <span style={{ fontFamily: "monospace", fontSize: "0.7rem" }}>{b.id.slice(0, 12)}...</span>
                </div>
              </div>

              {/* Status Progress */}
              <div style={{ marginTop: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                  {["Pending", "Approved", "Completed"].map((s, i) => {
                    const statusOrder: Record<string, number> = { Pending: 0, Approved: 1, Completed: 2 };
                    const currentOrder = statusOrder[b.status] ?? -1;
                    const isDone = i < currentOrder;
                    const isActive = i === currentOrder;
                    return (
                      <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700,
                            background: isDone ? "var(--success)" : isActive ? "var(--amber)" : "var(--grey-200)",
                            color: isDone || isActive ? "white" : "var(--grey-400)",
                            border: isActive ? "3px solid rgba(244,163,0,0.3)" : "none",
                          }}>
                            {isDone ? "✓" : i + 1}
                          </div>
                          <span style={{ fontSize: "0.65rem", color: isActive ? "var(--navy)" : "var(--grey-400)", fontWeight: isActive ? 700 : 400 }}>{s}</span>
                        </div>
                        {i < 2 && <div style={{ flex: 1, height: 2, background: isDone ? "var(--success)" : "var(--grey-200)", margin: "0 0.5rem", marginBottom: "1.25rem" }} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
