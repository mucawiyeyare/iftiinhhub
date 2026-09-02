import Treatment from '../models/Treatment.js';
import Invoice from '../models/Invoice.js';
import { logAudit } from '../utils/auditLogger.js';

export const getAllTreatments = async (req, res) => {
  try {
    const { visit, patient, doctor, page = 1, limit = 20 } = req.query;
    const query = { isDeleted: false };
    if (visit) query.visit = visit;
    if (patient) query.patient = patient;
    if (doctor) query.doctor = doctor;
    const treatments = await Treatment.find(query)
      .populate('service', 'name category price')
      .populate('patient', 'firstName lastName patientNumber')
      .populate('doctor', 'username')
      .sort({ treatmentDate: -1 })
      .skip((page - 1) * limit).limit(Number(limit));
    const total = await Treatment.countDocuments(query);
    res.json({ success: true, treatments, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createTreatment = async (req, res) => {
  try {
    const treatment = await Treatment.create({ ...req.body, doctor: req.user._id });
    // Add to invoice if exists
    const invoice = await Invoice.findOne({ visit: treatment.visit });
    if (invoice) {
      invoice.items.push({ description: `Treatment`, type: 'treatment', referenceId: treatment._id, amount: treatment.price });
      await invoice.save();
    }
    await logAudit(req.user._id, 'CREATE_TREATMENT', 'Treatment', treatment._id, { visit: treatment.visit }, req.ip);
    const populated = await Treatment.findById(treatment._id)
      .populate('service', 'name category price')
      .populate('doctor', 'username');
    res.status(201).json({ success: true, treatment: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getTreatment = async (req, res) => {
  try {
    const treatment = await Treatment.findOne({ _id: req.params.id, isDeleted: false })
      .populate('service', 'name category price description')
      .populate('patient', 'firstName lastName patientNumber')
      .populate('doctor', 'username email');
    if (!treatment) return res.status(404).json({ success: false, message: 'Treatment not found' });
    res.json({ success: true, treatment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateTreatment = async (req, res) => {
  try {
    const treatment = await Treatment.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false }, req.body, { new: true, runValidators: true }
    ).populate('service', 'name').populate('doctor', 'username');
    if (!treatment) return res.status(404).json({ success: false, message: 'Treatment not found' });
    await logAudit(req.user._id, 'UPDATE_TREATMENT', 'Treatment', treatment._id, {}, req.ip);
    res.json({ success: true, treatment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getVisitTreatments = async (req, res) => {
  try {
    const treatments = await Treatment.find({ visit: req.params.visitId, isDeleted: false })
      .populate('service', 'name category price')
      .populate('doctor', 'username')
      .sort({ treatmentDate: -1 });
    res.json({ success: true, treatments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
