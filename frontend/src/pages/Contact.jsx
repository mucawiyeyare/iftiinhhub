import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Contact = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '', message: '' });
  const [sent, setSent] = useState(false);
  const [isEnrollmentRequest, setIsEnrollmentRequest] = useState(false);

  // Pre-fill form if coming from course enrollment request
  useEffect(() => {
    if (location.state) {
      const { subject, message, courseDetails } = location.state;
      if (subject && message && courseDetails) {
        setIsEnrollmentRequest(true);
        setForm({
          name: user?.name || '',
          email: user?.email || '',
          whatsapp: '',
          message: message
        });
      }
    }
  }, [location.state, user]);

  const [error, setError] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!window.confirm('Are you sure to send message? (Yes or No)')) {
      return;
    }
    
    try {
      await axios.post('/messages', {
        name: form.name,
        email: form.email,
        whatsapp: form.whatsapp,
        message: form.message,
        type: isEnrollmentRequest ? 'enrollment_request' : 'general',
        courseDetails: isEnrollmentRequest ? location.state?.courseDetails : null,
        subject: isEnrollmentRequest ? location.state?.subject : 'General Inquiry',
      });
      setSent(true);
      setTimeout(() => setSent(false), 4000);
      setForm({ name: '', email: '', whatsapp: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-purple-800 mb-2">
            {isEnrollmentRequest ? 'Course Enrollment Request' : 'Contact Us'}
          </h1>
          <p className="text-purple-700">
            {isEnrollmentRequest 
              ? 'Submit your enrollment request and we\'ll get back to you soon.' 
              : 'We\'d love to hear from you. Send us a message and we\'ll respond soon.'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center mb-3">
              <svg className="w-6 h-6 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="font-semibold text-purple-900">Email</h3>
            </div>
            <p className="text-purple-700">Iftiinhub@gmail.com</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center mb-3">
              <svg className="w-6 h-6 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <h3 className="font-semibold text-purple-900">Phone</h3>
            </div>
            <p className="text-purple-700">616408886</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center mb-3">
              <svg className="w-6 h-6 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="font-semibold text-purple-900">Address</h3>
            </div>
            <p className="text-purple-700">Mogdisho,somlia</p>
          </div>
        </div>

        {/* Course Details Card for Enrollment Requests */}
        {isEnrollmentRequest && location.state?.courseDetails && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-2xl font-semibold text-purple-900 mb-4 flex items-center">
              📚 Course Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Course Name</p>
                <p className="font-semibold text-gray-900">{location.state.courseDetails.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Instructor</p>
                <p className="font-semibold text-gray-900">{location.state.courseDetails.instructor}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Price</p>
                <p className="font-semibold text-blue-600">${location.state.courseDetails.price}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Level</p>
                <p className="font-semibold text-gray-900 capitalize">{location.state.courseDetails.level}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-semibold text-gray-900">{location.state.courseDetails.category}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold text-purple-900 mb-4">
            {isEnrollmentRequest ? 'Enrollment Request Form' : 'Send a Message'}
          </h2>
          {sent && (
            <div className="mb-4 p-3 rounded bg-purple-50 border border-purple-200 text-purple-700">
              {isEnrollmentRequest 
                ? "message send succesfully ,Admin will contact you" 
                : 'message send succesfully ,Admin will contact you'
              }
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700">
              {error}
            </div>
          )}
          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Your Name"
                  className="w-full pl-4 pr-3 py-3 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="Your Email"
                  className="w-full pl-4 pr-3 py-3 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-green-600 font-bold text-lg select-none" style={{ lineHeight: 1 }}>📱</span>
              <input
                type="tel"
                name="whatsapp"
                value={form.whatsapp}
                onChange={onChange}
                placeholder="Geli WhatsApp Numberkada"
                className="w-full pl-10 pr-3 py-3 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="relative">
              <textarea
                name="message"
                value={form.message}
                onChange={onChange}
                placeholder="Your Message"
                rows={5}
                className="w-full pl-4 pr-3 py-3 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-semibold">
                {isEnrollmentRequest ? 'Submit Enrollment Request' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;


