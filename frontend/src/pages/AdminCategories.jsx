import { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import api from '../api/axiosInstance';
import { Plus, Trash2, Edit2, X, Wrench } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    priceRange: '',
    duration: '',
    imageUrl: '',
  });

  const fetchCategories = () => {
    setLoading(true);
    api.get('/services')
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '', priceRange: '', duration: '', imageUrl: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      priceRange: cat.priceRange || '',
      duration: cat.duration || '',
      imageUrl: cat.imageUrl || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    try {
      await api.delete(`/services/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/services/${editingCategory._id}`, formData);
      } else {
        await api.post('/services', formData);
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed');
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '2.5rem', background: 'var(--grey-50)', minHeight: 'calc(100vh - 70px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--navy)' }}>Service Categories</h1>
            <p style={{ color: 'var(--grey-500)', fontSize: '0.9rem' }}>Configure available vehicle repair and maintenance services.</p>
          </div>
          <button onClick={handleOpenAdd} className="btn-primary">
            <Plus size={16} /> Add Category
          </button>
        </div>

        {loading ? (
          <p style={{ color: 'var(--grey-500)' }}>Loading categories...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {categories.map((cat) => (
              <div key={cat._id} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--navy)' }}>{cat.name}</h3>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button onClick={() => handleOpenEdit(cat)} style={{ background: 'var(--amber-pale)', border: 'none', borderRadius: 6, padding: '0.4rem', cursor: 'pointer', color: 'var(--navy)' }}>
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(cat._id, cat.name)} style={{ background: '#FEE2E2', border: 'none', borderRadius: 6, padding: '0.4rem', cursor: 'pointer', color: '#DC2626' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--grey-600)', marginBottom: '1rem', lineHeight: 1.5 }}>
                  {cat.description}
                </p>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.75rem', fontWeight: 600 }}>
                  {cat.priceRange && <span style={{ background: 'var(--amber-pale)', color: 'var(--navy)', padding: '0.2rem 0.5rem', borderRadius: 4 }}>{cat.priceRange}</span>}
                  {cat.duration && <span style={{ background: 'var(--grey-100)', color: 'var(--grey-600)', padding: '0.2rem 0.5rem', borderRadius: 4 }}>⏱ {cat.duration}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
            <div style={{ background: 'white', borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 540 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.2rem', color: 'var(--navy)' }}>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Category Name *</label>
                    <input
                      required
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                        setFormData({ ...formData, name, slug: editingCategory ? formData.slug : slug });
                      }}
                    />
                  </div>
                  <div>
                    <label className="form-label">Slug *</label>
                    <input required className="form-input" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Price Range</label>
                    <input className="form-input" placeholder="e.g. Rs. 2,500 – Rs. 5,000" value={formData.priceRange} onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })} />
                  </div>
                  <div>
                    <label className="form-label">Duration</label>
                    <input className="form-input" placeholder="e.g. 1.5 hrs" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
                  </div>
                </div>

                <div>
                  <label className="form-label">Description *</label>
                  <textarea required rows={3} className="form-input" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </div>

                <div>
                  <label className="form-label">Image URL</label>
                  <input className="form-input" placeholder="https://example.com/image.jpg" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ flex: 2, justifyContent: 'center' }}>
                    {editingCategory ? 'Save Changes' : 'Create Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
