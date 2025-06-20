// src/routes/jadwalWawancaraRoutes.js
import express from 'express';
import { getJadwalWawancara } from '../controllers/jadwalWawancaraController.js';
import { ensureAuthenticated, ensureRole } from '../middleware/auth.js';

const router = express.Router();

// Route to get all interview schedules for 'mahasiswa' role
router.get('/', getJadwalWawancara);

// Route to get all interview schedules for 'admin' role
router.get('/admin', ensureAuthenticated, ensureRole('admin'), getJadwalWawancara);

export default router;