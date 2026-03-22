import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();

    res.json({
      totalUsers,
      totalStudents,
      totalCourses,
      totalEnrollments
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getRecentEnrollments = async (req, res) => {
  try {
    // Fetch recent enrollments with populated student and course details
    const recentEnrollments = await Enrollment.find()
      .populate('studentId', 'name email')
      .populate('courseId', 'name')
      .sort({ enrolledAt: -1 })
      .limit(10);

    res.json(recentEnrollments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};