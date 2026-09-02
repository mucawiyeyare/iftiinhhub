import LabTest from '../models/LabTest.js';
import { logAudit } from '../utils/auditLogger.js';

export const getAllLabTests = async (req, res) => {
  try {
    const { category, isActive } = req.query;
    const query = {};
    if (category) query.category = category;
    if (typeof isActive !== 'undefined') query.isActive = isActive !== 'false';
    const tests = await LabTest.find(query).sort({ category: 1, testName: 1 });
    res.json({ success: true, tests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createLabTest = async (req, res) => {
  try {
    const test = await LabTest.create(req.body);
    await logAudit(req.user._id, 'CREATE_LAB_TEST', 'LabTest', test._id, { name: test.testName }, req.ip);
    res.status(201).json({ success: true, test });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateLabTest = async (req, res) => {
  try {
    const test = await LabTest.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!test) return res.status(404).json({ success: false, message: 'Lab test not found' });
    await logAudit(req.user._id, 'UPDATE_LAB_TEST', 'LabTest', test._id, {}, req.ip);
    res.json({ success: true, test });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteLabTest = async (req, res) => {
  try {
    const test = await LabTest.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!test) return res.status(404).json({ success: false, message: 'Lab test not found' });
    res.json({ success: true, message: 'Lab test deactivated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
