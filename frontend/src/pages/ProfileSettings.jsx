import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';
import { User, Phone, Lock, Save, CheckCircle2 } from 'lucide-react';

export default function ProfileSettings() {
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const res = await api.put('/auth/profile', {
        name,
        phone,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });

      setMessage('Profile updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', color: 'var(--navy)' }}>Account Settings</h1>
        <p style={{ color: 'var(--grey-500)', fontSize: '0.875rem' }}>Update your personal profile details and security credentials.</p>
      </div>

      {message && (
        <div style={{ background: '#D1FAE5', color: '#065F46', padding: '0.875rem 1rem', borderRadius: 8, fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={16} /> {message}
        </div>
      )}

      {error && (
        <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '0.875rem 1rem', borderRadius: 8, fontSize: '0.85rem', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleUpdate} className="card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--navy)', marginBottom: '1.25rem' }}>Personal Information</h3>

        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address (Read-only)</label>
          <input
            type="email"
            className="form-input"
            value={user?.email || ''}
            disabled
            style={{ background: 'var(--grey-100)', cursor: 'not-allowed' }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input
            type="text"
            className="form-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0771234567"
          />
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--grey-100)', margin: '1.5rem 0' }} />

        <h3 style={{ fontSize: '1.1rem', color: 'var(--navy)', marginBottom: '1.25rem' }}>Change Password (Optional)</h3>

        <div className="form-group">
          <label className="form-label">Current Password</label>
          <input
            type="password"
            className="form-input"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password to verify"
          />
        </div>

        <div className="form-group">
          <label className="form-label">New Password</label>
          <input
            type="password"
            className="form-input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem', gap: '0.5rem' }}>
          <Save size={16} /> {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
