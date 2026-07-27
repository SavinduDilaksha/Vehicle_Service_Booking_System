import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import { ArrowRight, Wrench, Shield, Clock, Star, ChevronRight } from 'lucide-react';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/services')
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{ position: 'relative', background: 'var(--navy)', color: 'white', padding: '6rem 0 5rem', overflow: 'hidden' }}>
        <div className="container">
          <div style={{ maxWidth: 640 }}>
            <div className="section-tag">
              <div style={{ width: 24, height: 2, background: 'var(--amber)' }} />
              Premium Auto Services in Sri Lanka
            </div>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.5rem', color: 'white' }}>
              Your Car Deserves <span style={{ color: 'var(--amber)' }}>Expert Care</span>
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', marginBottom: '2.5rem', lineHeight: 1.7 }}>
              Book your vehicle service appointment online with MERN Stack integration. Real-time tracking, certified mechanics, guaranteed quality.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/book" className="btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '0.95rem' }}>
                Book Appointment <ArrowRight size={18} />
              </Link>
              <Link to="/services" className="btn-white" style={{ padding: '0.9rem 2rem', fontSize: '0.95rem' }}>
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section" style={{ background: 'var(--grey-50)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-tag" style={{ justifyContent: 'center' }}>Our Services</div>
            <h2 className="section-title">What We Do Best</h2>
            <p className="section-subtitle" style={{ margin: '0.5rem auto 0' }}>
              From routine oil changes to complex engine diagnostics, our certified team handles it all with precision.
            </p>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--grey-500)' }}>Loading services...</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {categories.map((cat) => (
                <div key={cat._id} className="card">
                  <div style={{ height: 180, background: 'linear-gradient(135deg, var(--navy), var(--navy-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {cat.imageUrl ? (
                      <img src={cat.imageUrl} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Wrench size={48} color="rgba(255,255,255,0.3)" />
                    )}
                    {cat.priceRange && (
                      <span style={{ position: 'absolute', top: 12, right: 12, background: 'var(--amber)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700 }}>
                        {cat.priceRange}
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--navy)', marginBottom: '0.5rem' }}>{cat.name}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--grey-600)', marginBottom: '1rem', lineHeight: 1.6 }}>
                      {cat.description.substring(0, 100)}...
                    </p>
                    <Link to="/book" style={{ color: 'var(--amber)', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      Book Service <ChevronRight size={16} />
                    </Link>
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
