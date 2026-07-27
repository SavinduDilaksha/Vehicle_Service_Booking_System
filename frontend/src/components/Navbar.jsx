import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wrench, User, LogOut, Shield, Calendar, Bell } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ background: 'var(--navy)', borderBottom: '1px solid rgba(255,255,255,0.1)', position: 'sticky', top: 0, zIndex: 1000 }}>
      <div className="container" style={{ height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'white' }}>
          <div style={{ background: 'var(--amber)', padding: '0.5rem', borderRadius: 8, display: 'flex' }}>
            <Wrench size={20} color="white" />
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>Shiny Wave</span>
            <span style={{ fontSize: '0.75rem', display: 'block', color: 'var(--amber)', fontWeight: 600, marginTop: -3 }}>Auto Services</span>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>Home</Link>
          <Link to="/services" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>Services</Link>
          <Link to="/book" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>Book Appointment</Link>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {user.role === 'ADMIN' ? (
                <Link to="/admin" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  <Shield size={16} /> Admin Dashboard
                </Link>
              ) : (
                <Link to="/profile" className="btn-ghost" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  <User size={16} /> {user.name}
                </Link>
              )}
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }} title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/login" className="btn-ghost" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)', padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>Sign In</Link>
              <Link to="/register" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
