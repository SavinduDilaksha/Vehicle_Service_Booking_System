"use client";
import { useState, useTransition } from "react";
import { updateBookingStatus, deleteBooking, createBooking } from "@/app/actions";
import { Search, Plus, CheckCircle, XCircle, Trash2, Filter, X } from "lucide-react";

type Booking = {
  id: string; customerName: string; phone: string; email?: string | null;
  vehicleNumber: string; vehicleBrand?: string | null; vehicleModel?: string | null;
  serviceType: string; date: string; time: string; status: string;
  notes?: string | null; createdAt: Date;
  user?: { name: string; email: string } | null;
};

interface Props {
  bookings: Booking[];
  categories: { id: string; name: string }[];
  users: { id: string; name: string; email: string; phone?: string | null }[];
}

export default function AdminBookingsClient({ bookings: initial, categories, users }: Props) {
  const [bookings, setBookings] = useState(initial);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [isPending, startTransition] = useTransition();

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleStatus = (id: string, status: string) => {
    startTransition(async () => {
      const res = await updateBookingStatus(id, status);
      if (res.success) {
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
        showToast(`Booking ${status.toLowerCase()} successfully.`);
      } else showToast(res.error || "Failed", "error");
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this booking?")) return;
    startTransition(async () => {
      const res = await deleteBooking(id);
      if (res.success) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
        showToast("Booking deleted.");
      } else showToast(res.error || "Failed", "error");
    });
  };

  const filtered = bookings.filter((b) => {
    const matchesFilter = filter === "All" || b.status === filter;
    const q = search.toLowerCase();
    const matchesSearch = !q || b.customerName.toLowerCase().includes(q) || b.phone.includes(q) || b.vehicleNumber.toLowerCase().includes(q) || b.serviceType.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const statuses = ["All", "Pending", "Approved", "Completed", "Rejected"];

  return (
    <div style={{ padding: "2.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", color: "var(--navy)", marginBottom: "0.25rem" }}>Booking Management</h1>
          <p style={{ color: "var(--grey-500)", fontSize: "0.875rem" }}>{bookings.length} total bookings</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={16} /> Manual Booking
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1 1 280px" }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--grey-400)" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="form-input" placeholder="Search by name, phone, vehicle..." style={{ paddingLeft: "2.5rem" }} />
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {statuses.map((s) => (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: "0.5rem 1rem", borderRadius: 6, border: `1.5px solid ${filter === s ? "var(--navy)" : "var(--grey-200)"}`, background: filter === s ? "var(--navy)" : "white", color: filter === s ? "white" : "var(--grey-600)", fontFamily: "'Poppins', sans-serif", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "white", borderRadius: 16, boxShadow: "var(--shadow-sm)", overflow: "auto" }}>
        <table className="data-table" style={{ minWidth: 900 }}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Service</th>
              <th>Vehicle</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "var(--grey-400)" }}>
                  No bookings found matching your search.
                </td>
              </tr>
            ) : filtered.map((b) => (
              <tr key={b.id}>
                <td>
                  <div style={{ fontWeight: 700, color: "var(--navy)" }}>{b.customerName}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--grey-500)" }}>{b.phone}</div>
                  {b.email && <div style={{ fontSize: "0.72rem", color: "var(--grey-400)" }}>{b.email}</div>}
                </td>
                <td style={{ fontWeight: 600 }}>{b.serviceType}</td>
                <td>
                  <div style={{ fontFamily: "monospace", fontWeight: 600 }}>{b.vehicleNumber}</div>
                  {b.vehicleBrand && <div style={{ fontSize: "0.75rem", color: "var(--grey-400)" }}>{b.vehicleBrand} {b.vehicleModel}</div>}
                </td>
                <td style={{ fontSize: "0.85rem" }}>
                  <div>{b.date}</div>
                  <div style={{ color: "var(--grey-400)" }}>{b.time}</div>
                </td>
                <td><span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span></td>
                <td>
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    {b.status === "Pending" && (
                      <>
                        <button onClick={() => handleStatus(b.id, "Approved")} style={{ display: "flex", alignItems: "center", gap: "0.3rem", padding: "0.35rem 0.75rem", background: "#D4EDDA", color: "#155724", border: "none", borderRadius: 6, fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
                          <CheckCircle size={13} /> Approve
                        </button>
                        <button onClick={() => handleStatus(b.id, "Rejected")} style={{ display: "flex", alignItems: "center", gap: "0.3rem", padding: "0.35rem 0.75rem", background: "#F8D7DA", color: "#721C24", border: "none", borderRadius: 6, fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
                          <XCircle size={13} /> Reject
                        </button>
                      </>
                    )}
                    {b.status === "Approved" && (
                      <>
                        <button onClick={() => handleStatus(b.id, "Completed")} style={{ display: "flex", alignItems: "center", gap: "0.3rem", padding: "0.35rem 0.75rem", background: "#D1ECF1", color: "#0C5460", border: "none", borderRadius: 6, fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
                          <CheckCircle size={13} /> Complete
                        </button>
                        <button onClick={() => handleStatus(b.id, "Rejected")} style={{ display: "flex", alignItems: "center", gap: "0.3rem", padding: "0.35rem 0.75rem", background: "#F8D7DA", color: "#721C24", border: "none", borderRadius: 6, fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
                          <XCircle size={13} /> Reject
                        </button>
                      </>
                    )}
                    {(b.status === "Completed" || b.status === "Rejected") && (
                      <button onClick={() => handleDelete(b.id)} style={{ display: "flex", alignItems: "center", gap: "0.3rem", padding: "0.35rem 0.75rem", background: "var(--grey-100)", color: "var(--grey-600)", border: "none", borderRadius: 6, fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
                        <Trash2 size={13} /> Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Manual Booking Modal */}
      {showModal && (
        <ManualBookingModal
          categories={categories}
          users={users}
          onClose={() => setShowModal(false)}
          onSuccess={(booking: Booking) => {
            setBookings((prev) => [booking as Booking, ...prev]);
            showToast("Booking created successfully!");
            setShowModal(false);
          }}
          onError={(msg: string) => showToast(msg, "error")}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast toast-${toast.type}`} style={{ zIndex: 9999 }}>
          {toast.type === "success" ? <CheckCircle size={18} /> : <XCircle size={18} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}

function ManualBookingModal({ categories, users, onClose, onSuccess, onError }: {
  categories: { id: string; name: string }[];
  users: { id: string; name: string; email: string; phone?: string | null }[];
  onClose: () => void;
  onSuccess: (b: any) => void;
  onError: (msg: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [selectedUser, setSelectedUser] = useState<string>("");

  const selectedUserData = users.find((u) => u.id === selectedUser);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createBooking({
        userId: fd.get("userId")?.toString() || undefined,
        customerName: fd.get("customerName")?.toString()!,
        phone: fd.get("phone")?.toString()!,
        email: fd.get("email")?.toString() || undefined,
        vehicleNumber: fd.get("vehicleNumber")?.toString().toUpperCase()!,
        vehicleBrand: fd.get("vehicleBrand")?.toString() || undefined,
        vehicleModel: fd.get("vehicleModel")?.toString() || undefined,
        serviceType: fd.get("serviceType")?.toString()!,
        date: fd.get("date")?.toString()!,
        time: fd.get("time")?.toString()!,
        notes: fd.get("notes")?.toString() || undefined,
      });
      if (res.error) onError(res.error);
      else {
        onSuccess({ id: res.bookingId, customerName: fd.get("customerName"), phone: fd.get("phone"), serviceType: fd.get("serviceType"), vehicleNumber: fd.get("vehicleNumber"), date: fd.get("date"), time: fd.get("time"), status: "Pending", createdAt: new Date() });
      }
    });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
      <div style={{ background: "white", borderRadius: 20, padding: "2rem", width: "100%", maxWidth: 620, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem" }}>
          <h2 style={{ fontSize: "1.2rem", color: "var(--navy)" }}>Create Manual Booking</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--grey-400)" }}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label className="form-label">Link to Registered User (Optional)</label>
            <select name="userId" className="form-select" value={selectedUser} onChange={(e) => {
              setSelectedUser(e.target.value);
            }}>
              <option value="">Walk-in / No Account</option>
              {users.map((u) => <option key={u.id} value={u.id}>{u.name} — {u.email}</option>)}
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label className="form-label">Customer Name *</label>
              <input name="customerName" required className="form-input" defaultValue={selectedUserData?.name || ""} placeholder="Full name" />
            </div>
            <div>
              <label className="form-label">Phone *</label>
              <input name="phone" required className="form-input" defaultValue={selectedUserData?.phone || ""} placeholder="07X XXX XXXX" />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input name="email" type="email" className="form-input" defaultValue={selectedUserData?.email || ""} placeholder="email@example.com" />
            </div>
            <div>
              <label className="form-label">Service Type *</label>
              <select name="serviceType" required className="form-select">
                {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Vehicle Number *</label>
              <input name="vehicleNumber" required className="form-input" placeholder="WP CAA-1234" />
            </div>
            <div>
              <label className="form-label">Vehicle Brand</label>
              <input name="vehicleBrand" className="form-input" placeholder="Toyota, Honda..." />
            </div>
            <div>
              <label className="form-label">Date *</label>
              <input name="date" type="date" required className="form-input" />
            </div>
            <div>
              <label className="form-label">Time *</label>
              <input name="time" type="time" required className="form-input" />
            </div>
          </div>

          <div>
            <label className="form-label">Notes</label>
            <textarea name="notes" className="form-input" rows={2} placeholder="Special instructions..." />
          </div>

          <div style={{ display: "flex", gap: "0.875rem", marginTop: "0.5rem" }}>
            <button type="button" onClick={onClose} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" disabled={isPending} className="btn-primary" style={{ flex: 2, justifyContent: "center" }}>
              {isPending ? "Creating..." : "Create Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
