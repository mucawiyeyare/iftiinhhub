import Enrollment from '../models/Enrollment.js';

export const createEnrollment = async (req, res) => {
  try {
    const { courseId } = req.body;
    
    const existingEnrollment = await Enrollment.findOne({
      studentId: req.user._id,
      courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const enrollment = new Enrollment({
      studentId: req.user._id,
      courseId
    });

    await enrollment.save();
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const adminCreateEnrollment = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    
    // Check if student and course exist
    const User = (await import('../models/User.js')).default;
    const Course = (await import('../models/Course.js')).default;
    
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if enrollment already exists
    const existingEnrollment = await Enrollment.findOne({
      studentId,
      courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Student already enrolled in this course' });
    }

    const enrollment = new Enrollment({
      studentId,
      courseId
    });

    await enrollment.save();
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getStudentEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ studentId: req.user._id })
      .populate('courseId')
      .sort({ enrolledAt: -1 });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getEnrollmentByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    let enrollment = await Enrollment.findOne({
      studentId: req.user._id,
      courseId
    });
    
    // Auto-create enrollment if it doesn't exist for progress tracking
    if (!enrollment) {
      enrollment = new Enrollment({
        studentId: req.user._id,
        courseId,
        completedVideos: []
      });
      await enrollment.save();
    }
    
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const markVideoComplete = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { videoIndex } = req.body;

    let enrollment = await Enrollment.findOne({
      studentId: req.user._id,
      courseId
    });

    if (!enrollment) {
      // Auto-create if not found
      enrollment = new Enrollment({
        studentId: req.user._id,
        courseId,
        completedVideos: []
      });
    }

    if (!enrollment.completedVideos) {
      enrollment.completedVideos = [];
    }

    if (!enrollment.completedVideos.includes(videoIndex)) {
      enrollment.completedVideos.push(videoIndex);
      await enrollment.save();
    }

    res.json({ message: 'Video marked as complete', completedVideos: enrollment.completedVideos });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};