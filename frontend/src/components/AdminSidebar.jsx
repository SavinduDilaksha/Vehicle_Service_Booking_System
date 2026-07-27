import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Wrench, Megaphone, ArrowLeft } from 'lucide-react';

export default function AdminSidebar() {
  const location = useLocation();

  const links = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Bookings', path: '/admin/bookings', icon: Calendar },
    { label: 'Services', path: '/admin/categories', icon: Wrench },
    { label: 'Announcements', path: '/admin/announcements', icon: Megaphone },
  ];

  return (
    <aside style={{ width: 260, background: 'var(--navy)', minHeight: 'calc(100vh - 70px)', padding: '1.5rem', color: 'white' }}>
      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--grey-400)', marginBottom: '1rem', fontWeight: 700 }}>
        Admin Navigation
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 8,
                textDecoration: 'none',
                color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
                background: isActive ? 'var(--amber)' : 'transparent',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.9rem',
              }}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </div>

      <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} /> Back to Main Site
        </Link>
      </div>
    </aside>
  );
}
