import express from 'express';
import { ensureAuthenticated, ensureRole } from '../middleware/auth.js';
import prisma from '../models/prisma.js'; // pastikan path sesuai
import { getRekapKuisioner, getDetailKuisioner } from '../controllers/rekapController.js';
import PengumumanAslabController from '../controllers/PengumumanAslab.js';
import {
    renderInputDataWawancara,
    getAllPewawancara,
    createPewawancara,
    updatePewawancara,
    deletePewawancara
} from '../controllers/inputDataWawancaraController.js';
import { 
    getJadwalWawancaraAdminForm, 
    createJadwalWawancara,
    renderEditJadwalForm,
    updateJadwalWawancara,
    deleteJadwalWawancara
} from '../controllers/jadwalWawancaraAdmin.js';
import { getEvaluasiPage, updateStatusKomplain } from '../controllers/evaluasiController.js';
import { 
    getVerifikasiPage, 
    getDetailPendaftar, 
    terimaDokumen, 
    tolakDokumen, 
    exportPDF,
    viewDocument
} from '../controllers/verifikasiController.js';

const router = express.Router();

// Middleware untuk memastikan semua rute di sini hanya bisa diakses oleh aslab
router.use(ensureAuthenticated, ensureRole('asisten_lab'));

// Halaman utama Aslab
router.get('/', (req, res, next) => {
    res.render('aslab/dashboard', { 
        title: 'Aslab Dashboard',
        layout: 'aslab/layout/main',
        activePage: 'dashboard',
        user: req.session.user
    });
});

// Route dashboard untuk kemudahan akses
router.get('/dashboard', (req, res, next) => {
    res.render('aslab/dashboard', { 
        title: 'Aslab Dashboard',
        layout: 'aslab/layout/main',
        activePage: 'dashboard',
        user: req.session.user
    });
});

// Route test untuk debug
router.get('/test', (req, res) => {
    res.send('Route test berhasil!');
});

// Rute Jadwal Wawancara
router.get('/jadwal-wawancara', getJadwalWawancaraAdminForm);
router.get('/jadwalwawancara1', getJadwalWawancaraAdminForm);
router.post('/jadwal-wawancara', createJadwalWawancara);
router.get('/jadwal-wawancara/edit/:id', renderEditJadwalForm);
router.post('/jadwal-wawancara/update/:id', updateJadwalWawancara);
router.delete('/jadwal-wawancara/delete/:id', deleteJadwalWawancara);

// Rute Input Data Pewawancara (Halaman & API)
router.get('/inputdatawawancara', renderInputDataWawancara);
router.get('/api/pewawancara', getAllPewawancara);
router.post('/api/pewawancara', createPewawancara);
router.put('/api/pewawancara/:id', updatePewawancara);
router.delete('/api/pewawancara/:id', deletePewawancara);

// Rute Verifikasi Dokumen
router.get('/verifikasi', getVerifikasiPage);
router.get('/verifikasi/detail/:id', getDetailPendaftar);
router.get('/verifikasi/document/:pendaftaranId/:documentType', viewDocument);
router.post('/verifikasi/terima/:id', terimaDokumen);
router.post('/verifikasi/tolak/:id', tolakDokumen);
router.get('/verifikasi/export-pdf', exportPDF);

// Rute Evaluasi Permohonan
router.get('/evaluasi-permohonan', getEvaluasiPage);
router.post('/evaluasi-permohonan/:komplainId', updateStatusKomplain);

// Rute lihatdetail - redirect ke verifikasi
router.get('/lihatdetail', (req, res) => {
    res.redirect('/aslab/verifikasi');
});

// Rute PengumumanAslab Controller (dengan autentikasi)
router.get('/pengumuman', PengumumanAslabController.index);
router.get('/pengumuman-aslab', PengumumanAslabController.index); // Route untuk backward compatibility
router.get('/api/pendaftar/:tahapan', PengumumanAslabController.getPendaftarByTahapan);
router.post('/api/simpan-pengumuman', PengumumanAslabController.simpanPengumuman);
router.get('/api/status-kelulusan', PengumumanAslabController.getStatusKelulusan);
router.get('/api/debug/pengumuman', PengumumanAslabController.getAllPengumuman); // Debug route

// Test route untuk debugging
router.get('/test-pengumuman', (req, res) => {
    res.json({ message: 'Test route working', timestamp: new Date().toISOString() });
});

// Rute Rekap Kuisioner
router.get('/rekap/kuisioner', getRekapKuisioner);
router.get('/rekap/kuisioner/:id', getDetailKuisioner);

export default router;
