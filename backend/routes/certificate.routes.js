import express from 'express';
import {
  verifyCertificate,
  getStudentCertificates,
  getAllCertificates,
  createCertificate,
  assignCompletedAndGenerateCertificate,
  updateCertificate,
  deleteCertificate
} from '../controllers/certificate.controller.js';
import { protect, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public Verification Routes
router.get('/verify/:id', verifyCertificate);
router.get('/verify', verifyCertificate);

// Student Certificates Route (Authenticated Student)
router.get('/my-certificates', protect, getStudentCertificates);

// Admin Certificate Management Routes
router.get('/', protect, isAdmin, getAllCertificates);
router.post('/', protect, isAdmin, createCertificate);
router.post('/assign-complete', protect, isAdmin, assignCompletedAndGenerateCertificate);
router.put('/:id', protect, isAdmin, updateCertificate);
router.delete('/:id', protect, isAdmin, deleteCertificate);

export default router;
