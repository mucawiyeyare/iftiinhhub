import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logoImg from '../assets/logo-transparent.png';

/* ── IftiinHub Logo ── */
const IftiinLogo = ({ size = 46 }) => (
  <div className="navbar-logo-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
    <img
      src={logoImg}
      alt="IftiinHub Logo"
      style={{
        height: `${size}px`,
        width: 'auto',
        maxHeight: '100%',
        objectFit: 'contain',
        display: 'block'
      }}
      className="navbar-brand-logo-img"
    />
  </div>
);

/* ── Hamburger / X icon ── */
const MenuIcon = ({ open }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    {open ? (
      <>
        <line x1="5" y1="5" x2="19" y2="19" />
        <line x1="19" y1="5" x2="5" y2="19" />
      </>
    ) : (
      <>
        <line x1="3" y1="6"  x2="21" y2="6"  />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </>
    )}
  </svg>
);

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [certSearchId, setCertSearchId] = useState('');
  const navRef = useRef(null);

  // Ensure pure white light mode globally
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  /* ── Close menu on outside click ── */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  /* ── Lock body scroll when mobile menu is open ── */
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleCertSubmit = (e) => {
    e.preventDefault();
    if (certSearchId.trim()) {
      navigate(`/verify-certificate?id=${encodeURIComponent(certSearchId.trim())}`);
      setCertSearchId('');
      setIsMenuOpen(false);
    } else {
      navigate('/verify-certificate');
      setIsMenuOpen(false);
    }
  };

  const isActive = (path) => {
    if (path === '/verify-certificate') {
      return location.pathname === '/verify-certificate' || location.pathname === '/certificate' || location.pathname === '/certificates';
    }
    return location.pathname === path;
  };

  return (
    <>
      <style>{`
        /* ═══════════════════════════════════════════
           NAVBAR BASE — Clean White & Gold Amber
        ═══════════════════════════════════════════ */
        .navbar-root {
          background: #ffffff;
          border-bottom: 2px solid #f59e0b;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        /* ═══════════════════════════════════════════
           DESKTOP NAV LINKS
        ═══════════════════════════════════════════ */
        .nav-link {
          position: relative;
          color: #1e293b;
          font-weight: 600;
          font-size: 0.90rem;
          padding: 8px 14px;
          border-radius: 10px;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 2px; left: 14px;
          width: 0; height: 2px;
          background: #f59e0b;
          border-radius: 2px;
          transition: width 0.25s ease;
        }
        .nav-link:hover {
          color: #d97706;
          background: #fffbeb;
        }
        .nav-link:hover::after { width: calc(100% - 28px); }
        .nav-link.active {
          color: #b45309;
          background: #fef3c7;
          font-weight: 700;
        }
        .nav-link.active::after { width: calc(100% - 28px); }

        /* ═══════════════════════════════════════════
           NAVBAR CERTIFICATE SEARCH BOX
        ═══════════════════════════════════════════ */
        .navbar-cert-form {
          display: inline-flex;
          align-items: center;
          position: relative;
          background: #f8fafc;
          border: 1.5px solid #cbd5e1;
          border-radius: 10px;
          padding: 3px 6px 3px 10px;
          transition: all 0.2s ease;
        }
        .navbar-cert-form:focus-within {
          border-color: #10b981;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
        }
        .navbar-cert-icon {
          color: #64748b;
          width: 15px;
          height: 15px;
          margin-right: 6px;
          flex-shrink: 0;
        }
        .navbar-cert-input {
          border: none;
          background: transparent;
          font-size: 0.80rem;
          font-weight: 600;
          color: #0f172a;
          outline: none;
          width: 125px;
          padding: 3px 0;
          text-transform: uppercase;
        }
        .navbar-cert-input::placeholder {
          color: #94a3b8;
          text-transform: none;
          font-weight: 500;
        }
        .navbar-cert-btn {
          background: #10b981;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          padding: 4px 9px;
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
          display: inline-flex;
          align-items: center;
          gap: 3px;
          margin-left: 4px;
        }
        .navbar-cert-btn:hover {
          background: #059669;
        }

        /* ═══════════════════════════════════════════
           AUTH BUTTONS
        ═══════════════════════════════════════════ */
        .btn-navbar-signin {
          color: #1e293b;
          font-weight: 700;
          font-size: 0.875rem;
          padding: 8px 16px;
          border-radius: 10px;
          border: 1.5px solid #cbd5e1;
          background: #ffffff;
          transition: all 0.2s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
        }
        .btn-navbar-signin:hover {
          border-color: #f59e0b;
          color: #d97706;
          background: #fffbeb;
        }

        .btn-navbar-signup {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: #09090b !important;
          font-weight: 800;
          font-size: 0.875rem;
          padding: 8px 18px;
          border-radius: 10px;
          border: none;
          box-shadow: 0 2px 10px rgba(245, 158, 11, 0.3);
          transition: all 0.2s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
        }
        .btn-navbar-signup:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(245, 158, 11, 0.45);
          background: linear-gradient(135deg, #fcd34d 0%, #fbbf24 100%);
        }

        /* ═══════════════════════════════════════════
           USER CHIP & LOGOUT
        ═══════════════════════════════════════════ */
        .user-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px 5px 8px;
          background: #fef3c7;
          border: 1px solid #fde68a;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #92400e;
        }
        .user-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #f59e0b;
          color: #09090b;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
        }
        .btn-logout {
          color: #ef4444;
          font-size: 0.82rem;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid rgba(239, 68, 68, 0.3);
          background: #fef2f2;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-logout:hover {
          background: #fee2e2;
          border-color: #ef4444;
        }

        /* ═══════════════════════════════════════════
           HAMBURGER BUTTON
        ═══════════════════════════════════════════ */
        .hamburger-btn {
          display: inline-flex; align-items: center; justify-content: center;
          width: 40px; height: 40px; border-radius: 10px;
          border: 1.5px solid #fde68a;
          background: #fef3c7;
          color: #78350f;
          cursor: pointer;
          transition: all 0.22s;
          flex-shrink: 0;
        }
        .hamburger-btn:hover { background: #fde68a; }

        /* ═══════════════════════════════════════════
           MOBILE DRAWER
        ═══════════════════════════════════════════ */
        .mobile-backdrop {
          position: fixed; inset: 0;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(2px);
          z-index: 998;
        }
        .mobile-drawer {
          position: absolute; top: 100%; left: 0; right: 0;
          background: #ffffff;
          border-bottom: 2px solid #f59e0b;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
          padding: 16px;
          z-index: 999;
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-height: calc(100vh - 70px);
          overflow-y: auto;
        }
        .mobile-nav-link {
          display: flex;
          align-items: center;
          padding: 11px 16px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.95rem;
          color: #1e293b;
          text-decoration: none;
          transition: all 0.2s;
        }
        .mobile-nav-link:hover, .mobile-nav-link.active {
          background: #fef3c7;
          color: #92400e;
          font-weight: 700;
        }
      `}</style>

      {/* ── Backdrop (mobile only) ── */}
      {isMenuOpen && (
        <div
          className="mobile-backdrop md:hidden"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <nav className="navbar-root" ref={navRef} role="navigation" aria-label="Main navigation">
        <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px', gap: '12px' }}>

            {/* ── Brand Logo ── */}
            <Link to="/" className="navbar-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', flexShrink: 0 }}
              onClick={() => setIsMenuOpen(false)}>
              <IftiinLogo size={46} />
            </Link>

            {/* ── Desktop Navigation Links ── */}
            <div className="hidden lg:flex" style={{ alignItems: 'center', gap: '4px' }}>
              <Link to="/"                  className={`nav-link${isActive('/')                  ? ' active' : ''}`}>Home</Link>
              <Link to="/about"             className={`nav-link${isActive('/about')             ? ' active' : ''}`}>About</Link>
              <Link to="/training-programs" className={`nav-link${isActive('/training-programs') ? ' active' : ''}`}>Training Programs</Link>
              <Link to="/verify-certificate" className={`nav-link${isActive('/verify-certificate') ? ' active' : ''}`}>
                Certificates
              </Link>
              <Link to="/contact"           className={`nav-link${isActive('/contact')           ? ' active' : ''}`}>Contact</Link>
            </div>

            {/* ── Desktop Quick Search Box & Auth ── */}
            <div className="hidden md:flex" style={{ alignItems: 'center', gap: '10px' }}>
              {/* Small Certificate Search Box */}
              <form onSubmit={handleCertSubmit} className="navbar-cert-form" title="Verify Certificate ID">
                <svg className="navbar-cert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={certSearchId}
                  onChange={(e) => setCertSearchId(e.target.value)}
                  placeholder="Cert ID..."
                  className="navbar-cert-input"
                />
                <button type="submit" className="navbar-cert-btn">
                  Verify
                </button>
              </form>

              <div style={{ width: '1px', height: '24px', background: '#e2e8f0', margin: '0 4px' }} />

              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* User chip */}
                  <span className="user-chip">
                    <span className="user-avatar">
                      {(user.name || user.email || 'U')[0].toUpperCase()}
                    </span>
                    {user.name?.split(' ')[0] || user.email?.split('@')[0]}
                  </span>
                  {user.role === 'admin' && (
                    <Link to="/admin-dashboard" className={`nav-link${isActive('/admin-dashboard') ? ' active' : ''}`}>Admin</Link>
                  )}
                  {user.role === 'student' && (
                    <Link to="/student-dashboard" className={`nav-link${isActive('/student-dashboard') ? ' active' : ''}`}>Dashboard</Link>
                  )}
                  <Link to="/profile" className={`nav-link${isActive('/profile') ? ' active' : ''}`}>Profile</Link>
                  <button onClick={handleLogout} className="btn-logout">Logout</button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Link to="/login" className="btn-navbar-signin">Sign In</Link>
                  <Link to="/student-register" className="btn-navbar-signup">Sign Up</Link>
                </div>
              )}
            </div>

            {/* ── Mobile: hamburger ── */}
            <div className="flex lg:hidden" style={{ alignItems: 'center', gap: '8px' }}>
              <button
                id="navbar-hamburger"
                className="hamburger-btn"
                onClick={() => setIsMenuOpen(o => !o)}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                <MenuIcon open={isMenuOpen} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Drawer ── */}
        {isMenuOpen && (
          <div id="mobile-menu" className="mobile-drawer lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>

              {/* User info (if logged in) */}
              {user && (
                <div style={{ padding: '10px 14px', marginBottom: '4px', borderRadius: '10px', background: '#fef3c7', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="user-avatar" style={{ width: '32px', height: '32px', fontSize: '0.9rem' }}>
                    {(user.name || user.email || 'U')[0].toUpperCase()}
                  </span>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0f172a' }}>{user.name || user.email?.split('@')[0]}</div>
                    <div style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: '600', textTransform: 'uppercase' }}>{user.role}</div>
                  </div>
                </div>
              )}

              {/* Mobile Quick Certificate Search Bar */}
              <form onSubmit={handleCertSubmit} className="navbar-cert-form" style={{ width: '100%', marginBottom: '8px', padding: '6px 10px' }}>
                <svg className="navbar-cert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={certSearchId}
                  onChange={(e) => setCertSearchId(e.target.value)}
                  placeholder="Enter Certificate ID (e.g. NTW-...)"
                  className="navbar-cert-input"
                  style={{ width: '100%', fontSize: '0.88rem' }}
                />
                <button type="submit" className="navbar-cert-btn" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                  Verify
                </button>
              </form>

              {/* Main Links */}
              <Link to="/" className={`mobile-nav-link${isActive('/') ? ' active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/about" className={`mobile-nav-link${isActive('/about') ? ' active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
              <Link to="/training-programs" className={`mobile-nav-link${isActive('/training-programs') ? ' active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                Training Programs
              </Link>
              <Link to="/verify-certificate" className={`mobile-nav-link${isActive('/verify-certificate') ? ' active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                📜 Verify Certificate
              </Link>
              <Link to="/contact" className={`mobile-nav-link${isActive('/contact') ? ' active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                Contact
              </Link>

              <div style={{ height: '1px', background: '#e2e8f0', margin: '8px 0' }} />

              {/* Auth links */}
              {user ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {user.role === 'admin' && (
                    <Link to="/admin-dashboard" className={`mobile-nav-link${isActive('/admin-dashboard') ? ' active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                      Admin Dashboard
                    </Link>
                  )}
                  {user.role === 'student' && (
                    <Link to="/student-dashboard" className={`mobile-nav-link${isActive('/student-dashboard') ? ' active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                      My Dashboard
                    </Link>
                  )}
                  <Link to="/profile" className={`mobile-nav-link${isActive('/profile') ? ' active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="btn-logout" style={{ marginTop: '8px', width: '100%', textAlign: 'center', padding: '10px' }}>
                    Logout
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '6px' }}>
                  <Link to="/login" className="btn-navbar-signin" style={{ justifyContent: 'center', padding: '10px' }} onClick={() => setIsMenuOpen(false)}>
                    Sign In
                  </Link>
                  <Link to="/student-register" className="btn-navbar-signup" style={{ justifyContent: 'center', padding: '10px' }} onClick={() => setIsMenuOpen(false)}>
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
