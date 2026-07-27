import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, Bell, User, CheckCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/bookings/my'),
      api.get('/notifications'),
    ])
      .then(([bRes, nRes]) => {
        setBookings(bRes.data);
        setNotifications(nRes.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>Approved</span>;
      case 'Completed':
        return <span style={{ background: '#D1FAE5', color: '#065F46', padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>Completed</span>;
      case 'Cancelled':
        return <span style={{ background: '#FEE2E2', color: '#991B1B', padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>Cancelled</span>;
      default:
        return <span style={{ background: '#FEF3C7', color: '#92400E', padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>Pending</span>;
    }
  };

  return (
    <div style={{ background: 'var(--grey-50)', minHeight: 'calc(100vh - 70px)', padding: '3rem 0' }}>
      <div className="container">
        {/* User Info Header */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--navy)', color: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800 }}>
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', color: 'var(--navy)' }}>{user?.name}</h1>
            <p style={{ color: 'var(--grey-500)', fontSize: '0.875rem' }}>{user?.email} • {user?.phone || 'No phone added'}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* My Bookings */}
          <div>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--navy)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={20} color="var(--amber)" /> My Service Appointments
            </h2>

            {loading ? (
              <p style={{ color: 'var(--grey-500)' }}>Loading bookings...</p>
            ) : bookings.length === 0 ? (
              <div className="card" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--grey-500)' }}>
                No booking history found. Book your first service today!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {bookings.map((b) => (
                  <div key={b._id} className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                        <h3 style={{ fontSize: '1.05rem', color: 'var(--navy)' }}>{b.serviceName}</h3>
                        {getStatusBadge(b.status)}
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--grey-600)' }}>
                        🚘 <strong>{b.vehicleModel}</strong> ({b.regNumber})
                      </p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--grey-400)', marginTop: '0.25rem' }}>
                        📅 {b.preferredDate} at {b.preferredTime}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Side */}
          <div>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--navy)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bell size={20} color="var(--amber)" /> Notifications
            </h2>

            <div className="card" style={{ padding: '1.5rem' }}>
              {notifications.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--grey-400)' }}>No new notifications.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {notifications.map((n) => (
                    <div key={n._id} style={{ borderBottom: '1px solid var(--grey-100)', paddingBottom: '0.75rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--navy)', marginBottom: '0.2rem' }}>{n.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--grey-600)', lineHeight: 1.5 }}>{n.message}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
