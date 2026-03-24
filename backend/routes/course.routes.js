/**
 * Course Management Routes
 * 
 * Handles all course-related operations including CRUD operations,
 * video management, and student course assignments.
 */

import express from 'express';
import { body } from 'express-validator';
import { 
  getAllCourses, 
  getCourseById, 
  createCourse, 
  updateCourse, 
  deleteCourse,
  addVideoToCourse,
  updateVideoInCourse,
  deleteVideoFromCourse,
  reorderVideos,
  addMultipleVideos,
  getUnassignedCourses,
  getAssignedCourses,
  getPublicStats
} from '../controllers/course.controller.js';
import { authenticateToken, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * Course CRUD Routes
 */

// GET /api/courses - Get all courses (public)
router.get('/', getAllCourses);

// GET /api/courses/student/assigned - Get courses the student is enrolled in (authenticated)
router.get('/student/assigned', authenticateToken, getAssignedCourses);

// GET /api/courses/student/unassigned - Get courses the student is not enrolled in (authenticated)
router.get('/student/unassigned', authenticateToken, getUnassignedCourses);

// GET /api/courses/public/stats - Get aggregate stats for public pages
router.get('/public/stats', getPublicStats);

// GET /api/courses/:id - Get a specific course by ID (public)
router.get('/:id', getCourseById);
/**
 * POST /api/courses - Create a new course (admin only)
 * Validates: name, description, price, instructor, duration, level, category
 */
router.post('/', authenticateToken, isAdmin, [
  body('name').notEmpty().withMessage('Course name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('instructor').notEmpty().withMessage('Instructor is required')
], createCourse);

// PUT /api/courses/:id - Update an existing course (admin only)
router.put('/:id', authenticateToken, isAdmin, updateCourse);

// DELETE /api/courses/:id - Delete a course (admin only)
router.delete('/:id', authenticateToken, isAdmin, deleteCourse);

/**
 * Video Management Routes
 * All video routes require admin authentication
 */

/**
 * POST /api/courses/:id/videos - Add a single video to a course
 * Validates: title, url, duration (optional), order (optional)
 */
router.post('/:id/videos', authenticateToken, isAdmin, [
  body('title').notEmpty().withMessage('Video title is required'),
  body('url').notEmpty().withMessage('Video URL is required'),
  body('duration').optional(),
  body('order').optional().isNumeric().withMessage('Order must be a number')
], addVideoToCourse);

/**
 * POST /api/courses/:id/videos/multiple - Add multiple videos to a course at once
 * Validates: videos array with title, url, and optional duration for each
 */
router.post('/:id/videos/multiple', authenticateToken, isAdmin, [
  body('videos').isArray().withMessage('Videos must be an array'),
  body('videos.*.title').notEmpty().withMessage('Video title is required'),
  body('videos.*.url').notEmpty().withMessage('Video URL is required'),
  body('videos.*.duration').optional()
], addMultipleVideos);

/**
 * PUT /api/courses/:courseId/videos/:videoId - Update a specific video
 * All fields are optional: title, url, duration, order
 */
router.put('/:courseId/videos/:videoId', authenticateToken, isAdmin, [
  body('title').optional(),
  body('url').optional(),
  body('duration').optional(),
  body('order').optional().isNumeric().withMessage('Order must be a number')
], updateVideoInCourse);

// DELETE /api/courses/:courseId/videos/:videoId - Remove a video from a course
router.delete('/:courseId/videos/:videoId', authenticateToken, isAdmin, deleteVideoFromCourse);

/**
 * PUT /api/courses/:id/videos/reorder - Reorder videos in a course
 * Validates: videoIds array containing the new order
 */
router.put('/:id/videos/reorder', authenticateToken, isAdmin, [
  body('videoIds').isArray().withMessage('Video IDs must be an array')
], reorderVideos);

export default router;