import mongoose from 'mongoose';

const followUpSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  visit: { type: mongoose.Schema.Types.ObjectId, ref: 'Visit', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  followUpDate: { type: Date, required: true },
  instructions: { type: String },
  status: { type: String, enum: ['pending', 'completed', 'missed'], default: 'pending' },
  notes: { type: String }
}, { timestamps: true });

const FollowUp = mongoose.model('FollowUp', followUpSchema);
export default FollowUp;
