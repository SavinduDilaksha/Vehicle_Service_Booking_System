import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';
import { LayoutDashboard, Calendar, Bell, Settings, LogOut, Home } from 'lucide-react';

export default function ProfileSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    if (user) {
      api.get('/notifications')
        .then((res) => {
          const unread = res.data.filter((n) => !n.isRead).length;
          setNotifCount(unread);
        })
        .catch(() => setNotifCount(0));
    }
  }, [user, location.pathname]);

  const links = [
    { path: '/profile', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/profile/bookings', label: 'My Bookings', icon: Calendar },
    { path: '/profile/notifications', label: 'Notifications', icon: Bell, badge: notifCount },
    { path: '/profile/settings', label: 'Profile Settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside style={{ width: 260, minHeight: 'calc(100vh - 70px)', background: 'var(--navy)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      {/* User Avatar Card */}
      <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '1rem' }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div style={{ fontWeight: 700, color: 'white', fontSize: '1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user?.name}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user?.email}
        </div>
        {user?.phone && (
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.1rem' }}>{user.phone}</div>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '1rem 0' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.75rem 1.5rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textDecoration: 'none', marginBottom: '0.25rem' }}>
          <Home size={14} /> Back to Home
        </Link>
        {links.map(({ path, label, icon: Icon, badge }) => (
          <Link
            key={path}
            to={path}
            className={`sidebar-link ${location.pathname === path ? 'active' : ''}`}
          >
            <Icon size={18} />
            <span style={{ flex: 1 }}>{label}</span>
            {badge && badge > 0 ? (
              <span style={{ background: 'var(--amber)', color: 'var(--navy)', borderRadius: '100px', padding: '0.1rem 0.5rem', fontSize: '0.65rem', fontWeight: 800 }}>{badge}</span>
            ) : null}
          </Link>
        ))}
      </nav>

      {/* Sign Out */}
      <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', width: '100%', padding: '0.875rem 1rem', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#FCA5A5', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
