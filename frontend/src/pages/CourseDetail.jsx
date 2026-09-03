import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [watchedVideos, setWatchedVideos] = useState(new Set());
  const [collapsedSections, setCollapsedSections] = useState(new Set());

  useEffect(() => {
    fetchCourse();
  }, [id, user]);

  const fetchCourse = async () => {
    try {
      const [courseRes, enrollmentsRes] = await Promise.all([
        axios.get(`/courses/${id}`),
        user ? axios.get('/enrollments/student') : Promise.resolve({ data: [] })
      ]);
      setCourse(courseRes.data);
      setEnrollments(enrollmentsRes.data);
    } catch (err) {
      setError('Failed to fetch course details');
    } finally {
      setLoading(false);
    }
  };

  const isEnrolled = enrollments.some(e => e?.courseId?._id === id);
  const isAdmin = user && user.role === 'admin';
  const canAccess = isEnrolled || isAdmin;

  const getCourseStructure = () => {
    if (!course) return [];
    const videos = Array.isArray(course.videos) ? course.videos.filter(Boolean) : [];
    const sorted = videos.slice().sort((a, b) => {
      const ao = Number.isFinite(+a?.order) ? +a.order : Infinity;
      const bo = Number.isFinite(+b?.order) ? +b.order : Infinity;
      return ao !== bo ? ao - bo : 0;
    });
    const lessons = sorted.map((v, idx) => ({
      id: idx + 1,
      title: v?.title || `Lesson ${idx + 1}`,
      duration: v?.duration || '',
      url: v?.url || ''
    }));
    if (lessons.length === 0) return [];
    return [{ id: 'all-lessons', title: 'All Lessons', lessons }];
  };

  const getAllLessons = () => getCourseStructure().flatMap(s => s.lessons);

  const toggleSection = (sectionId) => {
    setCollapsedSections(prev => {
      const next = new Set(prev);
      next.has(sectionId) ? next.delete(sectionId) : next.add(sectionId);
      return next;
    });
  };

  const getSectionProgress = (section) => {
    const completed = section.lessons.filter(l => watchedVideos.has(l.id - 1)).length;
    return { completed, total: section.lessons.length };
  };

  const handleVideoClick = (index) => {
    setCurrentVideoIndex(index);
    setWatchedVideos(prev => new Set([...prev, index]));
  };

  const getProgressPercentage = () => {
    const all = getAllLessons();
    return all.length === 0 ? 0 : Math.round((watchedVideos.size / all.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <div className="text-xl text-gray-700">Loading course details...</div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <div className="text-xl text-red-600">{error || 'Course not found'}</div>
        </div>
      </div>
    );
  }

  const allLessons = getAllLessons();
  const currentVideo = allLessons[currentVideoIndex];
  const progressPercentage = getProgressPercentage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50">
      <PageTitle title={`${course.name} - IFTIINHUB`} />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">

        {/* Course Info Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Image */}
            <div className="lg:col-span-1">
              {course.imageUrl ? (
                <img src={course.imageUrl} alt={course.name} className="w-full h-64 object-cover rounded-lg" />
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <div className="text-white text-6xl">📚</div>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="lg:col-span-2 flex flex-col justify-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{course.name}</h1>
              <p className="text-gray-600 mb-3 text-sm sm:text-base leading-relaxed">{course.description}</p>
              <p className="text-indigo-600 font-semibold flex items-center gap-2 mb-4">
                <span>👨‍🏫</span> {course.instructor}
              </p>
              {isEnrolled && (
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 text-sm font-medium rounded-full w-fit">
                  ✓ Enrolled
                </span>
              )}
              {!isEnrolled && !isAdmin && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2">
                  <p className="text-sm text-blue-700">
                    📋 Contact the administrator to get enrolled in this course.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Course Content — only for enrolled students & admins */}
        {canAccess && allLessons.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2 text-indigo-500">📚</span> Course Content
                </h3>

                {isEnrolled && (
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-700">Progress</span>
                      <span className="text-xs font-bold text-indigo-600">{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {watchedVideos.size} of {allLessons.length} lessons completed
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {getCourseStructure().map(section => {
                    const isCollapsed = collapsedSections.has(section.id);
                    const progress = getSectionProgress(section);
                    return (
                      <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <svg className={`w-4 h-4 text-gray-500 transition-transform ${isCollapsed ? '' : 'rotate-90'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="font-medium text-gray-900 text-sm">{section.title}</span>
                          </div>
                          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                            {progress.completed}/{progress.total}
                          </span>
                        </button>

                        {!isCollapsed && (
                          <div className="bg-white">
                            {section.lessons.map((lesson) => {
                              const globalIndex = allLessons.findIndex(l => l.id === lesson.id);
                              const isActive = currentVideoIndex === globalIndex;
                              const isWatched = watchedVideos.has(globalIndex);
                              return (
                                <button
                                  key={lesson.id}
                                  onClick={() => handleVideoClick(globalIndex)}
                                  className={`w-full px-4 py-3 text-left transition-colors border-t border-gray-100 ${
                                    isActive ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : 'hover:bg-gray-50'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                      isWatched ? 'bg-green-100 text-green-600' : isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                      {isWatched ? '✓' : globalIndex + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className={`text-sm font-medium truncate ${isActive ? 'text-indigo-700' : 'text-gray-900'}`}>
                                        {lesson.title}
                                      </div>
                                      {lesson.duration && <div className="text-xs text-gray-500">{lesson.duration}</div>}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Video Player */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              {currentVideo && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4">
                  <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-4 flex items-center justify-between">
                    <h3 className="text-white font-semibold">{currentVideo.title}</h3>
                    <button
                      onClick={() => setWatchedVideos(prev => new Set([...prev, currentVideoIndex]))}
                      className="bg-white text-pink-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-pink-50 transition"
                    >
                      Mark Complete
                    </button>
                  </div>
                  <div className="relative bg-black">
                    <iframe
                      src={getYouTubeEmbedUrl(currentVideo.url)}
                      title={currentVideo.title}
                      className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px]"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                    {/* Prev / Next */}
                    <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
                      <button
                        onClick={() => currentVideoIndex > 0 && handleVideoClick(currentVideoIndex - 1)}
                        disabled={currentVideoIndex === 0}
                        className="bg-black/50 text-white p-2 rounded-full pointer-events-auto disabled:opacity-40"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                      </button>
                      <button
                        onClick={() => currentVideoIndex < allLessons.length - 1 && handleVideoClick(currentVideoIndex + 1)}
                        disabled={currentVideoIndex === allLessons.length - 1}
                        className="bg-black/50 text-white p-2 rounded-full pointer-events-auto disabled:opacity-40"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Course Description */}
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                  <span className="mr-2 text-pink-500">📚</span> Course Description
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{course.description}</p>
              </div>

              {/* What You'll Learn */}
              {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2 text-pink-500">🎯</span> What You'll Learn
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {course.whatYouWillLearn.map((item, index) => (
                      <div key={index} className="flex items-start">
                        <svg className="w-4 h-4 text-pink-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Not enrolled — show description only */}
        {!canAccess && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="mr-2 text-pink-500">📚</span> Course Description
            </h2>
            <p className="text-gray-700 leading-relaxed">{course.description}</p>

            {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
              <>
                <h2 className="text-xl font-bold text-gray-900 mt-6 mb-4 flex items-center">
                  <span className="mr-2 text-pink-500">🎯</span> What You'll Learn
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.whatYouWillLearn.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <svg className="w-4 h-4 text-pink-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default CourseDetail;
