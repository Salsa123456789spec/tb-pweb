import express from 'express';
import { ensureAuthenticated, ensureRole } from '../middleware/auth.js';
import prisma from '../models/prisma.js'; // pastikan path sesuai

const router = express.Router();

router.get('/dashboard', ensureAuthenticated, ensureRole('asisten_lab'), async (req, res) => {
  const user = req.session.user;

//   Cek apakah user sudah mengisi pendaftaran
  const pendaftaran = await prisma.pendaftaran.findFirst({
    where: { user_id: user.id },
  });

  res.render('aslab/dashboard', {
    layout: 'aslab/layout/main',
    title: 'Dashboard Aslab',
     user: req.session.user,
    pendaftaran: pendaftaran,
    activePage: 'dashboard',
  });
});








export default router;
