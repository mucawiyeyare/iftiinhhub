/**
 * Authentication Routes
 * 
 * Handles user registration and login endpoints with input validation.
 */

import express from 'express';
import { body } from 'express-validator';
import { register, login } from '../controllers/auth.controller.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user account
 * Validates: name, email, password (min 6 characters)
 */
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], register);

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 * Validates: email, password
 */
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], login);

export default router;