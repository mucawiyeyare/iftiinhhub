import express from 'express';
import { createEnrollment, adminCreateEnrollment, getStudentEnrollments } from '../controllers/enrollment.controller.js';
import { authenticateToken, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Enrollment Routes
router.post('/', authenticateToken, createEnrollment);
router.post('/admin', authenticateToken, isAdmin, adminCreateEnrollment);
router.get('/student', authenticateToken, getStudentEnrollments);

export default router;