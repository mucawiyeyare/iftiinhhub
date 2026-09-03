import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import AdminLayout from '../components/AdminLayout';
import ImageUpload from '../components/ImageUpload';
import PageTitle from '../components/PageTitle';

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
    instructorImage: '',
    duration: '',
    price: '',
    originalPrice: '',
    imageUrl: '',
    requirements: '',
    whatYouWillLearn: '',
    video1: '',
    videos: [],
    sections: []
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
      const data = response.data;
      if (Array.isArray(data.whatYouWillLearn)) {
        data.whatYouWillLearn = data.whatYouWillLearn.join('\n');
      }
      setFormData(prev => ({
        ...prev,
        ...data
      }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        name: formData.name?.trim(),
        instructor: formData.instructor?.trim(),
        duration: formData.duration?.trim() || '12 Weeks',
        instructorImage: formData.instructorImage || '',
        imageUrl: formData.imageUrl || '',
        description: formData.description?.trim(),
        requirements: formData.requirements?.trim() || '',
        whatYouWillLearn: formData.whatYouWillLearn || '',
        price: 0
      };

      if (id) {
        // Update existing course
        await axios.put(`/courses/${id}`, payload);
        setSuccess('Course updated successfully!');
      } else {
        // Create new course
        await axios.post('/courses', payload);
        setSuccess('Course created successfully!');
      }
      
      setTimeout(() => {
        navigate('/admin-dashboard');
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || err.message || 'Something went wrong';
      setError(msg);
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
      <PageTitle title={id ? 'Edit Course - IFTIINHUB' : 'Add Course - IFTIINHUB'} />
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

              {/* Instructor Name */}
              <div>
                <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 mb-2">
                  Instructor Name *
                </label>
                <input
                  type="text"
                  id="instructor"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter instructor name (e.g. Eng. Abdirahman Mohamed)"
                />
              </div>

              {/* Course Duration */}
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                  Course Duration
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. 16 Weeks or 3 Months (4 Days/Week)"
                />
              </div>

              {/* Instructor Image Upload */}
              <div className="md:col-span-2">
                <ImageUpload
                  label="Instructor Image / Avatar"
                  currentImageUrl={formData.instructorImage}
                  onImageUpload={(imageUrl) => {
                    setFormData(prev => ({
                      ...prev,
                      instructorImage: imageUrl
                    }));
                  }}
                  maxSize={5}
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
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/admin-dashboard')}
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
