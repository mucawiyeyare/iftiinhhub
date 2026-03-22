import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await axios.get('/enrollments/student');
      setEnrollments(response.data);
    } catch (error) {
      setError('Failed to fetch enrollments');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchEnrollments}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition duration-200"
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
      label: 'Student Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
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
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white p-2 rounded-lg shadow-lg border border-gray-200"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-purple-950 bg-opacity-60 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Professional Sidebar */}
      <aside className={`w-72 bg-white shadow-lg min-h-screen fixed left-0 top-0 z-40 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Brand Header */}
        <div className="px-6 py-8 border-b border-purple-500 bg-purple-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link
                to="/"
                className="flex items-center p-2 text-purple-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200 group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5 text-white group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h2 className="text-xl font-bold text-white tracking-wide">STUDENT DASHBOARD</h2>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6">
          <div className="space-y-1">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={item.id === 'profile' ? () => window.location.href = '/profile' : () => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 group ${
                  activeTab === item.id && item.id !== 'profile'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={`w-5 h-5 mr-3 ${
                  activeTab === item.id && item.id !== 'profile' ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                }`}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
            
            {/* Browse link separate from tabs */}
            <div className="pt-4 mt-4 border-t border-gray-100">
                <Link
                  to="/courses"
                  className="w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 group text-indigo-600 hover:bg-indigo-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="w-5 h-5 mr-3 text-indigo-500">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </span>
                  <span className="font-medium">Browse Catalog</span>
                </Link>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-0 md:ml-72 min-h-screen">
        {/* Top Header */}
        <header className="bg-white shadow-sm px-8 py-4 sticky top-0 z-30 flex justify-between items-center hidden md:flex">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            {activeTab === 'overview' && 'Dashboard Overview'}
            {activeTab === 'courses' && 'Student Dashboard'}
            {activeTab === 'activity' && 'Recent Activity'}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold border border-purple-200">
               {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-tight">{user?.name || 'Student'}</p>
              <p className="text-xs text-gray-500">{user?.email || 'student@iftiinhub.com'}</p>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8 pt-20 md:pt-8">

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Welcome Section */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-lg p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
                <p className="text-purple-100 text-lg">You've enrolled in {enrollments.length} {enrollments.length === 1 ? 'course' : 'courses'}. Ready to continue your learning journey?</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center hover:shadow-md transition-shadow">
                  <div className="bg-blue-100 rounded-full p-4 mr-4 text-blue-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Courses</h3>
                    <p className="text-3xl font-extrabold text-gray-900">{enrollments.length}</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center hover:shadow-md transition-shadow">
                  <div className="bg-green-100 rounded-full p-4 mr-4 text-green-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Completed</h3>
                    <p className="text-3xl font-extrabold text-gray-900">
                      {enrollments.filter(e => e.status === 'completed').length}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center hover:shadow-md transition-shadow">
                  <div className="bg-yellow-100 rounded-full p-4 mr-4 text-yellow-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">In Progress</h3>
                    <p className="text-3xl font-extrabold text-gray-900">
                      {enrollments.filter(e => e.status === 'active').length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Enrolled Courses Preview (Up to 3) */}
              {enrollments.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Continue Learning</h3>
                    <button 
                      onClick={() => setActiveTab('courses')}
                      className="text-purple-600 font-medium hover:text-purple-800 transition-colors"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrollments.slice(0, 3).map(enrollment => {
                      const course = enrollment?.courseId;
                      if (!course) return null;
                      return (
                        <div key={enrollment._id} className="bg-white rounded-xl shadow-sm border border-gray-100 flex p-4 gap-4 hover:shadow-md transition-all cursor-pointer" onClick={() => window.location.href = `/courses/${course._id}/learn`}>
                          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                             {course.imageUrl ? (
                               <img src={course.imageUrl} alt={course.name} className="w-full h-full object-cover" />
                             ) : (
                               <div className="w-full h-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                                 {course.name.charAt(0)}
                               </div>
                             )}
                          </div>
                          <div className="flex flex-col flex-1">
                            <span className="text-xs font-semibold text-purple-600 uppercase mb-1">{course.category}</span>
                            <h4 className="font-bold text-gray-900 line-clamp-1 mb-1">{course.name}</h4>
                            <div className="mt-auto">
                               <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1">
                                <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: enrollment.status === 'completed' ? '100%' : '5%' }}></div>
                              </div>
                              <span className="text-xs text-gray-500">{enrollment.status === 'completed' ? 'Completed' : 'In Progress'}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STUDENT DASHBOARD TAB */}
          {activeTab === 'courses' && (
            <div className="animate-fadeIn">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Student Dashboard</h3>
                <span className="bg-purple-100 text-purple-800 text-sm font-semibold px-3 py-1 rounded-full">{enrollments.length}</span>
              </div>
              
              {enrollments.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <div className="bg-purple-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-5xl">🎓</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Start Your Learning Journey</h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">You haven't enrolled in any courses yet. Browse our catalog to find the perfect course for you.</p>
                  <Link
                    to="/courses"
                    className="inline-flex items-center justify-center bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition duration-200 font-medium shadow-md hover:shadow-lg"
                  >
                    Explore Courses
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {enrollments.map(enrollment => {
                    const course = enrollment?.courseId;
                    if (!course) return null;

                    const totalVideos = (course.videos?.length || 0) + (course.video1 ? 1 : 0) + (course.video2 ? 1 : 0);
                    const totalSections = course.sections?.length || 0;

                    return (
                      <div key={enrollment._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group h-full">
                        <div className="relative overflow-hidden aspect-video">
                          <Link to={`/courses/${course._id}/learn`}>
                            {course.imageUrl ? (
                              <img className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" src={course.imageUrl} alt={course.name} />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center text-white text-5xl">📚</div>
                            )}
                          </Link>
                          <div className="absolute top-3 right-3">
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-full flex items-center shadow-sm backdrop-blur-md ${
                              enrollment.status === 'completed' ? 'bg-green-500/90 text-white' : 'bg-white/90 text-gray-800'
                            }`}>
                              {enrollment.status === 'completed' ? '✅ Completed' : '🔄 In Progress'}
                            </span>
                          </div>
                        </div>

                        <div className="p-5 flex flex-col flex-grow">
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-[10px] uppercase tracking-wider font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                                {course.category}
                              </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-purple-600 transition-colors">
                              <Link to={`/courses/${course._id}/learn`}>{course.name}</Link>
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>
                          </div>

                          <div className="mb-4">
                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                              <div className="bg-purple-600 h-1.5 rounded-full transition-all" style={{ width: enrollment.status === 'completed' ? '100%' : '5%' }}></div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-gray-500 mb-5 pt-4 border-t border-gray-50">
                            <div className="flex items-center hover:text-gray-900"><span className="mr-1.5 text-gray-400">👨‍🏫</span><span className="truncate">{course.instructor}</span></div>
                            <div className="flex items-center hover:text-gray-900"><span className="mr-1.5 text-gray-400">⏱️</span><span className="truncate">{course.duration || 'Self-paced'}</span></div>
                            <div className="flex items-center hover:text-gray-900"><span className="mr-1.5 text-gray-400">📽️</span><span>{totalVideos} Videos</span></div>
                            <div className="flex items-center hover:text-gray-900"><span className="mr-1.5 text-gray-400">📑</span><span>{totalSections} Sections</span></div>
                          </div>

                          <div className="mt-auto">
                            <Link
                              to={`/courses/${course._id}/learn`}
                              className={`w-full flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 border-2 ${
                                enrollment.status === 'completed' 
                                 ? 'border-green-500 text-green-600 hover:bg-green-50'
                                 : 'border-transparent bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg'
                              }`}
                            >
                              {enrollment.status === 'completed' ? 'Review Course' : 'Continue Learning'}
                              {enrollment.status !== 'completed' && <span className="ml-2">→</span>}
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

          {/* ACTIVITY TAB */}
          {activeTab === 'activity' && (
            <div className="animate-fadeIn">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-0">
                  {enrollments.length === 0 ? (
                     <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                        <div className="bg-gray-100 rounded-full p-4 mb-4 text-gray-400 text-3xl">📭</div>
                        <p className="text-lg font-medium">No activity to show</p>
                        <p className="text-sm mt-1">Enroll in a course to see your history here.</p>
                     </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {enrollments.map(enrollment => (
                        <div key={enrollment._id} className="p-6 hover:bg-gray-50 transition-colors flex items-start space-x-4">
                          <div className="flex-shrink-0 bg-indigo-50 rounded-full p-3 mt-1">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-medium text-gray-900 border-b border-gray-100 pb-2 mb-2 inline-block w-full">
                              You enrolled in a new course
                            </p>
                            <Link to={`/courses/${enrollment.courseId?._id}/learn`} className="text-purple-600 hover:text-purple-800 font-bold block mb-1">
                               {enrollment?.courseId?.name || 'Unknown course'}
                            </Link>
                            <p className="text-sm text-gray-500 flex items-center mt-1">
                              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                              {new Date(enrollment.enrolledAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                           <div className="text-xs font-medium px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 hidden sm:block border border-blue-100">
                              System Action
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
