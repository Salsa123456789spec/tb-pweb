import express from 'express';
import { 
    getJadwalWawancaraAdminForm, 
    createJadwalWawancara,
    renderEditJadwalForm,
    updateJadwalWawancara,
    deleteJadwalWawancara
} from '../controllers/jadwalWawancaraAdmin.js';
import {
    renderInputDataWawancara,
    getAllPewawancara,
    createPewawancara,
    updatePewawancara,
    deletePewawancara
} from '../controllers/inputDataWawancaraController.js';
import { 
    getVerifikasiPage, 
    getDetailPendaftar, 
    terimaDokumen, 
    tolakDokumen, 
    exportPDF 
} from '../controllers/verifikasiController.js';
import { getEvaluasiPage, updateStatusKomplain } from '../controllers/evaluasiController.js';

const router = express.Router();

// Halaman utama Aslab
router.get('/', (req, res, next) => {
    res.render('aslab/layout/index', { 
        title: 'Aslab Dashboard',
        layout: 'aslab/layout/main',
        activePage: 'dashboard'
    });
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

export default router;