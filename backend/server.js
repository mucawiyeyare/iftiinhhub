/**
 * Main Server Configuration File
 * 
 * This file sets up the Express server with all necessary middleware,
 * database connections, routes, and error handling for the IftiinHub application.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import { notFound, errorHandler } from './middlewares/error.middleware.js';
import path from "path";

// Import route modules
import authRoutes from './routes/auth.routes.js';
import courseRoutes from './routes/course.routes.js';
import enrollmentRoutes from './routes/enrollment.routes.js';
import userRoutes from './routes/user.routes.js';
import profileRoutes from './routes/profile.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import cartRoutes from './routes/cart.routes.js';
import messageRoutes from './routes/message.routes.js';

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB database
connectDB().then(() => {
  console.log('Database connected successfully');
}).catch((error) => {
  console.error('Database connection failed:', error.message);
  process.exit(1); // Exit process if database connection fails
});

// Get the directory name for serving static files
const __dirname = path.resolve();

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 3000;

/**
 * CORS Configuration
 * Define allowed origins for cross-origin requests
 */
const allowedOrigins = [
  'http://localhost:5173', // Vite dev server (default)
  'http://localhost:5174', // Vite dev server (alternative)
  'http://localhost:3000', // Backend server
  process.env.FRONTEND_URL  // Production frontend URL from environment
].filter(Boolean); // Remove any undefined values

// Configure CORS middleware
app.use(cors({
  origin: true, // Allow all origins dynamically
  credentials: true // Allow cookies to be sent with requests
}));

// Parse incoming JSON requests
app.use(express.json());

/**
 * API Routes
 * All routes are prefixed with /api
 */
app.use('/api/auth', authRoutes);           // Authentication routes (login, register)
app.use('/api/courses', courseRoutes);       // Course management routes
app.use('/api/enrollments', enrollmentRoutes); // Student enrollment routes
app.use('/api/users', userRoutes);           // User management routes (admin)
app.use('/api/profile', profileRoutes);      // User profile routes
app.use('/api/dashboard', dashboardRoutes);  // Dashboard statistics routes
app.use('/api/cart', cartRoutes);            // Shopping cart routes
app.use('/api/messages', messageRoutes);     // Contact message routes

/**
 * Error Handling Middleware
 * Must be defined after all routes
 */
app.use(notFound);      // Handle 404 errors for undefined routes
app.use(errorHandler);  // Handle all other errors

/**
 * Serve Static Files (Production)
 * Serve the built frontend application from the dist folder
 */
app.use(express.static(path.join(__dirname, "frontend", "dist")));

/**
 * SPA Fallback Route
 * For any route not matched by the API, serve the index.html
 * This allows client-side routing to work properly
 */
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
