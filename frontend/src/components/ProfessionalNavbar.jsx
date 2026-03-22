import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProfessionalNavbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className={`font-bold text-xl transition-colors duration-300 ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}>
              CodeHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`font-medium transition-all duration-200 hover:text-blue-600 ${
                isActive('/') 
                  ? 'text-blue-600' 
                  : isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              Home
            </Link>
            <Link
              to="/courses"
              className={`font-medium transition-all duration-200 hover:text-blue-600 ${
                isActive('/courses') 
                  ? 'text-blue-600' 
                  : isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              Courses
            </Link>
            <Link
              to="/about"
              className={`font-medium transition-all duration-200 hover:text-blue-600 ${
                isActive('/about') 
                  ? 'text-blue-600' 
                  : isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              About
            </Link>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className={`font-medium transition-all duration-200 hover:text-blue-600 ${
                      isActive('/admin/dashboard') 
                        ? 'text-blue-600' 
                        : isScrolled ? 'text-gray-700' : 'text-white'
                    }`}
                  >
                    Admin Dashboard
                  </Link>
                )}
                {user.role === 'student' && (
                  <Link
                    to="/student/dashboard"
                    className={`font-medium transition-all duration-200 hover:text-blue-600 ${
                      isActive('/student/dashboard') 
                        ? 'text-blue-600' 
                        : isScrolled ? 'text-gray-700' : 'text-white'
                    }`}
                  >
                    My Dashboard
                  </Link>
                )}
                <Link
                  to="/profile"
                  className={`font-medium transition-all duration-200 hover:text-blue-600 ${
                    isActive('/profile') 
                      ? 'text-blue-600' 
                      : isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className={`font-medium transition-all duration-200 hover:text-red-600 ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
                >
                  Logout
                </button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className={`font-medium transition-all duration-200 hover:text-blue-600 ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md rounded-lg mt-2 shadow-lg border border-gray-200">
            <div className="px-4 py-2 space-y-2">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive('/') 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/courses"
                className={`block px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive('/courses') 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Courses
              </Link>
              <Link
                to="/about"
                className={`block px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive('/about') 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      className={`block px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                        isActive('/admin/dashboard') 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  {user.role === 'student' && (
                    <Link
                      to="/student/dashboard"
                      className={`block px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                        isActive('/student/dashboard') 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      My Dashboard
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className={`block px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isActive('/profile') 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default ProfessionalNavbar;
