import React, { useState, useEffect } from 'react';

// Helper function to convert YouTube URL to embed URL
const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  
  // Extract video ID from various YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const videoId = (match && match[2].length === 11) ? match[2] : null;
  
  return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
};

const ProfessionalVideoPlayer = ({ 
  videos, 
  currentVideoIndex, 
  onVideoChange, 
  onProgressUpdate 
}) => {
  const [watchedVideos, setWatchedVideos] = useState(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Mark current video as watched when it changes
    if (currentVideoIndex >= 0) {
      setWatchedVideos(prev => new Set([...prev, currentVideoIndex]));
      onProgressUpdate?.(watchedVideos.size + 1, videos.length);
    }
  }, [currentVideoIndex]);

  const goToPreviousVideo = () => {
    if (currentVideoIndex > 0) {
      onVideoChange(currentVideoIndex - 1);
    }
  };

  const goToNextVideo = () => {
    if (currentVideoIndex < videos.length - 1) {
      onVideoChange(currentVideoIndex + 1);
    }
  };

  const handleVideoClick = (index) => {
    onVideoChange(index);
  };

  const getProgressPercentage = () => {
    if (videos.length === 0) return 0;
    return Math.round((watchedVideos.size / videos.length) * 100);
  };

  const currentVideo = videos[currentVideoIndex];

  if (!currentVideo) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">📹</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Video Available</h3>
        <p className="text-gray-600">Please select a video from the course content.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Course Progress</h3>
          <span className="text-sm font-medium text-gray-600">
            {getProgressPercentage()}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>{watchedVideos.size} of {videos.length} videos watched</span>
          <span>{videos.length - watchedVideos.size} remaining</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Video Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">📹</span>
              Course Videos
            </h3>
            <div className="space-y-3">
              {videos.map((video, index) => (
                <button
                  key={index}
                  onClick={() => handleVideoClick(index)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition duration-200 ${
                    currentVideoIndex === index
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : watchedVideos.has(index)
                      ? 'border-green-300 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{video.title}</div>
                    {watchedVideos.has(index) && (
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  {video.duration && (
                    <div className="text-sm text-gray-500">{video.duration}</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Video Player */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-lg">{currentVideo.title}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-300 text-sm">
                    {currentVideoIndex + 1} of {videos.length}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={getYouTubeEmbedUrl(currentVideo.url)}
                  title={currentVideo.title}
                  className="w-full h-96 lg:h-[500px]"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              
              {/* Navigation Controls Overlay */}
              <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
                <button
                  onClick={goToPreviousVideo}
                  disabled={currentVideoIndex === 0}
                  className={`p-3 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all duration-200 pointer-events-auto ml-4 ${
                    currentVideoIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={goToNextVideo}
                  disabled={currentVideoIndex === videos.length - 1}
                  className={`p-3 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all duration-200 pointer-events-auto mr-4 ${
                    currentVideoIndex === videos.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Video Info and Controls */}
            <div className="p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{currentVideo.title}</h4>
                  {currentVideo.duration && (
                    <p className="text-sm text-gray-600">Duration: {currentVideo.duration}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={goToPreviousVideo}
                    disabled={currentVideoIndex === 0}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      currentVideoIndex === 0
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={goToNextVideo}
                    disabled={currentVideoIndex === videos.length - 1}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      currentVideoIndex === videos.length - 1
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalVideoPlayer;
