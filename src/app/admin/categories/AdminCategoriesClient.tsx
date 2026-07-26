"use client";
import { useState, useTransition } from "react";
import { createCategory, deleteCategory, updateCategory } from "@/app/actions";
import { Plus, Trash2, Edit2, X, Wrench, CheckCircle, XCircle, Upload } from "lucide-react";

type Category = {
  id: string; name: string; slug: string; description: string;
  imageUrl?: string | null; priceRange?: string | null; duration?: string | null;
};

export default function AdminCategoriesClient({ categories: initial }: { categories: Category[] }) {
  const [categories, setCategories] = useState(initial);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete "${name}" service category?`)) return;
    startTransition(async () => {
      const res = await deleteCategory(id);
      if (res.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        showToast("Category deleted.");
      } else showToast(res.error || "Failed", "error");
    });
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createCategory(fd);
      if (res.success) {
        showToast("Category created!");
        setShowModal(false);
        setImagePreview(null);
        window.location.reload();
      } else showToast(res.error || "Failed", "error");
    });
  };

  const handleEditOpen = (cat: Category) => {
    setEditingCategory(cat);
    setImagePreview(cat.imageUrl || null);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCategory) return;
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await updateCategory(editingCategory.id, fd);
      if (res.success) {
        showToast("Category updated!");
        setEditingCategory(null);
        setImagePreview(null);
        window.location.reload();
      } else showToast(res.error || "Failed to update category.", "error");
    });
  };

  return (
    <div style={{ padding: "2.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", color: "var(--navy)", marginBottom: "0.25rem" }}>Service Categories</h1>
          <p style={{ color: "var(--grey-500)", fontSize: "0.875rem" }}>{categories.length} categories configured</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Category Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
        {categories.map((cat) => (
          <div key={cat.id} style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "var(--shadow-sm)", border: "1px solid var(--grey-100)" }}>
            {/* Image */}
            <div style={{ height: 180, position: "relative", background: "var(--grey-100)" }}>
              {cat.imageUrl ? (
                <img src={cat.imageUrl} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, var(--navy), var(--navy-light))", flexDirection: "column", gap: "0.5rem" }}>
                  <Wrench size={36} color="rgba(255,255,255,0.3)" />
                  <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>No image set</span>
                </div>
              )}
            </div>

            <div style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <h3 style={{ fontSize: "1rem", color: "var(--navy)" }}>{cat.name}</h3>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <button onClick={() => handleEditOpen(cat)} title="Edit Category" style={{ background: "var(--amber-pale)", border: "none", borderRadius: 6, padding: "0.4rem", cursor: "pointer", color: "var(--navy)" }}>
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(cat.id, cat.name)} title="Delete Category" style={{ background: "#FEE2E2", border: "none", borderRadius: 6, padding: "0.4rem", cursor: "pointer", color: "#DC2626" }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <p style={{ fontSize: "0.8rem", color: "var(--grey-600)", lineHeight: 1.5, marginBottom: "0.875rem" }}>
                {cat.description.substring(0, 100)}...
              </p>

              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {cat.priceRange && (
                  <span style={{ background: "var(--amber-pale)", color: "var(--navy)", padding: "0.2rem 0.6rem", borderRadius: 4, fontSize: "0.72rem", fontWeight: 600 }}>
                    {cat.priceRange}
                  </span>
                )}
                {cat.duration && (
                  <span style={{ background: "var(--grey-100)", color: "var(--grey-600)", padding: "0.2rem 0.6rem", borderRadius: 4, fontSize: "0.72rem", fontWeight: 600 }}>
                    ⏱ {cat.duration}
                  </span>
                )}
              </div>

              <div style={{ marginTop: "0.75rem", fontSize: "0.72rem", color: "var(--grey-400)", fontFamily: "monospace" }}>
                /{cat.slug}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Category Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ background: "white", borderRadius: 20, padding: "2rem", width: "100%", maxWidth: 580, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem" }}>
              <h2 style={{ fontSize: "1.2rem", color: "var(--navy)" }}>Add Service Category</h2>
              <button onClick={() => { setShowModal(false); setImagePreview(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--grey-400)" }}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreate} encType="multipart/form-data" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Image Upload */}
              <div>
                <label className="form-label">Service Image</label>
                <div
                  className="upload-zone"
                  style={{ position: "relative", padding: imagePreview ? "0" : "2rem", overflow: "hidden" }}
                  onClick={() => document.getElementById("cat-image-input")?.click()}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }} />
                  ) : (
                    <>
                      <Upload size={28} color="var(--grey-400)" style={{ margin: "0 auto 0.75rem" }} />
                      <p style={{ fontSize: "0.85rem", color: "var(--grey-500)" }}>Click to upload service image</p>
                      <p style={{ fontSize: "0.72rem", color: "var(--grey-400)" }}>PNG, JPG, WEBP — Max 5MB</p>
                    </>
                  )}
                  <input
                    id="cat-image-input"
                    name="image"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setImagePreview(URL.createObjectURL(file));
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="form-label">Category Name *</label>
                  <input name="name" required className="form-input" placeholder="e.g. Full Service" />
                </div>
                <div>
                  <label className="form-label">URL Slug *</label>
                  <input name="slug" required className="form-input" placeholder="e.g. full-service" />
                </div>
                <div>
                  <label className="form-label">Price Range</label>
                  <input name="priceRange" className="form-input" placeholder="Rs. 2,500 – Rs. 5,000" />
                </div>
                <div>
                  <label className="form-label">Duration</label>
                  <input name="duration" className="form-input" placeholder="1.5 hrs" />
                </div>
              </div>

              <div>
                <label className="form-label">Description *</label>
                <textarea name="description" required className="form-input" rows={3} placeholder="Describe what this service includes..." />
              </div>

              <div style={{ display: "flex", gap: "0.875rem" }}>
                <button type="button" onClick={() => { setShowModal(false); setImagePreview(null); }} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" disabled={isPending} className="btn-primary" style={{ flex: 2, justifyContent: "center" }}>
                  {isPending ? "Creating..." : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ background: "white", borderRadius: 20, padding: "2rem", width: "100%", maxWidth: 580, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem" }}>
              <h2 style={{ fontSize: "1.2rem", color: "var(--navy)" }}>Edit Service Category</h2>
              <button onClick={() => { setEditingCategory(null); setImagePreview(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--grey-400)" }}><X size={20} /></button>
            </div>

            <form onSubmit={handleUpdate} encType="multipart/form-data" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Image Upload */}
              <div>
                <label className="form-label">Service Image</label>
                <div
                  className="upload-zone"
                  style={{ position: "relative", padding: imagePreview ? "0" : "2rem", overflow: "hidden" }}
                  onClick={() => document.getElementById("cat-edit-image-input")?.click()}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }} />
                  ) : (
                    <>
                      <Upload size={28} color="var(--grey-400)" style={{ margin: "0 auto 0.75rem" }} />
                      <p style={{ fontSize: "0.85rem", color: "var(--grey-500)" }}>Click to upload service image</p>
                      <p style={{ fontSize: "0.72rem", color: "var(--grey-400)" }}>PNG, JPG, WEBP — Max 5MB</p>
                    </>
                  )}
                  <input
                    id="cat-edit-image-input"
                    name="image"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setImagePreview(URL.createObjectURL(file));
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="form-label">Category Name *</label>
                  <input name="name" required defaultValue={editingCategory.name} className="form-input" placeholder="e.g. Full Service" />
                </div>
                <div>
                  <label className="form-label">URL Slug *</label>
                  <input name="slug" required defaultValue={editingCategory.slug} className="form-input" placeholder="e.g. full-service" />
                </div>
                <div>
                  <label className="form-label">Price Range</label>
                  <input name="priceRange" defaultValue={editingCategory.priceRange || ""} className="form-input" placeholder="Rs. 2,500 – Rs. 5,000" />
                </div>
                <div>
                  <label className="form-label">Duration</label>
                  <input name="duration" defaultValue={editingCategory.duration || ""} className="form-input" placeholder="1.5 hrs" />
                </div>
              </div>

              <div>
                <label className="form-label">Description *</label>
                <textarea name="description" required defaultValue={editingCategory.description} className="form-input" rows={3} placeholder="Describe what this service includes..." />
              </div>

              <div style={{ display: "flex", gap: "0.875rem" }}>
                <button type="button" onClick={() => { setEditingCategory(null); setImagePreview(null); }} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" disabled={isPending} className="btn-primary" style={{ flex: 2, justifyContent: "center" }}>
                  {isPending ? "Updating..." : "Save Changes"}
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
