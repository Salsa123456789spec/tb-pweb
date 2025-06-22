import express from 'express';
import { ensureAuthenticated, ensureRole } from '../middleware/auth.js';
import prisma from '../models/prisma.js';
import appState from '../config/appState.js'; // Impor state global

const router = express.Router();

// Variabel sederhana untuk status OPREC (nantinya bisa diganti dengan database)
let isOprecOpen = false; 

router.get('/dashboard', ensureAuthenticated, ensureRole('admin'), (req, res) => {
    res.render('superadmin/dashboard', {
        layout: 'superadmin/layout/main',
        title: 'Dashboard Superadmin',
        activePage: 'dashboard'
    });
});

router.get('/kelolaAslab', ensureAuthenticated, ensureRole('admin'), (req, res) => {
    res.render('superadmin/kelolaAslab', {
        layout: 'superadmin/layout/main',
        title: 'Kelola Aslab',
        activePage: 'kelolaAslab'
    });
});

// Rute untuk menampilkan halaman manajemen oprec (SEMENTARA TANPA LOGIN)
router.get('/manajemen-oprec', (req, res) => {
    res.render('superadmin/manajemenoprec', {
        layout: 'superadmin/layout/main',
        title: 'Manajemen Oprec',
        activePage: 'manajemen-oprec',
        user: { name: 'Admin (Uji Coba)' }, // Data user palsu untuk testing
        isOprecOpen: appState.isOprecOpen 
    });
});

// Rute untuk membuka web (SEMENTARA TANPA LOGIN)
router.post('/manajemen-oprec/buka', (req, res) => {
    appState.isOprecOpen = true; 
    req.flash('success_msg', 'Web rekrutmen berhasil dibuka!');
    res.redirect('/superadmin/manajemen-oprec');
});

// Rute untuk menutup web (SEMENTARA TANPA LOGIN)
router.post('/manajemen-oprec/tutup', (req, res) => {
    appState.isOprecOpen = false;
    req.flash('success_msg', 'Web rekrutmen berhasil ditutup!');
    res.redirect('/superadmin/manajemen-oprec');
});

export default router;
