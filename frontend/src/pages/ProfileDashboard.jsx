import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import { Calendar, Clock, Bell, Car, ChevronRight } from 'lucide-react';

export default function ProfileDashboard() {
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

  const pending = bookings.filter((b) => b.status === 'Pending').length;
  const approved = bookings.filter((b) => b.status === 'Approved').length;
  const unreadNotifs = notifications.filter((n) => !n.isRead).length;

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', color: 'var(--navy)', marginBottom: '0.5rem', fontWeight: 800 }}>Dashboard</h1>
      <p style={{ color: 'var(--grey-500)', fontSize: '0.875rem', marginBottom: '2rem' }}>Overview of your account activity</p>

      {/* 4 Metric Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {[
          { label: 'Total Bookings', value: bookings.length, color: '#3B82F6', bg: '#EFF6FF', icon: Calendar },
          { label: 'Pending', value: pending, color: '#F59E0B', bg: '#FFFBEB', icon: Clock },
          { label: 'Approved', value: approved, color: '#10B981', bg: '#ECFDF5', icon: Car },
          { label: 'Notifications', value: unreadNotifs, color: '#8B5CF6', bg: '#F5F3FF', icon: Bell },
        ].map(({ label, value, color, bg, icon: Icon }) => (
          <div key={label} className="metric-card">
            <div className="metric-icon" style={{ background: bg }}>
              <Icon size={18} color={color} />
            </div>
            <div className="metric-value">{value}</div>
            <div className="metric-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Recent Bookings Data Table */}
      <div style={{ background: 'white', borderRadius: 16, padding: '1.75rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--grey-200)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem', color: 'var(--navy)', fontWeight: 800 }}>Recent Bookings</h2>
          <Link to="/profile/bookings" style={{ fontSize: '0.85rem', color: 'var(--amber)', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            View all →
          </Link>
        </div>

        {loading ? (
          <p style={{ color: 'var(--grey-500)', fontSize: '0.9rem', padding: '1rem 0' }}>Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 0', color: 'var(--grey-400)' }}>
            <Car size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--grey-600)' }}>No bookings yet</p>
            <Link to="/book" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
              Book Now
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Vehicle</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map((b) => (
                  <tr key={b._id}>
                    <td style={{ fontWeight: 700, color: 'var(--navy)' }}>{b.serviceName}</td>
                    <td>{b.vehicleModel} ({b.regNumber})</td>
                    <td>{b.preferredDate} at {b.preferredTime}</td>
                    <td>
                      <span className={`badge badge-${b.status.toLowerCase()}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
