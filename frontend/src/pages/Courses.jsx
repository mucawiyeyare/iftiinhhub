import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import PriceLabel from '../components/PriceLabel';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Courses = () => {
  const { user } = useAuth();
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [unassignedCourses, setUnassignedCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('assigned'); // 'assigned', 'unassigned', 'all'

  useEffect(() => {
    fetchCourses();
  }, [user]);

  const fetchCourses = async () => {
    try {
      if (user && user.role === 'student') {
        // For students, fetch assigned and unassigned courses separately
        const [assignedRes, unassignedRes] = await Promise.all([
          axios.get('/courses/student/assigned'),
          axios.get('/courses/student/unassigned')
        ]);
        
        setAssignedCourses(assignedRes.data);
        setUnassignedCourses(unassignedRes.data);
        setAllCourses([...assignedRes.data, ...unassignedRes.data]);
      } else {
        // For admins and non-logged users, fetch all courses
        const coursesRes = await axios.get('/courses');
        setAllCourses(coursesRes.data);
        setAssignedCourses([]);
        setUnassignedCourses(coursesRes.data);
      }
    } catch (error) {
      setError('Failed to fetch courses');
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter courses based on search and filters
  const filterCourses = (courses) => {
    return courses.filter(course => {
      // Defensively check if course is not null to prevent runtime errors
      if (!course) return false;
      const matchesSearch = (course.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (course.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (course.instructor || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  };

  // Get courses to display based on active tab
  const getDisplayCourses = () => {
    // For admins and visitors, always show all courses
    if (!user || user.role !== 'student') {
      return filterCourses(allCourses);
    }
    switch (activeTab) {
      case 'assigned':
        return filterCourses(assignedCourses);
      case 'unassigned':
        return filterCourses(unassignedCourses);
      case 'all':
      default:
        return filterCourses(allCourses);
    }
  };

  const displayCourses = getDisplayCourses();


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-700">Loading courses...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <div className="text-xl text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">🎓 IftiinHub</h1>
            <p className="text-xl text-blue-100 mb-6">
              Discover, Learn, and Excel with Our Premium Courses
            </p>
            <div className="flex justify-center space-x-4">
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                {allCourses.length} Total Courses
              </span>
              {user && user.role === 'student' && (
                <>
                  <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                    {assignedCourses.length} Assigned
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                    {unassignedCourses.length} Available
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Tab Navigation for Students */}
        {user && user.role === 'student' && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setActiveTab('assigned')}
                className={`px-6 py-3 rounded-lg font-medium transition duration-200 ${
                  activeTab === 'assigned'
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📚 My Courses ({assignedCourses.length})
              </button>
              <button
                onClick={() => setActiveTab('unassigned')}
                className={`px-6 py-3 rounded-lg font-medium transition duration-200 ${
                  activeTab === 'unassigned'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🛒 Available Courses ({unassignedCourses.length})
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-6 py-3 rounded-lg font-medium transition duration-200 ${
                  activeTab === 'all'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🌟 All Courses ({allCourses.length})
              </button>
            </div>
            
            {/* Tab Description */}
            <div className="text-sm text-gray-600">
              {activeTab === 'assigned' && (
                <p>📖 Courses you are enrolled in and can access immediately</p>
              )}
              {activeTab === 'unassigned' && (
                <p>🛒 Discover new courses - Add to cart and contact admin for enrollment</p>
              )}
              {activeTab === 'all' && (
                <p>🌈 Browse all available courses in our platform</p>
              )}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>


            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                }}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            {user && user.role === 'admin' ? (
              <>
                <span className="mr-3">⚙️</span>
                Manage Courses ({displayCourses.length})
              </>
            ) : user && user.role === 'student' ? (
              activeTab === 'assigned' ? (
                <>
                  <span className="mr-3">📚</span>
                  My Enrolled Courses ({displayCourses.length})
                </>
              ) : activeTab === 'unassigned' ? (
                <>
                  <span className="mr-3">🛒</span>
                  Available Courses ({displayCourses.length})
                </>
              ) : (
                <>
                  <span className="mr-3">🌟</span>
                  All Courses ({displayCourses.length})
                </>
              )
            ) : (
              <>
                <span className="mr-3">🎓</span>
                All Courses ({displayCourses.length})
              </>
            )}
          </h2>

          {displayCourses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">
                {activeTab === 'assigned' ? '📚' : activeTab === 'unassigned' ? '🛒' : '🎓'}
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {activeTab === 'assigned' && 'No enrolled courses yet'}
                {activeTab === 'unassigned' && 'No available courses found'}
                {activeTab === 'all' && 'No courses found'}
                {!user || user.role !== 'student' && 'No courses found'}
              </h3>
              <p className="text-gray-500">
                {activeTab === 'assigned' && 'Contact your administrator to get enrolled in courses'}
                {activeTab === 'unassigned' && 'Try adjusting your search filters'}
                {activeTab === 'all' && 'Try adjusting your search filters'}
                {!user || user.role !== 'student' && 'Try adjusting your search filters'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayCourses.map(course => {
                const isEnrolled = user?.role === 'student' && assignedCourses.some(c => c?._id === course?._id);
                const isAdmin = user?.role === 'admin';
                const linkTo = `/courses/${course._id}/learn`;

                let buttonText = 'Preview Course';
                let buttonClass = 'bg-indigo-600 hover:bg-indigo-700';

                if (isAdmin) {
                  buttonText = 'Manage Course';
                  buttonClass = 'bg-blue-600 hover:bg-blue-700';
                } else if (isEnrolled) {
                  buttonText = 'Start Learning';
                  buttonClass = 'bg-green-600 hover:bg-green-700';
                }

                const totalVideos = (course.videos?.length || 0) + (course.video1 ? 1 : 0) + (course.video2 ? 1 : 0);
                const totalSections = course.sections?.length || 0;

                return (
                  <div key={course._id} className="bg-white rounded-xl shadow-md ring-1 ring-gray-100 overflow-hidden transform hover:-translate-y-1 hover:shadow-xl transition-all duration-200 flex flex-col">
                    <Link to={linkTo}>
                      <img 
                        src={course.imageUrl || 'https://via.placeholder.com/400x225'} 
                        alt={course.name} 
                        className="h-44 w-full object-cover"
                      />
                    </Link>
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="flex-grow">
                        <h3 className="mt-1 text-lg font-semibold text-gray-900 line-clamp-2">{course.name}</h3>
                        <p className="mt-0.5 text-xs text-gray-500">By {course.instructor}</p>
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{(course.description || '').substring(0, 90)}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500 mt-3 border-t border-gray-100 pt-3">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                            {totalSections} {totalSections === 1 ? 'Section' : 'Sections'}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                            {totalVideos} {totalVideos === 1 ? 'Video' : 'Videos'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-3">
                          <PriceLabel price={course.price} originalPrice={course.originalPrice} size="md" />
                        </div>
                        <Link to={linkTo} className={`w-full flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-md text-white transition-colors ${buttonClass}`}>
                          {buttonText}
                        </Link>
                      </div>
                    </div>
                  </div>
                )})}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;