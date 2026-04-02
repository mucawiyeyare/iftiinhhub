import express from 'express';
import { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  updateUserStatus
} from '../controllers/user.controller.js';
import { authenticateToken, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// User Management Routes (Admin only)
router.get('/', authenticateToken, isAdmin, getAllUsers);
router.get('/:id', authenticateToken, isAdmin, getUserById);
router.put('/:id', authenticateToken, isAdmin, updateUser);
router.put('/:id/status', authenticateToken, isAdmin, updateUserStatus);
router.delete('/:id', authenticateToken, isAdmin, deleteUser);

export default router;