import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { Bell, CheckCheck } from 'lucide-react';

export default function ProfileNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = () => {
    setLoading(true);
    api.get('/notifications')
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const markAllRead = () => {
    api.put('/notifications/read')
      .then(() => fetchNotifs())
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', color: 'var(--navy)' }}>Notifications</h1>
          <p style={{ color: 'var(--grey-500)', fontSize: '0.875rem' }}>Stay informed on your booking updates and service announcements.</p>
        </div>
        {notifications.some((n) => !n.isRead) && (
          <button onClick={markAllRead} className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', gap: '0.4rem' }}>
            <CheckCheck size={16} /> Mark All as Read
          </button>
        )}
      </div>

      {loading ? (
        <p style={{ color: 'var(--grey-500)' }}>Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--grey-400)' }}>
          No notifications yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {notifications.map((n) => (
            <div
              key={n._id}
              className="card"
              style={{
                padding: '1.25rem',
                borderLeft: n.isRead ? '4px solid var(--grey-200)' : '4px solid var(--amber)',
                background: n.isRead ? 'white' : '#FFFBEB',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--navy)', marginBottom: '0.25rem' }}>
                {n.title}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--grey-600)', marginBottom: '0.5rem' }}>
                {n.message}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--grey-400)' }}>
                📅 {new Date(n.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
