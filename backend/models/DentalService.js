import mongoose from 'mongoose';

const dentalServiceSchema = new mongoose.Schema({
  serviceCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, enum: ['General Dentistry', 'Orthodontics'], required: true },
  description: { type: String },
  price: { type: Number, required: true, min: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const DentalService = mongoose.model('DentalService', dentalServiceSchema);
export default DentalService;
