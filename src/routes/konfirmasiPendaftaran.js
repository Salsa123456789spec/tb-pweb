import express from 'express';
import prisma from '../models/prisma.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const user = req.session.user;

  if (!user) {
    req.flash('error_msg', 'Silakan login terlebih dahulu.');
    return res.redirect('/login');
  }

  const data = await prisma.pendaftaran.findFirst({
    where: { user_id: user.id }
  });

  if (!data) {
    req.flash('error_msg', 'Data pendaftaran tidak ditemukan.');
    return res.redirect('/mahasiswa/formulirPendaftaran');
  }

  res.render('mahasiswa/konfirmasiPendaftaran', {
  user,
  data,
  title: 'Konfirmasi Pendaftaran',
  activePage: 'konfirmasiPendaftaran' // tambahkan ini
});
});

export default router;
