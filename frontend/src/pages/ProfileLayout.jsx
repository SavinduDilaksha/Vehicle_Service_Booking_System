import { Outlet } from 'react-router-dom';
import ProfileSidebar from '../components/ProfileSidebar';

export default function ProfileLayout() {
  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: 'var(--grey-50)', display: 'flex' }}>
      <ProfileSidebar />
      <main style={{ flex: 1, padding: '2.5rem', minWidth: 0 }}>
        <Outlet />
      </main>
    </div>
  );
}
