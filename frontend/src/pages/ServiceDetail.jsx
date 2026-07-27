import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import { Clock, CheckCircle, ArrowLeft, Calendar, Wrench } from 'lucide-react';

const serviceIncludesMap = {
  'oil-change': ['Full engine oil drain and refill', 'New oil filter replacement', 'Top-up of all fluids', 'Multi-point visual inspection', 'Mileage reset & service sticker'],
  'brake-service': ['Front & rear brake pad inspection', 'Brake rotor/drum inspection', 'Brake fluid level check & top-up', 'Brake caliper inspection', 'Brake hose inspection', 'Road test verification'],
  'wheel-alignment': ['4-wheel computerized alignment', 'Tire pressure check & inflate', 'Steering wheel centering', 'Camber, caster & toe adjustment', 'Alignment report printout'],
  'engine-diagnostic': ['OBD-II electronic scan', 'Check engine light diagnosis', 'Sensor & emissions test', 'Battery & alternator check', 'Fuel system inspection', 'Detailed fault report'],
  'ac-service': ['AC performance test', 'Refrigerant recharge (R134a)', 'Compressor belt check', 'Condenser & evaporator cleaning', 'Cabin air filter replacement', 'Thermostat verification'],
  'full-detailing': ['Premium exterior hand wash', 'Clay bar decontamination', 'Machine polish & wax', 'Interior deep vacuum', 'Dashboard & upholstery conditioning', 'Window & glass treatment', 'Tire dressing & rim clean'],
};

const defaultIncludes = ['Full service inspection', 'Parts replacement (if required)', 'Multi-point check', 'Service report provided'];

export default function ServiceDetail() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [otherServices, setOtherServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/services/${slug}`)
      .then((res) => setService(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    api.get('/services')
      .then((res) => setOtherServices(res.data.filter((s) => s.slug !== slug).slice(0, 3)))
      .catch((err) => console.error(err));
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--grey-500)' }}>Loading service details...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2>Service Not Found</h2>
        <Link to="/services" className="btn-primary" style={{ marginTop: '1rem' }}>Back to Services</Link>
      </div>
    );
  }

  const includes = serviceIncludesMap[slug] || defaultIncludes;

  return (
    <div>
      {/* Header */}
      <div style={{ background: 'var(--navy)', color: 'white', padding: '3.5rem 0 3rem' }}>
        <div className="container">
          <Link to="/services" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            <ArrowLeft size={16} /> Back to Services
          </Link>
          <div className="section-tag" style={{ color: 'var(--amber)' }}>Service Detail</div>
          <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: 800 }}>{service.name}</h1>
        </div>
      </div>

      <section className="section" style={{ background: 'var(--grey-50)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
            {/* Main Content */}
            <div>
              {/* Image Banner */}
              <div style={{ borderRadius: 16, overflow: 'hidden', height: 320, marginBottom: '2rem', background: 'linear-gradient(135deg, var(--navy), var(--navy-light))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {service.imageUrl ? (
                  <img src={service.imageUrl} alt={service.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Wrench size={64} color="rgba(255,255,255,0.2)" />
                )}
              </div>

              {/* Description */}
              <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.3rem', color: 'var(--navy)', marginBottom: '0.75rem' }}>About This Service</h2>
                <p style={{ color: 'var(--grey-600)', lineHeight: 1.8, fontSize: '0.95rem' }}>{service.description}</p>
              </div>

              {/* What's Included */}
              <div className="card" style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '1.3rem', color: 'var(--navy)', marginBottom: '1.25rem' }}>What's Included</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  {includes.map((item) => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                      <CheckCircle size={18} color="#10B981" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '0.9rem', color: 'var(--grey-700)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Pricing & CTA */}
            <div>
              <div className="card" style={{ padding: '2rem', position: 'sticky', top: '90px' }}>
                <div style={{ background: 'var(--navy)', borderRadius: 12, padding: '1.5rem', marginBottom: '1.5rem', color: 'white' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>Starting From</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{service.priceRange || 'Contact for quote'}</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                  {service.duration && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--grey-100)' }}>
                      <span style={{ color: 'var(--grey-600)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={15} /> Duration</span>
                      <span style={{ fontWeight: 700, color: 'var(--navy)' }}>{service.duration}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--grey-100)' }}>
                    <span style={{ color: 'var(--grey-600)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={15} /> Availability</span>
                    <span style={{ fontWeight: 700, color: '#10B981' }}>Mon – Sat</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                    <span style={{ color: 'var(--grey-600)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckCircle size={15} /> Warranty</span>
                    <span style={{ fontWeight: 700, color: 'var(--navy)' }}>3 Months / 5,000 km</span>
                  </div>
                </div>

                <Link to="/book" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Book This Service
                </Link>
              </div>

              {/* Other Services */}
              <div className="card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
                <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--navy)' }}>Other Services</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {otherServices.map((s) => (
                    <Link key={s._id} to={`/services/${s.slug}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--navy)', textDecoration: 'none', padding: '0.4rem 0', borderBottom: '1px solid var(--grey-100)' }}>
                      <span>{s.name}</span>
                      <span style={{ color: 'var(--amber)', fontWeight: 600, fontSize: '0.75rem' }}>{s.priceRange?.split('–')[0]}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
