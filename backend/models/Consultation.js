import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema({
  visit: { type: mongoose.Schema.Types.ObjectId, ref: 'Visit', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mainComplaint: { type: String },
  symptoms: { type: String },
  duration: { type: String },
  relevantHistory: { type: String },
  clinicalObservations: { type: String },
  dentalExaminationFindings: { type: String },
  oralExamination: { type: String },
  diagnosis: { type: String },
  treatmentDecision: { type: String, enum: ['immediate', 'lab_required', 'pending'], default: 'pending' },
  prescriptions: [{
    medication: String,
    dosage: String,
    frequency: String,
    duration: String
  }],
  notes: { type: String },
  consultationDate: { type: Date, default: Date.now }
}, { timestamps: true });

const Consultation = mongoose.model('Consultation', consultationSchema);
export default Consultation;
