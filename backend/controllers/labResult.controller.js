import LabResult from '../models/LabResult.js';
import LabRequest from '../models/LabRequest.js';
import Visit from '../models/Visit.js';
import { logAudit } from '../utils/auditLogger.js';

export const createLabResult = async (req, res) => {
  try {
    const result = await LabResult.create({ ...req.body, performedBy: req.user._id, status: 'completed' });
    // Update lab request status
    await LabRequest.findByIdAndUpdate(req.body.labRequest, { status: 'completed' });
    // Update visit status
    await Visit.findByIdAndUpdate(req.body.visit, { status: 'lab_result_ready' });
    await logAudit(req.user._id, 'CREATE_LAB_RESULT', 'LabResult', result._id, { labRequest: req.body.labRequest }, req.ip);
    res.status(201).json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getLabResultByRequest = async (req, res) => {
  try {
    const result = await LabResult.findOne({ labRequest: req.params.requestId })
      .populate('performedBy', 'username')
      .populate('requestingDoctor', 'username')
      .populate('patient', 'firstName lastName patientNumber');
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateLabResult = async (req, res) => {
  try {
    const result = await LabResult.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!result) return res.status(404).json({ success: false, message: 'Lab result not found' });
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyLabResult = async (req, res) => {
  try {
    const result = await LabResult.findByIdAndUpdate(
      req.params.id,
      { status: 'verified', verificationDate: new Date() },
      { new: true }
    );
    if (!result) return res.status(404).json({ success: false, message: 'Lab result not found' });
    await logAudit(req.user._id, 'VERIFY_LAB_RESULT', 'LabResult', result._id, {}, req.ip);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
