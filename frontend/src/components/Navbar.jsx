import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';
import { Menu, X, Phone, Bell, User, ChevronDown, LogOut, Settings, LayoutDashboard, Wrench } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [notifCount, setNotifCount] = useState(0);

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const scrollToSection = (id) => {
    setMenuOpen(false);
    if (!isHome) {
      navigate('/', { state: { scrollTo: id } });
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isTransparent = isHome && !scrolled;

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'all 0.3s ease',
        background: isTransparent ? 'transparent' : 'white',
        boxShadow: isTransparent ? 'none' : '0 2px 20px rgba(11,30,61,0.10)',
        borderBottom: isTransparent ? 'none' : '1px solid #E2E8F0',
      }}
    >
      {/* Top info bar */}
      {isTransparent && (
        <div style={{ background: 'rgba(11,25,44,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1.5rem', padding: '0.4rem 1.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Phone size={12} color="var(--amber)" /> +94 11 234 5678
            </span>
            <span>Mon – Sat: 8:00 AM – 6:00 PM</span>
          </div>
        </div>
      )}

      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>
        {/* Brand Logo & Title */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 38, height: 38, background: 'var(--amber)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Wrench size={20} color="var(--navy)" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', lineHeight: 1.1, color: isTransparent ? 'white' : 'var(--navy)', letterSpacing: '0.02em' }}>
              SHINY WAVE
            </div>
            <div style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--amber)', lineHeight: 1 }}>
              Auto Services
            </div>
          </div>
        </Link>

        {/* Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
          <Link to="/" style={{ fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', textDecoration: 'none', color: isTransparent ? 'white' : 'var(--navy)' }}>
            Home
          </Link>
          <Link to="/services" style={{ fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', textDecoration: 'none', color: isTransparent ? 'white' : 'var(--navy)' }}>
            Services
          </Link>
          <button onClick={() => scrollToSection('about')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', color: isTransparent ? 'white' : 'var(--navy)' }}>
            About
          </button>
          <button onClick={() => scrollToSection('contact')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', color: isTransparent ? 'white' : 'var(--navy)' }}>
            Contact
          </button>
        </div>

        {/* User Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          {user ? (
            <>
              <Link to="/profile/notifications" style={{ position: 'relative', display: 'flex', alignItems: 'center', color: isTransparent ? 'white' : 'var(--navy)', textDecoration: 'none' }}>
                <Bell size={20} />
                {notifCount > 0 && <span className="notif-badge">{notifCount > 9 ? '9+' : notifCount}</span>}
              </Link>

              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    color: isTransparent ? 'white' : 'var(--navy)',
                    padding: '0.4rem',
                  }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', flexShrink: 0 }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} />
                </button>

                {userMenu && (
                  <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                    background: 'white', borderRadius: 12, boxShadow: 'var(--shadow-xl)',
                    border: '1px solid var(--grey-200)', minWidth: 200, zIndex: 100,
                    overflow: 'hidden',
                  }}>
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--grey-100)', background: 'var(--grey-50)' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)' }}>{user.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--grey-500)' }}>{user.email}</div>
                    </div>

                    {user.role === 'ADMIN' ? (
                      <Link to="/admin" onClick={() => setUserMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'var(--grey-700)', textDecoration: 'none' }}>
                        <LayoutDashboard size={16} /> Admin Console
                      </Link>
                    ) : (
                      <>
                        <Link to="/profile" onClick={() => setUserMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'var(--grey-700)', textDecoration: 'none' }}>
                          <User size={16} /> My Profile
                        </Link>
                        <Link to="/profile/bookings" onClick={() => setUserMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'var(--grey-700)', textDecoration: 'none' }}>
                          <LayoutDashboard size={16} /> My Bookings
                        </Link>
                        <Link to="/profile/settings" onClick={() => setUserMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'var(--grey-700)', textDecoration: 'none' }}>
                          <Settings size={16} /> Settings
                        </Link>
                      </>
                    )}

                    <button
                      onClick={() => { setUserMenu(false); logout(); navigate('/login'); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', width: '100%', borderTop: '1px solid var(--grey-100)' }}
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost" style={{ color: isTransparent ? 'white' : 'var(--navy)', borderColor: isTransparent ? 'rgba(255,255,255,0.4)' : 'var(--grey-300)', padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                Sign In
              </Link>
              <Link to="/book" className="btn-primary" style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}>
                Book Now
              </Link>
            </>
          )}

          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isTransparent ? 'white' : 'var(--navy)', display: 'none' }} className="mobile-menu-btn">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
