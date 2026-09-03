import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import PageTitle from '../components/PageTitle';
import IftiinCertificate from '../components/IftiinCertificate';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState('');
  const [previewCert, setPreviewCert] = useState(null);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [enrollRes, certRes] = await Promise.all([
        axios.get('/enrollments/student').catch(() => ({ data: [] })),
        axios.get('/certificates/my-certificates').catch(() => ({ data: [] }))
      ]);
      const rawCerts = certRes.data || [];
      const currentEmail = user?.email?.toLowerCase().trim();
      const currentUserId = user?._id;
      const myOwnCerts = rawCerts.filter(c => {
        if (!c) return false;
        const matchesUser = currentUserId && c.userId && String(c.userId) === String(currentUserId);
        const matchesEmail = currentEmail && c.studentEmail && c.studentEmail.toLowerCase().trim() === currentEmail;
        return matchesUser || matchesEmail;
      });
      setEnrollments(enrollRes.data || []);
      setCertificates(myOwnCerts);
    } catch (err) {
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (certId) => {
    const url = `${window.location.origin}/verify-certificate?id=${encodeURIComponent(certId)}`;
    navigator.clipboard.writeText(url);
    setCopiedId(certId);
    setTimeout(() => setCopiedId(''), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mb-4"></div>
          <p className="text-slate-600 font-medium">Loading your student dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center border border-slate-200">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="bg-amber-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl hover:bg-amber-400 transition duration-200 shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const menuItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: 'courses',
      label: 'My Courses',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      id: 'certificates',
      label: 'My Certificates',
      badge: certificates.length > 0 ? certificates.length : null,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      )
    },
    {
      id: 'activity',
      label: 'Recent Activity',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <PageTitle title="Student Dashboard - IftiinHub" />

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-amber-500 shadow-sm h-14 flex items-center px-4">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="mr-3 p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-base font-bold text-slate-900 truncate">Student Dashboard</h1>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Brand Sidebar */}
      <aside className={`w-72 bg-white shadow-xl min-h-screen fixed left-0 top-0 z-40 overflow-y-auto transform transition-transform duration-300 ease-in-out border-r border-slate-200 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Brand Header */}
        <div className="px-6 py-6 border-b-2 border-amber-500 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-slate-950">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link
                to="/"
                className="flex items-center p-2 text-slate-900 hover:bg-white/30 rounded-xl transition duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
                title="Back to Homepage"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div>
                <h2 className="text-lg font-black tracking-wide text-slate-950">STUDENT HUB</h2>
                <p className="text-[11px] font-bold text-slate-900/80 uppercase tracking-wider">IftiinHub Academy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6">
          <div className="space-y-1.5">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={item.id === 'profile' ? () => navigate('/profile') : () => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-xl transition-all duration-200 group ${
                  activeTab === item.id && item.id !== 'profile'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-slate-700 hover:bg-amber-50 hover:text-amber-900 font-semibold'
                }`}
              >
                <div className="flex items-center">
                  <span className={`w-5 h-5 mr-3 ${
                    activeTab === item.id && item.id !== 'profile' ? 'text-slate-950' : 'text-slate-400 group-hover:text-amber-700'
                  }`}>
                    {item.icon}
                  </span>
                  <span className="text-sm">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    activeTab === item.id ? 'bg-slate-950 text-white' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
            
            {/* Quick Link to Catalog & Verify */}
            <div className="pt-4 mt-4 border-t border-slate-100 space-y-1">
              <Link
                to="/courses"
                className="w-full flex items-center px-4 py-2.5 text-left rounded-xl transition-all duration-200 group text-amber-800 hover:bg-amber-50 font-semibold text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="w-5 h-5 mr-3 text-amber-600">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </span>
                <span>Browse All Courses</span>
              </Link>
              <Link
                to="/verify-certificate"
                className="w-full flex items-center px-4 py-2.5 text-left rounded-xl transition-all duration-200 group text-emerald-800 hover:bg-emerald-50 font-semibold text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="w-5 h-5 mr-3 text-emerald-600">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </span>
                <span>Public Certificate Portal</span>
              </Link>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-0 md:ml-72 min-h-screen overflow-x-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-30 justify-between items-center hidden md:flex shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {activeTab === 'overview' && 'Dashboard Overview'}
            {activeTab === 'courses' && 'My Courses'}
            {activeTab === 'certificates' && 'My Certificates & Credentials'}
            {activeTab === 'activity' && 'Recent Activity'}
          </h2>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-100 border border-amber-300 rounded-full flex items-center justify-center text-amber-900 font-black text-base shadow-sm">
               {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 leading-tight">{user?.name || 'Student'}</p>
              <p className="text-xs text-slate-500">{user?.email || 'student@iftiinhub.com'}</p>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 pt-16 md:pt-8 max-w-7xl mx-auto">

          {/* ═══════════════════════════════════════════
             OVERVIEW TAB
          ═══════════════════════════════════════════ */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 rounded-3xl shadow-xl p-8 sm:p-10 text-slate-950 relative overflow-hidden">
                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 rounded-full bg-black/10 text-slate-950 text-xs font-bold uppercase tracking-wider mb-3">
                    Student Learning Portal
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-black mb-2">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
                  <p className="text-slate-950/80 text-base sm:text-lg max-w-2xl font-medium">
                    You're enrolled in {enrollments.length} {enrollments.length === 1 ? 'course' : 'courses'} and have earned {certificates.length} verified {certificates.length === 1 ? 'certificate' : 'certificates'}.
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 flex items-center hover:shadow-md transition">
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mr-4 text-blue-700">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Enrolled Courses</h3>
                    <p className="text-3xl font-black text-slate-900">{enrollments.length}</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 flex items-center hover:shadow-md transition">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mr-4 text-emerald-700">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">My Certificates</h3>
                    <p className="text-3xl font-black text-slate-900">{certificates.length}</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 flex items-center hover:shadow-md transition">
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mr-4 text-amber-700">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">In Progress</h3>
                    <p className="text-3xl font-black text-slate-900">
                      {enrollments.filter(e => e.status === 'active').length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Certificates Quick Section */}
              {certificates.length > 0 && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-amber-950 flex items-center gap-2">
                        📜 Your Official Verified Certificates
                      </h3>
                      <p className="text-xs text-amber-800 mt-0.5">Instant proof of program completion and professional mastery</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('certificates')}
                      className="text-amber-800 font-bold hover:text-amber-950 transition text-sm flex items-center gap-1"
                    >
                      View All ({certificates.length}) →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {certificates.slice(0, 2).map((cert) => (
                      <div key={cert._id} className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                              {cert.certificateId}
                            </span>
                            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              ✓ Verified
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-base line-clamp-1 mb-1">{cert.courseTitle}</h4>
                          <p className="text-xs text-slate-500">
                            Issued on {new Date(cert.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} • {cert.grade || 'Passed'}
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                          <Link
                            to={`/verify-certificate?id=${encodeURIComponent(cert.certificateId)}`}
                            className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl text-center transition shadow-xs"
                          >
                            View & Print Certificate
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Enrolled Courses Preview */}
              {enrollments.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-900">Continue Learning</h3>
                    <button 
                      onClick={() => setActiveTab('courses')}
                      className="text-amber-700 font-bold hover:text-amber-900 transition-colors text-sm"
                    >
                      View All Courses →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrollments.slice(0, 3).map(enrollment => {
                      const course = enrollment?.courseId;
                      if (!course) return null;

                      const matchingCert = certificates.find(c => 
                        (c.courseId && String(c.courseId) === String(course._id)) ||
                        (c.courseTitle && course.name && (
                          c.courseTitle.toLowerCase().includes(course.name.toLowerCase()) ||
                          course.name.toLowerCase().includes(c.courseTitle.toLowerCase())
                        ))
                      );

                      return (
                        <div key={enrollment._id} className="bg-white rounded-2xl shadow-sm border border-slate-200/80 flex p-4 gap-4 hover:shadow-md transition cursor-pointer" onClick={() => navigate(`/courses/${course._id}/learn`)}>
                          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-100">
                             {course.imageUrl ? (
                               <img src={course.imageUrl} alt={course.name} className="w-full h-full object-cover" />
                             ) : (
                               <div className="w-full h-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black text-xl">
                                 {course.name.charAt(0)}
                                </div>
                             )}
                          </div>
                          <div className="flex flex-col flex-1">
                            <h4 className="font-bold text-slate-900 line-clamp-1 mb-1">{course.name}</h4>
                            <div className="mt-auto">
                              <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1.5">
                                <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: enrollment.status === 'completed' ? '100%' : '15%' }}></div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-500">{enrollment.status === 'completed' ? 'Completed' : 'In Progress'}</span>
                                {matchingCert && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPreviewCert(matchingCert);
                                    }}
                                    className="text-[11px] font-bold text-amber-700 hover:text-amber-900 underline flex items-center gap-0.5 cursor-pointer"
                                  >
                                    📜 Certificate
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════
             MY COURSES TAB
          ═══════════════════════════════════════════ */}
          {activeTab === 'courses' && (
            <div className="animate-fadeIn">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Enrolled Courses</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Access your course videos, training modules, and materials</p>
                </div>
                <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
                  {enrollments.length} Total
                </span>
              </div>
              
              {enrollments.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-12 text-center">
                  <div className="bg-amber-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-200 text-5xl">
                    🎓
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Start Your Learning Journey</h3>
                  <p className="text-slate-500 mb-8 max-w-md mx-auto text-sm">You haven't enrolled in any courses yet. Browse our hands-on professional tracks to get started.</p>
                  <Link
                    to="/courses"
                    className="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-400 text-slate-950 px-8 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition"
                  >
                    Explore Courses
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {enrollments.map(enrollment => {
                    const course = enrollment?.courseId;
                    if (!course) return null;

                    const matchingCert = certificates.find(c => 
                      (c.courseId && String(c.courseId) === String(course._id)) ||
                      (c.courseTitle && course.name && (
                        c.courseTitle.toLowerCase().includes(course.name.toLowerCase()) ||
                        course.name.toLowerCase().includes(c.courseTitle.toLowerCase())
                      ))
                    );

                    const totalVideos = (course.videos?.length || 0) + (course.video1 ? 1 : 0) + (course.video2 ? 1 : 0);
                    const totalSections = course.sections?.length || 0;

                    return (
                      <div key={enrollment._id} className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group h-full">
                        <div className="relative overflow-hidden aspect-video">
                          <Link to={`/courses/${course._id}/learn`}>
                            {course.imageUrl ? (
                              <img className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500" src={course.imageUrl} alt={course.name} />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 text-5xl">📚</div>
                            )}
                          </Link>
                          <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-full flex items-center shadow-sm backdrop-blur-md ${
                              enrollment.status === 'completed' ? 'bg-emerald-600 text-white' : 'bg-white/95 text-slate-800'
                            }`}>
                              {enrollment.status === 'completed' ? '✅ Completed' : '🔄 In Progress'}
                            </span>
                            {matchingCert && (
                              <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-amber-500 text-slate-950 shadow-xs">
                                📜 Certified
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-5 flex flex-col flex-grow">
                          <div className="mb-4">
                            <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 leading-tight group-hover:text-amber-700 transition">
                              <Link to={`/courses/${course._id}/learn`}>{course.name}</Link>
                            </h3>
                            <p className="text-xs text-slate-500 line-clamp-2">{course.description}</p>
                          </div>

                          <div className="mb-4">
                            <div className="w-full bg-slate-100 rounded-full h-2">
                              <div className="bg-amber-500 h-2 rounded-full transition-all" style={{ width: enrollment.status === 'completed' ? '100%' : '15%' }}></div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-slate-500 mb-5 pt-4 border-t border-slate-100">
                            <div className="flex items-center"><span className="mr-1.5">👨‍🏫</span><span className="truncate">{course.instructor}</span></div>
                            <div className="flex items-center"><span className="mr-1.5">⏱️</span><span className="truncate">{course.duration || 'Self-paced'}</span></div>
                            <div className="flex items-center"><span className="mr-1.5">📽️</span><span>{totalVideos} Videos</span></div>
                            <div className="flex items-center"><span className="mr-1.5">📑</span><span>{totalSections} Sections</span></div>
                          </div>

                          <div className="mt-auto space-y-2">
                            {/* If course completed and student has their own certificate */}
                            {matchingCert && (
                              <button
                                type="button"
                                onClick={() => setPreviewCert(matchingCert)}
                                className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-black rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 shadow-md transition duration-200 cursor-pointer"
                              >
                                <span>📜</span>
                                <span>View My Certificate ({matchingCert.certificateId})</span>
                              </button>
                            )}

                            <Link
                              to={`/courses/${course._id}/learn`}
                              className={`w-full flex items-center justify-center px-4 py-2.5 text-sm font-bold rounded-xl transition duration-200 border-2 ${
                                enrollment.status === 'completed' 
                                 ? 'border-slate-300 text-slate-700 hover:bg-slate-50'
                                 : 'border-transparent bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
                              }`}
                            >
                              {enrollment.status === 'completed' ? 'Review Course Material' : 'Continue Learning →'}
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════
             MY CERTIFICATES TAB (Requested by User)
          ═══════════════════════════════════════════ */}
          {activeTab === 'certificates' && (
            <div className="animate-fadeIn space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">My Certificates of Completion</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Official authenticated graduation credentials issued to your account</p>
                </div>
                <Link
                  to="/verify-certificate"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-xl hover:bg-emerald-100 transition shadow-xs"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open Public Verification Portal
                </Link>
              </div>

              {certificates.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-12 text-center">
                  <div className="bg-amber-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-200 text-5xl">
                    📜
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No Certificates Issued Yet</h3>
                  <p className="text-slate-500 mb-8 max-w-md mx-auto text-sm">
                    Certificates are automatically generated and awarded upon completing your training program curriculum and project evaluations.
                  </p>
                  <Link
                    to="/courses"
                    className="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-400 text-slate-950 px-8 py-3 rounded-xl font-bold shadow-md transition"
                  >
                    View Courses to Complete
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {certificates.map((cert) => (
                    <div
                      key={cert._id}
                      className="bg-white rounded-3xl border-2 border-amber-300/80 p-6 sm:p-8 shadow-sm hover:shadow-md transition flex flex-col justify-between relative overflow-hidden"
                    >
                      {/* Decorative Gold Header Bar */}
                      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500"></div>

                      <div>
                        {/* Certificate Badges */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pt-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                              {cert.certificateId}
                            </span>
                            <button
                              onClick={() => handleCopyLink(cert.certificateId)}
                              className="text-slate-400 hover:text-slate-700 p-1"
                              title="Copy verification link"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                            {copiedId === cert.certificateId && (
                              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                Copied!
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                            ✓ Verified Credential
                          </span>
                        </div>

                        {/* Title & Details */}
                        <h4 className="text-xl font-bold text-slate-900 mb-2 leading-snug">{cert.courseTitle}</h4>
                        <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <div><span className="font-semibold text-slate-800">Student Name:</span> {cert.studentName}</div>
                          <div><span className="font-semibold text-slate-800">Issue Date:</span> {new Date(cert.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                          <div><span className="font-semibold text-slate-800">Grade / Score:</span> <span className="font-bold text-amber-800">{cert.grade || 'Passed'}</span></div>
                          <div><span className="font-semibold text-slate-800">Signatory:</span> {cert.instructor || 'Eng. Mucawiye & Academic Team'}</div>
                        </div>

                        {/* Skills */}
                        {cert.skills && cert.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-6">
                            {cert.skills.map((skill, idx) => (
                              <span key={idx} className="text-[11px] font-semibold bg-white text-slate-700 px-2.5 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-2.5 pt-4 border-t border-slate-100">
                        <button
                          onClick={() => setPreviewCert(cert)}
                          className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl text-center transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View &amp; Print Certificate
                        </button>
                        <Link
                          to={`/verify-certificate?id=${encodeURIComponent(cert.certificateId)}`}
                          target="_blank"
                          className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1"
                        >
                          Verify ↗
                        </Link>
                        <button
                          onClick={() => handleCopyLink(cert.certificateId)}
                          className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                          title="Copy Link"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── LUXURY CERTIFICATE PREVIEW & PRINT MODAL ── */}
              {previewCert && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
                  <div className="bg-[#0A0E1A] border-2 border-amber-500 rounded-3xl p-4 sm:p-6 max-w-5xl w-full text-white shadow-2xl relative">
                    {/* Top Action Bar */}
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 no-print">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                        <h4 className="font-bold text-sm sm:text-base text-amber-300">
                          Official Certificate Preview ({previewCert.certificateId})
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => window.print()}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-md cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                          </svg>
                          Print / Save as PDF
                        </button>
                        <button
                          onClick={() => setPreviewCert(null)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Certificate Component */}
                    <div className="overflow-x-auto py-2">
                      <IftiinCertificate certificate={previewCert} isPrintMode={true} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════
             ACTIVITY TAB
          ═══════════════════════════════════════════ */}
          {activeTab === 'activity' && (
            <div className="animate-fadeIn">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h3>
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-0">
                  {enrollments.length === 0 ? (
                     <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                        <div className="bg-slate-100 rounded-full p-4 mb-4 text-slate-400 text-3xl">📭</div>
                        <p className="text-base font-bold text-slate-700">No activity to show</p>
                        <p className="text-xs text-slate-500 mt-1">Enroll in a course to see your learning history here.</p>
                     </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {enrollments.map(enrollment => (
                        <div key={enrollment._id} className="p-6 hover:bg-slate-50 transition flex items-start space-x-4">
                          <div className="flex-shrink-0 bg-amber-50 border border-amber-200 rounded-2xl p-3 mt-1 text-amber-700">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 mb-1">
                              Enrolled in training course
                            </p>
                            <Link to={`/courses/${enrollment.courseId?._id}/learn`} className="text-amber-800 hover:text-amber-950 font-bold block mb-1 text-base">
                               {enrollment?.courseId?.name || 'Full-Stack Web Development'}
                            </Link>
                            <p className="text-xs text-slate-400 flex items-center mt-1">
                              <svg className="w-3.5 h-3.5 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                              {new Date(enrollment.enrolledAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                          </div>
                          <div className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 hidden sm:block">
                            {enrollment.status === 'completed' ? 'Completed' : 'Enrolled'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
