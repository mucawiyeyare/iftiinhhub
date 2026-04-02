import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'student'], default: 'student' },
  phone: { type: String, default: '' },
  // Registration approval status: pending = awaiting admin review, approved = active, declined = rejected
  status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);