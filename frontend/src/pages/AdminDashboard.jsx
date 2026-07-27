import { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import api from '../api/axiosInstance';
import { Calendar, Clock, CheckCircle, AlertCircle, Wrench } from 'lucide-react';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/bookings'),
      api.get('/services'),
    ])
      .then(([bRes, cRes]) => {
        setBookings(bRes.data);
        setCategories(cRes.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const pendingCount = bookings.filter((b) => b.status === 'Pending').length;
  const approvedCount = bookings.filter((b) => b.status === 'Approved').length;
  const completedCount = bookings.filter((b) => b.status === 'Completed').length;

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '2.5rem', background: 'var(--grey-50)', minHeight: 'calc(100vh - 70px)' }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--navy)', marginBottom: '0.25rem' }}>Admin Dashboard</h1>
        <p style={{ color: 'var(--grey-500)', fontSize: '0.9rem', marginBottom: '2rem' }}>Overview of system bookings, categories, and activity.</p>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--navy)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--grey-500)', fontWeight: 600 }}>TOTAL BOOKINGS</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy)', marginTop: '0.25rem' }}>{bookings.length}</div>
          </div>

          <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #F59E0B' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--grey-500)', fontWeight: 600 }}>PENDING</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#F59E0B', marginTop: '0.25rem' }}>{pendingCount}</div>
          </div>

          <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #3B82F6' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--grey-500)', fontWeight: 600 }}>APPROVED</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#3B82F6', marginTop: '0.25rem' }}>{approvedCount}</div>
          </div>

          <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #10B981' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--grey-500)', fontWeight: 600 }}>COMPLETED</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981', marginTop: '0.25rem' }}>{completedCount}</div>
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--navy)', marginBottom: '1.25rem' }}>Recent Booking Activity</h2>
          {loading ? (
            <p style={{ color: 'var(--grey-500)' }}>Loading activity...</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--grey-100)', color: 'var(--grey-500)' }}>
                  <th style={{ padding: '0.75rem 0' }}>Customer</th>
                  <th style={{ padding: '0.75rem 0' }}>Service</th>
                  <th style={{ padding: '0.75rem 0' }}>Vehicle</th>
                  <th style={{ padding: '0.75rem 0' }}>Date & Time</th>
                  <th style={{ padding: '0.75rem 0' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map((b) => (
                  <tr key={b._id} style={{ borderBottom: '1px solid var(--grey-100)' }}>
                    <td style={{ padding: '1rem 0', fontWeight: 600 }}>{b.userId?.name || 'Customer'}</td>
                    <td style={{ padding: '1rem 0' }}>{b.serviceName}</td>
                    <td style={{ padding: '1rem 0' }}>{b.vehicleModel} ({b.regNumber})</td>
                    <td style={{ padding: '1rem 0', color: 'var(--grey-500)' }}>{b.preferredDate} ({b.preferredTime})</td>
                    <td style={{ padding: '1rem 0' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.75rem' }}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
