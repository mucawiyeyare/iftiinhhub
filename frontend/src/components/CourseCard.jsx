import React from 'react';
import { Link } from 'react-router-dom';
import instructorImg from '../assets/instructor.jpg';

const CourseCard = ({ course, user, canAccessCourse }) => {
  const totalVideos = (course.videos?.length || 0) + (course.video1 ? 1 : 0) + (course.video2 ? 1 : 0);
  const totalSections = course.sections?.length || 0;
  // Price set to $20 as requested
  const priceDisplay = course.price && course.price !== 2 ? course.price : 20;
  const origPriceDisplay = course.originalPrice || 49;

  return (
    <div className="bg-gradient-to-br from-[#f0f9ff] via-[#e0f2fe] to-[#dbeafe] border border-[#bae6fd] rounded-2xl shadow-lg hover:shadow-2xl hover:border-blue-400 transition-all duration-300 flex flex-col group overflow-hidden">
      {/* Course Header / Image */}
      <div className="h-52 bg-slate-900 relative overflow-hidden">
        <img
          src={course.imageUrl || instructorImg}
          alt={course.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/80 via-transparent to-transparent" />

        {canAccessCourse ? (
          <div className="absolute top-3 left-3">
            <span className="bg-emerald-500 text-white px-3 py-1 text-xs font-black rounded-full shadow-lg flex items-center gap-1">
              ✓ Enrolled
            </span>
          </div>
        ) : (
          <div className="absolute top-3 left-3">
            <span className="bg-[#0a1628] text-white px-3 py-1 text-xs font-black rounded-full shadow-md flex items-center gap-1 uppercase tracking-wider border border-blue-400/30">
              ★ FEATURED
            </span>
          </div>
        )}
      </div>

      {/* Card Content (Light Blue Theme) */}
      <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between text-slate-900">
        <div>
          {/* Category Tag */}
          <div className="text-[11px] font-black tracking-widest text-blue-700 uppercase mb-2">
            ADVANCED • WEB DEVELOPMENT
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-950 mb-2 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
            {course.name}
          </h3>

          {/* Description */}
          <p className="text-slate-600 text-xs sm:text-sm mb-4 line-clamp-2 leading-relaxed font-normal">
            {course.description || 'Master modern full-stack web development with hands-on Somali language lessons and weekly mentorship.'}
          </p>

          {/* Instructor & Meta */}
          <div className="flex items-center justify-between text-xs text-slate-700 mb-4 pb-4 border-b border-blue-200/80 font-medium">
            <div className="flex items-center gap-2">
              <img src={instructorImg} alt={course.instructor || 'Eng. Mucawiye'} className="w-7 h-7 rounded-full object-cover border-2 border-blue-500 shadow-sm" />
              <span className="font-bold text-slate-900 flex items-center gap-1">
                {course.instructor || 'Eng. Mucawiye'}
                <svg className="w-3.5 h-3.5 text-blue-600 fill-blue-600" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
            <span className="text-slate-600 font-semibold">▷ {totalVideos || 120} lessons</span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-auto pt-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">${priceDisplay}</span>
                <span className="text-slate-500 line-through text-xs font-semibold">${origPriceDisplay}</span>
              </div>
              <span className="text-[10px] text-blue-800 font-bold uppercase tracking-wider">Full Access</span>
            </div>

            <Link
              to={canAccessCourse ? `/courses/${course._id}/learn` : `/courses/${course._id}`}
              className={`px-5 py-2.5 rounded-full font-black text-xs sm:text-sm transition-all duration-200 shadow-md inline-flex items-center gap-1.5 ${
                canAccessCourse
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-[#0a1628] hover:bg-blue-600 text-white hover:scale-105 shadow-blue-900/20'
              }`}
            >
              {canAccessCourse ? 'Continue →' : 'Enroll now →'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;