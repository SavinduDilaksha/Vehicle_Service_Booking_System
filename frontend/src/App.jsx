import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Book from './pages/Book';
import Login from './pages/Login';
import Register from './pages/Register';

// Profile Routes & Sub-pages
import ProfileLayout from './pages/ProfileLayout';
import ProfileDashboard from './pages/ProfileDashboard';
import ProfileBookings from './pages/ProfileBookings';
import ProfileNotifications from './pages/ProfileNotifications';
import ProfileSettings from './pages/ProfileSettings';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminBookings from './pages/AdminBookings';
import AdminCategories from './pages/AdminCategories';
import AdminAnnouncements from './pages/AdminAnnouncements';

export default function App() {
  const location = useLocation();
  
  // Hide Navbar & Footer on Login and Register pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isAuthPage && <Navbar />}

      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Customer Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/book" element={<Book />} />
            
            {/* Profile Sub-routes */}
            <Route path="/profile" element={<ProfileLayout />}>
              <Route index element={<ProfileDashboard />} />
              <Route path="bookings" element={<ProfileBookings />} />
              <Route path="notifications" element={<ProfileNotifications />} />
              <Route path="settings" element={<ProfileSettings />} />
            </Route>
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/announcements" element={<AdminAnnouncements />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {!isAuthPage && <Footer />}
    </div>
  );
}
