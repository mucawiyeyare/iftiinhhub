import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import PageTitle from '../components/PageTitle';

const Courses = () => {
  const { user } = useAuth();
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const coursesRes = await axios.get('/courses');
      setAllCourses(Array.isArray(coursesRes.data) ? coursesRes.data : []);
    } catch (err) {
      setError('Failed to fetch courses');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = allCourses.filter(course => {
    if (!course) return false;
    const term = searchTerm.toLowerCase();
    return (
      (course.name || '').toLowerCase().includes(term) ||
      (course.description || '').toLowerCase().includes(term) ||
      (course.instructor || '').toLowerCase().includes(term)
    );
  });


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
      <PageTitle title="Courses - IFTIINHUB" />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">🎓 IftiinHub</h1>
          <p className="text-sm sm:text-xl text-blue-100 mb-4 max-w-2xl mx-auto px-2">
            Discover, Learn, and Excel with Our Premium Courses
          </p>
          <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
            {allCourses.length} Total Courses
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex gap-3 items-center">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200 text-sm"
            >
              Clear
            </button>
          )}
        </div>

        {/* Heading */}
        <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span>🎓</span> All Courses ({filteredCourses.length})
        </h2>

        {/* Course Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎓</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No courses found</h3>
            <p className="text-gray-500">Try adjusting your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredCourses.map(course => (
              <Link
                key={course._id}
                to={`/courses/${course._id}`}
                className="bg-white rounded-xl shadow-md ring-1 ring-gray-100 overflow-hidden transform hover:-translate-y-1 hover:shadow-xl transition-all duration-200 flex flex-col group"
              >
                {/* Course Image */}
                <div className="w-full bg-indigo-50 overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  <img
                    src={course.imageUrl || 'https://via.placeholder.com/400x225'}
                    alt={course.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Card Content */}
                <div className="p-4 flex flex-col flex-grow">
                  {/* Course Name */}
                  <h3 className="text-base font-bold text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                    {course.name}
                  </h3>

                  {/* Instructor */}
                  <p className="text-xs text-indigo-600 font-semibold mb-2 flex items-center gap-1">
                    <span>👨‍🏫</span> {course.instructor || 'IftiinHub Instructor'}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed flex-grow">
                    {course.description || 'Explore this course to learn new skills and advance your career.'}
                  </p>

                  {/* View Details */}
                  <div className="mt-4">
                    <span className="block w-full text-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors">
                      View Course →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;