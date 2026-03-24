import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import AdminLayout from '../components/AdminLayout';
import ImageUpload from '../components/ImageUpload';

const CourseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    instructor: '',
    price: '',
    imageUrl: '',
    requirements: '',
    whatYouWillLearn: '',
    video1: '',
    videos: [],
    sections: []
  });

  const [showVideoSection, setShowVideoSection] = useState(false);
  const [videoForm, setVideoForm] = useState({
    title: '',
    url: '',
    duration: ''
  });

  const [showSectionManagement, setShowSectionManagement] = useState(false);
  const [sectionForm, setSectionForm] = useState({
    title: ''
  });

  useEffect(() => {
    if (id) {
      // Editing existing course
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/courses/${id}`);
      setFormData(response.data);
    } catch (err) {
      setError('Failed to fetch course details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVideoChange = (e) => {
    const { name, value } = e.target;
    setVideoForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSectionChange = (e) => {
    const { name, value } = e.target;
    setSectionForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addVideo = () => {
    if (videoForm.title && videoForm.url) {
      const newVideo = {
        ...videoForm,
        order: formData.videos.length + 1
      };
      setFormData(prev => ({
        ...prev,
        videos: [...prev.videos, newVideo]
      }));
      setVideoForm({ title: '', url: '', duration: '' });
    }
  };

  const addSection = () => {
    if (sectionForm.title.trim()) {
      const newSection = {
        id: `section-${Date.now()}`,
        title: sectionForm.title.trim()
      };
      setFormData(prev => ({
        ...prev,
        sections: [...prev.sections, newSection]
      }));
      setSectionForm({ title: '' });
    }
  };

  const removeSection = (index) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  const moveSectionUp = (index) => {
    if (index > 0) {
      const newSections = [...formData.sections];
      [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
      setFormData(prev => ({
        ...prev,
        sections: newSections
      }));
    }
  };

  const moveSectionDown = (index) => {
    if (index < formData.sections.length - 1) {
      const newSections = [...formData.sections];
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
      setFormData(prev => ({
        ...prev,
        sections: newSections
      }));
    }
  };

  const removeVideo = (index) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }));
  };

  const moveVideo = (index, direction) => {
    const newVideos = [...formData.videos];
    if (direction === 'up' && index > 0) {
      [newVideos[index], newVideos[index - 1]] = [newVideos[index - 1], newVideos[index]];
    } else if (direction === 'down' && index < newVideos.length - 1) {
      [newVideos[index], newVideos[index + 1]] = [newVideos[index + 1], newVideos[index]];
    }
    
    // Update order numbers
    newVideos.forEach((video, i) => {
      video.order = i + 1;
    });
    
    setFormData(prev => ({
      ...prev,
      videos: newVideos
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (id) {
        // Update existing course
        await axios.put(`/courses/${id}`, formData);
        setSuccess('Course updated successfully!');
      } else {
        // Create new course
        await axios.post('/courses', formData);
        setSuccess('Course created successfully!');
      }
      
      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout activeTab="courses">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {id ? 'Edit Course' : 'Add New Course'}
            </h1>
            <p className="text-gray-600 mt-2">
              {id ? 'Update the course information below.' : 'Fill in the details to create a new course.'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-600">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Course Name */}
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Course Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter course name"
                />
              </div>

              {/* Instructor */}
              <div>
                <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 mb-2">
                  Instructor *
                </label>
                <input
                  type="text"
                  id="instructor"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter instructor name"
                />
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>





              {/* Course Image Upload */}
              <div className="md:col-span-2">
                <ImageUpload
                  label="Course Image"
                  currentImageUrl={formData.imageUrl}
                  onImageUpload={(imageUrl) => {
                    setFormData(prev => ({
                      ...prev,
                      imageUrl: imageUrl
                    }));
                  }}
                  maxSize={10}
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter a detailed description of the course"
                />
              </div>

              {/* Requirements */}
              <div className="md:col-span-2">
                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What students need to know before taking this course"
                />
              </div>

              {/* What You Will Learn */}
              <div className="md:col-span-2">
                <label htmlFor="whatYouWillLearn" className="block text-sm font-medium text-gray-700 mb-2">
                  What You Will Learn
                </label>
                <textarea
                  id="whatYouWillLearn"
                  name="whatYouWillLearn"
                  value={formData.whatYouWillLearn}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="List the key learning outcomes of this course"
                />
              </div>
              
              {/* Video 1 */}
              <div className="md:col-span-2">
                <label htmlFor="video1" className="block text-sm font-medium text-gray-700 mb-2">
                  Video 1 (YouTube URL)
                </label>
                <input
                  type="url"
                  id="video1"
                  name="video1"
                  value={formData.video1}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              {/* Course Sections Management */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Course Sections</h3>
                  <button
                    type="button"
                    onClick={() => setShowSectionManagement(!showSectionManagement)}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition duration-200"
                  >
                    {showSectionManagement ? 'Hide' : 'Manage Sections'}
                  </button>
                </div>
                
                {showSectionManagement && (
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    {/* Add Section Form */}
                    <div className="flex gap-4 mb-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Section Title *
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={sectionForm.title}
                          onChange={handleSectionChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="e.g., Introduction, Advanced Topics, Conclusion"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={addSection}
                          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
                        >
                          Add Section
                        </button>
                      </div>
                    </div>

                    {/* Sections List */}
                    {formData.sections.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Course Sections ({formData.sections.length})</h4>
                        {formData.sections.map((section, index) => (
                          <div key={section.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                            <div className="flex items-center space-x-3">
                              <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{section.title}</p>
                                <p className="text-xs text-gray-500">ID: {section.id}</p>
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              <button
                                type="button"
                                onClick={() => moveSectionUp(index)}
                                disabled={index === 0}
                                className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 disabled:opacity-50"
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                onClick={() => moveSectionDown(index)}
                                disabled={index === formData.sections.length - 1}
                                className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 disabled:opacity-50"
                              >
                                ↓
                              </button>
                              <button
                                type="button"
                                onClick={() => removeSection(index)}
                                className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {formData.sections.length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        <p>No sections added yet. Add sections to organize your course content.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Advanced Video Management */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Advanced Video Management</h3>
                  <button
                    type="button"
                    onClick={() => setShowVideoSection(!showVideoSection)}
                    className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition duration-200"
                  >
                    {showVideoSection ? 'Hide' : 'Add Multiple Videos'}
                  </button>
                </div>
                
                {showVideoSection && (
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    {/* Add Video Form */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Video Title *
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={videoForm.title}
                          onChange={handleVideoChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                          placeholder="Enter video title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          YouTube URL *
                        </label>
                        <input
                          type="url"
                          name="url"
                          value={videoForm.url}
                          onChange={handleVideoChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                          placeholder="https://www.youtube.com/watch?v=..."
                        />
                      </div>
                      <div className="flex items-end">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Duration
                          </label>
                          <input
                            type="text"
                            name="duration"
                            value={videoForm.duration}
                            onChange={handleVideoChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                            placeholder="e.g., 15:30"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={addVideo}
                          className="ml-2 bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition duration-200"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Videos List */}
                    {formData.videos.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Added Videos ({formData.videos.length})</h4>
                        {formData.videos.map((video, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                            <div className="flex items-center space-x-3">
                              <div className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                {video.order}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{video.title}</p>
                                <p className="text-sm text-gray-500">{video.url}</p>
                                {video.duration && (
                                  <p className="text-xs text-gray-400">Duration: {video.duration}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              <button
                                type="button"
                                onClick={() => moveVideo(index, 'up')}
                                disabled={index === 0}
                                className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 disabled:opacity-50"
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                onClick={() => moveVideo(index, 'down')}
                                disabled={index === formData.videos.length - 1}
                                className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 disabled:opacity-50"
                              >
                                ↓
                              </button>
                              <button
                                type="button"
                                onClick={() => removeVideo(index)}
                                className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : (id ? 'Update Course' : 'Create Course')}
              </button>
            </div>
          </form>
        </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CourseForm;
