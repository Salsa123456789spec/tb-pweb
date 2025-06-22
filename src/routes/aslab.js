import express from "express";
import { ensureAuthenticated, ensureRole } from '../middleware/auth.js';
import {
    getRekapPendaftar,
    getDetailPendaftar,
    deletePendaftar,
    showBuatAbsensiForm,
    showTabelAbsensi,
    simpanAbsensi
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

// === RUTE FINAL UNTUK FITUR ABSENSI LENGKAP ===
// 1. GET: Menampilkan halaman form
router.get("/absensi", ensureAuthenticated, ensureRole('asisten_lab'), showBuatAbsensiForm);

// 2. POST: Menampilkan halaman tabel (sebelum disimpan)
router.post("/absensi", ensureAuthenticated, ensureRole('asisten_lab'), showTabelAbsensi);

// 3. POST: Menerima data dari tabel dan menyimpan ke database
router.post("/absensi/simpan", ensureAuthenticated, ensureRole('asisten_lab'), simpanAbsensi);


// === RUTE LAINNYA ===
router.get("/rekap/pendaftar", ensureAuthenticated, ensureRole('asisten_lab'), getRekapPendaftar);
router.get("/rekap/pendaftar/detail/:id", ensureAuthenticated, ensureRole('asisten_lab'), getDetailPendaftar);
router.get("/rekap/pendaftar/delete/:id", ensureAuthenticated, ensureRole('asisten_lab'), deletePendaftar);

export default router;