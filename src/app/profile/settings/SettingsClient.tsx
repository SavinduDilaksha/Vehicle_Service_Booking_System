"use client";
import { useActionState } from "react";
import { updateProfile } from "@/app/actions";
import { Save, User, Mail, Phone, Lock, CheckCircle } from "lucide-react";

interface SettingsClientProps {
  user: { name: string; email: string; phone?: string | null };
}

export default function SettingsClient({ user }: SettingsClientProps) {
  const [state, action, pending] = useActionState(updateProfile, null);

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", color: "var(--navy)", marginBottom: "0.5rem" }}>Profile Settings</h1>
      <p style={{ color: "var(--grey-500)", fontSize: "0.875rem", marginBottom: "2rem" }}>
        Manage your personal information and password
      </p>

      {state?.success && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "#D4EDDA", border: "1px solid #C3E6CB", color: "#155724", padding: "0.875rem 1.25rem", borderRadius: 10, marginBottom: "1.5rem", fontSize: "0.9rem" }}>
          <CheckCircle size={18} /> Profile updated successfully!
        </div>
      )}
      {state?.error && (
        <div style={{ background: "#F8D7DA", border: "1px solid #F5C6CB", color: "#721C24", padding: "0.875rem 1.25rem", borderRadius: 10, marginBottom: "1.5rem", fontSize: "0.9rem" }}>
          {state.error}
        </div>
      )}

      <form action={action} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {/* Personal Info */}
        <div style={{ background: "white", borderRadius: 16, padding: "2rem", boxShadow: "var(--shadow-sm)" }}>
          <h2 style={{ fontSize: "1rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <User size={18} color="var(--amber)" /> Personal Information
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            <div>
              <label className="form-label">Full Name</label>
              <input name="name" defaultValue={user.name} className="form-input" placeholder="Your full name" />
            </div>
            <div>
              <label className="form-label">Phone Number</label>
              <div style={{ position: "relative" }}>
                <Phone size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--grey-400)" }} />
                <input name="phone" defaultValue={user.phone || ""} className="form-input" placeholder="07X XXX XXXX" style={{ paddingLeft: "2.5rem" }} />
              </div>
            </div>
            <div>
              <label className="form-label">Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--grey-400)" }} />
                <input type="email" defaultValue={user.email} disabled className="form-input" style={{ paddingLeft: "2.5rem", background: "var(--grey-50)", cursor: "not-allowed" }} />
              </div>
              <p style={{ fontSize: "0.72rem", color: "var(--grey-400)", marginTop: "0.4rem" }}>Email cannot be changed</p>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div style={{ background: "white", borderRadius: 16, padding: "2rem", boxShadow: "var(--shadow-sm)" }}>
          <h2 style={{ fontSize: "1rem", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Lock size={18} color="var(--amber)" /> Change Password
          </h2>
          <p style={{ fontSize: "0.8rem", color: "var(--grey-500)", marginBottom: "1.5rem" }}>Leave blank if you don't want to change your password</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.25rem" }}>
            <div>
              <label className="form-label">Current Password</label>
              <input name="currentPassword" type="password" className="form-input" placeholder="••••••••" />
            </div>
            <div>
              <label className="form-label">New Password</label>
              <input name="newPassword" type="password" className="form-input" placeholder="Min. 6 chars" />
            </div>
          </div>
        </div>

        <div>
          <button type="submit" disabled={pending} className="btn-primary" style={{ opacity: pending ? 0.7 : 1 }}>
            <Save size={16} /> {pending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
