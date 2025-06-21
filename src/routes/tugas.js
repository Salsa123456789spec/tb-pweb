import express from 'express';
import { ensureAuthenticated, ensureRole } from '../middleware/auth.js';
import { getAllTugas, getTugasById, submitTugas } from '../controllers/tugasController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Route untuk menampilkan semua tugas
router.get('/', ensureAuthenticated, ensureRole('mahasiswa'), getAllTugas);

// Route untuk menampilkan detail tugas berdasarkan ID
router.get('/:id', ensureAuthenticated, ensureRole('mahasiswa'), getTugasById);

// Route untuk mengumpulkan tugas
router.post('/:id/kumpul', ensureAuthenticated, ensureRole('mahasiswa'), upload.single('fileTugas'), submitTugas);

export default router; 