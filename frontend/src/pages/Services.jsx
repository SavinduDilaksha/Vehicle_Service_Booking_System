import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import { Clock, ChevronRight, Wrench, ArrowRight } from 'lucide-react';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/services')
      .then((res) => setServices(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Header */}
      <div style={{ background: 'var(--navy)', color: 'white', padding: '4rem 0' }}>
        <div className="container">
          <div className="section-tag">What We Offer</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white' }}>Vehicle Service Offerings</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '0.5rem' }}>
            Comprehensive automotive maintenance & repairs delivered by certified technicians.
          </p>
        </div>
      </div>

      <section className="section" style={{ background: 'var(--grey-50)' }}>
        <div className="container">
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--grey-500)' }}>Loading services catalog...</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
              {services.map((srv) => (
                <div key={srv._id} className="card">
                  <div style={{ height: 200, background: 'linear-gradient(135deg, var(--navy), var(--navy-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {srv.imageUrl ? (
                      <img src={srv.imageUrl} alt={srv.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Wrench size={52} color="rgba(255,255,255,0.3)" />
                    )}
                    {srv.priceRange && (
                      <span style={{ position: 'absolute', top: 12, right: 12, background: 'var(--amber)', color: 'white', padding: '0.3rem 0.8rem', borderRadius: 4, fontSize: '0.8rem', fontWeight: 700 }}>
                        {srv.priceRange}
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '1.75rem' }}>
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--navy)', marginBottom: '0.75rem' }}>{srv.name}</h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--grey-600)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                      {srv.description}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {srv.duration && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--grey-500)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Clock size={14} /> {srv.duration}
                        </span>
                      )}
                      <Link to="/book" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                        Book Now <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
