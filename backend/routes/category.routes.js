import express from 'express';
import { getCategories, createCategory, deleteCategory } from '../controllers/category.controller.js';
import { authenticateToken, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// GET /api/categories - (Public) get all categories
router.get('/', getCategories);

// POST /api/categories - (Admin) create a category
router.post('/', authenticateToken, isAdmin, createCategory);

// DELETE /api/categories/:id - (Admin) delete a category
router.delete('/:id', authenticateToken, isAdmin, deleteCategory);

export default router;
