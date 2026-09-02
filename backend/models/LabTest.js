import mongoose from 'mongoose';

const labTestSchema = new mongoose.Schema({
  testCode: { type: String, required: true, unique: true },
  testName: { type: String, required: true },
  category: {
    type: String,
    enum: ['Pregnancy', 'Blood', 'Infectious Disease Screening', 'Other'],
    required: true
  },
  description: { type: String },
  price: { type: Number, required: true, min: 0 },
  referenceRange: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const LabTest = mongoose.model('LabTest', labTestSchema);
export default LabTest;
