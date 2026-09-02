import DentalService from '../models/DentalService.js';
import { logAudit } from '../utils/auditLogger.js';

export const getAllDentalServices = async (req, res) => {
  try {
    const { category, isActive } = req.query;
    const query = {};
    if (category) query.category = category;
    if (typeof isActive !== 'undefined') query.isActive = isActive !== 'false';
    const services = await DentalService.find(query).sort({ category: 1, name: 1 });
    res.json({ success: true, services });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createDentalService = async (req, res) => {
  try {
    const service = await DentalService.create(req.body);
    await logAudit(req.user._id, 'CREATE_DENTAL_SERVICE', 'DentalService', service._id, { name: service.name }, req.ip);
    res.status(201).json({ success: true, service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateDentalService = async (req, res) => {
  try {
    const service = await DentalService.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    await logAudit(req.user._id, 'UPDATE_DENTAL_SERVICE', 'DentalService', service._id, {}, req.ip);
    res.json({ success: true, service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteDentalService = async (req, res) => {
  try {
    const service = await DentalService.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    await logAudit(req.user._id, 'DELETE_DENTAL_SERVICE', 'DentalService', service._id, {}, req.ip);
    res.json({ success: true, message: 'Service deactivated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
