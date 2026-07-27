import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, Car, CheckCircle } from 'lucide-react';

export default function Book() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    serviceId: '',
    vehicleModel: '',
    regNumber: '',
    preferredDate: '',
    preferredTime: '09:00 AM',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    api.get('/services')
      .then((res) => {
        setServices(res.data);
        if (res.data.length > 0) {
          setFormData((prev) => ({ ...prev, serviceId: res.data[0]._id }));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      await api.post('/bookings', formData);
      setToast('Booking submitted successfully! Redirecting to profile...');
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (err) {
      setToast(err.response?.data?.message || 'Failed to submit booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--grey-50)', minHeight: 'calc(100vh - 70px)', padding: '4rem 0' }}>
      <div className="container" style={{ maxWidth: 680 }}>
        <div className="card" style={{ padding: '2.5rem' }}>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--navy)', marginBottom: '0.5rem' }}>Book Vehicle Service</h1>
          <p style={{ color: 'var(--grey-500)', marginBottom: '2rem', fontSize: '0.9rem' }}>
            Fill out the details below to schedule your vehicle service appointment.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="form-label">Select Service *</label>
              <select
                name="serviceId"
                value={formData.serviceId}
                onChange={handleChange}
                className="form-input"
                required
              >
                {services.map((srv) => (
                  <option key={srv._id} value={srv._id}>
                    {srv.name} {srv.priceRange ? `(${srv.priceRange})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">Vehicle Model *</label>
                <input
                  type="text"
                  name="vehicleModel"
                  placeholder="e.g. Toyota Axio"
                  value={formData.vehicleModel}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label">Registration No *</label>
                <input
                  type="text"
                  name="regNumber"
                  placeholder="e.g. WP CAB-1234"
                  value={formData.regNumber}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">Preferred Date *</label>
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label">Preferred Time *</label>
                <select
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  {['08:30 AM', '10:00 AM', '11:30 AM', '01:30 PM', '03:00 PM', '04:30 PM'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="form-label">Additional Notes</label>
              <textarea
                name="notes"
                rows={3}
                placeholder="Mention any specific issues (e.g., strange noise in brakes)"
                value={formData.notes}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ justifyContent: 'center', marginTop: '1rem' }}>
              {loading ? 'Submitting...' : 'Confirm Appointment'}
            </button>
          </form>
        </div>
      </div>

      {toast && (
        <div className="toast toast-success">
          <CheckCircle size={18} /> {toast}
        </div>
      )}
    </div>
  );
}
