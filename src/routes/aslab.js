import express from 'express';
import { ensureAuthenticated, ensureRole } from '../middleware/auth.js';
import prisma from '../models/prisma.js'; // pastikan path sesuai
import { getRekapKuisioner, getDetailKuisioner, getRekapAbsensi, getRekapKelulusan, getRekapPendaftar, getDetailPendaftar, deletePendaftar } from '../controllers/rekapController.js';
import { 
  showBuatAbsensiForm, 
  showTabelAbsensi, 
  simpanAbsensi, 
  showEditAbsensiForm,
  updateAbsensi
} from '../controllers/aslabController.js';

const router = express.Router();

router.get('/dashboard', ensureAuthenticated, ensureRole('asisten_lab'), async (req, res) => {
  const user = req.session.user;

//   Cek apakah user sudah mengisi pendaftaran
  const pendaftaran = await prisma.pendaftaran.findFirst({
    where: { user_id: user.id },
  });

  res.render('aslab/dashboard', {
    layout: 'aslab/layout/main',
    title: 'Dashboard Aslab',
     user: req.session.user,
    pendaftaran: pendaftaran,
    activePage: 'dashboard',
  });
});

// === RUTE UNTUK FITUR ABSENSI ===
router.get("/absensi", ensureAuthenticated, ensureRole('asisten_lab'), showBuatAbsensiForm);
router.post("/absensi", ensureAuthenticated, ensureRole('asisten_lab'), showTabelAbsensi);
router.post("/absensi/simpan", ensureAuthenticated, ensureRole('asisten_lab'), simpanAbsensi);
router.get("/absensi/edit/:pertemuan", ensureAuthenticated, ensureRole('asisten_lab'), showEditAbsensiForm);
router.post("/absensi/update/:pertemuan", ensureAuthenticated, ensureRole('asisten_lab'), updateAbsensi);

// === RUTE UNTUK FITUR REKAP ===
router.get('/rekap/kuisioner', ensureAuthenticated, ensureRole('asisten_lab'), getRekapKuisioner);
router.get('/rekap/kuisioner/:id', ensureAuthenticated, ensureRole('asisten_lab'), getDetailKuisioner);
router.get('/rekap/absensi', ensureAuthenticated, ensureRole('asisten_lab'), getRekapAbsensi);
router.get('/rekap/kelulusan', ensureAuthenticated, ensureRole('asisten_lab'), getRekapKelulusan);
router.get('/rekap/pendaftar', ensureAuthenticated, ensureRole('asisten_lab'), getRekapPendaftar);
router.get('/rekap/pendaftar/detail/:id', ensureAuthenticated, ensureRole('asisten_lab'), getDetailPendaftar);
router.get('/rekap/pendaftar/delete/:id', ensureAuthenticated, ensureRole('asisten_lab'), deletePendaftar);

export default router;
