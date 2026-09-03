import React from 'react';
import { Link } from 'react-router-dom';
import instructorImg from '../assets/instructor.jpg';

const CourseCard = ({ course }) => {
  return (
    <div className="bg-gradient-to-br from-[#f0f9ff] via-[#e0f2fe] to-[#dbeafe] border border-[#bae6fd] rounded-2xl shadow-lg hover:shadow-2xl hover:border-blue-400 transition-all duration-300 flex flex-col group overflow-hidden">
      {/* Course Image */}
      <div className="h-52 bg-slate-900 relative overflow-hidden">
        <img
          src={course.imageUrl || instructorImg}
          alt={course.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/80 via-transparent to-transparent" />
      </div>

      {/* Card Content */}
      <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between text-slate-900">
        <div>
          {/* Title */}
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-950 mb-2 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
            {course.name}
          </h3>

          {/* Description */}
          <p className="text-slate-600 text-xs sm:text-sm mb-4 line-clamp-3 leading-relaxed">
            {course.description || 'Master modern skills with hands-on lessons and weekly mentorship.'}
          </p>

          {/* Instructor */}
          <div className="flex items-center gap-2 pb-4 border-b border-blue-200/80">
            <img
              src={instructorImg}
              alt={course.instructor || 'Instructor'}
              className="w-7 h-7 rounded-full object-cover border-2 border-blue-500 shadow-sm"
            />
            <span className="text-xs font-bold text-slate-900">
              {course.instructor || 'IftiinHub Instructor'}
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-4">
          <Link
            to={`/courses/${course._id}`}
            className="block w-full text-center px-5 py-2.5 rounded-full font-black text-xs sm:text-sm bg-[#0a1628] hover:bg-blue-600 text-white transition-all duration-200 shadow-md"
          >
            View Course →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
