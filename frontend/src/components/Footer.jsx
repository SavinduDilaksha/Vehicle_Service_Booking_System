import { Wrench, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--navy)', color: 'white', paddingTop: '4rem', paddingBottom: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ background: 'var(--amber)', padding: '0.5rem', borderRadius: 8, display: 'flex' }}>
                <Wrench size={20} color="white" />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>Shiny Wave</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
              Sri Lanka's premier vehicle service and maintenance platform. Quality care, expert mechanics, and seamless online booking.
            </p>
          </div>

          <div>
            <h4 style={{ color: 'var(--amber)', marginBottom: '1.2rem', fontSize: '0.95rem' }}>Contact Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} /> 123 Galle Road, Colombo 03</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={16} /> +94 11 234 5678</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16} /> info@shinywave.lk</div>
            </div>
          </div>

          <div>
            <h4 style={{ color: 'var(--amber)', marginBottom: '1.2rem', fontSize: '0.95rem' }}>Working Hours</h4>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
              <div>Monday – Friday: 8:00 AM – 6:00 PM</div>
              <div>Saturday: 8:00 AM – 4:00 PM</div>
              <div>Sunday: Closed</div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
          © {new Date().getFullYear()} Shiny Wave Auto Services. MERN Stack Application. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
