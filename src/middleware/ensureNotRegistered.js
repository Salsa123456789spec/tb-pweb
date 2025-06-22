// middleware/ensureNotRegistered.js
import prisma from '../models/prisma.js';

export default async function ensureNotRegistered(req, res, next) {
  const user = req.session.user;

  if (!user) {
    req.flash('error_msg', 'Silakan login terlebih dahulu.');
    return res.redirect('/login');
  }

  const existing = await prisma.pendaftaran.findFirst({
    where: { user_id: user.id }
  });

  if (existing) {
    req.flash('error_msg', 'Kamu sudah mengisi formulir.');
    // redirect ke halaman konfirmasi pendaftaran
    return res.redirect('/mahasiswa/konfirmasiPendaftaran');
  }

  next(); // lanjut ke route handler
}
