export default function Page() {
  return (
    <main>
      {/* TODO: Implement Page */}
    </main>
  );
}
"use client";
import { useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import { Wrench, Eye, EyeOff, ArrowRight, Mail, Lock, User, Phone } from "lucide-react";
import { loginUser, registerUser } from "../actions";
import Link from "next/link";

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();

  const [loginState, loginAction, loginPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const res = await loginUser(prevState, formData);
      if (res?.success) {
        router.push(res.role === "ADMIN" ? "/admin/dashboard" : "/home");
        router.refresh();
      }
      return res;
    },
    null
  );

  const [regState, regAction, regPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const res = await registerUser(prevState, formData);
      if (res?.success) {
        router.push("/home");
        router.refresh();
      }
      return res;
    },
    null
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 60%, #1d4b8a 100%)" }}>
      {/* Left Panel — Branding */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "3rem 4rem", color: "white" }} className="auth-left">
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none", marginBottom: "3rem" }}>
          <div style={{ width: 44, height: 44, background: "var(--amber)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Wrench size={22} color="var(--navy)" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1.2rem", color: "white", letterSpacing: "0.02em" }}>SHINY WAVE</div>
            <div style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--amber)" }}>Auto Services</div>
          </div>
        </Link>

        <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "white", lineHeight: 1.1, marginBottom: "1.25rem" }}>
          Your Vehicle,<br />
          <span style={{ color: "var(--amber)" }}>Our Priority.</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8, fontSize: "1rem", marginBottom: "2.5rem", maxWidth: 420 }}>
          Join thousands of satisfied customers who trust Shiny Wave for all their vehicle service needs. Book, track, and manage your appointments effortlessly.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {["✅ Real-time booking status updates", "🔧 Expert mechanics, certified technicians", "💰 Transparent pricing, no hidden fees", "🛡️ 3-month service warranty on all work"].map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.85)" }}>
              {item}
            </div>
          ))}
        </div>

        <div style={{ marginTop: "3rem", display: "flex", gap: "3rem" }}>
          {[["5000+", "Customers"], ["20+", "Years"], ["100%", "Satisfaction"]].map(([val, label]) => (
            <div key={label}>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--amber)" }}>{val}</div>
              <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel — Form */}
      <div style={{ width: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)" }} className="auth-right">
        <div style={{ width: "100%", maxWidth: 420 }}>
          <div style={{ background: "white", borderRadius: 20, padding: "2.5rem", boxShadow: "0 30px 80px rgba(0,0,0,0.3)" }}>
            {/* Tabs */}
            <div style={{ display: "flex", background: "var(--grey-100)", borderRadius: 10, padding: "4px", marginBottom: "2rem" }}>
              {(["login", "register"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    flex: 1, padding: "0.625rem", border: "none", cursor: "pointer",
                    borderRadius: 8, fontFamily: "'Poppins', sans-serif", fontWeight: 700,
                    fontSize: "0.85rem", textTransform: "capitalize",
                    background: tab === t ? "white" : "transparent",
                    color: tab === t ? "var(--navy)" : "var(--grey-500)",
                    boxShadow: tab === t ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                    transition: "all 0.2s",
                  }}
                >
                  {t === "login" ? "Sign In" : "Create Account"}
                </button>
              ))}
            </div>

            {/* LOGIN FORM */}
            {tab === "login" && (
              <form action={loginAction} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
                  <h2 style={{ fontSize: "1.4rem", marginBottom: "0.25rem" }}>Welcome Back</h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--grey-500)" }}>Sign in to your account</p>
                </div>

                {loginState?.error && (
                  <div style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", color: "#991B1B", padding: "0.75rem 1rem", borderRadius: 8, fontSize: "0.85rem" }}>
                    {loginState.error}
                  </div>
                )}

                <div>
                  <label className="form-label">Email Address</label>
                  <div style={{ position: "relative" }}>
                    <Mail size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--grey-400)" }} />
                    <input name="email" type="email" required className="form-input" placeholder="you@example.com" style={{ paddingLeft: "2.5rem" }} />
                  </div>
                </div>

                <div>
                  <label className="form-label">Password</label>
                  <div style={{ position: "relative" }}>
                    <Lock size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--grey-400)" }} />
                    <input name="password" type={showPass ? "text" : "password"} required className="form-input" placeholder="••••••••" style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }} />
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--grey-400)" }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loginPending} className="btn-primary" style={{ justifyContent: "center", opacity: loginPending ? 0.7 : 1 }}>
                  {loginPending ? "Signing In..." : "Sign In"} <ArrowRight size={16} />
                </button>

                <p style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--grey-500)" }}>
                  Don't have an account?{" "}
                  <button type="button" onClick={() => setTab("register")} style={{ color: "var(--amber)", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>
                    Create one free
                  </button>
                </p>
              </form>
            )}

            {/* REGISTER FORM */}
            {tab === "register" && (
              <form action={regAction} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
                  <h2 style={{ fontSize: "1.4rem", marginBottom: "0.25rem" }}>Create Account</h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--grey-500)" }}>Join Shiny Wave today</p>
                </div>

                {regState?.error && (
                  <div style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", color: "#991B1B", padding: "0.75rem 1rem", borderRadius: 8, fontSize: "0.85rem" }}>
                    {regState.error}
                  </div>
                )}

                <div>
                  <label className="form-label">Full Name</label>
                  <div style={{ position: "relative" }}>
                    <User size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--grey-400)" }} />
                    <input name="name" required className="form-input" placeholder="Your full name" style={{ paddingLeft: "2.5rem" }} />
                  </div>
                </div>

                <div>
                  <label className="form-label">Email Address</label>
                  <div style={{ position: "relative" }}>
                    <Mail size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--grey-400)" }} />
                    <input name="email" type="email" required className="form-input" placeholder="you@example.com" style={{ paddingLeft: "2.5rem" }} />
                  </div>
                </div>

                <div>
                  <label className="form-label">Phone Number</label>
                  <div style={{ position: "relative" }}>
                    <Phone size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--grey-400)" }} />
                    <input name="phone" type="tel" className="form-input" placeholder="07X XXX XXXX" style={{ paddingLeft: "2.5rem" }} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <label className="form-label">Password</label>
                    <input name="password" type="password" required className="form-input" placeholder="Min. 6 chars" />
                  </div>
                  <div>
                    <label className="form-label">Confirm</label>
                    <input name="confirm" type="password" required className="form-input" placeholder="Repeat password" />
                  </div>
                </div>

                <button type="submit" disabled={regPending} className="btn-primary" style={{ justifyContent: "center", opacity: regPending ? 0.7 : 1 }}>
                  {regPending ? "Creating Account..." : "Create Account"} <ArrowRight size={16} />
                </button>

                <p style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--grey-500)" }}>
                  Already have an account?{" "}
                  <button type="button" onClick={() => setTab("login")} style={{ color: "var(--amber)", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>
                    Sign in
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .auth-left { display: none !important; }
          .auth-right { width: 100% !important; }
        }
      `}</style>
    </div>
  );
}
