import Employee from '../models/Employee.js';
import { generateEmployeeNumber } from '../utils/generateId.js';
import { logAudit } from '../utils/auditLogger.js';

export const getAllEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;
    const query = { isDeleted: false };
    if (status) query.status = status;
    if (search) query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { position: { $regex: search, $options: 'i' } },
      { employeeNumber: { $regex: search, $options: 'i' } }
    ];
    const employees = await Employee.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    const total = await Employee.countDocuments(query);
    res.json({ success: true, employees, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const employeeNumber = await generateEmployeeNumber();
    const employee = await Employee.create({ ...req.body, employeeNumber });
    await logAudit(req.user._id, 'CREATE_EMPLOYEE', 'Employee', employee._id, { name: `${employee.firstName} ${employee.lastName}` }, req.ip);
    res.status(201).json({ success: true, employee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({ _id: req.params.id, isDeleted: false });
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
    res.json({ success: true, employee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    );
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
    await logAudit(req.user._id, 'UPDATE_EMPLOYEE', 'Employee', employee._id, {}, req.ip);
    res.json({ success: true, employee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, { isDeleted: true, status: 'terminated' }, { new: true });
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
    await logAudit(req.user._id, 'DELETE_EMPLOYEE', 'Employee', employee._id, {}, req.ip);
    res.json({ success: true, message: 'Employee removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
