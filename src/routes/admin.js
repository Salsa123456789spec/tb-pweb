import express from 'express';
import { PrismaClient } from '@prisma/client';
import { ensureAuthenticated, ensureRole } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Dashboard Superadmin
router.get('/dashboard', ensureAuthenticated, ensureRole('admin'), async (req, res) => {
  try {
    // Total user dengan role mahasiswa
    const totalUser = await prisma.user.count({
      where: { role: 'mahasiswa' },
    });

    // Jumlah mahasiswa aktif dan tidak aktif berdasarkan hasil_akhir di tabel Pendaftaran
   

    res.render('superadmin/dashboard', {
      layout: 'superadmin/layout/main',
      user: req.session.user,
      title: 'Dashboard Admin',
      activePage: 'dashboard',
      totalUser,
     
    });
  } catch (error) {
    console.error('Error loading dashboard:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Kelola User
router.get('/kelolaUser', ensureAuthenticated, ensureRole('admin'), async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    const totalUser = await prisma.user.count();

    res.render('admin/kelolaUser', {
      layout: 'superadmin/layout/main',
      title: 'Kelola User',
      activePage: 'kelolaUser',
      user: req.session.user,
      users,
      totalUser,
    });
  } catch (error) {
    console.error('Error loading user data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Hapus User
router.post('/hapus-user/:id', ensureAuthenticated, ensureRole('admin'), async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    res.redirect('/admin/kelola-user');
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
