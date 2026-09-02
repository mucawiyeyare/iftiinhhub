import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  visit: { type: mongoose.Schema.Types.ObjectId, ref: 'Visit', required: true },
  items: [{
    description: { type: String, required: true },
    type: { type: String, enum: ['consultation', 'laboratory', 'treatment', 'other'], default: 'other' },
    referenceId: { type: mongoose.Schema.Types.ObjectId },
    amount: { type: Number, required: true }
  }],
  subtotal: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  paidAmount: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['unpaid', 'partially_paid', 'paid', 'refunded', 'cancelled'],
    default: 'unpaid'
  },
  invoiceDate: { type: Date, default: Date.now },
  notes: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

invoiceSchema.pre('save', function (next) {
  this.subtotal = this.items.reduce((sum, item) => sum + item.amount, 0);
  this.totalAmount = this.subtotal - this.discount;
  this.balance = this.totalAmount - this.paidAmount;
  if (this.balance <= 0) this.status = 'paid';
  else if (this.paidAmount > 0) this.status = 'partially_paid';
  else this.status = this.status === 'cancelled' ? 'cancelled' : 'unpaid';
  next();
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;
