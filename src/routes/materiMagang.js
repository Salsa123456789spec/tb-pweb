import express from 'express';
import { ensureAuthenticated, ensureRole } from '../middleware/auth.js';
import { getAllMateri, getMateriById } from '../controllers/materiController.js';

const router = express.Router();

// Route untuk menampilkan semua materi
router.get('/', ensureAuthenticated, ensureRole('mahasiswa'), getAllMateri);

// Route untuk menampilkan detail materi berdasarkan ID
router.get('/:id', ensureAuthenticated, ensureRole('mahasiswa'), getMateriById);

export default router; 