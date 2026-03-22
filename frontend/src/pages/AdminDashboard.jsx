import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const AdminDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [messages, setMessages] = useState([]);
  const [videoStats, setVideoStats] = useState({
    totalVideos: 0,
    coursesWithVideos: 0,
    averageVideosPerCourse: 0
  });
  const [toast, setToast] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Sidebar menu items
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" />
      </svg>
    ) },
    { id: 'courses', label: 'Courses', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ) },
    { id: 'students', label: 'Students', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ) },
    { id: 'users', label: 'Users', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
      </svg>
    ) },
    { id: 'register', label: 'Register User', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ) },
    { id: 'profile', label: 'Profile', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ) },
    { id: 'enrollments', label: 'Enrollments', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
      </svg>
    ) },
    { id: 'videos', label: 'Video Management', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ) },
    { id: 'messages', label: 'Messages', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h6m5 8l-4-4H7a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v12z" />
      </svg>
    ) },
  ];
  
  // Derived counts for sidebar badges
  const sidebarCounts = {
    courses: courses.length,
    students: users.filter(u => u.role === 'student').length,
    users: users.length,
    enrollments: recentEnrollments.length,
    videos: videoStats.totalVideos,
    messages: messages.length,
  };
  
  // State for edit user modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [editUserData, setEditUserData] = useState({
    name: '',
    email: '',
    role: 'student',
    password: '',
    confirmPassword: ''
  });
  
  // State for search terms
  const [courseSearchTerm, setCourseSearchTerm] = useState('');
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [studentCourseSearchTerm, setStudentCourseSearchTerm] = useState('');
  
  // State for enrollment functionality
  const [enrollStudentId, setEnrollStudentId] = useState('');
  const [enrollCourseId, setEnrollCourseId] = useState('');
  const [enrollmentMessage, setEnrollmentMessage] = useState('');
  const [enrollStudentSearch, setEnrollStudentSearch] = useState('');
  
  // Video management state
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedCourseForVideo, setSelectedCourseForVideo] = useState(null);
  const [videoData, setVideoData] = useState({
    title: '',
    url: '',
    duration: '',
    section: ''
  });
  const [addingVideo, setAddingVideo] = useState(false);
  
  // Section management state
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [addingSection, setAddingSection] = useState(false);
  const [showSectionsView, setShowSectionsView] = useState(false);
  const [selectedCourseForSections, setSelectedCourseForSections] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [editSectionName, setEditSectionName] = useState('');

  useEffect(() => {
    // Handle redirect toast from Register page
    const state = location.state;
    if (state && (state.toast || state.highlight)) {
      if (state.toast) {
        setToast(state.toast);
        setTimeout(() => setToast(''), 4000);
      }
      if (state.highlight === 'users') {
        setActiveTab('users');
      }
      // Clear location state
      navigate('.', { replace: true, state: {} });
    }

    fetchDashboardData();
    try {
      const stored = JSON.parse(localStorage.getItem('contactMessages') || '[]');
      setMessages(stored);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, coursesRes, usersRes, enrollmentsRes] = await Promise.all([
        axios.get('/dashboard/stats'),
        axios.get('/courses'),
        axios.get('/users'),
        axios.get('/dashboard/recent-enrollments')
      ]);
      
      setStats(statsRes.data);
      setCourses(coursesRes.data);
      setUsers(usersRes.data);
      setRecentEnrollments(enrollmentsRes.data);
      
      // Calculate video statistics
      calculateVideoStats(coursesRes.data);
    } catch (error) {
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculateVideoStats = (coursesData) => {
    let totalVideos = 0;
    let coursesWithVideos = 0;
    
    coursesData.forEach(course => {
      const courseVideos = course.videos?.length || 0;
      const legacyVideos = (course.video1 ? 1 : 0) + (course.video2 ? 1 : 0);
      const totalCourseVideos = courseVideos + legacyVideos;
      
      totalVideos += totalCourseVideos;
      if (totalCourseVideos > 0) {
        coursesWithVideos++;
      }
    });
    
    setVideoStats({
      totalVideos,
      coursesWithVideos,
      averageVideosPerCourse: coursesWithVideos > 0 ? Math.round(totalVideos / coursesWithVideos * 10) / 10 : 0
    });
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`/courses/${courseId}`);
        setCourses(courses.filter(course => course._id !== courseId));
      } catch (error) {
        alert('Failed to delete course');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/users/${userId}`);
        setUsers(users.filter(user => user._id !== userId));
      } catch (error) {
        alert('Failed to delete user');
      }
    }
  };

  // Function to open edit modal with user data
  const handleEditUser = (user) => {
    setCurrentUser(user);
    setEditUserData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '',
      confirmPassword: ''
    });
    setShowPasswordFields(false);
    setIsEditModalOpen(true);
  };

  // Function to handle input changes in edit form
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to handle user update
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    
    // Validate password if password fields are shown
    if (showPasswordFields) {
      if (!editUserData.password) {
        alert('Please enter a new password');
        return;
      }
      
      if (editUserData.password !== editUserData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      
      if (editUserData.password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
      }
    }
    
    try {
      // Prepare data to send (only include password if it's provided)
      const updateData = {
        name: editUserData.name,
        email: editUserData.email,
        role: editUserData.role
      };
      
      // Only include password if password fields are shown and password is provided
      if (showPasswordFields && editUserData.password.trim()) {
        updateData.password = editUserData.password;
      }
      
      const res = await axios.put(`/users/${currentUser._id}`, updateData);
      setUsers(users.map(user => user._id === currentUser._id ? res.data : user));
      setIsEditModalOpen(false);
      setToast('User updated successfully');
      setTimeout(() => setToast(''), 3000);
    } catch (error) {
      console.error('Update error:', error);
      alert(error.response?.data?.message || 'Failed to update user');
    }
  };
  
  // Function to handle student enrollment
  const handleEnrollStudent = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/enrollments/admin', {
        studentId: enrollStudentId,
        courseId: enrollCourseId
      });
      setEnrollmentMessage('Student successfully enrolled in course');
      setTimeout(() => setEnrollmentMessage(''), 3000);
      // Reset form
      setEnrollStudentId('');
      setEnrollCourseId('');
    } catch (error) {
      setEnrollmentMessage('Failed to enroll student: ' + (error.response?.data?.message || error.message));
      setTimeout(() => setEnrollmentMessage(''), 3000);
    }
  };

  // Video management functions
  const openVideoModal = (course) => {
    setSelectedCourseForVideo(course);
    setShowVideoModal(true);
    setVideoData({
      title: '',
      url: '',
      duration: '',
      section: course.sections && course.sections.length > 0 ? course.sections[0].id : ''
    });
  };

  // Section management functions
  const openSectionModal = (course) => {
    setSelectedCourseForVideo(course);
    setShowSectionModal(true);
    setNewSectionName('');
  };

  const handleAddSection = async (e) => {
    e.preventDefault();
    if (!newSectionName.trim()) {
      setToast('Please enter a section name');
      setTimeout(() => setToast(''), 3000);
      return;
    }

    try {
      setAddingSection(true);
      const sectionId = newSectionName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const newSection = {
        id: sectionId,
        title: newSectionName.trim()
      };

      const courseResponse = await axios.get(`/courses/${selectedCourseForVideo._id}`);
      const currentCourse = courseResponse.data;
      const updatedSections = [...(currentCourse.sections || []), newSection];

      await axios.put(`/courses/${selectedCourseForVideo._id}`, {
        ...currentCourse,
        sections: updatedSections
      });

      setToast(`Section "${newSectionName}" added successfully`);
      setTimeout(() => setToast(''), 3000);
      setShowSectionModal(false);
      fetchDashboardData();
    } catch (error) {
      setToast('Failed to add section: ' + (error.response?.data?.message || error.message));
      setTimeout(() => setToast(''), 3000);
    } finally {
      setAddingSection(false);
    }
  };

  // Section view and management functions
  const openSectionsView = (course) => {
    setSelectedCourseForSections(course);
    setShowSectionsView(true);
  };

  const handleEditSection = (section) => {
    setEditingSection(section);
    setEditSectionName(section.title);
  };

  const handleUpdateSection = async (e) => {
    e.preventDefault();
    if (!editSectionName.trim()) {
      setToast('Please enter a section name');
      setTimeout(() => setToast(''), 3000);
      return;
    }

    try {
      const courseResponse = await axios.get(`/courses/${selectedCourseForSections._id}`);
      const currentCourse = courseResponse.data;
      const updatedSections = currentCourse.sections.map(section => 
        section.id === editingSection.id 
          ? { ...section, title: editSectionName.trim() }
          : section
      );

      await axios.put(`/courses/${selectedCourseForSections._id}`, {
        ...currentCourse,
        sections: updatedSections
      });

      setToast(`Section updated successfully`);
      setTimeout(() => setToast(''), 3000);
      setEditingSection(null);
      setEditSectionName('');
      fetchDashboardData();
      
      // Update the selected course data
      setSelectedCourseForSections({
        ...selectedCourseForSections,
        sections: updatedSections
      });
    } catch (error) {
      setToast('Failed to update section: ' + (error.response?.data?.message || error.message));
      setTimeout(() => setToast(''), 3000);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!window.confirm('Are you sure you want to delete this section? This action cannot be undone.')) {
      return;
    }

    try {
      const courseResponse = await axios.get(`/courses/${selectedCourseForSections._id}`);
      const currentCourse = courseResponse.data;
      const updatedSections = currentCourse.sections.filter(section => section.id !== sectionId);

      await axios.put(`/courses/${selectedCourseForSections._id}`, {
        ...currentCourse,
        sections: updatedSections
      });

      setToast(`Section deleted successfully`);
      setTimeout(() => setToast(''), 3000);
      fetchDashboardData();
      
      // Update the selected course data
      setSelectedCourseForSections({
        ...selectedCourseForSections,
        sections: updatedSections
      });
    } catch (error) {
      setToast('Failed to delete section: ' + (error.response?.data?.message || error.message));
      setTimeout(() => setToast(''), 3000);
    }
  };

  const handleVideoInputChange = (e) => {
    const { name, value } = e.target;
    setVideoData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeleteVideo = async (courseId, videoId) => {
    if (!window.confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`/courses/${courseId}/videos/${videoId}`);
      setToast('Video deleted successfully');
      setTimeout(() => setToast(''), 3000);
      
      // Update local state without fetching the whole dashboard again
      const courseIndex = courses.findIndex(c => c._id === courseId);
      if (courseIndex !== -1) {
        const updatedCourses = [...courses];
        updatedCourses[courseIndex] = {
          ...updatedCourses[courseIndex],
          videos: updatedCourses[courseIndex].videos.filter(v => v._id !== videoId)
        };
        setCourses(updatedCourses);
        calculateVideoStats(updatedCourses);
      } else {
        fetchDashboardData();
      }
    } catch (error) {
      setToast('Failed to delete video: ' + (error.response?.data?.message || error.message));
      setTimeout(() => setToast(''), 3000);
    }
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    if (!videoData.title || !videoData.url || !videoData.section) {
      setToast('Please fill in title, URL, and select a section.');
      setTimeout(() => setToast(''), 3000);
      return;
    }

    try {
      setAddingVideo(true);
      const videoToAdd = { ...videoData };

      // Fetch the latest course data, add the new video, and update the course.
      const courseResponse = await axios.get(`/courses/${selectedCourseForVideo._id}`);
      const currentCourse = courseResponse.data;
      const updatedVideos = [...(currentCourse.videos || []), videoToAdd];

      await axios.put(`/courses/${selectedCourseForVideo._id}`, {
        ...currentCourse,
        videos: updatedVideos
      });

      setToast(`Video "${videoData.title}" added successfully to ${selectedCourseForVideo.name}`);
      setTimeout(() => setToast(''), 3000);
      setShowVideoModal(false);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      setToast('Failed to add video: ' + (error.response?.data?.message || error.message));
      setTimeout(() => setToast(''), 3000);
    } finally {
      setAddingVideo(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-600 text-white px-4 py-3 rounded shadow-lg">
            {toast}
          </div>
        </div>
      )}
      
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white p-2 rounded-lg shadow-lg border border-gray-200"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-purple-950 bg-opacity-60 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Professional Sidebar */}
      <aside className={`w-72 bg-white shadow-lg min-h-screen fixed left-0 top-0 z-40 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Brand Header */}
        <div className="px-6 py-8 border-b border-purple-500 bg-purple-500 ">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link
                to="/"
                className="flex items-center p-2 text-purple-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200 group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5 text-white group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h2 className="text-xl font-bold text-white tracking-wide ">IFTIINHUB ADMIN</h2>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden p-1 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        
        {/* Navigation */}
        <nav className="px-4 py-6">
          <div className="space-y-1">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-all duration-200 group ${
                  activeTab === item.id
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="flex items-center space-x-3">
                  <span className={`w-5 h-5 ${
                    activeTab === item.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                  }`}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </span>
                {sidebarCounts[item.id] !== undefined && (
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    activeTab === item.id 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                  }`}>
                    {sidebarCounts[item.id]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-72 ml-0">
        <div className="p-6 md:p-6 pt-16 md:pt-6">
            {/* Overview Section */}
            {activeTab === 'overview' && stats && (
              <div>
                {/* Header */}
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                      <p className="mt-1 text-gray-600">Welcome back, {user?.name}!</p>
                    </div>
                    <Link
                      to="/courses"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-200 font-medium"
                    >
                      View All Courses
                    </Link>
                  </div>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-lg p-3">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="bg-green-100 rounded-lg p-3">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Students</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="bg-yellow-100 rounded-lg p-3">
                      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Courses</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="bg-purple-100 rounded-lg p-3">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Enrollments</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalEnrollments}</p>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            )}

            {/* Content card */}
            <div className="bg-white rounded-lg shadow mb-6">
              {/* Mobile tabs nav */}
              <div className="border-b border-gray-200 md:hidden">
                <nav className="-mb-px flex space-x-4 px-4 overflow-x-auto">
                  {menuItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`py-3 px-2 whitespace-nowrap border-b-2 text-sm font-medium ${
                        activeTab === item.id ? 'border-purple-600 text-purple-700' : 'border-transparent text-gray-600'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
            {activeTab === 'messages' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Contact Messages</h2>
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        try {
                          const stored = JSON.parse(localStorage.getItem('contactMessages') || '[]');
                          setMessages(stored);
                        } catch {}
                      }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    >
                      Refresh
                    </button>
                    <button
                      onClick={() => {
                        localStorage.setItem('contactMessages', JSON.stringify([]));
                        setMessages([]);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {messages.length === 0 ? (
                  <div className="text-gray-500">No messages found.</div>
                ) : (
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Received</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {messages.map((m) => (
                            <tr key={m.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{m.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-700">{m.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{m.whatsapp || 'N/A'}</td>
                              <td className="px-6 py-4 text-sm text-gray-700 max-w-lg">{m.message}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(m.createdAt).toLocaleString()}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  onClick={() => {
                                    const updated = messages.filter(x => x.id !== m.id);
                                    localStorage.setItem('contactMessages', JSON.stringify(updated));
                                    setMessages(updated);
                                  }}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* Courses Tab */}
            {activeTab === 'courses' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Course Management</h2>
                  <Link
                    to="/courses/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                  >
                    Add New Course
                  </Link>
                </div>
                {/* Search Bar for Courses */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search courses..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={courseSearchTerm}
                    onChange={(e) => setCourseSearchTerm(e.target.value)}
                  />
                </div>
                <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Course
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Instructor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Level
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {courses
                        .filter(course =>
                          course.name.toLowerCase().includes(courseSearchTerm.toLowerCase()) ||
                          course.category.toLowerCase().includes(courseSearchTerm.toLowerCase()) ||
                          course.instructor.toLowerCase().includes(courseSearchTerm.toLowerCase())
                        )
                        .map(course => (
                          <tr key={course._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{course.name}</div>
                                <div className="text-sm text-gray-500">{course.category}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {course.instructor}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${course.price}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                course.level === 'beginner' ? 'bg-green-100 text-green-800' :
                                course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleDeleteCourse(course._id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Delete
                                </button>
                                <Link
                                  to={`/courses/${course._id}/edit`}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  Edit
                                </Link>
                                <Link
                                  to={`/courses/${course._id}/learn`}
                                  className="bg-green-600 text-white px-2 py-1 rounded-md hover:bg-green-700 transition-colors text-xs"
                                >
                                  Manage
                                </Link>
                                <button
                                  onClick={() => openVideoModal(course)}
                                  className="bg-purple-600 text-white px-2 py-1 rounded-md hover:bg-purple-700 transition-colors text-xs"
                                >
                                  Add Video
                                </button>
                                <button
                                  onClick={() => openSectionModal(course)}
                                  className="bg-indigo-600 text-white px-2 py-1 rounded-md hover:bg-indigo-700 transition-colors text-xs"
                                >
                                  Add Section
                                </button>
                                <button
                                  onClick={() => openSectionsView(course)}
                                  className="bg-gray-600 text-white px-2 py-1 rounded-md hover:bg-gray-700 transition-colors text-xs"
                                >
                                  View Sections
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Students Tab */}
            {activeTab === 'students' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Student Management</h2>
                {/* Search Bar for Students */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search students..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={studentSearchTerm}
                    onChange={(e) => setStudentSearchTerm(e.target.value)}
                  />
                </div>
                <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users
                        .filter(user => user.role === 'student')
                        .filter(student =>
                          student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
                          student.email.toLowerCase().includes(studentSearchTerm.toLowerCase())
                        )
                        .map(student => (
                          <tr key={student._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {student.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(student.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleDeleteUser(student._id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                              <button
                                onClick={() => handleEditUser(student)}
                                className="text-blue-600 hover:text-blue-900 ml-3"
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">User Management</h2>
                {/* Search Bar for Users */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                  />
                </div>
                <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users
                        .filter(user =>
                          user.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                          user.email?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                          user.role?.toLowerCase().includes(userSearchTerm.toLowerCase())
                        )
                        .map(user => (
                          <tr key={user._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                              <button
                                onClick={() => handleEditUser(user)}
                                className="text-blue-600 hover:text-blue-900 ml-3"
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Enrollments Tab */}
            {activeTab === 'enrollments' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Enroll Students in Courses</h2>
                {enrollmentMessage && (
                  <div className={`mb-4 p-4 rounded-md ${enrollmentMessage.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {enrollmentMessage}
                  </div>
                )}
                <form onSubmit={handleEnrollStudent} className="bg-white rounded-lg shadow p-6 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* ── Student Picker ── */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Select Student</label>

                      {/* If no student selected yet: show search + list */}
                      {!enrollStudentId ? (
                        <>
                          <div className="relative mb-2">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
                            </svg>
                            <input
                              type="text"
                              placeholder="Search student by name or email..."
                              value={enrollStudentSearch}
                              onChange={(e) => setEnrollStudentSearch(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            {enrollStudentSearch && (
                              <button type="button" onClick={() => setEnrollStudentSearch('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
                            )}
                          </div>
                          <div className="border border-gray-200 rounded-md overflow-hidden max-h-52 overflow-y-auto">
                            {users
                              .filter(u => u.role === 'student' &&
                                (u.name.toLowerCase().includes(enrollStudentSearch.toLowerCase()) ||
                                 u.email.toLowerCase().includes(enrollStudentSearch.toLowerCase()))
                              )
                              .map(student => (
                                <button
                                  key={student._id}
                                  type="button"
                                  onClick={() => { setEnrollStudentId(student._id); setEnrollStudentSearch(''); }}
                                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                                >
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                    {student.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-gray-900 truncate">{student.name}</div>
                                    <div className="text-xs text-gray-500 truncate">{student.email}</div>
                                  </div>
                                </button>
                              ))}
                            {users.filter(u => u.role === 'student' &&
                              (u.name.toLowerCase().includes(enrollStudentSearch.toLowerCase()) ||
                               u.email.toLowerCase().includes(enrollStudentSearch.toLowerCase()))
                            ).length === 0 && (
                              <div className="px-4 py-3 text-sm text-gray-400 text-center">No students found</div>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {users.filter(u => u.role === 'student' &&
                              (u.name.toLowerCase().includes(enrollStudentSearch.toLowerCase()) ||
                               u.email.toLowerCase().includes(enrollStudentSearch.toLowerCase()))
                            ).length} student(s)
                          </p>
                        </>
                      ) : (
                        /* If a student IS selected: show card, hide the list */
                        (() => {
                          const sel = users.find(u => u._id === enrollStudentId);
                          return sel ? (
                            <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                                {sel.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-gray-900">{sel.name}</div>
                                <div className="text-xs text-gray-500">{sel.email}</div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setEnrollStudentId('')}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap"
                              >
                                Change
                              </button>
                            </div>
                          ) : null;
                        })()
                      )}
                    </div>

                    {/* ── Course Picker ── */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Select Course</label>
                      <select
                        value={enrollCourseId}
                        onChange={(e) => setEnrollCourseId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Choose a course</option>
                        {courses.map(course => (
                          <option key={course._id} value={course._id}>
                            {course.name} ({course.category})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 font-medium"
                    >
                      Enroll Student
                    </button>
                  </div>
                </form>

                {/* ── Recently Enrolled ── */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Recently Enrolled</h3>
                    <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-full">
                      {recentEnrollments.length} total
                    </span>
                  </div>
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    {recentEnrollments.length === 0 ? (
                      <div className="px-6 py-8 text-center text-gray-400">
                        <svg className="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        No enrollments yet
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled On</th>
                              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-100">
                            {recentEnrollments.map(enrollment => (
                              <tr key={enrollment._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-5 py-3 whitespace-nowrap">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                      {(enrollment.studentId?.name || '?').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">{enrollment.studentId?.name || 'Unknown'}</div>
                                      <div className="text-xs text-gray-500">{enrollment.studentId?.email || ''}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-5 py-3 whitespace-nowrap">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                    📚 {enrollment.courseId?.name || 'Unknown Course'}
                                  </span>
                                </td>
                                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-500">
                                  {enrollment.enrolledAt ? new Date(enrollment.enrolledAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                                </td>
                                <td className="px-5 py-3 whitespace-nowrap">
                                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    enrollment.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    {enrollment.status ? enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1) : 'Active'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Students & Their Courses ── */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">Students & Their Courses</h3>
                      <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-3 py-1 rounded-full">
                        {users.filter(u => u.role === 'student' && 
                          (u.name.toLowerCase().includes(studentCourseSearchTerm.toLowerCase()) || 
                           u.email.toLowerCase().includes(studentCourseSearchTerm.toLowerCase()))
                        ).length} students
                      </span>
                    </div>
                    {/* Search box for this table */}
                    <div className="relative w-full sm:w-72">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={studentCourseSearchTerm}
                        onChange={(e) => setStudentCourseSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                      {studentCourseSearchTerm && (
                        <button type="button" onClick={() => setStudentCourseSearchTerm('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
                      )}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courses Learning</th>
                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {users.filter(u => u.role === 'student' && 
                            (u.name.toLowerCase().includes(studentCourseSearchTerm.toLowerCase()) || 
                             u.email.toLowerCase().includes(studentCourseSearchTerm.toLowerCase()))
                          ).map(student => {
                            const studentEnrollments = recentEnrollments.filter(
                              e => e.studentId?._id === student._id || e.studentId === student._id
                            );
                            return (
                              <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-5 py-3 whitespace-nowrap">
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-teal-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                      {student.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                      <div className="text-xs text-gray-500">{student.email}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-5 py-3">
                                  {studentEnrollments.length === 0 ? (
                                    <span className="text-xs text-gray-400 italic">No courses yet</span>
                                  ) : (
                                    <div className="flex flex-wrap gap-1">
                                      {studentEnrollments.map(e => (
                                        <span key={e._id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                          {e.courseId?.name || 'Course'}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </td>
                                <td className="px-5 py-3 whitespace-nowrap">
                                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${
                                    studentEnrollments.length > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'
                                  }`}>
                                    {studentEnrollments.length}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                          {users.filter(u => u.role === 'student' && 
                            (u.name.toLowerCase().includes(studentCourseSearchTerm.toLowerCase()) || 
                             u.email.toLowerCase().includes(studentCourseSearchTerm.toLowerCase()))
                          ).length === 0 && (
                            <tr>
                              <td colSpan="3" className="px-6 py-8 text-center text-gray-400">
                                {studentCourseSearchTerm ? "No matching students found" : "No students registered yet"}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

              </div>
            )}


            {/* Video Management Tab */}

            {activeTab === 'videos' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Video Management</h2>
                </div>

                                 {/* Video Statistics */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6 border border-pink-200">
                    <div className="flex items-center">
                      <div className="bg-pink-100 rounded-lg p-3">
                        <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Videos</p>
                        <p className="text-2xl font-bold text-gray-900">{videoStats.totalVideos}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                    <div className="flex items-center">
                      <div className="bg-purple-100 rounded-lg p-3">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Courses with Videos</p>
                        <p className="text-2xl font-bold text-gray-900">{videoStats.coursesWithVideos}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                    <div className="flex items-center">
                      <div className="bg-blue-100 rounded-lg p-3">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Avg Videos/Course</p>
                        <p className="text-2xl font-bold text-gray-900">{videoStats.averageVideosPerCourse}</p>
                      </div>
                    </div>
                  </div>
                </div>

                                 {/* Courses with Videos */}
                 <div className="bg-white rounded-lg shadow overflow-hidden">
                   <div className="px-6 py-4 border-b border-gray-200">
                     <h3 className="text-lg font-medium text-gray-900">Courses with Videos</h3>
                     <p className="text-sm text-gray-600 mt-1">Click on any course to view and manage its videos</p>
                   </div>
                  <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Course
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Instructor
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Videos
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {courses
                          .filter(course => {
                            const courseVideos = course.videos?.length || 0;
                            const legacyVideos = (course.video1 ? 1 : 0) + (course.video2 ? 1 : 0);
                            return courseVideos + legacyVideos > 0;
                          })
                          .map((course) => {
                            const courseVideos = course.videos?.length || 0;
                            const legacyVideos = (course.video1 ? 1 : 0) + (course.video2 ? 1 : 0);
                            const totalVideos = courseVideos + legacyVideos;
                            
                            return (
                              <tr key={course._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                      {course.imageUrl ? (
                                        <img className="h-10 w-10 rounded-lg object-cover" src={course.imageUrl} alt={course.name} />
                                      ) : (
                                        <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
                                          <span className="text-white font-bold text-sm">{course.name.charAt(0)}</span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{course.name}</div>
                                      <div className="text-sm text-gray-500">{course.category}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {course.instructor}
                                </td>
                                                                 <td className="px-6 py-4 whitespace-nowrap">
                                   <div className="flex items-center">
                                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                                       {totalVideos} {totalVideos === 1 ? 'video' : 'videos'}
                                     </span>
                                     {courseVideos > 0 && (
                                       <span className="ml-2 text-xs text-gray-500">
                                         ({courseVideos} new format)
                                       </span>
                                     )}
                                   </div>
                                   {/* Show video titles if available */}
                                   {course.videos && course.videos.length > 0 && (
                                     <div className="mt-2 text-xs text-gray-600">
                                       <div className="font-medium mb-1">Uploaded Videos:</div>
                                       {course.videos.slice(0, 3).map((video, idx) => (
                                         <div key={idx} className="flex items-center">
                                           <span className="w-2 h-2 bg-pink-400 rounded-full mr-2"></span>
                                           <span className="truncate">{video.title}</span>
                                         </div>
                                       ))}
                                       {course.videos.length > 3 && (
                                         <div className="text-gray-500 italic">
                                           +{course.videos.length - 3} more videos
                                         </div>
                                       )}
                                     </div>
                                   )}
                                 </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex space-x-2">
                                    <Link
                                      to={`/courses/${course._id}`}
                                      className="text-blue-600 hover:text-blue-900 transition duration-200"
                                    >
                                      View Course
                                    </Link>
                                    <Link
                                      to={`/courses/${course._id}/learn`}
                                      className="text-green-600 hover:text-green-900 transition duration-200"
                                    >
                                      Play Videos
                                    </Link>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Courses without Videos */}
                <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Courses without Videos</h3>
                  </div>
                  <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Course
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Instructor
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {courses
                          .filter(course => {
                            const courseVideos = course.videos?.length || 0;
                            const legacyVideos = (course.video1 ? 1 : 0) + (course.video2 ? 1 : 0);
                            return courseVideos + legacyVideos === 0;
                          })
                          .map((course) => (
                            <tr key={course._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                                    {course.imageUrl ? (
                                      <img className="h-10 w-10 rounded-lg object-cover" src={course.imageUrl} alt={course.name} />
                                    ) : (
                                      <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">{course.name.charAt(0)}</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{course.name}</div>
                                    <div className="text-sm text-gray-500">{course.category}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {course.instructor}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <Link
                                    to={`/courses/${course._id}`}
                                    className="text-blue-600 hover:text-blue-900 transition duration-200"
                                  >
                                    View Course
                                  </Link>
                                  <Link
                                    to={`/courses/${course._id}/edit`}
                                    className="text-purple-600 hover:text-purple-900 transition duration-200"
                                  >
                                    Add Videos
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* All Uploaded Videos Overview */}
                <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">All Uploaded Videos Overview</h3>
                    <p className="text-sm text-gray-600 mt-1">Complete list of all videos uploaded across all courses</p>
                  </div>
                  <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Video Title
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Course
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Duration
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {courses
                          .filter(course => course.videos && course.videos.length > 0)
                          .flatMap(course => 
                            course.videos.map((video, videoIndex) => ({
                              ...video,
                              courseName: course.name,
                              courseId: course._id
                            }))
                          )
                          .sort((a, b) => a.order - b.order)
                          .map((video, index) => (
                            <tr key={`${video.courseId}-${index}`} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-8 w-8">
                                    <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
                                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{video.title}</div>
                                    <div className="text-sm text-gray-500 truncate max-w-xs">{video.url}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {video.courseName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {video.duration || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {video.order || 'N/A'}
                              </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex space-x-2">
                                    <Link
                                      to={`/courses/${video.courseId}`}
                                      className="text-blue-600 hover:text-blue-900 transition duration-200"
                                    >
                                      View Course
                                    </Link>
                                    <Link
                                      to={`/courses/${video.courseId}/learn`}
                                      className="text-green-600 hover:text-green-900 transition duration-200"
                                    >
                                      Play Video
                                    </Link>
                                    {video._id && (
                                      <button
                                        onClick={() => handleDeleteVideo(video.courseId, video._id)}
                                        className="text-red-600 hover:text-red-900 transition duration-200"
                                      >
                                        Delete
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Register User Tab */}
            {activeTab === 'register' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Register New User</h2>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="max-w-md mx-auto">
                    <p className="text-gray-600 mb-6 text-center">
                      Create a new user account for the system
                    </p>
                    <div className="text-center">
                      <Link
                        to="/register"
                        className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition duration-200"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Go to Registration Form
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Admin Profile</h2>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="max-w-2xl mx-auto">
                    <div className="flex items-center space-x-6 mb-8">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">
                          {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{user?.name || 'Admin User'}</h3>
                        <p className="text-gray-600">{user?.email || 'admin@iftiinhub.com'}</p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-2">
                          Administrator
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Account Information</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div><span className="font-medium">Name:</span> {user?.name || 'Admin User'}</div>
                          <div><span className="font-medium">Email:</span> {user?.email || 'admin@iftiinhub.com'}</div>
                          <div><span className="font-medium">Role:</span> Administrator</div>
                          <div><span className="font-medium">Status:</span> <span className="text-green-600">Active</span></div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Quick Actions</h4>
                        <div className="space-y-2">
                          <Link
                            to="/profile"
                            className="block w-full text-left px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-md transition duration-200"
                          >
                            Edit Profile
                          </Link>
                          <button
                            onClick={() => setActiveTab('users')}
                            className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition duration-200"
                          >
                            Manage Users
                          </button>
                          <button
                            onClick={() => setActiveTab('courses')}
                            className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition duration-200"
                          >
                            Manage Courses
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
              </div>
            </div>
  
      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-purple-950 bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Edit User</h3>
            </div>
            <form onSubmit={handleUpdateUser}>
              <div className="px-6 py-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editUserData.name}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editUserData.email}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    name="role"
                    value={editUserData.role}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                {/* Password Section */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-900">Change Password</h4>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordFields(!showPasswordFields);
                        if (!showPasswordFields) {
                          setEditUserData(prev => ({
                            ...prev,
                            password: '',
                            confirmPassword: ''
                          }));
                        }
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {showPasswordFields ? 'Cancel Password Change' : 'Change Password'}
                    </button>
                  </div>
                  
                  {showPasswordFields && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={editUserData.password}
                          onChange={handleEditInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter new password"
                          minLength="6"
                          required={showPasswordFields}
                        />
                        <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={editUserData.confirmPassword}
                          onChange={handleEditInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Confirm new password"
                          required={showPasswordFields}
                        />
                      </div>
                    </div>
                  )}
                  
                  {!showPasswordFields && (
                    <p className="text-sm text-gray-500">
                      Current password will remain unchanged
                    </p>
                  )}
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-purple-950 bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Add Video to {selectedCourseForVideo?.name}
              </h3>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddVideo} className="space-y-6">
              {/* Video Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={videoData.title}
                  onChange={handleVideoInputChange}
                  placeholder="e.g., Introduction to HTML"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video URL *
                </label>
                <input
                  type="url"
                  name="url"
                  value={videoData.url}
                  onChange={handleVideoInputChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supports YouTube, Vimeo, and direct video URLs
                </p>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  value={videoData.duration}
                  onChange={handleVideoInputChange}
                  placeholder="e.g., 15:30"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: MM:SS or HH:MM:SS
                </p>
              </div>

              {/* Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Section
                </label>
                <select
                  name="section"
                  value={videoData.section}
                  onChange={handleVideoInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select a section...</option>
                  {selectedCourseForVideo && selectedCourseForVideo.sections && selectedCourseForVideo.sections.map(section => (
                    <option key={section.id} value={section.id}>{section.title}</option>
                  ))}
                </select>
                {(!selectedCourseForVideo?.sections || selectedCourseForVideo.sections.length === 0) && (
                  <p className="text-xs text-amber-600 mt-1">
                    No sections available. Create a section first using "Add Section" button.
                  </p>
                )}
              </div>

              {/* Video Preview */}
              {videoData.url && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
                  <div className="bg-white rounded border p-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-4h10a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2v-8a2 2 0 012-2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{videoData.title || 'Untitled Video'}</p>
                        <p className="text-sm text-gray-500">
                          {videoData.duration || 'Duration not specified'} • {videoData.section.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowVideoModal(false)}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!videoData.title || !videoData.url || addingVideo}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center space-x-2"
                >
                  {addingVideo ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Add Video</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Section Modal */}
      {showSectionModal && (
        <div className="fixed inset-0 bg-purple-950 bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Add New Section to "{selectedCourseForVideo?.name}"
              </h3>
              <button
                onClick={() => setShowSectionModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddSection} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Name *
                </label>
                <input
                  type="text"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  placeholder="e.g., Advanced JavaScript, React Basics"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will create a new section where you can organize videos
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSectionModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingSection}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {addingSection ? 'Adding...' : 'Add Section'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Sections Modal */}
      {showSectionsView && selectedCourseForSections && (
        <div className="fixed inset-0 bg-purple-950 bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Manage Sections for "{selectedCourseForSections?.name}"
              </h3>
              <button
                onClick={() => {
                  setShowSectionsView(false);
                  setEditingSection(null);
                  setEditSectionName('');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {selectedCourseForSections.sections && selectedCourseForSections.sections.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-md font-medium text-gray-900 mb-4">
                    Course Sections ({selectedCourseForSections.sections.length})
                  </h4>
                  {selectedCourseForSections.sections.map((section, index) => (
                    <div key={section.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      {editingSection && editingSection.id === section.id ? (
                        <form onSubmit={handleUpdateSection} className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Section Name
                            </label>
                            <input
                              type="text"
                              value={editSectionName}
                              onChange={(e) => setEditSectionName(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              required
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingSection(null);
                                setEditSectionName('');
                              }}
                              className="px-3 py-1 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors text-sm"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-sm"
                            >
                              Save
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900">{section.title}</h5>
                              <p className="text-sm text-gray-500">ID: {section.id}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditSection(section)}
                              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteSection(section.id)}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="mb-4">
                    <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Sections Yet</h4>
                  <p className="text-gray-500 mb-4">
                    This course doesn't have any sections yet. Create sections to organize your course content.
                  </p>
                  <button
                    onClick={() => {
                      setShowSectionsView(false);
                      openSectionModal(selectedCourseForSections);
                    }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add First Section
                  </button>
                </div>
              )}

              {selectedCourseForSections.sections && selectedCourseForSections.sections.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowSectionsView(false);
                      openSectionModal(selectedCourseForSections);
                    }}
                    className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add New Section
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
