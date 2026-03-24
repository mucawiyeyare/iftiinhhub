import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  whatsapp: { type: String, trim: true, default: '' },
  message: { type: String, required: true, trim: true },
  type: { type: String, enum: ['general', 'enrollment_request'], default: 'general' },
  subject: { type: String, default: 'General Inquiry' },
  courseDetails: { type: Object, default: null },
  read: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);
