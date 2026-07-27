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
    <div style={{ display: 'flex', paddingTop: '70px', minHeight: '100vh' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '2.5rem', background: 'var(--grey-50)', minHeight: 'calc(100vh - 70px)', minWidth: 0 }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--navy)', marginBottom: '0.25rem', fontWeight: 800 }}>Admin Dashboard</h1>
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
          <h2 style={{ fontSize: '1.2rem', color: 'var(--navy)', marginBottom: '1.25rem', fontWeight: 800 }}>Recent Booking Activity</h2>
          {loading ? (
            <p style={{ color: 'var(--grey-500)' }}>Loading activity...</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Vehicle</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 5).map((b) => (
                    <tr key={b._id}>
                      <td style={{ fontWeight: 700 }}>{b.userId?.name || 'Customer'}</td>
                      <td>{b.serviceName}</td>
                      <td>{b.vehicleModel} ({b.regNumber})</td>
                      <td style={{ color: 'var(--grey-500)' }}>{b.preferredDate} ({b.preferredTime})</td>
                      <td>
                        <span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
