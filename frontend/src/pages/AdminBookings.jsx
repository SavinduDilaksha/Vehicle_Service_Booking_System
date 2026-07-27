import { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import api from '../api/axiosInstance';
import { CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = () => {
    setLoading(true);
    api.get('/bookings')
      .then((res) => setBookings(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status } : b)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div style={{ display: 'flex', paddingTop: '70px', minHeight: '100vh' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '2.5rem', background: 'var(--grey-50)', minHeight: 'calc(100vh - 70px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--navy)' }}>Booking Management</h1>
            <p style={{ color: 'var(--grey-500)', fontSize: '0.9rem' }}>Review, approve, complete or cancel customer appointments.</p>
          </div>
          <button onClick={fetchBookings} className="btn-ghost" style={{ background: 'white' }}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          {loading ? (
            <p style={{ color: 'var(--grey-500)', textAlign: 'center' }}>Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <p style={{ color: 'var(--grey-500)', textAlign: 'center' }}>No bookings found.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--grey-100)', color: 'var(--grey-500)' }}>
                  <th style={{ padding: '0.75rem 0' }}>Customer</th>
                  <th style={{ padding: '0.75rem 0' }}>Service</th>
                  <th style={{ padding: '0.75rem 0' }}>Vehicle</th>
                  <th style={{ padding: '0.75rem 0' }}>Date & Time</th>
                  <th style={{ padding: '0.75rem 0' }}>Status</th>
                  <th style={{ padding: '0.75rem 0' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} style={{ borderBottom: '1px solid var(--grey-100)' }}>
                    <td style={{ padding: '1rem 0' }}>
                      <div style={{ fontWeight: 700 }}>{b.userId?.name || 'Customer'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--grey-500)' }}>{b.userId?.phone || b.userId?.email}</div>
                    </td>
                    <td style={{ padding: '1rem 0', fontWeight: 600 }}>{b.serviceName}</td>
                    <td style={{ padding: '1rem 0' }}>{b.vehicleModel} ({b.regNumber})</td>
                    <td style={{ padding: '1rem 0', color: 'var(--grey-600)' }}>{b.preferredDate} ({b.preferredTime})</td>
                    <td style={{ padding: '1rem 0' }}>
                      <span style={{
                        padding: '0.25rem 0.6rem',
                        borderRadius: 4,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: b.status === 'Approved' ? '#DBEAFE' : b.status === 'Completed' ? '#D1FAE5' : b.status === 'Cancelled' ? '#FEE2E2' : '#FEF3C7',
                        color: b.status === 'Approved' ? '#1E40AF' : b.status === 'Completed' ? '#065F46' : b.status === 'Cancelled' ? '#991B1B' : '#92400E',
                      }}>
                        {b.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0' }}>
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b._id, e.target.value)}
                        style={{ padding: '0.35rem 0.6rem', borderRadius: 6, border: '1px solid var(--grey-300)', fontSize: '0.8rem', outline: 'none' }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
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
