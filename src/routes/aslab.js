import express from "express";
import { ensureAuthenticated, ensureRole } from '../middleware/auth.js';
import {
    getRekapPendaftar,
    getDetailPendaftar,
    deletePendaftar,
    showBuatAbsensiForm,
    showTabelAbsensi,
    simpanAbsensi,
    showEditAbsensiForm,
    getRekapAbsensi // <-- Fungsi baru untuk rekap absensi diimpor di sini
} from '../controllers/aslabController.js';

const router = express.Router();

router.get("/dashboard", ensureAuthenticated, ensureRole('asisten_lab'), (req, res) => {
    res.render("aslab/dashboard", {
        layout: 'aslab/layout/main',
        title: 'Dashboard Aslab',
        user: req.session.user,
        activePage: 'dashboard'
    });
});

// === RUTE UNTUK FITUR ABSENSI ===
router.get("/absensi", ensureAuthenticated, ensureRole('asisten_lab'), showBuatAbsensiForm);
router.post("/absensi", ensureAuthenticated, ensureRole('asisten_lab'), showTabelAbsensi);
router.post("/absensi/simpan", ensureAuthenticated, ensureRole('asisten_lab'), simpanAbsensi);
router.get("/absensi/edit/:pertemuan", ensureAuthenticated, ensureRole('asisten_lab'), showEditAbsensiForm);

// === RUTE REKAP ===
router.get("/rekap/pendaftar", ensureAuthenticated, ensureRole('asisten_lab'), getRekapPendaftar);
router.get("/rekap/pendaftar/detail/:id", ensureAuthenticated, ensureRole('asisten_lab'), getDetailPendaftar);
router.get("/rekap/pendaftar/delete/:id", ensureAuthenticated, ensureRole('asisten_lab'), deletePendaftar);

// Rute baru untuk rekap absensi ditambahkan di sini
router.get("/rekap/absensi", ensureAuthenticated, ensureRole('asisten_lab'), getRekapAbsensi);

export default router;