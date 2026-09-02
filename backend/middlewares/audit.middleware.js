import { logAudit } from '../utils/auditLogger.js';

export const audit = (action, entity) => {
  return (req, res, next) => {
    const originalSend = res.json;
    res.json = function (body) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const entityId = body?.data?._id || req.params?.id || null;
        logAudit(
          req.user?._id,
          action,
          entity,
          entityId,
          { body: req.body, query: req.query, params: req.params },
          req.ip
        );
      }
      originalSend.call(this, body);
    };
    next();
  };
};
