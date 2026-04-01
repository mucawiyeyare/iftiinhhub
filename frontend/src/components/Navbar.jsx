import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logoImage from '../assets/iftiin.png';

/* ── Sun icon ── */
const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
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
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
);

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ── Dark mode state (persisted in localStorage) ──
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <style>{`
        /* ── Dark mode global overrides ── */
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

        /* Toggle button */
        .theme-toggle {
          display: inline-flex; align-items: center; justify-content: center;
          width: 38px; height: 38px; border-radius: 10px;
          border: 1.5px solid #e0d4fc;
          background: #f8f5ff; color: #7c3aed;
          cursor: pointer; transition: all 0.22s;
          flex-shrink: 0;
        }
        .theme-toggle:hover { background: #ede9fe; transform: scale(1.08); }
        html.dark .theme-toggle { background: rgba(124,58,237,0.15); border-color: rgba(167,139,250,0.3); color: #c4b5fd; }
        html.dark .theme-toggle:hover { background: rgba(124,58,237,0.3); }
      `}</style>

      <nav className="bg-white shadow-lg border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center -ml-2">
                <img className="h-20 w-auto" src={logoImage} alt="Logo" />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-purple-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
              <Link to="/about" className="text-purple-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">About Us</Link>
              <Link to="/contact" className="text-purple-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">Contact</Link>
              <Link to="/courses" className="text-purple-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">Courses</Link>

              {user ? (
                <div className="flex items-center space-x-4">
                  {user.role === 'admin' && (
                    <Link to="/admin-dashboard" className="text-purple-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
                      Admin Dashboard
                    </Link>
                  )}
                  {user.role === 'student' && (
                    <Link to="/student-dashboard" className="text-purple-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
                      Student Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="text-purple-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
                    Login
                  </Link>
                </div>
              )}

              {/* ── Dark / Light Toggle ── */}
              <button
                className="theme-toggle"
                onClick={() => setDark(d => !d)}
                aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                title={dark ? 'Light mode' : 'Dark mode'}
              >
                {dark ? <SunIcon /> : <MoonIcon />}
              </button>
            </div>

            {/* Mobile: toggle + hamburger */}
            <div className="md:hidden flex items-center gap-2">
              <button
                className="theme-toggle"
                onClick={() => setDark(d => !d)}
                aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {dark ? <SunIcon /> : <MoonIcon />}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link to="/" className="text-purple-700 hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/about" className="text-purple-700 hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>About Us</Link>
              <Link to="/courses" className="text-purple-700 hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Courses</Link>

              {user ? (
                <>
                  {user.role === 'admin' && (
                    <Link to="/admin-dashboard" className="text-purple-700 hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>
                      Admin Dashboard
                    </Link>
                  )}
                  {user.role === 'student' && (
                    <Link to="/student-dashboard" className="text-purple-700 hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>
                      Student Dashboard
                    </Link>
                  )}
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-red-600 hover:text-red-700 block w-full text-left px-3 py-2 rounded-md text-base font-medium">
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="text-purple-700 hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
