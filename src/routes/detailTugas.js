// File: routes/aslab/tugas.js

import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const prisma = new PrismaClient();

// Konfigurasi multer untuk upload lampiran
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './public/uploads';
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });


// ✅ GET: Tampilkan daftar tugas (opsional kalau kamu punya)
router.get('/aslab/buatTugas', async (req, res) => {
  try {
    const tugas = await prisma.tugas.findMany();
    res.render('aslab/daftarTugas', {
      title: 'Daftar Tugas',
      tugas,
      layout: 'aslab/layout/main',
      user: req.session.user,
      activePage: 'tugas'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal mengambil tugas');
  }
});


// ✅ GET: Form tambah tugas
router.get('/aslab/formTugas', (req, res) => {
  res.render('aslab/formTugas', {
    title: 'Form Tugas Baru',
    layout: 'aslab/layout/main',
    user: req.session.user,
    success: false,
    error: false
  });
});


// ✅ POST: Simpan tugas baru
router.post('/aslab/tugas', upload.single('lampiran'), async (req, res) => {
  try {
    const { judul, deskripsi, deadline, kategori } = req.body;
    const lampiran = req.file ? req.file.filename : null;

    await prisma.tugas.create({
      data: {
        judul,
        deskripsi,
        deadline: new Date(deadline),
        kategori,
        lampiran
      }
    });

    res.render('aslab/formTugas', {
      title: 'Form Tugas Baru',
      layout: 'aslab/layout/main',
      user: req.session.user,
      success: true,
      error: false
    });
  } catch (err) {
    console.error(err);
    res.render('aslab/formTugas', {
      title: 'Form Tugas Baru',
      layout: 'aslab/layout/main',
      user: req.session.user,
      success: false,
      error: true
    });
  }
});


// ✅ GET: Tampilkan detail tugas
router.get('/aslab/tugas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const tugas = await prisma.tugas.findUnique({ where: { id: Number(id) } });
    if (!tugas) return res.status(404).send('Tugas tidak ditemukan');

    res.render('aslab/detailTugas', {
      title: 'Detail Tugas',
      layout: 'aslab/layout/main',
      tugas,
      user: req.session.user,
      activePage: 'tugas'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal memuat detail tugas');
  }
});


// ✅ POST: Update tugas
router.post('/aslab/tugas/update/:id', async (req, res) => {
  const { id } = req.params;
  const { judul, deskripsi, deadline } = req.body;

  try {
    await prisma.tugas.update({
      where: { id: Number(id) },
      data: {
        judul,
        deskripsi,
        deadline: new Date(deadline)
      }
    });
    res.redirect('/aslab/buatTugas');
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal mengupdate tugas');
  }
});

export default router;
