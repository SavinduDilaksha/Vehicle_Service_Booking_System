import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import { Search, Clock, ChevronRight, Wrench, ArrowRight, CheckCircle, Shield } from 'lucide-react';

export default function Services() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  useEffect(() => {
    api.get('/services')
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredServices = categories.filter((cat) => {
    const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cat.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div>
      {/* Header Banner */}
      <div style={{ background: 'var(--navy)', color: 'white', paddingTop: 'calc(70px + 3.5rem)', paddingBottom: '3.5rem' }}>
        <div className="container">
          <div className="section-tag" style={{ color: 'var(--amber)', marginBottom: '0.75rem' }}>
            <div style={{ width: 28, height: 2, background: 'var(--amber)' }} />
            What We Offer
          </div>
          <h1 style={{ color: 'white', fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 800, marginBottom: '1rem' }}>
            Service Catalog
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: 560, fontSize: '1rem', lineHeight: 1.6 }}>
            Comprehensive vehicle care for every need. From routine engine maintenance to complex diagnostics — we do it all with transparent pricing.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section className="section" style={{ background: 'var(--grey-50)', minHeight: '60vh' }}>
        <div className="container">
          {/* Interactive Search Bar & Filter Header */}
          <div
            className="card"
            style={{
              padding: '1.25rem 1.75rem',
              marginBottom: '2.5rem',
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
              <Search size={18} color="var(--grey-400)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.75rem', fontSize: '0.9rem' }}
                placeholder="Search by service name or description (e.g. Oil, Brake, AC)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--grey-500)', fontWeight: 600 }}>
              Showing <span style={{ color: 'var(--amber)', fontWeight: 800 }}>{filteredServices.length}</span> Services
            </div>
          </div>

          {/* Services Grid */}
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--grey-500)', padding: '3rem 0' }}>Loading service catalog...</p>
          ) : filteredServices.length === 0 ? (
            <div className="card" style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--grey-500)' }}>
              <Wrench size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <h3>No services found</h3>
              <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Try searching with a different keyword.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
              {filteredServices.map((cat) => (
                <div key={cat._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                  {/* Image */}
                  <div style={{ height: 210, overflow: 'hidden', position: 'relative', background: 'var(--grey-200)' }}>
                    {cat.imageUrl ? (
                      <img src={cat.imageUrl} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--navy), var(--navy-light))' }}>
                        <Wrench size={52} color="rgba(255,255,255,0.2)" />
                      </div>
                    )}
                    {cat.priceRange && (
                      <div style={{ position: 'absolute', top: 14, right: 14, background: 'var(--amber)', color: 'var(--navy)', padding: '0.35rem 0.85rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 800, boxShadow: 'var(--shadow-sm)' }}>
                        {cat.priceRange}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ fontSize: '1.25rem', color: 'var(--navy)', marginBottom: '0.625rem', fontWeight: 800 }}>
                      {cat.name}
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--grey-600)', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>
                      {cat.description}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--grey-100)', marginTop: 'auto' }}>
                      {cat.duration && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--grey-500)', fontWeight: 600 }}>
                          <Clock size={14} color="var(--amber)" /> Est. {cat.duration}
                        </span>
                      )}

                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <Link
                          to={`/services/${cat.slug}`}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', textDecoration: 'none' }}
                        >
                          Details <ChevronRight size={16} />
                        </Link>
                        <Link
                          to={`/book?service=${encodeURIComponent(cat.name)}`}
                          className="btn-primary"
                          style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Inspection CTA Banner */}
          <div style={{ marginTop: '4.5rem', background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)', borderRadius: 20, padding: '3.5rem 2rem', textAlign: 'center', color: 'white', boxShadow: 'var(--shadow-lg)' }}>
            <h2 style={{ color: 'white', fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>
              Not Sure Which Service You Need?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: 540, margin: '0 auto 2rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Book a complimentary 25-point vehicle health inspection. Our certified mechanics will diagnose your vehicle and recommend the exact service required.
            </p>
            <Link to="/book" className="btn-primary" style={{ fontSize: '1rem', padding: '0.9rem 2.5rem' }}>
              Book Free Inspection <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
