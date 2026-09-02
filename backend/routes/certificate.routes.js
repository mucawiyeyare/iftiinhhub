import express from 'express';
import {
  verifyCertificate,
  getAllCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate
} from '../controllers/certificate.controller.js';
import { protect, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public Verification Routes
router.get('/verify/:id', verifyCertificate);
router.get('/verify', verifyCertificate);

// Admin Certificate Management Routes
router.get('/', protect, isAdmin, getAllCertificates);
router.post('/', protect, isAdmin, createCertificate);
router.put('/:id', protect, isAdmin, updateCertificate);
router.delete('/:id', protect, isAdmin, deleteCertificate);

export default router;
