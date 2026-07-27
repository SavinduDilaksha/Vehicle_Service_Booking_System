import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wrench, Mail, Lock, ArrowRight, Eye, EyeOff, User, Phone, CheckCircle } from 'lucide-react';

export default function Login() {
  const [tab, setTab] = useState('login');
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regData, setRegData] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userData = await login(email, password);
      if (userData?.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(regData);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--navy)' }}>
      {/* Left Panel — High-Res Car Workshop Background Image */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justify: 'center',
          padding: '4rem 5rem',
          color: 'white',
          position: 'relative',
          background: `linear-gradient(135deg, rgba(11,25,44,0.85) 0%, rgba(11,25,44,0.92) 100%), url('/images/hero.png') center/cover no-repeat`,
        }}
        className="auth-left"
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', marginBottom: '3rem' }}>
          <div style={{ width: 44, height: 44, background: 'var(--amber)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wrench size={22} color="var(--navy)" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'white', letterSpacing: '0.02em' }}>SHINY WAVE</div>
            <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--amber)' }}>Auto Services</div>
          </div>
        </Link>

        <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: '1.25rem' }}>
          Your Vehicle,<br />
          <span style={{ color: 'var(--amber)' }}>Our Priority.</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, fontSize: '1rem', marginBottom: '2.5rem', maxWidth: 460 }}>
          Join thousands of satisfied customers who trust Shiny Wave for all their vehicle service needs. Book, track, and manage your appointments effortlessly.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            'Real-time booking status updates',
            'Expert mechanics, certified technicians',
            'Transparent pricing, no hidden fees',
            '3-month service warranty on all work',
          ].map((item) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)' }}>
              <CheckCircle size={18} color="var(--amber)" /> {item}
            </div>
          ))}
        </div>

        <div style={{ marginTop: '3.5rem', display: 'flex', gap: '3rem' }}>
          {[["5000+", "Customers"], ["20+", "Years"], ["100%", "Satisfaction"]].map(([val, label]) => (
            <div key={label}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--amber)' }}>{val}</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel — Form Card */}
      <div style={{ width: 520, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem', background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)' }} className="auth-right">
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ background: 'white', borderRadius: 20, padding: '2.5rem', boxShadow: '0 30px 80px rgba(0,0,0,0.3)' }}>
            {/* Tabs */}
            <div style={{ display: 'flex', background: 'var(--grey-100)', borderRadius: 10, padding: '4px', marginBottom: '2rem' }}>
              <button
                type="button"
                onClick={() => { setTab('login'); setError(''); }}
                style={{
                  flex: 1, padding: '0.625rem', border: 'none', cursor: 'pointer',
                  borderRadius: 8, fontWeight: 700, fontSize: '0.85rem',
                  background: tab === 'login' ? 'white' : 'transparent',
                  color: tab === 'login' ? 'var(--navy)' : 'var(--grey-500)',
                  boxShadow: tab === 'login' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setTab('register'); setError(''); }}
                style={{
                  flex: 1, padding: '0.625rem', border: 'none', cursor: 'pointer',
                  borderRadius: 8, fontWeight: 700, fontSize: '0.85rem',
                  background: tab === 'register' ? 'white' : 'transparent',
                  color: tab === 'register' ? 'var(--navy)' : 'var(--grey-500)',
                  boxShadow: tab === 'register' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                Create Account
              </button>
            </div>

            {/* LOGIN FORM */}
            {tab === 'login' && (
              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                  <h2 style={{ fontSize: '1.4rem', color: 'var(--navy)', marginBottom: '0.25rem' }}>Welcome Back</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--grey-500)' }}>Sign in to your account</p>
                </div>

                {error && (
                  <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.85rem' }}>
                    {error}
                  </div>
                )}

                <div>
                  <label className="form-label">Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--grey-400)' }} />
                    <input type="email" required className="form-input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ paddingLeft: '2.5rem' }} />
                  </div>
                </div>

                <div>
                  <label className="form-label">Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--grey-400)' }} />
                    <input type={showPass ? 'text' : 'password'} required className="form-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }} />
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--grey-400)' }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary" style={{ justifyContent: 'center', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Signing In...' : 'Sign In'} <ArrowRight size={16} />
                </button>

                <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--grey-500)', marginTop: '0.5rem' }}>
                  Don't have an account?{' '}
                  <button type="button" onClick={() => { setTab('register'); setError(''); }} style={{ color: 'var(--amber)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>
                    Create one free
                  </button>
                </p>
              </form>
            )}

            {/* REGISTER FORM */}
            {tab === 'register' && (
              <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                  <h2 style={{ fontSize: '1.4rem', color: 'var(--navy)', marginBottom: '0.25rem' }}>Create Account</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--grey-500)' }}>Join Shiny Wave today</p>
                </div>

                {error && (
                  <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.85rem' }}>
                    {error}
                  </div>
                )}

                <div>
                  <label className="form-label">Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--grey-400)' }} />
                    <input required className="form-input" placeholder="Your full name" value={regData.name} onChange={(e) => setRegData({ ...regData, name: e.target.value })} style={{ paddingLeft: '2.5rem' }} />
                  </div>
                </div>

                <div>
                  <label className="form-label">Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--grey-400)' }} />
                    <input type="email" required className="form-input" placeholder="you@example.com" value={regData.email} onChange={(e) => setRegData({ ...regData, email: e.target.value })} style={{ paddingLeft: '2.5rem' }} />
                  </div>
                </div>

                <div>
                  <label className="form-label">Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--grey-400)' }} />
                    <input type="tel" className="form-input" placeholder="07X XXX XXXX" value={regData.phone} onChange={(e) => setRegData({ ...regData, phone: e.target.value })} style={{ paddingLeft: '2.5rem' }} />
                  </div>
                </div>

                <div>
                  <label className="form-label">Password</label>
                  <input type="password" required className="form-input" placeholder="Min. 6 characters" value={regData.password} onChange={(e) => setRegData({ ...regData, password: e.target.value })} />
                </div>

                <button type="submit" disabled={loading} className="btn-primary" style={{ justifyContent: 'center', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Creating Account...' : 'Create Account'} <ArrowRight size={16} />
                </button>

                <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--grey-500)', marginTop: '0.5rem' }}>
                  Already have an account?{' '}
                  <button type="button" onClick={() => { setTab('register'); setError(''); }} style={{ color: 'var(--amber)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>
                    Sign in
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .auth-left { display: none !important; }
          .auth-right { width: 100% !important; }
        }
      `}</style>
    </div>
  );
}
