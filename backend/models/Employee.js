import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  employeeNumber: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  position: { type: String },
  department: { type: String },
  hireDate: { type: Date },
  salary: { type: Number },
  status: { type: String, enum: ['active', 'inactive', 'terminated'], default: 'active' },
  address: { type: String },
  emergencyContact: { name: String, phone: String, relationship: String },
  notes: { type: String },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

employeeSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

employeeSchema.set('toJSON', { virtuals: true });
employeeSchema.set('toObject', { virtuals: true });

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
