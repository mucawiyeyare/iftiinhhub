import express from 'express';
import Cart from '../models/Cart.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Get user's cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.courseId');
    if (!cart) {
      return res.json({ items: [] });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add course to cart
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.body;
    
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      userId: req.user.id,
      courseId: courseId
    });
    
    if (existingEnrollment) {
      return res.status(400).json({ message: 'You are already enrolled in this course' });
    }

    // Find or create cart
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    // Check if course is already in cart
    const existingItem = cart.items.find(item => item.courseId.toString() === courseId);
    if (existingItem) {
      return res.status(400).json({ message: 'Course is already in your cart' });
    }

    // Add course to cart
    cart.items.push({ courseId });
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.courseId');
    res.json({ message: 'Course added to cart', cart: populatedCart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove course from cart
router.delete('/remove/:courseId', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.courseId.toString() !== courseId);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.courseId');
    res.json({ message: 'Course removed from cart', cart: populatedCart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Clear cart
router.delete('/clear', authenticateToken, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user.id });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
