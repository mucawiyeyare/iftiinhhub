import Course from '../models/Course.js';
import { validationResult } from 'express-validator';

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Video Management Functions
export const addVideoToCourse = async (req, res) => {
  try {
    const { title, url, duration, order, section } = req.body;
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // If no order specified, add to end
    const videoOrder = order || (course.videos.length + 1);

    const newVideo = {
      title,
      url,
      duration,
      order: videoOrder,
      section
    };

    course.videos.push(newVideo);
    
    // Sort videos by order
    course.videos.sort((a, b) => a.order - b.order);
    
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateVideoInCourse = async (req, res) => {
  try {
    const { title, url, duration, order, section } = req.body;
    const { courseId, videoId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const videoIndex = course.videos.findIndex(video => video._id.toString() === videoId);
    if (videoIndex === -1) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Update video fields
    if (title) course.videos[videoIndex].title = title;
    if (url) course.videos[videoIndex].url = url;
    if (duration) course.videos[videoIndex].duration = duration;
    if (order !== undefined) course.videos[videoIndex].order = order;
    if (section !== undefined) course.videos[videoIndex].section = section;

    // Sort videos by order
    course.videos.sort((a, b) => a.order - b.order);
    
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteVideoFromCourse = async (req, res) => {
  try {
    const { courseId, videoId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const videoIndex = course.videos.findIndex(video => video._id.toString() === videoId);
    if (videoIndex === -1) {
      return res.status(404).json({ message: 'Video not found' });
    }

    course.videos.splice(videoIndex, 1);
    
    // Reorder remaining videos
    course.videos.forEach((video, index) => {
      video.order = index + 1;
    });
    
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const reorderVideos = async (req, res) => {
  try {
    const { videoIds } = req.body; // Array of video IDs in new order
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Reorder videos based on provided order
    const reorderedVideos = [];
    for (let i = 0; i < videoIds.length; i++) {
      const video = course.videos.find(v => v._id.toString() === videoIds[i]);
      if (video) {
        video.order = i + 1;
        reorderedVideos.push(video);
      }
    }

    course.videos = reorderedVideos;
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const addMultipleVideos = async (req, res) => {
  try {
    const { videos } = req.body; // Array of video objects
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Add each video with proper ordering
    videos.forEach((video, index) => {
      const newVideo = {
        title: video.title,
        url: video.url,
        duration: video.duration,
        order: course.videos.length + index + 1,
        section: video.section
      };
      course.videos.push(newVideo);
    });

    // Sort videos by order
    course.videos.sort((a, b) => a.order - b.order);
    
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get courses not assigned to the current student
export const getUnassignedCourses = async (req, res) => {
  try {
    // Import Enrollment model
    const Enrollment = (await import('../models/Enrollment.js')).default;
    
    // Get all enrollments for the current student
    const studentEnrollments = await Enrollment.find({ studentId: req.user._id });
    const enrolledCourseIds = studentEnrollments.map(enrollment => enrollment.courseId.toString());
    
    // Get all courses that are not enrolled by the student
    const unassignedCourses = await Course.find({
      _id: { $nin: enrolledCourseIds }
    }).sort({ createdAt: -1 });
    
    res.json(unassignedCourses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get courses assigned to the current student
export const getAssignedCourses = async (req, res) => {
  try {
    // Import Enrollment model
    const Enrollment = (await import('../models/Enrollment.js')).default;
    
    // Get all enrollments for the current student with populated course data
    const studentEnrollments = await Enrollment.find({ studentId: req.user._id })
      .populate('courseId')
      .sort({ enrolledAt: -1 });
    
    // Extract the course data
    const assignedCourses = studentEnrollments.map(enrollment => enrollment.courseId);
    
    res.json(assignedCourses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get aggregate public statistics
export const getPublicStats = async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default;
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCourses = await Course.countDocuments();
    res.json({ students: totalStudents, courses: totalCourses });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};