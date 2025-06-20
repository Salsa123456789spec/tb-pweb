import express from 'express';
import { ensureAuthenticated, ensureRole } from '../middleware/auth.js';
import prisma from '../models/prisma.js'; // Ensure the path is correct

const router = express.Router();

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

// Route to fetch and display interview schedules
router.get('/jadwalWawancara', ensureAuthenticated, ensureRole('mahasiswa'), async (req, res) => {
  const user = req.session.user;

  try {
    const jadwalWawancara = await prisma.jadwalWawancara.findMany({
      where: {
        pendaftaran: { // Accessing the related Pendaftaran model
          user_id: user.id,
        },
      },
      include: {
        pendaftaran: { // Include Pendaftaran data to get name and divisi
          select: {
            domisili: true,
            asal: true,
            nomor_whatsapp: true,
            divisi: true,
            user: { // Include user to get their name
              select: {
                name: true,
                nim: true
              }
            }
          },
        },
      },
    });

    res.render('mahasiswa/jadwalWawancara', { // Assuming your EJS file is in views/mahasiswa/jadwalWawancara.ejs
      layout: 'mahasiswa/layout/main',
      title: 'Jadwal Wawancara',
      user: req.session.user,
      activePage: 'wawancara', // Adjust activePage as per your sidebar navigation
      jadwalWawancara: jadwalWawancara,
    });
  } catch (err) {
    console.error("Error fetching jadwal wawancara:", err);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat jadwal wawancara.');
    res.redirect('/mahasiswa/dashboard'); // Redirect to dashboard or an error page
  }
});

export default router;