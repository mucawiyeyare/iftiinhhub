import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { logAudit } from '../utils/auditLogger.js';

// GET /api/users
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 50, role, search } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { username: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
    const users = await User.find(query)
      .select('-passwordHash -password')
      .populate('employee', 'firstName lastName phone position')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await User.countDocuments(query);
    res.json({ success: true, users, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/users/:id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-passwordHash -password')
      .populate('employee');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/users
export const createUser = async (req, res) => {
  try {
    const { name, username, email, password, role, employee } = req.body;
    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) return res.status(400).json({ success: false, message: 'Username or email already exists' });
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, username, email, passwordHash, role, employee, isActive: true });
    try {
      await logAudit(req.user._id, 'CREATE_USER', 'User', user._id, { username, role }, req.ip);
    } catch (e) {}
    res.status(201).json({ success: true, user: { ...user.toObject(), passwordHash: undefined } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/users/:id
export const updateUser = async (req, res) => {
  try {
    const { name, username, email, role, employee, isActive, status } = req.body;
    const updateData = { name, username, email, role, employee, isActive, status };
    if (req.body.password) {
      updateData.passwordHash = await bcrypt.hash(req.body.password, 12);
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-passwordHash -password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    try {
      await logAudit(req.user._id, 'UPDATE_USER', 'User', user._id, { role }, req.ip);
    } catch (e) {}
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/users/:id/status
export const updateUserStatus = async (req, res) => {
  try {
    const { status, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status, isActive: isActive !== undefined ? isActive : status === 'active' },
      { new: true }
    ).select('-passwordHash -password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/users/:id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    try {
      await logAudit(req.user._id, 'DELETE_USER', 'User', user._id, {}, req.ip);
    } catch (e) {}
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/users/:id/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const passwordHash = await bcrypt.hash(newPassword || 'Admin@1234', 12);
    const user = await User.findByIdAndUpdate(req.params.id, { passwordHash }, { new: true }).select('-passwordHash -password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    try {
      await logAudit(req.user._id, 'RESET_PASSWORD', 'User', user._id, {}, req.ip);
    } catch (e) {}
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};