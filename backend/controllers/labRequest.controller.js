import LabRequest from '../models/LabRequest.js';
import Visit from '../models/Visit.js';
import { generateLabRequestNumber } from '../utils/generateId.js';
import { logAudit } from '../utils/auditLogger.js';

export const getAllLabRequests = async (req, res) => {
  try {
    const { status, visit, patient, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (visit) query.visit = visit;
    if (patient) query.patient = patient;
    const requests = await LabRequest.find(query)
      .populate('patient', 'firstName lastName patientNumber')
      .populate('doctor', 'username')
      .populate('test', 'testName category price')
      .sort({ requestDate: -1 })
      .skip((page - 1) * limit).limit(Number(limit));
    const total = await LabRequest.countDocuments(query);
    res.json({ success: true, requests, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createLabRequest = async (req, res) => {
  try {
    const requestNumber = await generateLabRequestNumber();
    const request = await LabRequest.create({
      ...req.body,
      requestNumber,
      doctor: req.user._id,
      status: 'payment_required',
      paymentStatus: 'unpaid'
    });
    // Update visit status
    await Visit.findByIdAndUpdate(req.body.visit, { status: 'lab_payment_required' });
    await logAudit(req.user._id, 'CREATE_LAB_REQUEST', 'LabRequest', request._id, { requestNumber }, req.ip);
    const populated = await LabRequest.findById(request._id)
      .populate('test', 'testName category price')
      .populate('patient', 'firstName lastName patientNumber');
    res.status(201).json({ success: true, request: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getLabRequest = async (req, res) => {
  try {
    const request = await LabRequest.findById(req.params.id)
      .populate('patient', 'firstName lastName patientNumber')
      .populate('doctor', 'username')
      .populate('test', 'testName category price referenceRange');
    if (!request) return res.status(404).json({ success: false, message: 'Lab request not found' });
    res.json({ success: true, request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateLabRequestStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const update = {};
    if (status) update.status = status;
    if (paymentStatus) update.paymentStatus = paymentStatus;
    const request = await LabRequest.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate('test', 'testName category price')
      .populate('patient', 'firstName lastName patientNumber');
    if (!request) return res.status(404).json({ success: false, message: 'Lab request not found' });
    // Update visit status when lab is paid
    if (paymentStatus === 'paid') {
      await Visit.findByIdAndUpdate(request.visit, { status: 'lab_paid' });
    }
    await logAudit(req.user._id, 'UPDATE_LAB_REQUEST_STATUS', 'LabRequest', request._id, { status, paymentStatus }, req.ip);
    res.json({ success: true, request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPendingLabPayments = async (req, res) => {
  try {
    const requests = await LabRequest.find({ paymentStatus: 'unpaid', status: 'payment_required' })
      .populate('patient', 'firstName lastName patientNumber phone')
      .populate('doctor', 'username')
      .populate('test', 'testName price')
      .sort({ requestDate: -1 });
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getVisitLabRequests = async (req, res) => {
  try {
    const requests = await LabRequest.find({ visit: req.params.visitId })
      .populate('test', 'testName category price referenceRange')
      .populate('doctor', 'username')
      .sort({ requestDate: -1 });
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
