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
import { generatePDFKelulusan, generatePDFAbsensi, generatePDFPendaftar } from '../controllers/pdfController.js';
import { 
  getVerifikasiPage, updateStatusVerifikasi, exportPDF, terimaDokumen 
} from '../controllers/verifikasiController.js';
import { 
  renderInputDataWawancara,
  getAllPewawancara,
  createPewawancara,
  updatePewawancara,
  deletePewawancara
} from '../controllers/inputDataWawancaraController.js';
import { 
  getJadwalWawancaraAdminForm, createJadwalWawancara, renderEditJadwalForm, updateJadwalWawancara, deleteJadwalWawancara 
} from '../controllers/jadwalWawancaraAdmin.js';
import { 
  getEvaluasiPage, updateStatusKomplain 
} from '../controllers/evaluasiController.js';
import PengumumanAslabController from '../controllers/PengumumanAslab.js';

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

// === RUTE UNTUK GENERATE PDF ===
router.get('/rekap/kelulusan/pdf', ensureAuthenticated, ensureRole('asisten_lab'), generatePDFKelulusan);
router.get('/rekap/absensi/pdf', ensureAuthenticated, ensureRole('asisten_lab'), generatePDFAbsensi);
router.get('/rekap/pendaftar/pdf', ensureAuthenticated, ensureRole('asisten_lab'), generatePDFPendaftar);

// === RUTE UNTUK VERIFIKASI ===
router.get('/verifikasi', ensureAuthenticated, ensureRole('asisten_lab'), getVerifikasiPage);
router.get('/verifikasi/detail/:id', ensureAuthenticated, ensureRole('asisten_lab'), getDetailPendaftar);
router.post('/verifikasi/update/:pendaftaranId', ensureAuthenticated, ensureRole('asisten_lab'), updateStatusVerifikasi);
router.get('/verifikasi/export-pdf', ensureAuthenticated, ensureRole('asisten_lab'), exportPDF);

// === RUTE UNTUK INPUT DATA WAWANCARA ===
router.get('/inputdatawawancara', ensureAuthenticated, ensureRole('asisten_lab'), renderInputDataWawancara);
router.get('/api/pewawancara', ensureAuthenticated, ensureRole('asisten_lab'), getAllPewawancara);
router.post('/api/pewawancara', ensureAuthenticated, ensureRole('asisten_lab'), createPewawancara);
router.put('/api/pewawancara/:id', ensureAuthenticated, ensureRole('asisten_lab'), updatePewawancara);
router.delete('/api/pewawancara/:id', ensureAuthenticated, ensureRole('asisten_lab'), deletePewawancara);

// === RUTE UNTUK JADWAL WAWANCARA ===
router.get('/jadwal-wawancara', ensureAuthenticated, ensureRole('asisten_lab'), getJadwalWawancaraAdminForm);
router.get('/jadwalwawancara', ensureAuthenticated, ensureRole('asisten_lab'), getJadwalWawancaraAdminForm);
router.post('/jadwal-wawancara', ensureAuthenticated, ensureRole('asisten_lab'), createJadwalWawancara);
router.get('/jadwal-wawancara/edit/:id', ensureAuthenticated, ensureRole('asisten_lab'), renderEditJadwalForm);
router.post('/jadwal-wawancara/update/:id', ensureAuthenticated, ensureRole('asisten_lab'), updateJadwalWawancara);
router.delete('/jadwal-wawancara/delete/:id', ensureAuthenticated, ensureRole('asisten_lab'), deleteJadwalWawancara);

// === RUTE UNTUK EVALUASI PERMOHONAN ===
router.get('/evaluasi-permohonan', ensureAuthenticated, ensureRole('asisten_lab'), getEvaluasiPage);
router.get('/evaluasipermohonan', ensureAuthenticated, ensureRole('asisten_lab'), getEvaluasiPage);
router.post('/evaluasi-permohonan/:komplainId', ensureAuthenticated, ensureRole('asisten_lab'), updateStatusKomplain);

// === RUTE UNTUK PENGUMUMAN ===
router.get('/pengumuman', ensureAuthenticated, ensureRole('asisten_lab'), PengumumanAslabController.index);
router.get('/api/pendaftar/:tahapan', ensureAuthenticated, ensureRole('asisten_lab'), PengumumanAslabController.getPendaftarByTahapan);
router.post('/api/simpan-pengumuman', ensureAuthenticated, ensureRole('asisten_lab'), PengumumanAslabController.simpanPengumuman);

export default router;
