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

// Kelola Aslab - Tampilkan daftar aslab
router.get('/kelolaAslab', ensureAuthenticated, ensureRole('admin'), async (req, res) => {
  try {
    const aslabs = await prisma.user.findMany({
      where: { role: 'asisten_lab' },
      orderBy: { name: 'asc' }
    });

    res.render('superadmin/kelolaAslab', {
      layout: 'superadmin/layout/main',
      title: 'Kelola Aslab',
      activePage: 'kelolaAslab',
      user: req.session.user,
      aslabs,
      success: req.flash('success_msg'),
      error: req.flash('error_msg')
    });
  } catch (error) {
    console.error('Error loading aslab data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Form Tambah Aslab
router.get('/tambahAslab', ensureAuthenticated, ensureRole('admin'), (req, res) => {
  res.render('superadmin/tambahAslab', {
    layout: 'superadmin/layout/main',
    title: 'Tambah Aslab',
    activePage: 'tambahAslab',
    user: req.session.user,
    error: req.flash('error_msg')
  });
});

// Proses Tambah Aslab
router.post('/tambahAslab', ensureAuthenticated, ensureRole('admin'), async (req, res) => {
  try {
    const { name, email, password, no_aslab } = req.body;

    // Validasi input
    if (!name || !email || !password || !no_aslab) {
      req.flash('error_msg', 'Semua field harus diisi!');
      return res.redirect('/superadmin/tambahAslab');
    }

    // Cek apakah email sudah ada
    const existingEmail = await prisma.user.findUnique({
      where: { email }
    });

    if (existingEmail) {
      req.flash('error_msg', 'Email sudah terdaftar!');
      return res.redirect('/superadmin/tambahAslab');
    }

    // Cek apakah no_aslab sudah ada
    const existingNoAslab = await prisma.user.findUnique({
      where: { no_aslab }
    });

    if (existingNoAslab) {
      req.flash('error_msg', 'Nomor Aslab sudah terdaftar!');
      return res.redirect('/superadmin/tambahAslab');
    }

    // Hash password (gunakan bcrypt jika tersedia)
    const hashedPassword = password; // Untuk sementara, implementasikan bcrypt nanti

    // Buat user aslab baru
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        no_aslab,
        role: 'asisten_lab'
      }
    });

    req.flash('success_msg', 'Aslab berhasil ditambahkan!');
    res.redirect('/superadmin/kelolaAslab');

  } catch (error) {
    console.error('Error adding aslab:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat menambah aslab!');
    res.redirect('/superadmin/tambahAslab');
  }
});

// Form Edit Aslab
router.get('/editAslab/:id', ensureAuthenticated, ensureRole('admin'), async (req, res) => {
  try {
    const aslabId = parseInt(req.params.id);
    const aslab = await prisma.user.findUnique({
      where: { id: aslabId }
    });

    if (!aslab || aslab.role !== 'asisten_lab') {
      req.flash('error_msg', 'Aslab tidak ditemukan!');
      return res.redirect('/superadmin/kelolaAslab');
    }

    res.render('superadmin/editAslab', {
      layout: 'superadmin/layout/main',
      title: 'Edit Aslab',
      activePage: 'editAslab',
      user: req.session.user,
      aslab,
      error: req.flash('error_msg')
    });
  } catch (error) {
    console.error('Error loading aslab for edit:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Proses Edit Aslab
router.post('/editAslab/:id', ensureAuthenticated, ensureRole('admin'), async (req, res) => {
  try {
    const aslabId = parseInt(req.params.id);
    const { name, email, no_aslab } = req.body;

    // Validasi input
    if (!name || !email || !no_aslab) {
      req.flash('error_msg', 'Semua field harus diisi!');
      return res.redirect(`/superadmin/editAslab/${aslabId}`);
    }

    // Cek apakah email sudah ada (kecuali untuk user yang sedang diedit)
    const existingEmail = await prisma.user.findFirst({
      where: { 
        email,
        id: { not: aslabId }
      }
    });

    if (existingEmail) {
      req.flash('error_msg', 'Email sudah terdaftar!');
      return res.redirect(`/superadmin/editAslab/${aslabId}`);
    }

    // Cek apakah no_aslab sudah ada (kecuali untuk user yang sedang diedit)
    const existingNoAslab = await prisma.user.findFirst({
      where: { 
        no_aslab,
        id: { not: aslabId }
      }
    });

    if (existingNoAslab) {
      req.flash('error_msg', 'Nomor Aslab sudah terdaftar!');
      return res.redirect(`/superadmin/editAslab/${aslabId}`);
    }

    // Update data aslab
    await prisma.user.update({
      where: { id: aslabId },
      data: {
        name,
        email,
        no_aslab
      }
    });

    req.flash('success_msg', 'Data aslab berhasil diperbarui!');
    res.redirect('/superadmin/kelolaAslab');

  } catch (error) {
    console.error('Error updating aslab:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memperbarui data aslab!');
    res.redirect(`/superadmin/editAslab/${req.params.id}`);
  }
});

// Hapus Aslab
router.post('/hapusAslab/:id', ensureAuthenticated, ensureRole('admin'), async (req, res) => {
  try {
    const aslabId = parseInt(req.params.id);
    
    await prisma.user.delete({
      where: { id: aslabId }
    });

    req.flash('success_msg', 'Aslab berhasil dihapus!');
    res.redirect('/superadmin/kelolaAslab');
  } catch (error) {
    console.error('Error deleting aslab:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat menghapus aslab!');
    res.redirect('/superadmin/kelolaAslab');
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
