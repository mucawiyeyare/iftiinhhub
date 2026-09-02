import mongoose from 'mongoose';

const labRequestSchema = new mongoose.Schema({
  requestNumber: { type: String, required: true, unique: true },
  visit: { type: mongoose.Schema.Types.ObjectId, ref: 'Visit', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'LabTest', required: true },
  reasonForTest: { type: String },
  requestDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['pending', 'payment_required', 'paid', 'in_progress', 'completed', 'cancelled'],
    default: 'payment_required'
  },
  paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' }
}, { timestamps: true });

const LabRequest = mongoose.model('LabRequest', labRequestSchema);
export default LabRequest;
