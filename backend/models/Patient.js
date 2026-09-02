import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  patientNumber: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  age: { type: Number },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  address: { type: String },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  bloodGroup: { type: String },
  allergies: [{ type: String }],
  medicalHistory: { type: String },
  registrationDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

patientSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

patientSchema.index({ phone: 1 });
patientSchema.index({ patientNumber: 1 });
patientSchema.index({ firstName: 'text', lastName: 'text' });

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
