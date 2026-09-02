import Visit from '../models/Visit.js';
import { generateVisitNumber } from '../utils/generateId.js';
import { logAudit } from '../utils/auditLogger.js';

export const getAllVisits = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, doctor, patient, date } = req.query;
    const query = {};
    if (status) query.status = status;
    if (doctor) query.doctor = doctor;
    if (patient) query.patient = patient;
    if (date) {
      const d = new Date(date);
      query.visitDate = { $gte: new Date(d.setHours(0,0,0,0)), $lt: new Date(d.setHours(23,59,59,999)) };
    }
    const visits = await Visit.find(query)
      .populate('patient', 'firstName lastName patientNumber phone')
      .populate('doctor', 'username email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit).limit(Number(limit));
    const total = await Visit.countDocuments(query);
    res.json({ success: true, visits, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createVisit = async (req, res) => {
  try {
    const visitNumber = await generateVisitNumber();
    const visit = await Visit.create({ ...req.body, visitNumber, createdBy: req.user._id });
    await logAudit(req.user._id, 'CREATE_VISIT', 'Visit', visit._id, { visitNumber, patient: req.body.patient }, req.ip);
    const populated = await Visit.findById(visit._id)
      .populate('patient', 'firstName lastName patientNumber phone')
      .populate('doctor', 'username email');
    res.status(201).json({ success: true, visit: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getVisit = async (req, res) => {
  try {
    const visit = await Visit.findById(req.params.id)
      .populate('patient', 'firstName lastName patientNumber phone age gender bloodGroup allergies medicalHistory')
      .populate('doctor', 'username email')
      .populate('createdBy', 'username');
    if (!visit) return res.status(404).json({ success: false, message: 'Visit not found' });
    res.json({ success: true, visit });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateVisit = async (req, res) => {
  try {
    const visit = await Visit.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('patient', 'firstName lastName patientNumber')
      .populate('doctor', 'username email');
    if (!visit) return res.status(404).json({ success: false, message: 'Visit not found' });
    await logAudit(req.user._id, 'UPDATE_VISIT', 'Visit', visit._id, {}, req.ip);
    res.json({ success: true, visit });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateVisitStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const visit = await Visit.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('patient', 'firstName lastName patientNumber')
      .populate('doctor', 'username email');
    if (!visit) return res.status(404).json({ success: false, message: 'Visit not found' });
    await logAudit(req.user._id, 'UPDATE_VISIT_STATUS', 'Visit', visit._id, { status }, req.ip);
    res.json({ success: true, visit });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getTodayVisits = async (req, res) => {
  try {
    const today = new Date();
    const start = new Date(today.setHours(0,0,0,0));
    const end = new Date(today.setHours(23,59,59,999));
    const visits = await Visit.find({ visitDate: { $gte: start, $lte: end } })
      .populate('patient', 'firstName lastName patientNumber phone')
      .populate('doctor', 'username email')
      .sort({ createdAt: -1 });
    res.json({ success: true, visits });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
