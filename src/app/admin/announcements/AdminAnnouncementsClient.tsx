"use client";
import { useState, useTransition } from "react";
import { createAnnouncement, deleteAnnouncement } from "@/app/actions";
import { Plus, Trash2, X, Megaphone, Users, CheckCircle, XCircle } from "lucide-react";

type Announcement = {
  id: string; title: string; message: string; publishedAt: Date;
  _count: { notifications: number };
};

export default function AdminAnnouncementsClient({ announcements: initial, userCount }: { announcements: Announcement[]; userCount: number }) {
  const [announcements, setAnnouncements] = useState(initial);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [isPending, startTransition] = useTransition();

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createAnnouncement({
        title: fd.get("title")?.toString()!,
        message: fd.get("message")?.toString()!,
      });
      if (res.success) {
        showToast(`Announcement published to ${userCount} users!`);
        setShowModal(false);
        window.location.reload();
      } else showToast(res.error || "Failed", "error");
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this announcement? All associated notifications will also be removed.")) return;
    startTransition(async () => {
      const res = await deleteAnnouncement(id);
      if (res.success) {
        setAnnouncements((prev) => prev.filter((a) => a.id !== id));
        showToast("Announcement deleted.");
      } else showToast(res.error || "Failed", "error");
    });
  };

  return (
    <div style={{ padding: "2.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", color: "var(--navy)", marginBottom: "0.25rem" }}>Announcements</h1>
          <p style={{ color: "var(--grey-500)", fontSize: "0.875rem" }}>
            Published announcements are instantly sent as notifications to all {userCount} registered users.
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={16} /> New Announcement
        </button>
      </div>

      {/* Info Banner */}
      <div style={{ background: "var(--amber-pale)", border: "1px solid rgba(244,163,0,0.3)", borderRadius: 10, padding: "1rem 1.25rem", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.875rem" }}>
        <Users size={18} color="var(--amber)" />
        <span style={{ fontSize: "0.875rem", color: "var(--navy)", fontWeight: 500 }}>
          When you publish an announcement, it will be sent as a notification to all <strong>{userCount}</strong> registered users automatically.
        </span>
      </div>

      {announcements.length === 0 ? (
        <div style={{ background: "white", borderRadius: 16, padding: "4rem", textAlign: "center", boxShadow: "var(--shadow-sm)" }}>
          <Megaphone size={48} color="var(--grey-300)" style={{ margin: "0 auto 1.25rem" }} />
          <h3 style={{ color: "var(--grey-600)", marginBottom: "0.5rem" }}>No Announcements</h3>
          <p style={{ color: "var(--grey-400)", marginBottom: "1.5rem", fontSize: "0.875rem" }}>Create your first announcement to notify all users.</p>
          <button onClick={() => setShowModal(true)} className="btn-primary">Create Announcement</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {announcements.map((a) => (
            <div key={a.id} style={{ background: "white", borderRadius: 16, padding: "1.75rem 2rem", boxShadow: "var(--shadow-sm)", border: "1px solid var(--grey-100)", borderLeft: "4px solid var(--amber)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <Megaphone size={18} color="var(--amber)" />
                    <h3 style={{ fontSize: "1.05rem", color: "var(--navy)" }}>{a.title}</h3>
                  </div>
                  <p style={{ fontSize: "0.875rem", color: "var(--grey-600)", lineHeight: 1.7, marginBottom: "1rem" }}>{a.message}</p>
                  <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.78rem", color: "var(--grey-400)" }}>
                    <span>Published: {new Date(a.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <Users size={13} /> {a._count.notifications} notifications sent
                    </span>
                  </div>
                </div>
                <button onClick={() => handleDelete(a.id)} style={{ background: "#FEE2E2", border: "none", borderRadius: 8, padding: "0.5rem 0.75rem", cursor: "pointer", color: "#DC2626", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", fontWeight: 600, fontFamily: "'Poppins', sans-serif", flexShrink: 0, marginLeft: "1rem" }}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ background: "white", borderRadius: 20, padding: "2rem", width: "100%", maxWidth: 540 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem" }}>
              <h2 style={{ fontSize: "1.2rem", color: "var(--navy)" }}>New Announcement</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--grey-400)" }}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ background: "var(--amber-pale)", border: "1px solid rgba(244,163,0,0.3)", borderRadius: 8, padding: "0.875rem 1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Users size={16} color="var(--amber)" />
                <span style={{ fontSize: "0.82rem", color: "var(--navy)", fontWeight: 500 }}>
                  This will be sent to all <strong>{userCount}</strong> registered users as a notification.
                </span>
              </div>

              <div>
                <label className="form-label">Announcement Title *</label>
                <input name="title" required className="form-input" placeholder="e.g. Special Offer — 20% Off This Weekend!" />
              </div>

              <div>
                <label className="form-label">Message *</label>
                <textarea name="message" required className="form-input" rows={5} placeholder="Write your announcement message here..." />
              </div>

              <div style={{ display: "flex", gap: "0.875rem" }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" disabled={isPending} className="btn-primary" style={{ flex: 2, justifyContent: "center" }}>
                  <Megaphone size={16} /> {isPending ? "Publishing..." : "Publish to All Users"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === "success" ? <CheckCircle size={18} /> : <XCircle size={18} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
