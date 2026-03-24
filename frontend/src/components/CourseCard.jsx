import React from 'react';
import { Link } from 'react-router-dom';
import PriceLabel from './PriceLabel';

const CourseCard = ({ course, user, canAccessCourse }) => {
  const totalVideos = (course.videos?.length || 0) + (course.video1 ? 1 : 0) + (course.video2 ? 1 : 0);
  const totalSections = course.sections?.length || 0;

  return (
    <div
      className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col ${
        canAccessCourse ? 'border-l-4 border-green-500' : 'border-l-4 border-blue-500'
      }`}
    >
      {course.imageUrl && (
        <div className="h-48 bg-gray-200 relative">
          <img
            src={course.imageUrl}
            alt={course.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 text-xs font-bold rounded-full ${
              course.level === 'beginner' ? 'bg-green-500 text-white' :
              course.level === 'intermediate' ? 'bg-yellow-500 text-white' :
              'bg-red-500 text-white'
            }`}>
              {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
            </span>
          </div>
          {canAccessCourse && (
            <div className="absolute top-4 left-4">
              <span className="bg-green-500 text-white px-3 py-1 text-xs font-bold rounded-full">
                ✓ Enrolled
              </span>
            </div>
          )}
          {!canAccessCourse && user && user.role === 'student' && (
            <div className="absolute top-4 left-4">
              <span className="bg-blue-500 text-white px-3 py-1 text-xs font-bold rounded-full">
                🛒 Available
              </span>
            </div>
          )}
        </div>
      )}
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {course.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">By {course.instructor}</span>
          <PriceLabel price={course.price} originalPrice={course.originalPrice} size="md" />
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">{course.duration}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4 border-t border-gray-100 pt-4">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
            {totalSections} {totalSections === 1 ? 'Section' : 'Sections'}
          </span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            {totalVideos} {totalVideos === 1 ? 'Video' : 'Videos'}
          </span>
        </div>

        <div className="mt-auto">
          <Link
            to={canAccessCourse ? `/courses/${course._id}/learn` : `/courses/${course._id}`}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition duration-200 text-center block ${
              canAccessCourse
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
            }`}
          >
            {canAccessCourse ? 'Continue Learning →' : 'View Details & Add to Cart →'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;