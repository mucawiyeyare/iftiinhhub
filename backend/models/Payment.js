import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  paymentNumber: { type: String, required: true, unique: true },
  receiptNumber: { type: String, required: true, unique: true },
  invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  visit: { type: mongoose.Schema.Types.ObjectId, ref: 'Visit', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['cash', 'card', 'mobile', 'other'], required: true },
  paymentType: { type: String, enum: ['consultation', 'laboratory', 'treatment', 'full_bill', 'other'], default: 'full_bill' },
  receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  paymentDate: { type: Date, default: Date.now },
  notes: { type: String }
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
