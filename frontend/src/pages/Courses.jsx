import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PageTitle from '../components/PageTitle';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('/courses');
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError('Failed to fetch courses');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
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
    <div className="min-h-screen bg-slate-50">
      <PageTitle title="Courses - IFTIINHUB" />

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white shadow-lg border-b border-amber-500/30">
        <div className="max-w-7xl mx-auto py-10 sm:py-14 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 tracking-tight">
            🎓 <span className="text-amber-400">IftiinHub</span> Academy Courses
          </h1>
          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto px-2">
            Discover and explore our intensive training programs and tech bootcamps.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-8 flex gap-3 items-center max-w-xl mx-auto">
          <svg className="w-5 h-5 text-slate-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search courses by name or instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-2 py-1 text-slate-900 focus:outline-none text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded-lg text-xs font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Heading */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span>📚</span> All Programs ({filteredCourses.length})
          </h2>
        </div>

        {/* Course Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <div className="text-5xl mb-3">🎓</div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">No courses found</h3>
            <p className="text-slate-500 text-sm">Try searching for a different keyword</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredCourses.map(course => (
              <div
                key={course._id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
              >
                <Link to={`/courses/${course._id}`}>
                  <div className="w-full bg-slate-900 flex items-center justify-center overflow-hidden h-52 relative">
                    <img
                      src={course.imageUrl || 'https://via.placeholder.com/400x225'}
                      alt={course.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                  </div>
                </Link>

                <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 line-clamp-2 mb-1 group-hover:text-amber-600 transition-colors">
                      {course.name}
                    </h3>
                    <p className="text-xs text-amber-700 font-semibold mb-2 flex items-center gap-1">
                      <span>👨‍🏫</span> {course.instructor || 'Eng. Abdirahman Mohamed Ibrahim'}
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {course.description || 'Master professional hands-on tech skills with practical industry curriculum.'}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100">
                    <Link
                      to={`/courses/${course._id}`}
                      className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 transition-all duration-200 shadow-sm flex items-center justify-center gap-1.5"
                    >
                      View Course Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;