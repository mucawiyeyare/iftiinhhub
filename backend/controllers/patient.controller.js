import Patient from '../models/Patient.js';
import Visit from '../models/Visit.js';
import Consultation from '../models/Consultation.js';
import Treatment from '../models/Treatment.js';
import LabRequest from '../models/LabRequest.js';
import LabResult from '../models/LabResult.js';
import { generatePatientNumber } from '../utils/generateId.js';
import { logAudit } from '../utils/auditLogger.js';

export const getAllPatients = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, gender, isActive } = req.query;
    const query = { isDeleted: false };
    if (typeof isActive !== 'undefined') query.isActive = isActive === 'true';
    if (gender) query.gender = gender;
    if (search) query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { patientNumber: { $regex: search, $options: 'i' } }
    ];
    const patients = await Patient.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    const total = await Patient.countDocuments(query);
    res.json({ success: true, patients, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const searchPatients = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ success: true, patients: [] });
    const patients = await Patient.find({
      isDeleted: false,
      $or: [
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
        { patientNumber: { $regex: q, $options: 'i' } }
      ]
    }).limit(10);
    res.json({ success: true, patients });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createPatient = async (req, res) => {
  try {
    const patientNumber = await generatePatientNumber();
    const patient = await Patient.create({ ...req.body, patientNumber });
    await logAudit(req.user._id, 'CREATE_PATIENT', 'Patient', patient._id, { patientNumber, name: `${patient.firstName} ${patient.lastName}` }, req.ip);
    res.status(201).json({ success: true, patient });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({ _id: req.params.id, isDeleted: false });
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
    res.json({ success: true, patient });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    );
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
    await logAudit(req.user._id, 'UPDATE_PATIENT', 'Patient', patient._id, {}, req.ip);
    res.json({ success: true, patient });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, { isDeleted: true, isActive: false }, { new: true });
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
    await logAudit(req.user._id, 'DELETE_PATIENT', 'Patient', patient._id, {}, req.ip);
    res.json({ success: true, message: 'Patient removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPatientVisits = async (req, res) => {
  try {
    const visits = await Visit.find({ patient: req.params.id })
      .populate('doctor', 'username email')
      .sort({ visitDate: -1 });
    res.json({ success: true, visits });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPatientHistory = async (req, res) => {
  try {
    const patientId = req.params.id;
    const [visits, consultations, treatments, labRequests] = await Promise.all([
      Visit.find({ patient: patientId }).populate('doctor', 'username').sort({ visitDate: -1 }),
      Consultation.find({ patient: patientId }).populate('doctor', 'username').sort({ consultationDate: -1 }),
      Treatment.find({ patient: patientId, isDeleted: false }).populate('service', 'name category').populate('doctor', 'username').sort({ treatmentDate: -1 }),
      LabRequest.find({ patient: patientId }).populate('test', 'testName category').sort({ requestDate: -1 })
    ]);
    res.json({ success: true, visits, consultations, treatments, labRequests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
