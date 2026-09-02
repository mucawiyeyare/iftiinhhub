import AuditLog from '../models/AuditLog.js';

export const logAudit = async (userId, action, entity, entityId, details = {}, ipAddress = '') => {
  try {
    await AuditLog.create({ user: userId, action, entity, entityId, details, ipAddress });
  } catch (err) {
    console.error('Audit log error:', err.message);
  }
};
