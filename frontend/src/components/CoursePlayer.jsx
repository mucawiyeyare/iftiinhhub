import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

// Helper function to convert YouTube URL to embed URL
const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  
  // Extract video ID from various YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const videoId = (match && match[2].length === 11) ? match[2] : null;
  
  return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
};

const CoursePlayer = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [completedVideos, setCompletedVideos] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/courses/${id}`);
      setCourse(response.data);
      
      // Set first video as current if videos exist
      if (response.data.videos && response.data.videos.length > 0) {
        setCurrentVideoIndex(0);
      } else if (response.data.video1) {
        setCurrentVideoIndex(0);
      }
    } catch (error) {
      setError('Failed to fetch course details');
    } finally {
      setLoading(false);
    }
  };

  // Get all videos (new format + backward compatibility)
  const getAllVideos = () => {
    if (!course) return [];
    
    if (course.videos && course.videos.length > 0) {
      return course.videos.sort((a, b) => a.order - b.order);
    }
    
    const videos = [];
    if (course.video1) videos.push({ title: 'Video 1', url: course.video1, order: 1 });
    if (course.video2) videos.push({ title: 'Video 2', url: course.video2, order: 2 });
    return videos;
  };

  const handleVideoClick = (index) => {
    setCurrentVideoIndex(index);
  };

  const markAsComplete = () => {
    setCompletedVideos(prev => new Set([...prev, currentVideoIndex]));
  };

  const getProgressPercentage = () => {
    const allVideos = getAllVideos();
    if (allVideos.length === 0) return 0;
    return Math.round((completedVideos.size / allVideos.length) * 100);
  };

  const formatDuration = (duration) => {
    if (!duration) return '';
    return duration;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <div className="text-xl text-gray-700">Loading course...</div>
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

  const allVideos = getAllVideos();
  const currentVideo = allVideos[currentVideoIndex];
  const progressPercentage = getProgressPercentage();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden bg-white border-b border-gray-200 p-4">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="flex items-center space-x-2 text-gray-700 hover:text-pink-600 transition duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="font-medium">Course Content</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Left Sidebar - Course Content */}
        <div className={`lg:w-1/4 bg-white border-r border-gray-200 lg:block ${showSidebar ? 'block' : 'hidden'}`}>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-2 text-pink-500">📚</span>
              Course Content
            </h2>

            {/* Progress Summary */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Your Progress</span>
                <span className="text-sm font-bold text-pink-600">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {completedVideos.size} of {allVideos.length} lessons completed
              </div>
            </div>

            {/* Video Lessons List */}
            <div className="space-y-2 max-h-96 lg:max-h-none overflow-y-auto">
              {allVideos.map((video, index) => {
                const isActive = currentVideoIndex === index;
                const isCompleted = completedVideos.has(index);
                
                return (
                  <button
                    key={index}
                    onClick={() => handleVideoClick(index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition duration-200 ${
                      isActive
                        ? 'border-pink-500 bg-pink-50 text-pink-700 shadow-md'
                        : isCompleted
                        ? 'border-green-300 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-pink-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                          isActive 
                            ? 'bg-pink-500 text-white' 
                            : isCompleted 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-300 text-gray-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="font-medium text-sm">{video.title}</div>
                      </div>
                      {isCompleted && (
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    {video.duration && (
                      <div className="text-xs text-gray-500 ml-9">{formatDuration(video.duration)}</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 lg:w-3/4">
          {currentVideo ? (
            <div className="p-6">
              {/* Lesson Title */}
              <div className="mb-6">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  {currentVideo.title}
                </h1>
                <p className="text-gray-600">
                  Lesson {currentVideoIndex + 1} of {allVideos.length}
                </p>
              </div>

              {/* Video Player */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
                <div className="bg-gradient-to-br from-purple-900 to-purple-700 relative">
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src={getYouTubeEmbedUrl(currentVideo.url)}
                      title={currentVideo.title}
                      className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px]"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>

                {/* Video Controls */}
                <div className="p-6">
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Lesson Progress</span>
                      <span className="text-sm text-gray-500">
                        {completedVideos.has(currentVideoIndex) ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          completedVideos.has(currentVideoIndex)
                            ? 'bg-green-500'
                            : 'bg-gradient-to-r from-pink-500 to-purple-600'
                        }`}
                        style={{ 
                          width: completedVideos.has(currentVideoIndex) ? '100%' : '0%' 
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={markAsComplete}
                      disabled={completedVideos.has(currentVideoIndex)}
                      className={`flex-1 px-6 py-3 rounded-lg font-medium transition duration-200 ${
                        completedVideos.has(currentVideoIndex)
                          ? 'bg-green-500 text-white cursor-not-allowed'
                          : 'bg-pink-500 text-white hover:bg-pink-600'
                      }`}
                    >
                      {completedVideos.has(currentVideoIndex) ? (
                        <span className="flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Completed
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Mark as Complete
                        </span>
                      )}
                    </button>

                    {/* Navigation Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentVideoIndex(Math.max(0, currentVideoIndex - 1))}
                        disabled={currentVideoIndex === 0}
                        className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ← Previous
                      </button>
                      <button
                        onClick={() => setCurrentVideoIndex(Math.min(allVideos.length - 1, currentVideoIndex + 1))}
                        disabled={currentVideoIndex === allVideos.length - 1}
                        className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Info */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About This Course</h2>
                <p className="text-gray-700 leading-relaxed">{course.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-1">Instructor</h3>
                    <p className="text-gray-700">{course.instructor}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-1">Duration</h3>
                    <p className="text-gray-700">{course.duration}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-1">Level</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      course.level === 'beginner' ? 'bg-green-100 text-green-800' :
                      course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="text-6xl mb-4">📹</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">No Videos Available</h2>
                <p className="text-gray-600">This course doesn't have any videos yet.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
