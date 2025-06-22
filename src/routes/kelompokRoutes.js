import express from 'express';
import { ensureAuthenticated, ensureRole } from '../middleware/auth.js';
import {
    getKelompokPage,
    getCreateKelompokPage,
    createKelompok,
    getEditKelompokPage,
    updateKelompok,
    deleteKelompok
} from '../controllers/aslabKelompokController.js';

const router = express.Router();

// Semua rute di sini memerlukan otentikasi dan peran 'asisten_lab'
router.use(ensureAuthenticated, ensureRole('asisten_lab'));

// Halaman utama kelompok
router.get('/', getKelompokPage);

// Rute untuk membuat kelompok baru
router.get('/create', getCreateKelompokPage);
router.post('/create', createKelompok);

// Rute untuk mengedit kelompok
router.get('/edit/:id', getEditKelompokPage);
router.post('/edit/:id', updateKelompok);

// Rute untuk menghapus kelompok
router.post('/delete/:id', deleteKelompok);

export default router;