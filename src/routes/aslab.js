import express from 'express';
import { 
    getJadwalWawancaraAdminForm, 
    createJadwalWawancara, 
    getAllJadwalWawancaraAdmin 
} from '../controllers/jadwalWawancaraAdmin.js';
import {
    renderInputDataWawancara,
    createPewawancara,
    getAllPewawancara,
    deletePewawancara
} from '../controllers/inputDataWawancaraController.js';

const router = express.Router();

// Test route to verify layout
router.get('/test', function(req, res, next) {
    console.log('Accessing aslab test route');
    res.render('aslab/layout/test', { 
        title: 'Test Page',
        layout: 'aslab/layout/main',
        activePage: 'test'
    });
});

// Route for jadwal wawancara - multiple variations to ensure accessibility
router.get('/layout/jadwalWawancara', function(req, res, next) {
    console.log('Accessing aslab layout/jadwalWawancara route');
    try {
        res.render('aslab/layout/jadwalwawancara1', { 
            title: 'Jadwal Wawancara',
            layout: 'aslab/layout/main',
            activePage: 'jadwalWawancara'
        });
    } catch (error) {
        console.error('Error rendering aslab page:', error);
        res.status(500).send('Error loading page: ' + error.message);
    }
});

// Alternative route for jadwal wawancara
router.get('/jadwal-wawancara', function(req, res, next) {
    console.log('Accessing aslab jadwal-wawancara route');
    try {
        res.render('aslab/layout/jadwalwawancara1', { 
            title: 'Jadwal Wawancara',
            layout: 'aslab/layout/main',
            activePage: 'jadwalWawancara'
        });
    } catch (error) {
        console.error('Error rendering aslab page:', error);
        res.status(500).send('Error loading page: ' + error.message);
    }
});

// Input Data Wawancara routes
router.get('/inputdatawawancara', renderInputDataWawancara);
router.post('/inputdatawawancara', createPewawancara);
router.get('/api/pewawancara', getAllPewawancara);
router.delete('/api/pewawancara/:id', deletePewawancara);

// Alternative route for input data wawancara
router.get('/input-data-wawancara', renderInputDataWawancara);

// Verifikasi route
router.get('/verifikasi', function(req, res, next) {
    console.log('Menangani request ke /aslab/verifikasi');
    res.render('aslab/layout/verifikasi', {
        title: 'Verifikasi',
        layout: 'aslab/layout/main',
        activePage: 'verifikasi'
    });
});

// Default aslab route - now shows index page
router.get('/', function(req, res, next) {
    console.log('Accessing aslab default route');
    try {
        res.render('aslab/layout/index', { 
            title: 'Aslab Dashboard',
            layout: 'aslab/layout/main',
            activePage: 'dashboard'
        });
    } catch (error) {
        console.error('Error rendering aslab page:', error);
        res.status(500).send('Error loading page: ' + error.message);
    }
});

// Jadwal Wawancara Routes using existing admin controller
router.get('/jadwalwawancara1', getJadwalWawancaraAdminForm);
router.post('/jadwalwawancara1', createJadwalWawancara);
router.get('/jadwalwawancara1/list', getAllJadwalWawancaraAdmin);

// Route for jadwalWawancara (alternative spelling)
router.get('/jadwalWawancara', getJadwalWawancaraAdminForm);
router.post('/jadwalWawancara', createJadwalWawancara);
router.get('/jadwalWawancara/list', getAllJadwalWawancaraAdmin);

export default router;