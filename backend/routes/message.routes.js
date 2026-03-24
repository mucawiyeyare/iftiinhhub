import express from 'express';
import { createMessage, getMessages, markAsRead, deleteMessage } from '../controllers/message.controller.js';
import { authenticateToken, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public: submit a contact message
router.post('/', createMessage);

// Admin only: list all messages
router.get('/', authenticateToken, isAdmin, getMessages);

// Admin only: mark a message as read
router.patch('/:id/read', authenticateToken, isAdmin, markAsRead);

// Admin only: delete a message
router.delete('/:id', authenticateToken, isAdmin, deleteMessage);

export default router;
