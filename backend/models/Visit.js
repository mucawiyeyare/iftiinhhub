import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema({
  visitNumber: { type: String, required: true, unique: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  visitDate: { type: Date, default: Date.now },
  reasonForVisit: { type: String },
  consultationFee: { type: Number, default: 0 },
  status: {
    type: String,
    enum: [
      'registered', 'waiting_payment', 'consultation_paid', 'waiting_doctor',
      'with_doctor', 'lab_payment_required', 'lab_paid', 'waiting_lab',
      'lab_testing', 'lab_result_ready', 'returning_to_doctor', 'treatment_in_progress',
      'treatment_completed', 'payment_pending', 'paid', 'completed', 'follow_up_required', 'cancelled'
    ],
    default: 'registered'
  },
  notes: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Visit = mongoose.model('Visit', visitSchema);
export default Visit;
