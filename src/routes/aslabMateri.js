import express from 'express';
import { ensureAuthenticated, ensureRole } from '../middleware/auth.js';
import {
  listMateri,
  renderCreateForm,
  createMateri,
  renderEditForm,
  updateMateri,
  deleteMateri
} from '../controllers/aslabMateriController.js';
import upload from '../middleware/upload.js'; // asumsi middleware multer

const router = express.Router();

router.get('/', ensureAuthenticated, ensureRole('asisten_lab'), listMateri);
router.get('/tambah', ensureAuthenticated, ensureRole('asisten_lab'), renderCreateForm);
router.post('/tambah', ensureAuthenticated, ensureRole('asisten_lab'), upload.single('file'), createMateri);

router.get('/edit/:id', ensureAuthenticated, ensureRole('asisten_lab'), renderEditForm);
router.post('/edit/:id', ensureAuthenticated, ensureRole('asisten_lab'), upload.single('file'), updateMateri);

router.post('/hapus/:id', ensureAuthenticated, ensureRole('asisten_lab'), deleteMateri);

export default router;
