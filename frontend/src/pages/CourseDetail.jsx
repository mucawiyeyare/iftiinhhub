import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import VideoManager from '../components/VideoManager';

// Helper function to convert YouTube URL to embed URL
const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  
  // Extract video ID from various YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const videoId = (match && match[2].length === 11) ? match[2] : null;
  
  return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
};

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Enrollment functionality removed - handled by admin only
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [cart, setCart] = useState({ items: [] });
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState('');
  const [watchedVideos, setWatchedVideos] = useState(new Set());
  const [showPreview, setShowPreview] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [collapsedSections, setCollapsedSections] = useState(new Set());

  useEffect(() => {
    fetchCourseAndEnrollments();
    if (user) {
      fetchCart();
    }
  }, [id, user]);

  const fetchCourseAndEnrollments = async () => {
    try {
      const [courseRes, enrollmentsRes] = await Promise.all([
        axios.get(`/courses/${id}`),
        user ? axios.get('/enrollments/student') : Promise.resolve({ data: [] })
      ]);
      
      const courseData = courseRes.data;
      setCourse(courseData);
      setEnrollments(enrollmentsRes.data);
      
      // Set first video as current if videos exist
      if (courseData.videos && courseData.videos.length > 0) {
        setCurrentVideoIndex(0);
      } else if (courseData.video1) {
        setCurrentVideoIndex(0);
      }
    } catch (error) {
      setError('Failed to fetch course details');
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get('/cart');
      setCart(response.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  // Check if student is enrolled in this course
  const isEnrolled = enrollments.some(enrollment => enrollment?.courseId?._id === id);
  
  // Check if course is in cart
  const isInCart = cart.items?.some(item => item?.courseId?._id === id);

  // Access control flags
  const isAdmin = user && user.role === 'admin';
  const canAccess = isEnrolled || isAdmin; // admins and enrolled students can access videos
  const isPreviewing = showPreview && !isEnrolled && !isAdmin; // no preview needed for admins

  // Build course sections from actual course.videos (no hardcoded defaults)
  const getCourseStructure = () => {
    if (!course) return [];

    // Ensure we have an array of videos
    const videos = Array.isArray(course.videos) ? course.videos.filter(Boolean) : [];

    // Sort by optional 'order' first, then keep original order as fallback
    const sorted = videos.slice().sort((a, b) => {
      const ao = Number.isFinite(+a?.order) ? +a.order : Infinity;
      const bo = Number.isFinite(+b?.order) ? +b.order : Infinity;
      if (ao !== bo) return ao - bo;
      return 0;
    });

    // Map to lesson shape used by the UI
    const lessons = sorted.map((v, idx) => ({
      id: idx + 1, // sequential id for progress/watched tracking
      title: v?.title || `Lesson ${idx + 1}`,
      duration: v?.duration || '',
      url: v?.url || ''
    }));

    if (lessons.length === 0) return [];

    // Single dynamic section containing all lessons
    return [
      {
        id: 'all-lessons',
        title: 'All Lessons',
        lessons
      }
    ];
  };

  // Get all lessons flattened
  const getAllLessons = () => {
    const sections = getCourseStructure();
    return sections.flatMap(section => section.lessons);
  };

  // Get all videos (backward compatibility)
  const getAllVideos = () => {
    return getAllLessons();
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

  const getSectionProgress = (section) => {
    const completedCount = section.lessons.filter(lesson => 
      watchedVideos.has(lesson.id - 1)
    ).length;
    return { completed: completedCount, total: section.lessons.length };
  };

  // Enrollment is now handled by admin only
  // Students cannot self-enroll

  const handleVideoClick = (index) => {
    setCurrentVideoIndex(index);
    markVideoAsWatched(index);
  };

  const markVideoAsWatched = (index) => {
    setWatchedVideos(prev => new Set([...prev, index]));
  };

  const goToPreviousVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
      markVideoAsWatched(currentVideoIndex - 1);
    }
  };

  const goToNextVideo = () => {
    const allVideos = getAllVideos();
    if (currentVideoIndex < allVideos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
      markVideoAsWatched(currentVideoIndex + 1);
    }
  };

  const getProgressPercentage = () => {
    const allVideos = getAllVideos();
    if (allVideos.length === 0) return 0;
    return Math.round((watchedVideos.size / allVideos.length) * 100);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    setCartMessage('');

    try {
      await axios.post('/cart/add', { courseId: id });
      setCartMessage('Course added to cart successfully!');
      fetchCart(); // Refresh cart
    } catch (error) {
      setCartMessage(error.response?.data?.message || 'Failed to add course to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleRemoveFromCart = async () => {
    setAddingToCart(true);
    setCartMessage('');

    try {
      await axios.delete(`/cart/remove/${id}`);
      setCartMessage('Course removed from cart!');
      fetchCart(); // Refresh cart
    } catch (error) {
      setCartMessage(error.response?.data?.message || 'Failed to remove course from cart');
    } finally {
      setAddingToCart(false);
    }
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
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <div className="text-xl text-red-600">{error || 'Course not found'}</div>
        </div>
      </div>
    );
  }

  const allVideos = getAllVideos();
  const currentVideo = allVideos[currentVideoIndex];
  const progressPercentage = getProgressPercentage();

  return (
     <div className=" min-h-screen bg-gradient-to-br from-gray-50 to-pink-50">
             {/* Header removed as requested */}

                                                                                                               <div className="w-full py-4 sm:py-6 px-4 sm:px-6 lg:pl-0 lg:pr-8 max-w-7xl mx-auto">
        {/* Course Information Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Course Image */}
            <div className="lg:col-span-1">
              {course.imageUrl ? (
                <img
                  src={course.imageUrl}
                  alt={course.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <div className="text-white text-6xl">📚</div>
                </div>
              )}
            </div>

            {/* Course Details */}
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.name}</h1>
                  <p className="text-lg text-gray-600 mb-4">{course.description}</p>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-sm text-gray-500">👨‍🏫 {course.instructor}</span>
                    <span className="text-sm text-gray-500">⏱️ {course.duration}</span>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      course.level === 'beginner' ? 'bg-green-500 text-white' :
                      course.level === 'intermediate' ? 'bg-yellow-500 text-white' :
                      'bg-red-500 text-white'
                    }`}>
                      {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {course.category}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-blue-600 mb-2">${course.price}</div>
                  {isEnrolled ? (
                    <span className="bg-green-100 text-green-800 px-3 py-1 text-sm font-medium rounded-full">
                      ✓ Enrolled
                    </span>
                  ) : (
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 text-sm font-medium rounded-full">
                      🛒 Available
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {isEnrolled ? (
                  <Link
                    to={`/courses/${id}/learn`}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-200 font-medium flex items-center"
                  >
                    🎓 Start Learning
                  </Link>
                ) : (
                  <>
                    {!isInCart ? (
                      <button
                        onClick={handleAddToCart}
                        disabled={addingToCart}
                        className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition duration-200 disabled:opacity-50 font-medium flex items-center"
                      >
                        {addingToCart ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Adding...
                          </>
                        ) : (
                          <>
                            🛒 Add to Cart
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={handleRemoveFromCart}
                        disabled={addingToCart}
                        className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition duration-200 disabled:opacity-50 font-medium flex items-center"
                      >
                        {addingToCart ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Removing...
                          </>
                        ) : (
                          <>
                            ❌ Remove from Cart
                          </>
                        )}
                      </button>
                    )}
                    <Link
                      to="/contact"
                      state={{
                        subject: `Enrollment Request for: ${course.name}`,
                        message: `Hello Admin,\n\nI would like to request enrollment in the following course:\n\nCourse: ${course.name}\nInstructor: ${course.instructor}\nPrice: $${course.price}\nLevel: ${course.level}\n\nPlease let me know the next steps for enrollment.\n\nThank you!`,
                        courseDetails: {
                          name: course.name,
                          instructor: course.instructor,
                          price: course.price,
                          level: course.level,
                          category: course.category
                        }
                      }}
                      className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition duration-200 font-medium flex items-center"
                    >
                      📧 Contact Admin for Enrollment
                    </Link>
                  </>
                )}
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-200 font-medium flex items-center"
                >
                  {showPreview ? '👁️ Hide Preview' : '👁️ Show Preview'}
                </button>
              </div>

              {/* Messages */}
              {cartMessage && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-sm text-green-600 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {cartMessage}
                  </div>
                </div>
              )}

              {/* Enrollment Info for Non-enrolled Students */}
              {!isEnrolled && user && user.role === 'student' && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    How to Enroll:
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Add this course to your cart</li>
                    <li>• Contact admin using the button above</li>
                    <li>• Wait for admin approval</li>
                    <li>• Start learning once enrolled!</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Video Manager for Admin Users */}
        {user && user.role === 'admin' && (
          <div className="mb-8">
            <VideoManager 
              course={course} 
              onVideoUpdate={(updatedCourse) => {
                setCourse(updatedCourse);
                // Reset current video index if needed
                if (currentVideoIndex >= updatedCourse.videos.length) {
                  setCurrentVideoIndex(0);
                }
              }} 
            />
          </div>
        )}

                                   {/* Course Content - Always show but with different access levels */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 justify-start max-w-none mb-6">
            {/* Modern Course Content Sidebar */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="w-full bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <span className="mr-2 text-indigo-500">📚</span>
                  Course Content
                </h3>
                
                {/* Progress Summary - Only for enrolled */}
                {isEnrolled && (
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-xs sm:text-sm font-bold text-indigo-600">{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {watchedVideos.size} of {getAllLessons().length} lessons completed
                    </div>
                  </div>
                )}


                
                {/* Collapsible Sections */}
                <div className="space-y-3">
                  {getCourseStructure().map((section) => {
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
                          <div className="flex items-center space-x-2">
                            {canAccess && (
                              <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                                {progress.completed}/{progress.total}
                              </div>
                            )}
                            {!canAccess && (
                              <div className="text-xs text-red-500 bg-red-100 px-2 py-1 rounded-full flex items-center">
                                🔒 {section.lessons.length}
                              </div>
                            )}
                          </div>
                        </button>
                        
                        {/* Section Lessons */}
                        {!isCollapsed && (
                          <div className="bg-white">
                            {section.lessons.map((lesson, lessonIndex) => {
                              const globalIndex = getAllLessons().findIndex(l => l.id === lesson.id);
                              const isActive = currentVideoIndex === globalIndex;
                              const isWatched = watchedVideos.has(globalIndex);
                              const disabled = !canAccess && !isAdmin; // Admins can click all lessons
                              
                              return (
                                <button
                                  key={lesson.id}
                                  onClick={() => (canAccess || isAdmin) && handleVideoClick(globalIndex)}
                                  disabled={disabled}
                                  className={`w-full px-4 py-3 text-left transition-colors border-t border-gray-100 ${
                                    disabled
                                      ? 'cursor-not-allowed opacity-60 bg-gray-50'
                                      : isActive 
                                      ? 'bg-indigo-50 border-l-4 border-l-indigo-500' 
                                      : 'hover:bg-gray-50'
                                  }`}
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                      disabled
                                        ? 'bg-gray-200 text-gray-400'
                                        : isWatched 
                                        ? 'bg-green-100 text-green-600' 
                                        : isActive 
                                        ? 'bg-indigo-100 text-indigo-600' 
                                        : 'bg-gray-100 text-gray-500'
                                    }`}>
                                      {disabled ? (
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                      ) : isWatched ? (
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                      ) : (
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <div className={`text-sm font-medium ${
                                        disabled 
                                          ? 'text-gray-400' 
                                          : isActive 
                                          ? 'text-indigo-700' 
                                          : 'text-gray-900'
                                      }`}>
                                        {lesson.title}
                                      </div>
                                      <div className="text-xs text-gray-500 mt-1">{lesson.duration}</div>
                                    </div>
                                    {disabled && (
                                      <span className="text-xs text-red-500 bg-red-100 px-2 py-1 rounded-full">
                                        Locked
                                      </span>
                                    )}
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
            <div className="lg:col-span-3 order-1 lg:order-2 w-full max-w-none">
              {/* Video Player Section - Show for enrolled, admins, or preview mode */}
              {(canAccess || showPreview) && currentVideo && (
                <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden mb-4 sm:mb-6 max-w-none">
                  {/* Video Header */}
                  <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                        <h3 className="text-white font-semibold text-base sm:text-lg">{currentVideo.title}</h3>
                        {canAccess && (
                          <button
                            onClick={() => markVideoAsWatched(currentVideoIndex)}
                            className="bg-white text-pink-600 px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-pink-50 transition duration-200 text-sm sm:text-base"
                          >
                            Mark as Complete
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Video Player or Preview Lock */}
                    <div className="bg-gradient-to-br from-purple-900 to-purple-700 relative">
                      <div className="aspect-w-16 aspect-h-9">
                        {canAccess ? (
                          <iframe
                            src={getYouTubeEmbedUrl(currentVideo.url)}
                            title={currentVideo.title}
                            className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px]"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <div className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] flex flex-col items-center justify-center bg-[url('')] bg-cover bg-center">
                            <div className="bg-black bg-opacity-50 rounded-xl p-6 text-center text-white max-w-md">
                              <div className="text-3xl mb-2">🔒</div>
                              <div className="text-lg font-semibold mb-2">Preview Mode</div>
                              <p className="text-sm opacity-90 mb-4">You can see the course contents, but the video is locked until you get permission.</p>
                              <div className="flex gap-2 justify-center">
                                {!isInCart && (
                                  <button onClick={handleAddToCart} className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm">Add to Cart</button>
                                )}
                                <Link
                                  to="/contact"
                                  state={{
                                    subject: `Enrollment Request for: ${course.name}`,
                                    message: `Hello Admin,\n\nI would like to request enrollment in the following course:\n\nCourse: ${course.name}\nInstructor: ${course.instructor}\nPrice: $${course.price}\nLevel: ${course.level}\n\nPlease let me know the next steps for enrollment.\n\nThank you!`,
                                    courseDetails: {
                                      name: course.name,
                                      instructor: course.instructor,
                                      price: course.price,
                                      level: course.level,
                                      category: course.category
                                    }
                                  }}
                                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm"
                                >
                                  Contact Admin
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Navigation Buttons */}
                      <div className="absolute inset-0 flex items-center justify-between p-2 sm:p-4 pointer-events-none">
                        <button
                          onClick={goToPreviousVideo}
                          disabled={currentVideoIndex === 0}
                          className="bg-black bg-opacity-50 text-white p-2 sm:p-3 rounded-full hover:bg-opacity-70 transition duration-200 pointer-events-auto disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={goToNextVideo}
                          disabled={currentVideoIndex === allVideos.length - 1}
                          className="bg-black bg-opacity-50 text-white p-2 sm:p-3 rounded-full hover:bg-opacity-70 transition duration-200 pointer-events-auto disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Video Controls (only when accessible) */}
                    {canAccess && (
                      <div className="bg-gray-900 p-3 sm:p-4">
                        <div className="flex items-center justify-between">
                          {/* Play/Pause Button */}
                          <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="text-white hover:text-pink-400 transition duration-200"
                          >
                            {isPlaying ? (
                              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>

                          {/* Progress Bar */}
                          <div className="flex-1 mx-2 sm:mx-4">
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(currentTime / duration) * 100}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Time Display */}
                          <div className="text-white text-xs sm:text-sm font-mono">
                            {formatTime(currentTime)} / {formatTime(duration)}
                          </div>

                          {/* Volume Control */}
                          <button className="text-white hover:text-pink-400 transition duration-200 ml-2 sm:ml-4">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.5 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.5l3.883-3.793a1 1 0 011.414.076zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>

                          {/* Fullscreen Button */}
                          <button className="text-white hover:text-pink-400 transition duration-200 ml-2 sm:ml-4">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                                                           {/* Course Description */}
                <div className="w-full bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 max-w-none">
                 <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                   <span className="mr-2 text-pink-500">📚</span>
                   Course Description
                 </h2>
                 <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{course.description}</p>
               </div>

                                                           {/* Course Details */}
                <div className="w-full bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 max-w-none">
                 <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                   <span className="mr-2 text-pink-500">ℹ️</span>
                   Course Details
                 </h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                     <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-3 sm:p-4 rounded-lg">
                     <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Instructor</h3>
                     <p className="text-gray-700 text-sm sm:text-base">{course.instructor}</p>
                   </div>
                   <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 sm:p-4 rounded-lg">
                     <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Duration</h3>
                     <p className="text-gray-700 text-sm sm:text-base">{course.duration}</p>
                   </div>
                   <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-3 sm:p-4 rounded-lg">
                     <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Level</h3>
                     <span className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-full ${
                       course.level === 'beginner' ? 'bg-green-500 text-white' :
                       course.level === 'intermediate' ? 'bg-yellow-500 text-white' :
                       'bg-red-500 text-white'
                     }`}>
                       {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                     </span>
                   </div>
                   <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 sm:p-4 rounded-lg">
                     <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Category</h3>
                     <p className="text-gray-700 text-sm sm:text-base">{course.category}</p>
                   </div>
                </div>
              </div>

                                                           {/* What You'll Learn */}
                <div className="w-full bg-white rounded-xl shadow-lg p-4 sm:p-6">
                 <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                   <span className="mr-2 text-pink-500">🎯</span>
                   What You'll Learn
                 </h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 ? (
                                         course.whatYouWillLearn.map((item, index) => (
                       <div key={index} className="flex items-start">
                         <svg className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                         </svg>
                         <span className="text-gray-700 text-sm sm:text-base">{item}</span>
                       </div>
                     ))
                  ) : (
                                         <>
                       <div className="flex items-start">
                         <svg className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 mr-2 sm:mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                         </svg>
                         <span className="text-gray-700 text-sm sm:text-base">Comprehensive understanding of the subject matter</span>
                       </div>
                       <div className="flex items-start">
                         <svg className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 mr-2 sm:mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                         </svg>
                         <span className="text-gray-700 text-sm sm:text-base">Practical skills and hands-on experience</span>
                       </div>
                       <div className="flex items-start">
                         <svg className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 mr-2 sm:mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                         </svg>
                         <span className="text-gray-700 text-sm sm:text-base">Real-world project implementation</span>
                       </div>
                       <div className="flex items-start">
                         <svg className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 mr-2 sm:mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                         </svg>
                         <span className="text-gray-700 text-sm sm:text-base">Certificate upon completion</span>
                       </div>
                     </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Enrollment Required Message */}
          {!isEnrolled && !showPreview && (
            <div className="w-full bg-white rounded-xl shadow-lg p-4 sm:p-8 text-left">
             <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🔒</div>
             <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Enrollment Required</h2>
             <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
               To access this course content, you need to be enrolled by an administrator. Students cannot self-enroll in courses.
             </p>
                          <div className="flex flex-col sm:flex-row justify-start gap-2 sm:gap-4">
                                {isEnrolled ? (
                   <Link
                     to={`/courses/${id}/learn`}
                     className="bg-green-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-green-600 transition duration-200 font-medium text-sm sm:text-base"
                   >
                     🎓 Continue Learning
                   </Link>
                 ) : (
                   <div className="bg-gray-100 text-gray-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base">
                     Contact admin for enrollment
                   </div>
                 )}
                 <button
                   onClick={() => setShowPreview(true)}
                   className="bg-pink-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-pink-600 transition duration-200 text-sm sm:text-base"
                 >
                   Preview Course
                 </button>
                {!isInCart ? (
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="bg-purple-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-purple-600 transition duration-200 disabled:opacity-50 text-sm sm:text-base"
                  >
                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                  </button>
                ) : (
                  <button
                    onClick={handleRemoveFromCart}
                    disabled={addingToCart}
                    className="bg-red-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-red-600 transition duration-200 disabled:opacity-50 text-sm sm:text-base"
                  >
                    {addingToCart ? 'Removing...' : 'Remove from Cart'}
                  </button>
                )}
            </div>
            {cartMessage && (
              <div className="mt-4 text-sm text-green-600">{cartMessage}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
