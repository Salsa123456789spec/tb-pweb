// src/routes/mahasiswa.js
import express from 'express';
import { ensureAuthenticated, ensureRole } from '../middleware/auth.js';
import prisma from '../models/prisma.js';
import upload from '../middleware/upload.js'; // Pastikan Anda memiliki middleware upload untuk penyerahan tugas

import { getAllTugas, getTugasById, submitTugas } from '../controllers/tugasController.js';

const router = express.Router();

// ... (Rute yang sudah ada, seperti dashboard, formulirPendaftaran, jadwalWawancara) ...

router.get('/dashboard', ensureAuthenticated, ensureRole('mahasiswa'), async (req, res) => {
  const user = req.session.user;

  // Cek apakah user sudah mengisi pendaftaran
  const pendaftaran = await prisma.pendaftaran.findFirst({
    where: { user_id: user.id },
  });

  res.render('mahasiswa/dashboard', {
    layout: 'mahasiswa/layout/main',
    title: 'Dashboard Mahasiswa',
    user: req.session.user,
    pendaftaran: pendaftaran,
    activePage: 'dashboard',
  });
});


router.get('/formulirPendaftaran', ensureAuthenticated, ensureRole('mahasiswa'), (req, res) => {
  res.render('mahasiswa/formulirPendaftaran', {
    layout: 'mahasiswa/layout/main',
    title: 'Formulir Pendaftaran',
    user: req.session.user,
    activePage: 'formulirPendaftaran'
  });
});

router.post('/formulirPendaftaran', ensureAuthenticated, ensureRole('mahasiswa'), (req, res) => {
  // ambil data dari req.body
  const { nama } = req.body;

  // simpan ke database atau lakukan validasi

  req.flash('success_msg', 'Formulir berhasil dikirim');
  res.redirect('/mahasiswa/formulirPendaftaran');
});

router.get('/tugas', ensureAuthenticated, ensureRole('mahasiswa'), getAllTugas);
// Rute untuk menampilkan detail tugas berdasarkan ID
router.get('/tugas/:id', ensureAuthenticated, ensureRole('mahasiswa'), getTugasById);

// Rute BARU untuk menghandle pengumpulan tugas
router.post('/tugas/:id/kumpul', ensureAuthenticated, ensureRole('mahasiswa'), upload.single('fileTugas'), submitTugas);

export default router;