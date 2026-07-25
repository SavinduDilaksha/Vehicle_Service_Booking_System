import { requireAuth } from "@/app/actions";
import { db } from "@/lib/db";
import { Clock, Car } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BookingHistoryPage() {
  const session = await requireAuth();
  const bookings = await db.booking.findMany({
    where: { userId: session.userId, status: { in: ["Completed", "Rejected"] } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", color: "var(--navy)", marginBottom: "0.5rem" }}>Booking History</h1>
      <p style={{ color: "var(--grey-500)", fontSize: "0.875rem", marginBottom: "2rem" }}>
        Your completed and rejected service appointments
      </p>

      {bookings.length === 0 ? (
        <div style={{ background: "white", borderRadius: 16, padding: "4rem", textAlign: "center", boxShadow: "var(--shadow-sm)" }}>
          <Clock size={48} color="var(--grey-300)" style={{ margin: "0 auto 1.25rem" }} />
          <h3 style={{ color: "var(--grey-600)", marginBottom: "0.5rem" }}>No History Yet</h3>
          <p style={{ color: "var(--grey-400)", fontSize: "0.875rem" }}>Completed and rejected bookings will appear here.</p>
        </div>
      ) : (
        <div style={{ background: "white", borderRadius: 16, boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Vehicle</th>
                <th>Date</th>
                <th>Status</th>
                <th>Booked On</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 600, color: "var(--navy)" }}>{b.serviceType}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{b.vehicleNumber}</div>
                    {b.vehicleBrand && <div style={{ fontSize: "0.75rem", color: "var(--grey-400)" }}>{b.vehicleBrand} {b.vehicleModel}</div>}
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem" }}>
                      <Clock size={13} color="var(--grey-400)" /> {b.date} at {b.time}
                    </div>
                  </td>
                  <td><span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span></td>
                  <td style={{ fontSize: "0.8rem", color: "var(--grey-400)" }}>
                    {new Date(b.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
