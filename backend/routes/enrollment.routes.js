import express from 'express';
import { createEnrollment, adminCreateEnrollment, getStudentEnrollments, getEnrollmentByCourse, markVideoComplete } from '../controllers/enrollment.controller.js';
import { authenticateToken, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Enrollment Routes
router.post('/', authenticateToken, createEnrollment);
router.post('/admin', authenticateToken, isAdmin, adminCreateEnrollment);
router.get('/student', authenticateToken, getStudentEnrollments);
router.get('/course/:courseId', authenticateToken, getEnrollmentByCourse);
router.post('/course/:courseId/complete', authenticateToken, markVideoComplete);

export default router;