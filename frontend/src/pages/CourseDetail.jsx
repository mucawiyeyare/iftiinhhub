import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import PageTitle from '../components/PageTitle';

const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const videoId = (match && match[2].length === 11) ? match[2] : null;
  return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
};

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`/courses/${id}`);
      setCourse(res.data);
    } catch (err) {
      setError('Failed to fetch course details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <div className="text-lg text-slate-700 font-bold">Loading course details...</div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 max-w-md">
          <div className="text-5xl mb-3">😞</div>
          <div className="text-lg font-bold text-red-600 mb-4">{error || 'Course not found'}</div>
          <Link
            to="/courses"
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition"
          >
            ← Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const allLessons = Array.isArray(course.videos) ? course.videos.filter(Boolean) : [];
  const currentVideo = allLessons[currentVideoIndex];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <PageTitle title={`${course.name} - IFTIINHUB`} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="hover:text-amber-700">Home</Link>
          <span>/</span>
          <Link to="/courses" className="hover:text-amber-700">Courses</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold truncate">{course.name}</span>
        </div>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 sm:p-8 mb-8 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Image */}
            <div className="lg:col-span-1">
              <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden bg-slate-950 shadow-md relative">
                {course.imageUrl ? (
                  <img
                    src={course.imageUrl}
                    alt={course.name}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-5xl">
                    📚
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-2 flex flex-col justify-between">
              <div>
                <span className="text-xs font-black tracking-widest text-amber-600 uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60 inline-block mb-3">
                  ACADEMY PROGRAM
                </span>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 mb-3 leading-tight">
                  {course.name}
                </h1>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
                  {course.description || 'Master professional hands-on tech skills with practical industry curriculum.'}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-sm shadow-sm">
                  👨‍🏫
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Instructor</p>
                  <p className="text-sm font-bold text-slate-900">
                    {course.instructor || 'Eng. Abdirahman Mohamed Ibrahim'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content & Video Section (if any lessons exist) */}
        {allLessons.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Video Player */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
                <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
                  <h3 className="font-bold text-sm sm:text-base truncate">
                    {currentVideo?.title || `Lesson ${currentVideoIndex + 1}`}
                  </h3>
                  <span className="text-xs text-amber-400 font-mono">
                    Lesson {currentVideoIndex + 1} of {allLessons.length}
                  </span>
                </div>

                <div className="aspect-video bg-black relative">
                  {currentVideo?.url ? (
                    <iframe
                      src={getYouTubeEmbedUrl(currentVideo.url)}
                      title={currentVideo.title || 'Course Video'}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
                      No video URL available for this lesson
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Lessons Playlist */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-5 h-full flex flex-col">
                <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span>📑</span> Course Curriculum ({allLessons.length})
                </h3>
                <div className="space-y-2 overflow-y-auto max-h-96 pr-1">
                  {allLessons.map((lesson, idx) => {
                    const isActive = currentVideoIndex === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentVideoIndex(idx)}
                        className={`w-full text-left p-3 rounded-xl text-xs font-semibold transition flex items-center gap-2.5 ${
                          isActive
                            ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                          isActive ? 'bg-slate-950 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="truncate flex-1">
                          {lesson.title || `Lesson ${idx + 1}`}
                        </span>
                        {lesson.duration && (
                          <span className="text-[10px] opacity-75 shrink-0">{lesson.duration}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* What You'll Learn */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2">
            <span>🎯</span> What You'll Learn in this Program
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 ? (
              course.whatYouWillLearn.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-emerald-600 font-bold text-base">✓</span>
                  <span className="text-slate-700 text-sm leading-relaxed">{item}</span>
                </div>
              ))
            ) : (
              <>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-emerald-600 font-bold text-base">✓</span>
                  <span className="text-slate-700 text-sm leading-relaxed">Comprehensive understanding of practical concepts</span>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-emerald-600 font-bold text-base">✓</span>
                  <span className="text-slate-700 text-sm leading-relaxed">Industry standard workflows, architecture and tooling</span>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-emerald-600 font-bold text-base">✓</span>
                  <span className="text-slate-700 text-sm leading-relaxed">Real-world production projects and portfolio building</span>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-emerald-600 font-bold text-base">✓</span>
                  <span className="text-slate-700 text-sm leading-relaxed">Verifiable accredited certificate upon graduation</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
