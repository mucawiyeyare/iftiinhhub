import express from 'express';
import { getDashboardStats, getRecentEnrollments } from '../controllers/dashboard.controller.js';
import { authenticateToken, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Dashboard Routes (Admin)
router.get('/stats', authenticateToken, isAdmin, getDashboardStats);
router.get('/recent-enrollments', authenticateToken, isAdmin, getRecentEnrollments);

export default router;