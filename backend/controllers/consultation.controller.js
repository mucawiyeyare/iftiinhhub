import Consultation from '../models/Consultation.js';
import { logAudit } from '../utils/auditLogger.js';

export const createConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.create({ ...req.body, doctor: req.user._id });
    await logAudit(req.user._id, 'CREATE_CONSULTATION', 'Consultation', consultation._id, { visit: req.body.visit }, req.ip);
    res.status(201).json({ success: true, consultation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getConsultationByVisit = async (req, res) => {
  try {
    const consultation = await Consultation.findOne({ visit: req.params.visitId })
      .populate('doctor', 'username email')
      .populate('patient', 'firstName lastName patientNumber');
    res.json({ success: true, consultation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!consultation) return res.status(404).json({ success: false, message: 'Consultation not found' });
    await logAudit(req.user._id, 'UPDATE_CONSULTATION', 'Consultation', consultation._id, {}, req.ip);
    res.json({ success: true, consultation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
