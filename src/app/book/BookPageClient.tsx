"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import { ArrowRight, ArrowLeft, CheckCircle, Car, Calendar, Clipboard, User } from "lucide-react";
import { createBooking } from "@/app/actions";

interface BookPageProps {
  session: any;
  categories: Array<{ id: string; name: string; priceRange?: string | null; duration?: string | null }>;
  notifCount: number;
}

export default function BookPageClient({ session, categories, notifCount }: BookPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselected = searchParams.get("service") || "";

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState<{ bookingId: string; service: string } | null>(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    serviceType: preselected,
    customerName: session?.name || "",
    phone: "",
    email: session?.email || "",
    vehicleNumber: "",
    vehicleBrand: "",
    vehicleModel: "",
    date: "",
    time: "",
    notes: "",
  });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const timeSlots = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

  const canAdvance = () => {
    if (step === 1) return !!form.serviceType;
    if (step === 2) return !!form.date && !!form.time;
    if (step === 3) return !!form.customerName && !!form.phone && !!form.vehicleNumber;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await createBooking({
        userId: session?.userId,
        customerName: form.customerName,
        phone: form.phone,
        email: form.email,
        vehicleNumber: form.vehicleNumber.toUpperCase(),
        vehicleBrand: form.vehicleBrand,
        vehicleModel: form.vehicleModel,
        serviceType: form.serviceType,
        date: form.date,
        time: form.time,
        notes: form.notes,
      });

      if (res.error) {
        setError(res.error);
      } else if (res.bookingId) {
        setBookingResult({ bookingId: res.bookingId, service: form.serviceType });
        setStep(5);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, label: "Service", icon: Clipboard },
    { num: 2, label: "Schedule", icon: Calendar },
    { num: 3, label: "Details", icon: User },
    { num: 4, label: "Confirm", icon: Car },
  ];

  // Get min date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <>
      <Navbar session={session} notifCount={notifCount} />

      <div style={{ background: "var(--navy)", paddingTop: "calc(70px + 3rem)", paddingBottom: "3rem" }}>
        <div className="container">
          <div className="section-tag" style={{ color: "var(--amber)" }}>
            <div style={{ width: 28, height: 2, background: "var(--amber)" }} />
            Online Booking
          </div>
          <h1 style={{ color: "white", fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}>Book Your Appointment</h1>
        </div>
      </div>

      <section className="section" style={{ background: "var(--grey-50)" }}>
        <div className="container">
          {step < 5 ? (
            <div style={{ maxWidth: 760, margin: "0 auto" }}>
              {/* Step Indicator */}
              <div className="step-indicator" style={{ marginBottom: "2.5rem" }}>
                {steps.map((s, i) => (
                  <div key={s.num} className="step-item" style={{ alignItems: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
                      <div className={`step-circle ${step > s.num ? "done" : step === s.num ? "active" : ""}`}>
                        {step > s.num ? <CheckCircle size={16} /> : s.num}
                      </div>
                      <span style={{ fontSize: "0.7rem", fontWeight: 600, color: step === s.num ? "var(--navy)" : "var(--grey-400)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</span>
                    </div>
                    {i < steps.length - 1 && <div className={`step-line ${step > s.num ? "done" : ""}`} style={{ margin: "0 0.5rem", marginBottom: "1.25rem" }} />}
                  </div>
                ))}
              </div>

              <div style={{ background: "white", borderRadius: 20, padding: "2.5rem", boxShadow: "var(--shadow-md)" }}>
                {error && (
                  <div style={{ background: "#FEE2E2", color: "#991B1B", padding: "0.875rem 1rem", borderRadius: 8, marginBottom: "1.5rem", fontSize: "0.875rem" }}>
                    {error}
                  </div>
                )}

                {/* STEP 1 — Service Selection */}
                {step === 1 && (
                  <div>
                    <h2 style={{ fontSize: "1.3rem", marginBottom: "0.5rem" }}>Choose a Service</h2>
                    <p style={{ fontSize: "0.875rem", color: "var(--grey-500)", marginBottom: "1.75rem" }}>Select the service you'd like to book</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      {categories.map((cat) => (
                        <div
                          key={cat.id}
                          onClick={() => update("serviceType", cat.name)}
                          style={{
                            border: `2px solid ${form.serviceType === cat.name ? "var(--amber)" : "var(--grey-200)"}`,
                            borderRadius: 10, padding: "1.25rem", cursor: "pointer",
                            background: form.serviceType === cat.name ? "var(--amber-pale)" : "white",
                            transition: "all 0.2s",
                          }}
                        >
                          <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--navy)", marginBottom: "0.25rem" }}>{cat.name}</div>
                          {cat.priceRange && <div style={{ fontSize: "0.75rem", color: "var(--grey-500)" }}>{cat.priceRange}</div>}
                          {cat.duration && <div style={{ fontSize: "0.75rem", color: "var(--grey-400)", marginTop: "0.25rem" }}>⏱ {cat.duration}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2 — Date & Time */}
                {step === 2 && (
                  <div>
                    <h2 style={{ fontSize: "1.3rem", marginBottom: "0.5rem" }}>Select Date & Time</h2>
                    <p style={{ fontSize: "0.875rem", color: "var(--grey-500)", marginBottom: "1.75rem" }}>Choose your preferred appointment slot</p>

                    <div style={{ marginBottom: "1.5rem" }}>
                      <label className="form-label">Preferred Date</label>
                      <input
                        type="date"
                        min={minDate}
                        value={form.date}
                        onChange={(e) => update("date", e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label className="form-label">Preferred Time</label>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.75rem" }}>
                        {timeSlots.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => update("time", t)}
                            style={{
                              padding: "0.75rem 0.5rem",
                              border: `2px solid ${form.time === t ? "var(--amber)" : "var(--grey-200)"}`,
                              borderRadius: 8,
                              background: form.time === t ? "var(--amber-pale)" : "white",
                              fontFamily: "'Poppins', sans-serif",
                              fontWeight: 600,
                              fontSize: "0.8rem",
                              color: form.time === t ? "var(--navy)" : "var(--grey-600)",
                              cursor: "pointer",
                              transition: "all 0.15s",
                            }}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3 — Details */}
                {step === 3 && (
                  <div>
                    <h2 style={{ fontSize: "1.3rem", marginBottom: "0.5rem" }}>Your Details</h2>
                    <p style={{ fontSize: "0.875rem", color: "var(--grey-500)", marginBottom: "1.75rem" }}>Tell us about yourself and your vehicle</p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
                      <div>
                        <label className="form-label">Full Name *</label>
                        <input className="form-input" value={form.customerName} onChange={(e) => update("customerName", e.target.value)} placeholder="Your name" required />
                      </div>
                      <div>
                        <label className="form-label">Phone Number *</label>
                        <input className="form-input" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="07X XXX XXXX" required />
                      </div>
                      <div>
                        <label className="form-label">Email</label>
                        <input className="form-input" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="your@email.com" />
                      </div>
                      <div>
                        <label className="form-label">Vehicle Number *</label>
                        <input className="form-input" value={form.vehicleNumber} onChange={(e) => update("vehicleNumber", e.target.value.toUpperCase())} placeholder="WP CAA-1234" required />
                      </div>
                      <div>
                        <label className="form-label">Vehicle Brand</label>
                        <input className="form-input" value={form.vehicleBrand} onChange={(e) => update("vehicleBrand", e.target.value)} placeholder="Toyota, Honda..." />
                      </div>
                      <div>
                        <label className="form-label">Vehicle Model</label>
                        <input className="form-input" value={form.vehicleModel} onChange={(e) => update("vehicleModel", e.target.value)} placeholder="Corolla, Civic..." />
                      </div>
                    </div>

                    <div>
                      <label className="form-label">Additional Notes</label>
                      <textarea className="form-input" rows={3} value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Any special instructions or concerns about your vehicle..." style={{ resize: "vertical" }} />
                    </div>
                  </div>
                )}

                {/* STEP 4 — Confirm */}
                {step === 4 && (
                  <div>
                    <h2 style={{ fontSize: "1.3rem", marginBottom: "0.5rem" }}>Confirm Booking</h2>
                    <p style={{ fontSize: "0.875rem", color: "var(--grey-500)", marginBottom: "1.75rem" }}>Review your booking details before confirming</p>

                    <div style={{ background: "var(--grey-50)", borderRadius: 12, padding: "1.5rem", marginBottom: "1.5rem" }}>
                      {[
                        ["Service", form.serviceType],
                        ["Date", form.date],
                        ["Time", form.time],
                        ["Name", form.customerName],
                        ["Phone", form.phone],
                        ["Vehicle", `${form.vehicleBrand || ""} ${form.vehicleModel || ""} — ${form.vehicleNumber}`],
                        ...(form.notes ? [["Notes", form.notes]] : []),
                      ].map(([k, v]) => (
                        <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 0", borderBottom: "1px solid var(--grey-200)" }}>
                          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--grey-500)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{k}</span>
                          <span style={{ fontSize: "0.9rem", color: "var(--navy)", fontWeight: 600 }}>{v}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ background: "var(--amber-pale)", border: "1px solid var(--amber)", borderRadius: 8, padding: "0.875rem 1rem", fontSize: "0.85rem", color: "var(--navy)" }}>
                      ✅ Our team will confirm your appointment within 2 hours of booking.
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2.5rem" }}>
                  {step > 1 ? (
                    <button onClick={() => setStep(step - 1)} className="btn-ghost">
                      <ArrowLeft size={16} /> Back
                    </button>
                  ) : <div />}

                  {step < 4 ? (
                    <button
                      onClick={() => setStep(step + 1)}
                      disabled={!canAdvance()}
                      className="btn-primary"
                      style={{ opacity: canAdvance() ? 1 : 0.5, cursor: canAdvance() ? "pointer" : "not-allowed" }}
                    >
                      Continue <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="btn-primary"
                      style={{ opacity: loading ? 0.7 : 1 }}
                    >
                      {loading ? "Submitting..." : "Confirm Booking"} <CheckCircle size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* SUCCESS STATE */
            <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
              <div style={{ background: "white", borderRadius: 20, padding: "3rem", boxShadow: "var(--shadow-lg)" }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#D4EDDA", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                  <CheckCircle size={40} color="var(--success)" />
                </div>
                <h2 style={{ fontSize: "1.75rem", color: "var(--navy)", marginBottom: "0.75rem" }}>Booking Confirmed!</h2>
                <p style={{ color: "var(--grey-600)", marginBottom: "2rem", lineHeight: 1.7 }}>
                  Your <strong>{bookingResult?.service}</strong> appointment has been submitted successfully. Our team will confirm within 2 hours.
                </p>

                <div style={{ background: "var(--grey-50)", borderRadius: 10, padding: "1.25rem", marginBottom: "2rem" }}>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--grey-400)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>Booking Reference</div>
                  <div style={{ fontFamily: "monospace", fontSize: "0.9rem", fontWeight: 700, color: "var(--navy)", wordBreak: "break-all" }}>
                    {bookingResult?.bookingId}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                  {session && (
                    <Link href="/profile/bookings" className="btn-primary">View My Bookings</Link>
                  )}
                  <Link href="/" className="btn-secondary">Back to Home</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
