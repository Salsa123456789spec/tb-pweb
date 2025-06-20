import express from 'express';
import { ensureAuthenticated, ensureRole } from '../middleware/auth.js';
import prisma from '../models/prisma.js'; // pastikan path sesuai

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


// Blok router.post('/formulirPendaftaran',...) sudah dihapus dari sini


export default router;