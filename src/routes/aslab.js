import express from "express";
import { ensureAuthenticated, ensureRole } from '../middleware/auth.js';
// Import semua controller yang dibutuhkan
import { getRekapPendaftar, getDetailPendaftar, deletePendaftar } from '../controllers/aslabController.js';

const router = express.Router();

// Rute untuk dashboard
router.get("/dashboard", ensureAuthenticated, ensureRole('asisten_lab'), (req, res) => {
    res.render("aslab/dashboard", {
        layout: 'aslab/layout/main', // Pastikan file /views/aslab/layout/main.ejs ada
        title: 'Dashboard Aslab',
        user: req.session.user,
        activePage: 'dashboard' // Variabel ini ditambahkan untuk mengatasi kemungkinan error di layout
    });
});

// Rute untuk halaman Absensi
router.get("/absensi", ensureAuthenticated, ensureRole('asisten_lab'), (req, res) => {
    // Anda bisa menambahkan logika untuk mengambil data riwayat dari database di sini
    const riwayatAbsensi = [
        {
            pertemuan: 1,
            tanggal: '16/06/2025',
            pembahasan: 'Pengenalan Materi Dasar Programming',
            peserta: '18/20'
        }
    ];

    res.render("aslab/absensi", { // Panggil file ejs yang baru dibuat
        layout: 'aslab/layout/main',
        title: 'Manajemen Absensi',
        user: req.session.user,
        activePage: 'absensi', // Untuk menyorot menu aktif
        riwayat: riwayatAbsensi // Mengirim data contoh ke view
    });
});

// Rute untuk menampilkan list pendaftar
router.get("/rekap/pendaftar", ensureAuthenticated, ensureRole('asisten_lab'), getRekapPendaftar);

// Rute untuk menampilkan halaman detail pendaftar
router.get("/rekap/pendaftar/detail/:id", ensureAuthenticated, ensureRole('asisten_lab'), getDetailPendaftar);

// Rute untuk menghapus data pendaftar
router.get("/rekap/pendaftar/delete/:id", ensureAuthenticated, ensureRole('asisten_lab'), deletePendaftar);

export default router;