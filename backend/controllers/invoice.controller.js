import Invoice from '../models/Invoice.js';
import { generateInvoiceNumber } from '../utils/generateId.js';
import { logAudit } from '../utils/auditLogger.js';

export const getAllInvoices = async (req, res) => {
  try {
    const { status, patient, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (patient) query.patient = patient;
    const invoices = await Invoice.find(query)
      .populate('patient', 'firstName lastName patientNumber phone')
      .populate('createdBy', 'username')
      .sort({ invoiceDate: -1 })
      .skip((page - 1) * limit).limit(Number(limit));
    const total = await Invoice.countDocuments(query);
    res.json({ success: true, invoices, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createInvoice = async (req, res) => {
  try {
    const invoiceNumber = await generateInvoiceNumber();
    const invoice = await Invoice.create({ ...req.body, invoiceNumber, createdBy: req.user._id });
    await logAudit(req.user._id, 'CREATE_INVOICE', 'Invoice', invoice._id, { invoiceNumber }, req.ip);
    res.status(201).json({ success: true, invoice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('patient', 'firstName lastName patientNumber phone')
      .populate('visit', 'visitNumber visitDate status')
      .populate('createdBy', 'username');
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, invoice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    Object.assign(invoice, req.body);
    await invoice.save();
    await logAudit(req.user._id, 'UPDATE_INVOICE', 'Invoice', invoice._id, {}, req.ip);
    res.json({ success: true, invoice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPendingInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ status: { $in: ['unpaid', 'partially_paid'] } })
      .populate('patient', 'firstName lastName patientNumber phone')
      .sort({ invoiceDate: -1 })
      .limit(50);
    res.json({ success: true, invoices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getVisitInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ visit: req.params.visitId })
      .populate('patient', 'firstName lastName patientNumber')
      .populate('createdBy', 'username');
    res.json({ success: true, invoice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addInvoiceItem = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    invoice.items.push(req.body);
    await invoice.save();
    res.json({ success: true, invoice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const applyDiscount = async (req, res) => {
  try {
    const { discount } = req.body;
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    invoice.discount = discount;
    await invoice.save();
    await logAudit(req.user._id, 'APPLY_DISCOUNT', 'Invoice', invoice._id, { discount }, req.ip);
    res.json({ success: true, invoice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
