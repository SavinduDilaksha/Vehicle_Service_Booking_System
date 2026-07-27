import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import { Calendar, Clock, Car, Plus, Search } from 'lucide-react';

export default function ProfileBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    api.get('/bookings/my')
      .then((res) => setBookings(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const matchesTab = activeTab === 'All' || b.status === activeTab;
    const matchesSearch = b.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.regNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabs = ['All', 'Pending', 'Approved', 'Completed', 'Cancelled'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', color: 'var(--navy)' }}>My Appointments</h1>
          <p style={{ color: 'var(--grey-500)', fontSize: '0.875rem' }}>Manage and view all your vehicle service bookings.</p>
        </div>
        <Link to="/book" className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}>
          <Plus size={16} /> New Booking
        </Link>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--grey-200)', padding: 4, borderRadius: 8 }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: activeTab === tab ? 700 : 500,
                background: activeTab === tab ? 'white' : 'transparent',
                color: activeTab === tab ? 'var(--navy)' : 'var(--grey-600)',
                boxShadow: activeTab === tab ? 'var(--shadow-sm)' : 'none',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: 220 }}>
          <Search size={16} color="var(--grey-400)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search vehicle or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2rem', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <p style={{ color: 'var(--grey-500)' }}>Loading appointments...</p>
      ) : filteredBookings.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--grey-500)' }}>
          No appointments found matching your filter criteria.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredBookings.map((b) => (
            <div key={b._id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--navy)', marginBottom: '0.25rem' }}>{b.serviceName}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--grey-600)' }}>
                    🚘 <strong>{b.vehicleModel}</strong> ({b.regNumber})
                  </div>
                </div>

                <span style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: 20,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  background: b.status === 'Approved' ? '#DBEAFE' : b.status === 'Completed' ? '#D1FAE5' : b.status === 'Cancelled' ? '#FEE2E2' : '#FEF3C7',
                  color: b.status === 'Approved' ? '#1E40AF' : b.status === 'Completed' ? '#065F46' : b.status === 'Cancelled' ? '#991B1B' : '#92400E',
                }}>
                  {b.status}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--grey-500)', paddingTop: '0.75rem', borderTop: '1px solid var(--grey-100)' }}>
                <span>📅 Preferred Date: <strong>{b.preferredDate}</strong></span>
                <span>⏱ Time: <strong>{b.preferredTime}</strong></span>
                {b.notes && <span>📝 Notes: {b.notes}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
