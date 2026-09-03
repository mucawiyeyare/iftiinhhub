import React from 'react';
import { Link } from 'react-router-dom';
import instructorImg from '../assets/instructor.jpg';

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group overflow-hidden">
      {/* Course Header / Image */}
      <div className="h-52 bg-slate-900 relative overflow-hidden">
        <img
          src={course.imageUrl || instructorImg}
          alt={course.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/60 via-transparent to-transparent" />
        
        {/* Duration Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-950/85 text-amber-400 border border-amber-500/40 backdrop-blur-md shadow-md flex items-center gap-1.5">
            <span>⏱️</span>
            <span>{course.duration || '12 Weeks'}</span>
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between text-slate-900">
        <div>
          {/* Category Tag */}
          <div className="text-[11px] font-black tracking-widest text-amber-600 uppercase mb-2">
            ACADEMY PROGRAM
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-950 mb-2 leading-snug line-clamp-2 group-hover:text-amber-600 transition-colors">
            {course.name}
          </h3>

          {/* Instructor Name & His Image */}
          <div className="flex items-center gap-2.5 pb-3 mb-3 border-b border-slate-100 font-medium">
            <img
              src={course.instructorImage || instructorImg}
              alt={course.instructor || 'Instructor'}
              className="w-8 h-8 rounded-full object-cover border-2 border-amber-500 shadow-xs flex-shrink-0"
              onError={(e) => { e.target.src = instructorImg; }}
            />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none">Instructor</p>
              <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {course.instructor || 'Eng. Abdirahman Mohamed Ibrahim'}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-slate-600 text-xs sm:text-sm mb-4 line-clamp-2 leading-relaxed font-normal">
            {course.description || 'Master modern skills with intensive hands-on lessons and mentorship.'}
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-1">
          <Link
            to={`/courses/${course._id}`}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 transition-all duration-200 shadow-sm flex items-center justify-center gap-1.5"
          >
            View Course →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;