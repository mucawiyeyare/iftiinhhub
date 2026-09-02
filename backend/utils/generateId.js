import mongoose from 'mongoose';

// Counter schema for auto-incrementing IDs
const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, default: 0 }
});
const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

async function getNextValue(name) {
  const counter = await Counter.findOneAndUpdate(
    { name },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  return counter.value;
}

function pad(num) {
  return String(num).padStart(4, '0');
}

export const generatePatientNumber = async () => `PAT-${pad(await getNextValue('patient'))}`;
export const generateVisitNumber = async () => `VIS-${pad(await getNextValue('visit'))}`;
export const generateInvoiceNumber = async () => `INV-${pad(await getNextValue('invoice'))}`;
export const generateReceiptNumber = async () => `RCP-${pad(await getNextValue('receipt'))}`;
export const generateAppointmentNumber = async () => `APT-${pad(await getNextValue('appointment'))}`;
export const generateLabRequestNumber = async () => `LRQ-${pad(await getNextValue('labRequest'))}`;
export const generateEmployeeNumber = async () => `EMP-${pad(await getNextValue('employee'))}`;
export const generatePaymentNumber = async () => `PAY-${pad(await getNextValue('payment'))}`;
