// src/routes/pdfRoutes.js
import express from 'express';
import { ensureAuthenticated, ensureRole } from '../middleware/auth.js';
import { generatePDFTahap1, generatePDFTahap2, generatePDFTahap3 } from '../controllers/pdfController.js';

const router = express.Router();

// PDF generation routes for each stage
router.get('/generate-pdf-tahap-1', ensureAuthenticated, ensureRole('mahasiswa'), generatePDFTahap1);
router.get('/generate-pdf-tahap-2', ensureAuthenticated, ensureRole('mahasiswa'), generatePDFTahap2);
router.get('/generate-pdf-tahap-3', ensureAuthenticated, ensureRole('mahasiswa'), generatePDFTahap3);

export default router; 