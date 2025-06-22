import express from 'express';
import { ensureAuthenticated, ensureRole } from '../middleware/auth.js';
import prisma from '../models/prisma.js'; // Ensure the path is correct
import komplainWawancaraRoutes from './komplainWawancaraRoutes.js'; // Import the komplainWawancaraRoutes
import pengumumanController from '../controllers/pengumumanController.js'; // Import the new pengumumanController
import pdfRoutes from './pdfRoutes.js'; // Import PDF routes

const router = express.Router();

router.get('/dashboard', ensureAuthenticated, ensureRole('mahasiswa'), async (req, res) => {
  const user = req.session.user;

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
  const { nama } = req.body;
  req.flash('success_msg', 'Formulir berhasil dikirim');
  res.redirect('/mahasiswa/formulirPendaftaran');
});

router.get('/jadwalWawancara', ensureAuthenticated, ensureRole('mahasiswa'), async (req, res) => {
  const user = req.session.user;
  const { komplainSuccess } = req.query;

  try {
    const jadwalWawancara = await prisma.jadwalWawancara.findMany({
      where: {
        pendaftaran: {
          user_id: user.id,
        },
      },
      include: {
        pendaftaran: {
          select: {
            domisili: true,
            asal: true,
            nomor_whatsapp: true,
            divisi: true,
            user: {
              select: {
                name: true,
                nim: true
              }
            }
          },
        },
        pewawancara: true,
        komplain: {
          orderBy: {
            tanggal_pengajuan: 'desc'
          }
        }
      },
    });

    res.render('mahasiswa/jadwalWawancara', {
      layout: 'mahasiswa/layout/main',
      title: 'Jadwal Wawancara',
      user: req.session.user,
      activePage: 'wawancara',
      jadwalWawancara: jadwalWawancara,
      komplainSuccess: komplainSuccess === 'true'
    });
  } catch (err) {
    console.error("Error fetching jadwal wawancara:", err);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat jadwal wawancara.');
    res.redirect('/mahasiswa/dashboard');
  }
});

// =========================================================
// NEW: Routes for individual Pengumuman Tahap pages
// =========================================================
router.get('/pengumuman/hasil-tahap-1', ensureAuthenticated, ensureRole('mahasiswa'), pengumumanController.getHasilTahap1);
router.get('/pengumuman/hasil-tahap-2', ensureAuthenticated, ensureRole('mahasiswa'), pengumumanController.getHasilTahap2);
router.get('/pengumuman/hasil-tahap-3', ensureAuthenticated, ensureRole('mahasiswa'), pengumumanController.getHasilTahap3);


router.use('/', komplainWawancaraRoutes); // This mounts the complaint routes
router.use('/', pdfRoutes); // This mounts the PDF routes

export default router;