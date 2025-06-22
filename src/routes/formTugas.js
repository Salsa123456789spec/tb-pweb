// File: src/routes/mahasiswa/tugas.js

import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const prisma = new PrismaClient();

// Setup multer untuk upload file tugas
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './public/uploads/tugas';
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Hanya file PDF yang diperbolehkan.'));
  }
});

router.get('/formTugas', (req, res) => {
  res.render('aslab/formTugas', {
    title: 'Form Tugas Baru',
    layout: 'aslab/layout/main',
    user: req.session.user,
    success: false,
    error: false
  });
});

// POST: Kirim/Update tugas
router.post('/tugas/:id/submit', upload.single('file'), async (req, res) => {
  const { id } = req.params;
  const user = req.session.user;

  try {
    const tugas = await prisma.tugas.findUnique({ where: { id: Number(id) } });
    if (!tugas) return res.status(404).send('Tugas tidak ditemukan');

    if (new Date() > new Date(tugas.deadline)) {
      return res.status(403).send('Deadline sudah lewat.');
    }

    const pendaftaran = await prisma.pendaftaran.findFirst({
      where: { user_id: user.id }
    });
    if (!pendaftaran) return res.status(403).send('Pendaftaran tidak ditemukan');

    const filename = req.file.filename;

    await prisma.pengumpulanTugas.upsert({
      where: {
        tugas_id_pendaftaran_id: {
          tugas_id: Number(id),
          pendaftaran_id: pendaftaran.id
        }
      },
      update: {
        file: filename,
        tanggal_kumpul: new Date(),
        status: 'terkumpul'
      },
      create: {
        tugas_id: Number(id),
        pendaftaran_id: pendaftaran.id,
        file: filename,
        tanggal_kumpul: new Date(),
        status: 'terkumpul'
      }
    });

    res.redirect(`/mahasiswa/tugas/${id}?success=1`);
  } catch (err) {
    console.error('Gagal submit tugas:', err);
    res.status(500).send('Terjadi kesalahan saat upload tugas.');
  }
});

router.post('/tugas', upload.single('lampiran'), async (req, res) => {
  const { judul, deskripsi, deadline, kategori } = req.body;
  let filename = null;

  if (req.file) {
    filename = req.file.filename;
  }

  try {
    await prisma.tugas.create({
      data: {
        judul,
        deskripsi,
        deadline: new Date(deadline),
        kategori,
        lampiran: filename
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
    console.error('Gagal menyimpan tugas:', err);
    res.render('aslab/formTugas', {
      title: 'Form Tugas Baru',
      layout: 'aslab/layout/main',
      user: req.session.user,
      success: false,
      error: true
    });
  }
});

export default router;
