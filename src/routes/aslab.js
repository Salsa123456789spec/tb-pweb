// src/routes/aslab.js

import express from "express";
import { ensureAuthenticated, ensureRole } from '../middleware/auth.js';
// Import semua controller yang dibutuhkan
import { getRekapPendaftar, getDetailPendaftar, deletePendaftar } from '../controllers/aslabController.js';

const router = express.Router();

// Rute untuk dashboard (DIPERBAIKI)
router.get("/dashboard", ensureAuthenticated, ensureRole('aslab'), (req, res) => {
    res.render("aslab/dashboard", {
        layout: 'aslab/layout/main', // Pastikan file /views/aslab/layout/main.ejs ada
        title: 'Dashboard Aslab',
        user: req.session.user,
        activePage: 'dashboard' // Variabel ini ditambahkan untuk mengatasi kemungkinan error di layout
    });
});

// Rute untuk menampilkan list pendaftar (sudah ada)
router.get("/rekap/pendaftar", ensureAuthenticated, ensureRole('aslab'), getRekapPendaftar);

// (RUTE BARU) Rute untuk menampilkan halaman detail pendaftar
router.get("/rekap/pendaftar/detail/:id", ensureAuthenticated, ensureRole('aslab'), getDetailPendaftar);

// (RUTE BARU) Rute untuk menghapus data pendaftar
router.get("/rekap/pendaftar/delete/:id", ensureAuthenticated, ensureRole('aslab'), deletePendaftar);

export default router;