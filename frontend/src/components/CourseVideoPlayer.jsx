import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

// Helper function to convert YouTube URL to embed URL
const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  
  // Extract video ID from various YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const videoId = (match && match[2].length === 11) ? match[2] : null;
  
  return videoId ? `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0` : '';
};

const CourseVideoPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [completedVideos, setCompletedVideos] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState(new Set());

  useEffect(() => {
    const checkAccessAndFetchCourse = async () => {
      try {
        setLoading(true);

        // Fetch course data first for all users
        const response = await axios.get(`/courses/${id}`);
        setCourse(response.data);

        let authorized = false;
        if (user) {
          if (user.role === 'admin') {
            authorized = true;
          } else if (user.role === 'student') {
            const assignedRes = await axios.get('/courses/student/assigned');
            authorized = assignedRes.data.some(c => c._id === id);
          }
        }

        setIsAuthorized(authorized);

        if (authorized) {
          if (response.data.videos && response.data.videos.length > 0) {
            setCurrentVideoIndex(0);
          } else if (response.data.video1) {
            setCurrentVideoIndex(0);
          }
        }

      } catch (err) {
        console.error('Error checking access or fetching course:', err);
        setError('Failed to load course. The course may not exist.');
      } finally {
        setLoading(false);
      }
    };

      checkAccessAndFetchCourse();
  }, [id, user]);

  // Course sections with lessons
  const getCourseStructure = () => {
    if (!course) return [];
    
    // Use dynamic sections from course data, or fallback to default structure
    let sections = [];
    
    if (course.sections && Array.isArray(course.sections) && course.sections.length > 0) {
      // Use custom sections defined by admin
      sections = course.sections.map(section => ({
        id: section.id,
        title: section.title,
        lessons: []
      }));
    } else {
      // If no custom sections, dynamically create sections from video.section properties
      // and include hardcoded defaults if no videos have sections
      const uniqueVideoSections = new Set();
      if (course.videos && Array.isArray(course.videos)) {
        course.videos.forEach(video => {
          if (video.section && video.section.trim() !== '') {
            uniqueVideoSections.add(video.section.trim());
          }
        });
      }

      if (uniqueVideoSections.size > 0) {
        sections = Array.from(uniqueVideoSections).map(sectionId => ({
          id: sectionId,
          title: sectionId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '), // Convert 'getting-started' to 'Getting Started'
          lessons: []
        }));
        // Sort sections alphabetically by title for consistency
        sections.sort((a, b) => a.title.localeCompare(b.title));
      } else {
        // Fallback to a single default section if no custom sections and no video sections
        sections = [{ id: 'general', title: 'General', lessons: [] }];
      }
    }

    // Add legacy videos to the first section (or 'general' if it exists)
    const firstSectionId = sections.length > 0 ? sections[0].id : 'general';
    let firstSectionIndex = sections.findIndex(s => s.id === firstSectionId);

    // Ensure the first section exists if legacy videos are present and no sections were found
    if (firstSectionIndex === -1 && (course.video1 || course.video2)) {
      const newSection = { id: 'general', title: 'General', lessons: [] };
      sections.push(newSection);
      firstSectionIndex = sections.length - 1; // Get the index of the newly added section
    }

    if (course.video1 && firstSectionIndex !== -1) {
      sections[firstSectionIndex].lessons.push({ id: 'legacy-1', title: 'Introduction (Legacy)', duration: 'N/A', url: course.video1 });
    }
    if (course.video2 && firstSectionIndex !== -1) {
      sections[firstSectionIndex].lessons.push({ id: 'legacy-2', title: 'Course Overview (Legacy)', duration: 'N/A', url: course.video2 });
    }

    // Add dynamically added videos to their respective sections
    if (course.videos && Array.isArray(course.videos)) {
      course.videos.forEach((video, index) => {
        let targetSectionId = video.section && video.section.trim() !== '' ? video.section.trim() : firstSectionId;

        let sectionIndex = sections.findIndex(section => section.id === targetSectionId);

        // If the target section doesn't exist, create it dynamically
        if (sectionIndex === -1) {
          const newSection = {
            id: targetSectionId,
            title: targetSectionId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            lessons: []
          };
          sections.push(newSection);
          // Re-sort sections after adding a new one
          sections.sort((a, b) => a.title.localeCompare(b.title));
          sectionIndex = sections.findIndex(section => section.id === targetSectionId); // Get new index
        }

        if (sectionIndex !== -1) {
          sections[sectionIndex].lessons.push({
            id: `video-${video._id || index}`,
            title: video.title,
            duration: video.duration || 'N/A',
            url: video.url
          });
        }
      });
    }

    // Filter out empty sections or keep them for admin users
    if (user && user.role === 'admin') {
      return sections; // Admins see all sections, even empty ones
    } else {
      return sections.filter(section => section.lessons.length > 0);
    }
  };

  // Get all lessons flattened
  const getAllLessons = () => {
    const sections = getCourseStructure();
    return sections.flatMap(section => section.lessons);
  };

  const handleVideoClick = (index) => {
    setCurrentVideoIndex(index);
  };

  const markAsComplete = () => {
    setCompletedVideos(prev => new Set([...prev, currentVideoIndex]));
  };

  const toggleSection = (sectionId) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const getProgressPercentage = () => {
    const allLessons = getAllLessons();
    if (allLessons.length === 0) return 0;
    return Math.round((completedVideos.size / allLessons.length) * 100);
  };

  const getSectionProgress = (section) => {
    const completedCount = section.lessons.filter(lesson => 
      completedVideos.has(lesson.id - 1)
    ).length;
    return { completed: completedCount, total: section.lessons.length };
  };

  const getCurrentLesson = () => {
    const allLessons = getAllLessons();
    return allLessons[currentVideoIndex];
  };

  const goBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading course...</div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <div className="text-xl text-red-600">{error || 'Course not found'}</div>
        </div>
      </div>
    );
  }

  const allLessons = getAllLessons();
  const currentLesson = getCurrentLesson();
  const progressPercentage = getProgressPercentage();
  const courseStructure = getCourseStructure();

  // ── LOCKED VIEW (not authorized) ────────────────────────────────────────────
  if (!isAuthorized) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'Inter, system-ui, sans-serif' }}>

        {/* Top bar */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <button
            onClick={goBack}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#374151', fontWeight: 500, fontSize: '14px', padding: '6px 10px', borderRadius: '8px', transition: 'background 0.15s' }}
            onMouseOver={e => e.currentTarget.style.background = '#f3f4f6'}
            onMouseOut={e => e.currentTarget.style.background = 'none'}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <div style={{ flex: 1 }}>
            <span style={{ fontWeight: 700, fontSize: '17px', color: '#111827' }}>{course?.name || 'Course'}</span>
          </div>
          {user ? (
            <div style={{ fontSize: '13px', color: '#6b7280', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '20px', padding: '4px 14px', fontWeight: 500 }}>
              🔒 Not Enrolled
            </div>
          ) : (
            <Link to="/login" style={{ textDecoration: 'none', background: '#4f46e5', color: '#fff', borderRadius: '8px', padding: '8px 18px', fontWeight: 600, fontSize: '14px', transition: 'background 0.15s' }}>
              Sign In
            </Link>
          )}
        </div>

        {/* Main content */}
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '36px 20px 60px' }}>

          {/* Course hero card */}
          <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)', borderRadius: '16px', padding: '40px 36px', color: '#fff', marginBottom: '36px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '220px', height: '220px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: '-60px', right: '60px', width: '160px', height: '160px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <span style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '20px', padding: '4px 14px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  📚 Course
                </span>
                <span style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '20px', padding: '4px 14px', fontSize: '12px', fontWeight: 600 }}>
                  {allLessons.length} Lessons
                </span>
              </div>
              <h1 style={{ fontSize: '30px', fontWeight: 800, margin: '0 0 12px', lineHeight: 1.25 }}>{course?.name}</h1>
              {course?.description && (
                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', margin: '0 0 28px', lineHeight: 1.6, maxWidth: '560px' }}>
                  {course.description}
                </p>
              )}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link
                  to="/contact"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fff', color: '#4338ca', borderRadius: '10px', padding: '12px 28px', fontWeight: 700, fontSize: '15px', textDecoration: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.2)', transition: 'transform 0.15s' }}
                  onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Enroll Now
                </Link>
                {!user && (
                  <Link
                    to="/login"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: '10px', padding: '12px 24px', fontWeight: 600, fontSize: '15px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)' }}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Course Content heading */}
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', marginBottom: '20px', paddingBottom: '10px', borderBottom: '2px solid #e5e7eb' }}>
            Course Content
          </h2>

          {/* Sections accordion */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
            {courseStructure.map((section) => {
              const isCollapsed = collapsedSections.has(section.id);
              return (
                <div key={section.id} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  {/* Section header */}
                  <button
                    onClick={() => toggleSection(section.id)}
                    style={{ width: '100%', padding: '16px 20px', background: '#f8fafc', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left', transition: 'background 0.15s' }}
                    onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'}
                    onMouseOut={e => e.currentTarget.style.background = '#f8fafc'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <svg
                        style={{ width: '16px', height: '16px', color: '#6b7280', transition: 'transform 0.2s', transform: isCollapsed ? 'rotate(0deg)' : 'rotate(90deg)' }}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span style={{ fontWeight: 700, fontSize: '15px', color: '#111827' }}>{section.title}</span>
                    </div>
                    <span style={{ fontSize: '13px', color: '#6b7280', background: '#e5e7eb', borderRadius: '20px', padding: '3px 12px', whiteSpace: 'nowrap' }}>
                      {section.lessons.length} {section.lessons.length === 1 ? 'lesson' : 'lessons'}
                    </span>
                  </button>

                  {/* Lesson rows */}
                  {!isCollapsed && (
                    <div>
                      {section.lessons.map((lesson, idx) => (
                        <div
                          key={lesson.id}
                          style={{ display: 'flex', alignItems: 'center', padding: '13px 20px', borderTop: '1px solid #f3f4f6', background: '#fff', gap: '14px' }}
                        >
                          {/* Play icon placeholder */}
                          <div style={{ width: '32px', height: '32px', minWidth: '32px', borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="14" height="14" fill="#9ca3af" viewBox="0 0 20 20">
                              <path d="M8 5v10l7-5-7-5z" />
                            </svg>
                          </div>

                          {/* Title */}
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>{lesson.title}</div>
                          </div>

                          {/* Duration */}
                          <div style={{ fontSize: '13px', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                            {lesson.duration !== 'N/A' ? lesson.duration : ''}
                          </div>

                          {/* Lock icon */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="16" height="16" fill="none" stroke="#d1d5db" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom enroll card */}
          <div style={{ background: '#fff', border: '2px solid #e0e7ff', borderRadius: '16px', padding: '32px 36px', textAlign: 'center', boxShadow: '0 2px 12px rgba(79,70,229,0.08)' }}>
            <div style={{ width: '56px', height: '56px', background: '#eef2ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="26" height="26" fill="none" stroke="#4f46e5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>Ready to start learning?</h3>
            <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '24px', lineHeight: 1.6 }}>
              Enroll in <strong>{course?.name}</strong> to get full access to all {allLessons.length} lessons.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                to="/contact"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#4f46e5', color: '#fff', borderRadius: '10px', padding: '12px 32px', fontWeight: 700, fontSize: '15px', textDecoration: 'none', boxShadow: '0 4px 12px rgba(79,70,229,0.3)', transition: 'background 0.15s' }}
                onMouseOver={e => e.currentTarget.style.background = '#4338ca'}
                onMouseOut={e => e.currentTarget.style.background = '#4f46e5'}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Get Access Now
              </Link>
              <button
                onClick={goBack}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#f3f4f6', color: '#374151', borderRadius: '10px', padding: '12px 24px', fontWeight: 600, fontSize: '15px', border: 'none', cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseOver={e => e.currentTarget.style.background = '#e5e7eb'}
                onMouseOut={e => e.currentTarget.style.background = '#f3f4f6'}
              >
                Browse Other Courses
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ── AUTHORIZED VIEW ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Modern Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={goBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{course?.name || 'Course'}</h1>
                {user?.role !== 'admin' && (
                  <div className="text-sm text-gray-500 mt-1">
                    Your Progress: <span className="font-medium text-indigo-600">{completedVideos.size} of {allLessons.length} ({progressPercentage}%)</span>
                  </div>
                )}
              </div>
            </div>
            
            {user?.role !== 'admin' && (
              <button
                onClick={markAsComplete}
                disabled={completedVideos.has(currentVideoIndex)}
                className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                  completedVideos.has(currentVideoIndex)
                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>{completedVideos.has(currentVideoIndex) ? 'Completed' : 'Mark as Complete'}</span>
              </button>
            )}
            {user?.role === 'admin' && (
              <Link
                to={`/courses/${id}/edit`}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit Course</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Modern Sidebar */}
        <div className="w-96 bg-white border-r border-gray-200 h-screen overflow-y-auto">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Course Content</h2>

            <div className="space-y-3">
              {courseStructure.map((section) => {
                const isCollapsed = collapsedSections.has(section.id);
                const progress = getSectionProgress(section);

                return (
                  <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Section Header */}
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <svg
                          className={`w-4 h-4 text-gray-500 transition-transform ${isCollapsed ? '' : 'rotate-90'}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="font-medium text-gray-900">{section.title}</span>
                      </div>
                      <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                        {progress.completed}/{progress.total}
                      </div>
                    </button>

                    {/* Section Lessons */}
                    {!isCollapsed && (
                      <div className="bg-white">
                        {section.lessons.map((lesson) => {
                          const globalIndex = allLessons.findIndex(l => l.id === lesson.id);
                          const isActive = currentVideoIndex === globalIndex;
                          const isCompleted = completedVideos.has(globalIndex);

                          return (
                            <button
                              key={lesson.id}
                              onClick={() => handleVideoClick(globalIndex)}
                              className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-t border-gray-100 ${
                                isActive ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : ''}`}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-7 h-5 rounded shadow-sm bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
                                  <svg className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4 4l12 6-12 6V4z" />
                                  </svg>
                                </div>
                                <div className="flex-1 min-w-0 pr-2">
                                  <div className={`text-[15px] font-medium truncate ${isActive ? 'text-indigo-800' : 'text-indigo-900/80'}`}>
                                    {lesson.title}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3 flex-shrink-0">
                                  <div className="text-[15px] font-medium text-slate-500">{lesson.duration !== 'N/A' ? lesson.duration : ''}</div>
                                  {isCompleted ? (
                                    <div className="w-6 h-6 rounded-full bg-[#22c55e] text-white flex items-center justify-center shadow-sm">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                      </svg>
                                    </div>
                                  ) : (
                                    <div className="w-6 h-6"></div>
                                  )}
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

        {/* Main Content Area */}
        <div className="flex-1">
          {/* Lesson Title */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-900">{currentLesson?.title || 'Select a Lesson'}</h1>
            {currentLesson && (
              <div className="text-sm text-gray-500 mt-1">
                Lesson {currentVideoIndex + 1} of {allLessons.length} • {currentLesson.duration}
              </div>
            )}
          </div>

          {/* Video Player */}
          <div className="flex flex-col bg-gray-900 border-b border-gray-800">
            <div className="w-full aspect-video relative bg-black">
              {currentLesson && currentLesson.url && getYouTubeEmbedUrl(currentLesson.url) ? (
                <iframe
                  src={getYouTubeEmbedUrl(currentLesson.url)}
                  title={currentLesson.title}
                  className="w-full h-full absolute inset-0"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex items-center justify-center h-full text-white absolute inset-0">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 5v10l7-5-7-5z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Ready to Learn?</h2>
                    <p className="text-gray-300">Select a lesson from the sidebar to start watching</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Navigation Controls */}
            {currentLesson && (
              <div className="bg-gray-900 px-6 py-4 flex items-center justify-between border-t border-gray-800 flex-shrink-0">
                <button
                  onClick={() => setCurrentVideoIndex(Math.max(0, currentVideoIndex - 1))}
                  disabled={currentVideoIndex === 0}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Previous</span>
                </button>
                
                <button
                  onClick={() => setCurrentVideoIndex(Math.min(allLessons.length - 1, currentVideoIndex + 1))}
                  disabled={currentVideoIndex === allLessons.length - 1}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700"
                >
                  <span>Next</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseVideoPlayer;
