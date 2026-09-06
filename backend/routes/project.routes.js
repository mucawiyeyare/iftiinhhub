import express from 'express';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/project.controller.js';
import { authenticateToken, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public route to fetch project logos
router.get('/', getProjects);

// Admin-only protected routes
router.post('/', authenticateToken, isAdmin, createProject);
router.put('/:id', authenticateToken, isAdmin, updateProject);
router.delete('/:id', authenticateToken, isAdmin, deleteProject);

export default router;
