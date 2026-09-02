import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { logAudit } from '../utils/auditLogger.js';

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: process.env.JWT_EXPIRE || '30d' });

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const username = email.split('@')[0] + Math.floor(1000 + Math.random() * 9000);

    const user = new User({
      name: name || username,
      username: username,
      email: email.toLowerCase(),
      passwordHash,
      role: role || 'student',
      phone: phone || '',
      isActive: true,
      status: 'active'
    });

    await user.save();

    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const identifier = email || username;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Email/Username and password are required' });
    }

    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { username: identifier }
      ]
    }).populate('employee');

    if (!user || user.isActive === false) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    user.lastLogin = new Date();
    await user.save();

    try {
      await logAudit(user._id, 'LOGIN', 'User', user._id, { username: user.username }, req.ip);
    } catch (e) {
      // Ignore audit log error if not configured
    }

    const token = signToken(user._id);
    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name || user.username,
        username: user.username,
        email: user.email,
        role: user.role,
        employee: user.employee,
        isActive: user.isActive
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/logout
export const logout = async (req, res) => {
  try {
    if (req.user && req.user._id) {
      await logAudit(req.user._id, 'LOGOUT', 'User', req.user._id, {}, req.ip);
    }
  } catch (e) {}
  res.json({ success: true, message: 'Logged out successfully' });
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select('-passwordHash -password').populate('employee');
  res.json({ success: true, user });
};

// POST /api/auth/change-password
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    user.passwordHash = await bcrypt.hash(newPassword, 12);
    await user.save();
    try {
      await logAudit(user._id, 'CHANGE_PASSWORD', 'User', user._id, {}, req.ip);
    } catch (e) {}
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Called on server startup to ensure at least one admin exists
export const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const passwordHash = await bcrypt.hash('Admin@1234', 12);
      await User.create({
        name: 'Super Admin',
        username: 'admin',
        email: 'admin@iftiinhhub.com',
        passwordHash,
        role: 'admin',
        isActive: true
      });
      console.log('✅ Default admin created: email=admin@iftiinhhub.com, password=Admin@1234');
    }
  } catch (err) {
    console.error('Error creating default admin:', err.message);
  }
};