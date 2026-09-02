import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  username: {
    type: String,
    sparse: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String
  },
  passwordHash: {
    type: String
  },
  role: {
    type: String,
    enum: ['admin', 'student', 'user', 'hr', 'doctor', 'receptionist'],
    default: 'student'
  },
  phone: {
    type: String
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    default: 'active'
  },
  lastLogin: {
    type: Date
  }
}, { timestamps: true });

userSchema.methods.comparePassword = async function(enteredPassword) {
  if (this.passwordHash) {
    return await bcrypt.compare(enteredPassword, this.passwordHash);
  }
  if (this.password) {
    return await bcrypt.compare(enteredPassword, this.password);
  }
  return false;
};

const User = mongoose.model('User', userSchema);
export default User;