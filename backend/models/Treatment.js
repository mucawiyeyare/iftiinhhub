import mongoose from 'mongoose';

const treatmentSchema = new mongoose.Schema({
  visit: { type: mongoose.Schema.Types.ObjectId, ref: 'Visit', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'DentalService', required: true },
  toothNumber: { type: String },
  diagnosis: { type: String },
  procedure: { type: String },
  treatmentNotes: { type: String },
  price: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
  treatmentDate: { type: Date, default: Date.now },
  followUpDate: { type: Date },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

const Treatment = mongoose.model('Treatment', treatmentSchema);
export default Treatment;
