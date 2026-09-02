import mongoose from 'mongoose';

const labResultSchema = new mongoose.Schema({
  labRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'LabRequest', required: true, unique: true },
  visit: { type: mongoose.Schema.Types.ObjectId, ref: 'Visit', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  requestingDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  testDate: { type: Date, default: Date.now },
  result: { type: String, required: true },
  referenceRange: { type: String },
  notes: { type: String },
  status: { type: String, enum: ['pending', 'completed', 'verified'], default: 'completed' },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verificationDate: { type: Date }
}, { timestamps: true });

const LabResult = mongoose.model('LabResult', labResultSchema);
export default LabResult;
