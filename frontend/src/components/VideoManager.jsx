import React, { useState } from 'react';
import axios from 'axios';

const VideoManager = ({ course, onVideoUpdate }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showMultipleForm, setShowMultipleForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Single video form state
  const [videoForm, setVideoForm] = useState({
    title: '',
    url: '',
    duration: '',
    order: ''
  });

  // Multiple videos form state
  const [multipleVideosForm, setMultipleVideosForm] = useState({
    videos: [
      { title: '', url: '', duration: '' },
      { title: '', url: '', duration: '' },
      { title: '', url: '', duration: '' }
    ]
  });

  const handleSingleVideoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(`/courses/${course._id}/videos`, videoForm);
      onVideoUpdate(response.data);
      setVideoForm({ title: '', url: '', duration: '', order: '' });
      setShowAddForm(false);
      setMessage('Video added successfully!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to add video');
    } finally {
      setLoading(false);
    }
  };

  const handleMultipleVideosSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Filter out empty videos
    const validVideos = multipleVideosForm.videos.filter(video => 
      video.title.trim() && video.url.trim()
    );

    if (validVideos.length === 0) {
      setMessage('Please add at least one video');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`/courses/${course._id}/videos/multiple`, {
        videos: validVideos
      });
      onVideoUpdate(response.data);
      setMultipleVideosForm({
        videos: [
          { title: '', url: '', duration: '' },
          { title: '', url: '', duration: '' },
          { title: '', url: '', duration: '' }
        ]
      });
      setShowMultipleForm(false);
      setMessage(`${validVideos.length} videos added successfully!`);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to add videos');
    } finally {
      setLoading(false);
    }
  };

  const handleEditVideo = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.put(
        `/courses/${course._id}/videos/${editingVideo._id}`, 
        videoForm
      );
      onVideoUpdate(response.data);
      setEditingVideo(null);
      setVideoForm({ title: '', url: '', duration: '', order: '' });
      setMessage('Video updated successfully!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update video');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.delete(`/courses/${course._id}/videos/${videoId}`);
      onVideoUpdate(response.data);
      setMessage('Video deleted successfully!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to delete video');
    } finally {
      setLoading(false);
    }
  };

  const handleReorderVideos = async (videoIds) => {
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.put(`/courses/${course._id}/videos/reorder`, {
        videoIds
      });
      onVideoUpdate(response.data);
      setMessage('Videos reordered successfully!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to reorder videos');
    } finally {
      setLoading(false);
    }
  };

  const startEditVideo = (video) => {
    setEditingVideo(video);
    setVideoForm({
      title: video.title,
      url: video.url,
      duration: video.duration || '',
      order: video.order || ''
    });
  };

  const addVideoField = () => {
    setMultipleVideosForm(prev => ({
      videos: [...prev.videos, { title: '', url: '', duration: '' }]
    }));
  };

  const removeVideoField = (index) => {
    setMultipleVideosForm(prev => ({
      videos: prev.videos.filter((_, i) => i !== index)
    }));
  };

  const updateMultipleVideoField = (index, field, value) => {
    setMultipleVideosForm(prev => ({
      videos: prev.videos.map((video, i) => 
        i === index ? { ...video, [field]: value } : video
      )
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <span className="mr-2 text-pink-500">🎥</span>
          Video Management
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition duration-200"
          >
            {showAddForm ? 'Cancel' : 'Add Single Video'}
          </button>
          <button
            onClick={() => setShowMultipleForm(!showMultipleForm)}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition duration-200"
          >
            {showMultipleForm ? 'Cancel' : 'Add Multiple Videos'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg ${
          message.includes('successfully') 
            ? 'bg-green-100 text-green-700 border border-green-200' 
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {/* Add Single Video Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-4">
            {editingVideo ? 'Edit Video' : 'Add New Video'}
          </h4>
          <form onSubmit={editingVideo ? handleEditVideo : handleSingleVideoSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video Title *
                </label>
                <input
                  type="text"
                  value={videoForm.title}
                  onChange={(e) => setVideoForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  YouTube URL *
                </label>
                <input
                  type="url"
                  value={videoForm.url}
                  onChange={(e) => setVideoForm(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  value={videoForm.duration}
                  onChange={(e) => setVideoForm(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  placeholder="e.g., 15:30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order
                </label>
                <input
                  type="number"
                  value={videoForm.order}
                  onChange={(e) => setVideoForm(prev => ({ ...prev, order: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Leave empty for auto-order"
                />
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition duration-200 disabled:opacity-50"
              >
                {loading ? 'Saving...' : (editingVideo ? 'Update Video' : 'Add Video')}
              </button>
              {editingVideo && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingVideo(null);
                    setVideoForm({ title: '', url: '', duration: '', order: '' });
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Add Multiple Videos Form */}
      {showMultipleForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-4">Add Multiple Videos</h4>
          <form onSubmit={handleMultipleVideosSubmit}>
            {multipleVideosForm.videos.map((video, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-white rounded-lg border">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video {index + 1} Title *
                  </label>
                  <input
                    type="text"
                    value={video.title}
                    onChange={(e) => updateMultipleVideoField(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    YouTube URL *
                  </label>
                  <input
                    type="url"
                    value={video.url}
                    onChange={(e) => updateMultipleVideoField(index, 'url', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    placeholder="https://www.youtube.com/watch?v=..."
                    required
                  />
                </div>
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={video.duration}
                      onChange={(e) => updateMultipleVideoField(index, 'duration', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                      placeholder="e.g., 15:30"
                    />
                  </div>
                  {multipleVideosForm.videos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVideoField(index)}
                      className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition duration-200"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={addVideoField}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                + Add Another Video
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition duration-200 disabled:opacity-50"
              >
                {loading ? 'Adding Videos...' : 'Add All Videos'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Current Videos List */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Current Videos ({course.videos?.length || 0})</h4>
        {course.videos && course.videos.length > 0 ? (
          <div className="space-y-3">
            {course.videos.map((video, index) => (
              <div key={video._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {video.order || index + 1}
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">{video.title}</h5>
                    <p className="text-sm text-gray-500">{video.url}</p>
                    {video.duration && (
                      <p className="text-xs text-gray-400">Duration: {video.duration}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEditVideo(video)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition duration-200 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteVideo(video._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-200 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📹</div>
            <p>No videos added yet. Add your first video to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoManager;
