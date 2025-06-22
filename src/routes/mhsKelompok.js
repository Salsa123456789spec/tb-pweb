import express from 'express';
import { ensureAuthenticated, ensureRole } from '../middleware/auth.js';
import { getKelompokPage } from '../controllers/mhsKelompokController.js';

const router = express.Router();

// Rute ini menangani GET request ke '/' RELATIF terhadap base path.
// Karena base path adalah '/mahasiswa/kelompok', maka rute ini akan cocok dengan:
// GET /mahasiswa/kelompok
router.get('/', ensureAuthenticated, ensureRole('mahasiswa'), getKelompokPage);

export default router;