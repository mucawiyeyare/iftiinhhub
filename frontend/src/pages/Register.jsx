import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminLayout from '../components/AdminLayout';
import PageTitle from '../components/PageTitle';

const adminFeatures = [
  { icon: '👥', text: 'Manage platform users' },
  { icon: '🔐', text: 'Assign roles & permissions' },
  { icon: '🛡️', text: 'Secure access control' },
  { icon: '📈', text: 'Monitor system activity' },
  { icon: '⚙️', text: 'Configure application settings' },
];

const Register = () => {
  const { user, createUser } = useAuth();
  const navigate = useNavigate();
  
  // Only admins can access this page
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
          <div className="text-5xl mb-4">⛔</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">Only administrators can register new users.</p>
          <Link 
            to="/login" 
            className="inline-block w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold px-4 py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition shadow-md"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const result = await createUser(
        formData.name,
        formData.email,
        formData.password,
        formData.role
      );
      if (result.success) {
        navigate('/admin-dashboard', {
          replace: true,
          state: {
            toast: `User ${formData.name} (${formData.role}) created successfully`,
            highlight: 'users'
          }
        });
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout activeTab="register">
      <PageTitle title="Register User - IFTIINHUB" />
      
      <div className="min-h-screen bg-gray-50 flex items-start justify-center p-4 py-8 lg:py-12">
        {/* ── Outer card ── */}
        <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          
          {/* ── LEFT: Promo panel (desktop only) ── */}
          <aside className="hidden md:flex flex-col justify-center bg-gradient-to-br from-purple-800 via-purple-700 to-indigo-800 text-white px-10 py-12 md:w-2/5 lg:w-1/2 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            <div className="relative z-10 mb-8">
              <div className="text-5xl mb-4">⚙️</div>
              <h2 className="text-3xl font-extrabold leading-tight mb-3">Admin User Registration</h2>
              <p className="text-purple-200 text-sm leading-relaxed">
                Create accounts for new students, instructors, or additional administrators. Ensure correct role assignment.
              </p>
            </div>

            <ul className="relative z-10 space-y-4 mb-10">
              {adminFeatures.map(({ icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm">
                  <span className="text-xl w-7 flex-shrink-0">{icon}</span>
                  <span className="text-purple-100 font-medium">{text}</span>
                </li>
              ))}
            </ul>
          </aside>

          {/* ── RIGHT: Registration form ── */}
          <main className="flex-1 px-6 py-8 sm:px-8 lg:px-12 bg-white flex flex-col justify-center">
            
            {/* Mobile header */}
            <div className="md:hidden text-center mb-8">
              <div className="text-4xl mb-2">⚙️</div>
              <h1 className="text-2xl font-extrabold text-gray-900">Admin Registration</h1>
              <p className="text-gray-500 text-sm mt-1">Create new users manually</p>
            </div>

            {/* Desktop heading */}
            <div className="hidden md:block mb-8">
              <h1 className="text-2xl font-extrabold text-gray-900">Register New User</h1>
              <p className="text-gray-500 text-sm mt-1">Fill out the details to provision a new account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">👤</span>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    placeholder="e.g. Abdullahi Hassan"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">✉️</span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    placeholder="user@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-1">
                  Account Role <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">🆔</span>
                  <select
                    id="role"
                    name="role"
                    required
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition appearance-none"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="student">Student</option>
                    <option value="admin">Administrator</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">🔒</span>
                    <input
                      id="password"
                      name="password"
                      type={showPass ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      placeholder="Min. 6 chars"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">🔒</span>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPass ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition p-1"
                      aria-label="Toggle password visibility"
                    >
                      {showPass ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-base shadow-md hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <span>➕</span> Create User Account
                    </>
                  )}
                </button>
              </div>
              
              <div className="text-center pt-2">
                <Link 
                  to="/admin-dashboard" 
                  className="text-sm font-medium text-gray-500 hover:text-purple-600 transition"
                >
                  ← Back to Admin Dashboard
                </Link>
              </div>

            </form>
          </main>

        </div>
      </div>
    </AdminLayout>
  );
};

export default Register;

