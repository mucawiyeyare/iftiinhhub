/**
 * Main Application Component
 * 
 * Sets up routing, authentication context, and layout structure for the IftiinHub application.
 * Handles navigation, protected routes, and conditional rendering of navbar/footer.
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CourseDetail from './pages/CourseDetail';
import CourseForm from './pages/CourseForm';
import CourseVideoPlayer from './components/CourseVideoPlayer';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import './index.css';

/**
 * PrivateRoute Component
 * 
 * Protects routes that require authentication and/or specific user roles.
 * Redirects to login if not authenticated, or home if user lacks required role.
 * 
 * @param {React.ReactNode} children - The component to render if authorized
 * @param {string[]} allowedRoles - Array of roles allowed to access this route
 */
const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  
  // Show loading state while checking authentication
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Redirect to home if user doesn't have required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  
  return children;
};

/**
 * Layout Component
 * 
 * Manages the overall page layout including conditional rendering of Navbar and Footer.
 * Hides navigation on course detail pages and admin dashboard for cleaner UI.
 */
const Layout = () => {
  const location = useLocation();

  // Check if current page is a course detail page
  const isCourseDetail = /^\/courses\/[^/]+$/.test(location.pathname);

  // Check if current page is admin dashboard
  const isAdminDashboard = location.pathname === '/admin-dashboard';

  // Check if current page is student dashboard
  const isStudentDashboard = location.pathname === '/student-dashboard';

  // Check if current page is course video player
  const isCoursePlayer = location.pathname.includes('/learn');

  const hideNavAndFooter = isAdminDashboard || isStudentDashboard || isCoursePlayer;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hide navbar on app-like full screen pages */}
      {!hideNavAndFooter && <Navbar />}
      
      {/* Main content area - no container padding for app-like pages */}
      <main className={`${!hideNavAndFooter ? 'container mx-auto px-4 py-8' : ''}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route 
            path="/courses/:id/learn"
            element={<CourseVideoPlayer />}
          />
          <Route 
            path="/courses/new" 
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <CourseForm />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/courses/:id/edit" 
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <CourseForm />
              </PrivateRoute>
            } 
          />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/register" 
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <Register />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/student-dashboard" 
            element={
              <PrivateRoute allowedRoles={['student']}>
                <StudentDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin-dashboard" 
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } 
          />
        </Routes>
      </main>
      {!isCourseDetail && !hideNavAndFooter && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}>
        <Layout />
      </Router>
    </AuthProvider>
  );
};

export default App;
