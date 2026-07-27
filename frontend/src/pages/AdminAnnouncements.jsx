import { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import api from '../api/axiosInstance';
import { Megaphone, Plus, Trash2, Send } from 'lucide-react';

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const fetchAnnouncements = () => {
    setLoading(true);
    api.get('/announcements')
      .then((res) => setAnnouncements(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/announcements', { title, message });
      setTitle('');
      setMessage('');
      fetchAnnouncements();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to publish announcement');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this announcement?')) return;
    try {
      await api.delete(`/announcements/${id}`);
      setAnnouncements((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      alert('Failed to delete announcement');
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '2.5rem', background: 'var(--grey-50)', minHeight: 'calc(100vh - 70px)' }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--navy)', marginBottom: '0.25rem' }}>Announcements Broadcast</h1>
        <p style={{ color: 'var(--grey-500)', fontSize: '0.9rem', marginBottom: '2rem' }}>Broadcast messages & offers to all registered user notification feeds.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Create Announcement Form */}
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--navy)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Megaphone size={20} color="var(--amber)" /> Post New Announcement
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="form-label">Announcement Title *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Special Discount This Month!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">Message Content *</label>
                <textarea
                  required
                  rows={4}
                  className="form-input"
                  placeholder="Write message to send to all users..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
                <Send size={16} /> Broadcast Notification
              </button>
            </form>
          </div>

          {/* Past Announcements List */}
          <div>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--navy)', marginBottom: '1.25rem' }}>Past Announcements</h2>
            {loading ? (
              <p style={{ color: 'var(--grey-500)' }}>Loading announcements...</p>
            ) : announcements.length === 0 ? (
              <p style={{ color: 'var(--grey-500)' }}>No announcements published yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {announcements.map((item) => (
                  <div key={item._id} className="card" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '1rem', color: 'var(--navy)' }}>{item.title}</h3>
                      <button onClick={() => handleDelete(item._id)} style={{ background: '#FEE2E2', border: 'none', borderRadius: 6, padding: '0.35rem', cursor: 'pointer', color: '#DC2626' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--grey-600)', lineHeight: 1.5 }}>{item.message}</p>
                    <div style={{ fontSize: '0.75rem', color: 'var(--grey-400)', marginTop: '0.75rem' }}>
                      Published on {new Date(item.publishedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
