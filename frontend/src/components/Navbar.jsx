import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logoImage from '../assets/iftiin.png';

/* ── Sun icon ── */
const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

/* ── Moon icon ── */
const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
);

/* ── Hamburger / X icon ── */
const MenuIcon = ({ open }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <style>{`
      .bar1, .bar2, .bar3 {
        transform-origin: center;
        transition: transform 0.3s cubic-bezier(.4,0,.2,1), opacity 0.2s;
      }
    `}</style>
    {open ? (
      <>
        <line className="bar1" x1="5" y1="5" x2="19" y2="19" />
        <line className="bar3" x1="19" y1="5" x2="5" y2="19" />
      </>
    ) : (
      <>
        <line className="bar1" x1="3" y1="6"  x2="21" y2="6"  />
        <line className="bar2" x1="3" y1="12" x2="21" y2="12" />
        <line className="bar3" x1="3" y1="18" x2="21" y2="18" />
      </>
    )}
  </svg>
);

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef(null);

  /* ── Dark mode state (persisted in localStorage) ── */
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  /* ── Close menu on route change ── */
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

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        /* ═══════════════════════════════════════════
           DARK MODE GLOBAL OVERRIDES
        ═══════════════════════════════════════════ */
        html.dark body { background: #0f0f1a; color: #f1f5f9; }
        html.dark .bg-white { background: #1a1a2e !important; }
        html.dark .shadow-lg { box-shadow: 0 4px 24px rgba(0,0,0,0.5) !important; }
        html.dark .border-purple-100 { border-color: #312e5a !important; }
        html.dark .text-purple-700 { color: #c4b5fd !important; }
        html.dark .text-gray-900, html.dark .text-gray-800 { color: #f1f5f9 !important; }
        html.dark .text-gray-600, html.dark .text-gray-500, html.dark .text-gray-400 { color: #94a3b8 !important; }
        html.dark .bg-gray-50, html.dark .bg-gray-100 { background: #10101e !important; }
        html.dark .border-gray-100, html.dark .border-gray-200 { border-color: #1e1e3a !important; }

        /* Dark hero override */
        html.dark .hero-section {
          background: linear-gradient(135deg, #1e0a3c 0%, #3b0764 40%, #4c1d95 70%, #5b21b6 100%) !important;
          border-bottom-color: #3b0764 !important;
        }
        html.dark .hero-heading { color: #fff !important; }
        html.dark .hero-sub     { color: rgba(255,255,255,0.72) !important; }
        html.dark .hero-bullet  { color: rgba(255,255,255,0.82) !important; }
        html.dark .hero-badge   { background: rgba(167,139,250,0.2) !important; border-color: rgba(167,139,250,0.4) !important; color: #c4b5fd !important; }
        html.dark .hero-stat-num  { color: #fff !important; }
        html.dark .hero-stat-label { color: rgba(255,255,255,0.55) !important; }
        html.dark .hero-stats   { border-top-color: rgba(255,255,255,0.1) !important; }
        html.dark .hero-card    { background: rgba(255,255,255,0.06) !important; border-color: rgba(255,255,255,0.12) !important; box-shadow: 0 24px 80px rgba(0,0,0,0.4) !important; }
        html.dark .hero-module-item { background: rgba(255,255,255,0.05) !important; border-color: rgba(255,255,255,0.08) !important; }
        html.dark .hero-module-item:hover { background: rgba(255,255,255,0.1) !important; }
        html.dark .hero-module-label { color: rgba(255,255,255,0.88) !important; }
        html.dark .hero-module-badge { background: rgba(167,139,250,0.2) !important; color: #c4b5fd !important; }
        html.dark .hero-module-badge.included { background: rgba(34,197,94,0.15) !important; color: #4ade80 !important; }
        html.dark .hero-progress-bar-wrap { background: rgba(255,255,255,0.08) !important; }
        html.dark .hero-grid-lines { background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px) !important; }

        /* ═══════════════════════════════════════════
           NAVBAR BASE
        ═══════════════════════════════════════════ */
        .navbar-root {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(124,58,237,0.1);
          box-shadow: 0 1px 20px rgba(124,58,237,0.06);
          position: sticky;
          top: 0;
          z-index: 1000;
          transition: background 0.3s, box-shadow 0.3s;
        }
        html.dark .navbar-root {
          background: rgba(15,15,26,0.95);
          border-bottom-color: rgba(124,58,237,0.2);
          box-shadow: 0 1px 20px rgba(0,0,0,0.4);
        }

        /* ═══════════════════════════════════════════
           BRAND
        ═══════════════════════════════════════════ */
        .brand-text {
          font-size: 1.25rem;
          font-weight: 800;
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #6d28d9 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.03em;
          line-height: 1;
        }
        html.dark .brand-text {
          background: linear-gradient(135deg, #c4b5fd 0%, #e879f9 50%, #a78bfa 100%);
          -webkit-background-clip: text;
          background-clip: text;
        }

        /* ═══════════════════════════════════════════
           DESKTOP NAV LINKS
        ═══════════════════════════════════════════ */
        .nav-link {
          position: relative;
          color: #6d28d9;
          font-weight: 500;
          font-size: 0.875rem;
          padding: 6px 10px;
          border-radius: 8px;
          transition: color 0.2s, background 0.2s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 2px; left: 10px;
          width: 0; height: 2px;
          background: linear-gradient(90deg, #7c3aed, #a855f7);
          border-radius: 2px;
          transition: width 0.25s ease;
        }
        .nav-link:hover { color: #4c1d95; background: rgba(124,58,237,0.06); }
        .nav-link:hover::after { width: calc(100% - 20px); }
        .nav-link.active {
          color: #7c3aed;
          background: rgba(124,58,237,0.08);
          font-weight: 600;
        }
        .nav-link.active::after { width: calc(100% - 20px); }
        html.dark .nav-link { color: #c4b5fd; }
        html.dark .nav-link:hover { color: #fff; background: rgba(124,58,237,0.15); }
        html.dark .nav-link.active { color: #e879f9; background: rgba(124,58,237,0.2); }

        /* ═══════════════════════════════════════════
           THEME TOGGLE
        ═══════════════════════════════════════════ */
        .theme-toggle {
          display: inline-flex; align-items: center; justify-content: center;
          width: 36px; height: 36px; border-radius: 10px;
          border: 1.5px solid #e0d4fc;
          background: #f8f5ff; color: #7c3aed;
          cursor: pointer; transition: all 0.22s;
          flex-shrink: 0;
        }
        .theme-toggle:hover { background: #ede9fe; transform: scale(1.08); }
        html.dark .theme-toggle { background: rgba(124,58,237,0.15); border-color: rgba(167,139,250,0.3); color: #c4b5fd; }
        html.dark .theme-toggle:hover { background: rgba(124,58,237,0.3); }

        /* ═══════════════════════════════════════════
           HAMBURGER BUTTON
        ═══════════════════════════════════════════ */
        .hamburger-btn {
          display: inline-flex; align-items: center; justify-content: center;
          width: 40px; height: 40px; border-radius: 10px;
          border: 1.5px solid rgba(124,58,237,0.15);
          background: rgba(124,58,237,0.05);
          color: #7c3aed;
          cursor: pointer;
          transition: all 0.22s;
          flex-shrink: 0;
        }
        .hamburger-btn:hover { background: rgba(124,58,237,0.12); border-color: rgba(124,58,237,0.3); }
        html.dark .hamburger-btn { 
          background: rgba(124,58,237,0.12); 
          border-color: rgba(167,139,250,0.25); 
          color: #c4b5fd; 
        }
        html.dark .hamburger-btn:hover { background: rgba(124,58,237,0.25); }

        /* ═══════════════════════════════════════════
           LOGIN / LOGOUT BUTTONS
        ═══════════════════════════════════════════ */
        .btn-login {
          background: linear-gradient(135deg, #7c3aed, #9333ea);
          color: #fff;
          padding: 8px 18px;
          border-radius: 999px;
          font-size: 0.85rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.22s;
          box-shadow: 0 2px 8px rgba(124,58,237,0.25);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
        }
        .btn-login:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(124,58,237,0.4); }
        html.dark .btn-login { background: linear-gradient(135deg, #6d28d9, #9333ea); }

        .btn-logout {
          background: #fef2f2;
          color: #dc2626;
          padding: 7px 14px;
          border-radius: 999px;
          font-size: 0.85rem;
          font-weight: 600;
          border: 1.5px solid #fecaca;
          cursor: pointer;
          transition: all 0.22s;
          white-space: nowrap;
        }
        .btn-logout:hover { background: #fee2e2; border-color: #f87171; }
        html.dark .btn-logout { background: rgba(220,38,38,0.1); border-color: rgba(220,38,38,0.3); color: #f87171; }

        /* ═══════════════════════════════════════════
           MOBILE BACKDROP
        ═══════════════════════════════════════════ */
        .mobile-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(4px);
          z-index: 999;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* ═══════════════════════════════════════════
           MOBILE DRAWER
        ═══════════════════════════════════════════ */
        .mobile-drawer {
          position: absolute;
          top: 100%;
          left: 0; right: 0;
          background: #fff;
          border-bottom: 1px solid rgba(124,58,237,0.1);
          box-shadow: 0 16px 40px rgba(124,58,237,0.12);
          z-index: 1001;
          overflow: hidden;
          animation: slideDown 0.28s cubic-bezier(0.4,0,0.2,1);
        }
        html.dark .mobile-drawer {
          background: #12121f;
          border-bottom-color: rgba(124,58,237,0.2);
          box-shadow: 0 16px 40px rgba(0,0,0,0.5);
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ═══════════════════════════════════════════
           MOBILE NAV ITEMS
        ═══════════════════════════════════════════ */
        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px 20px;
          font-size: 0.9375rem;
          font-weight: 500;
          color: #374151;
          text-decoration: none;
          border-radius: 10px;
          margin: 0 8px;
          transition: background 0.18s, color 0.18s;
        }
        .mobile-nav-link:hover,
        .mobile-nav-link.active {
          background: rgba(124,58,237,0.08);
          color: #7c3aed;
          font-weight: 600;
        }
        html.dark .mobile-nav-link { color: #cbd5e1; }
        html.dark .mobile-nav-link:hover,
        html.dark .mobile-nav-link.active {
          background: rgba(124,58,237,0.18);
          color: #c4b5fd;
        }

        .mobile-nav-icon {
          font-size: 1.1rem;
          width: 26px;
          text-align: center;
          flex-shrink: 0;
        }

        .mobile-divider {
          height: 1px;
          background: rgba(124,58,237,0.1);
          margin: 8px 16px;
        }
        html.dark .mobile-divider { background: rgba(124,58,237,0.2); }

        .mobile-btn-login {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          background: linear-gradient(135deg, #7c3aed, #9333ea);
          color: #fff;
          padding: 13px 20px;
          font-size: 0.9375rem;
          font-weight: 600;
          border-radius: 12px;
          margin: 0 8px;
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .mobile-btn-login:hover { opacity: 0.9; }

        .mobile-btn-logout {
          display: flex; align-items: center; gap: 10px;
          background: rgba(220,38,38,0.06);
          color: #dc2626;
          padding: 13px 20px;
          font-size: 0.9375rem;
          font-weight: 600;
          border: none;
          border-radius: 10px;
          margin: 0 8px;
          width: calc(100% - 16px);
          cursor: pointer;
          transition: background 0.18s;
        }
        .mobile-btn-logout:hover { background: rgba(220,38,38,0.12); }
        html.dark .mobile-btn-logout { color: #f87171; background: rgba(220,38,38,0.08); }
        html.dark .mobile-btn-logout:hover { background: rgba(220,38,38,0.18); }

        /* ═══════════════════════════════════════════
           USER AVATAR CHIP (desktop)
        ═══════════════════════════════════════════ */
        .user-chip {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(124,58,237,0.07);
          border: 1px solid rgba(124,58,237,0.15);
          border-radius: 999px;
          padding: 4px 10px 4px 4px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #7c3aed;
        }
        html.dark .user-chip { background: rgba(124,58,237,0.18); border-color: rgba(167,139,250,0.3); color: #c4b5fd; }
        .user-avatar {
          width: 26px; height: 26px; border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: #fff; font-size: 0.75rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
        }

        /* ═══════════════════════════════════════════
           MOBILE USER INFO
        ═══════════════════════════════════════════ */
        .mobile-user-info {
          display: flex; align-items: center; gap: 12px;
          padding: 14px 20px;
          background: rgba(124,58,237,0.04);
          margin: 8px;
          border-radius: 12px;
          border: 1px solid rgba(124,58,237,0.1);
        }
        html.dark .mobile-user-info {
          background: rgba(124,58,237,0.1);
          border-color: rgba(124,58,237,0.2);
        }
        .mobile-avatar {
          width: 38px; height: 38px; border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: #fff; font-size: 1rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .mobile-user-name {
          font-size: 0.925rem; font-weight: 700; color: #1e293b;
          line-height: 1.2;
        }
        html.dark .mobile-user-name { color: #f1f5f9; }
        .mobile-user-role {
          font-size: 0.78rem; color: #7c3aed; font-weight: 500;
          text-transform: capitalize; margin-top: 2px;
        }
        html.dark .mobile-user-role { color: #c4b5fd; }
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
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '68px' }}>

            {/* ── Brand Logo ── */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', flexShrink: 0 }}
              onClick={() => setIsMenuOpen(false)}>
              <img
                src={logoImage}
                alt="IftiinHub Logo"
                style={{ height: '44px', width: 'auto', objectFit: 'contain', transition: 'transform 0.3s' }}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
              />
              <span className="brand-text">IftiinHub</span>
            </Link>

            {/* ── Desktop Menu ── */}
            <div className="hidden md:flex" style={{ alignItems: 'center', gap: '4px' }}>
              <a href="/"        className={`nav-link${isActive('/')        ? ' active' : ''}`}>Home</a>
              <a href="/courses" className={`nav-link${isActive('/courses') ? ' active' : ''}`}>Courses</a>
              <a href="/about"   className={`nav-link${isActive('/about')   ? ' active' : ''}`}>About</a>
              <a href="/contact" className={`nav-link${isActive('/contact') ? ' active' : ''}`}>Contact</a>

              <div style={{ width: '1px', height: '20px', background: 'rgba(124,58,237,0.2)', margin: '0 8px' }} />

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
                    <Link to="/admin-dashboard" className={`nav-link${isActive('/admin-dashboard') ? ' active' : ''}`}>⚙️ Admin</Link>
                  )}
                  {user.role === 'student' && (
                    <Link to="/student-dashboard" className={`nav-link${isActive('/student-dashboard') ? ' active' : ''}`}>🎓 Dashboard</Link>
                  )}
                  <Link to="/profile" className={`nav-link${isActive('/profile') ? ' active' : ''}`}>👤 Profile</Link>
                  <button onClick={handleLogout} className="btn-logout">Logout</button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Link to="/student-register" className={`nav-link${isActive('/student-register') ? ' active' : ''}`}>✏️ Register</Link>
                  <Link to="/login" className="btn-login">🔑 Login</Link>
                </div>
              )}

              {/* ── Dark / Light Toggle ── */}
              <button
                className="theme-toggle"
                style={{ marginLeft: '6px' }}
                onClick={() => setDark(d => !d)}
                aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                title={dark ? 'Light mode' : 'Dark mode'}
              >
                {dark ? <SunIcon /> : <MoonIcon />}
              </button>
            </div>

            {/* ── Mobile: theme toggle + hamburger ── */}
            <div className="flex md:hidden" style={{ alignItems: 'center', gap: '8px' }}>
              <button
                className="theme-toggle"
                onClick={() => setDark(d => !d)}
                aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {dark ? <SunIcon /> : <MoonIcon />}
              </button>
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
          <div id="mobile-menu" className="mobile-drawer md:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
            <div style={{ padding: '8px 0 16px' }}>

              {/* User info (if logged in) */}
              {user && (
                <div className="mobile-user-info">
                  <span className="mobile-avatar">
                    {(user.name || user.email || 'U')[0].toUpperCase()}
                  </span>
                  <div>
                    <div className="mobile-user-name">{user.name || user.email?.split('@')[0]}</div>
                    <div className="mobile-user-role">{user.role}</div>
                  </div>
                </div>
              )}

              {/* Main links */}
              <div style={{ marginTop: '4px' }}>
                <Link to="/"        className={`mobile-nav-link${isActive('/')        ? ' active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  <span className="mobile-nav-icon">🏠</span> Home
                </Link>
                <Link to="/courses" className={`mobile-nav-link${isActive('/courses') ? ' active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  <span className="mobile-nav-icon">📚</span> Courses
                </Link>
                <Link to="/about"   className={`mobile-nav-link${isActive('/about')   ? ' active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  <span className="mobile-nav-icon">ℹ️</span> About
                </Link>
                <Link to="/contact" className={`mobile-nav-link${isActive('/contact') ? ' active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  <span className="mobile-nav-icon">📩</span> Contact
                </Link>
              </div>

              <div className="mobile-divider" />

              {/* Auth links */}
              {user ? (
                <div>
                  {user.role === 'admin' && (
                    <Link to="/admin-dashboard" className={`mobile-nav-link${isActive('/admin-dashboard') ? ' active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                      <span className="mobile-nav-icon">⚙️</span> Admin Dashboard
                    </Link>
                  )}
                  {user.role === 'student' && (
                    <Link to="/student-dashboard" className={`mobile-nav-link${isActive('/student-dashboard') ? ' active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                      <span className="mobile-nav-icon">🎓</span> My Dashboard
                    </Link>
                  )}
                  <Link to="/profile" className={`mobile-nav-link${isActive('/profile') ? ' active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                    <span className="mobile-nav-icon">👤</span> Profile
                  </Link>
                  <div style={{ marginTop: '4px' }}>
                    <button onClick={handleLogout} className="mobile-btn-logout">
                      <span className="mobile-nav-icon">🚪</span> Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '4px 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <Link to="/student-register" className={`mobile-nav-link${isActive('/student-register') ? ' active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                    <span className="mobile-nav-icon">✏️</span> Register as Student
                  </Link>
                  <Link to="/login" className="mobile-btn-login" onClick={() => setIsMenuOpen(false)}>
                    🔑 Login to your account
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
