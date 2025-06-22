// File: src/routes/mahasiswa/tugas.js (atau sesuai struktur kamu)

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
    const dir = path.join('public', 'uploads', 'tugas');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
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

router.get('/tugas/:id', async (req, res) => {
  const { id } = req.params;
  const user = req.session.user;

  if (!user) return res.redirect('/login'); // ⬅️ penting!

  try {
    const tugas = await prisma.tugas.findUnique({
      where: { id: Number(id) }
    });
    if (!tugas) return res.status(404).send('Tugas tidak ditemukan');

    const pendaftaran = await prisma.pendaftaran.findFirst({
      where: { user_id: user.id }
    });
    if (!pendaftaran) return res.status(403).send('Pendaftaran tidak ditemukan');

    const pengumpulan = await prisma.pengumpulanTugas.findUnique({
      where: {
        tugas_id_pendaftaran_id: {
          tugas_id: Number(id),
          pendaftaran_id: pendaftaran.id
        }
      }
    });

    res.render('mahasiswa/detailTugasMahasiswa', {
      layout: 'mahasiswa/layout/main',
      title: 'Detail Tugas',
      tugas,
      pengumpulan,
      user,
      activePage: 'tugas',
      success: req.query.success === '1'
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan saat memuat detail tugas');
  }
});

router.post('/tugas/:id/submit', upload.single('file'), async (req, res) => {
  const { id } = req.params;
  const user = req.session.user;

  if (!user) return res.redirect('/login');

  try {
    // Cari pendaftaran user
    const pendaftaran = await prisma.pendaftaran.findFirst({
      where: { user_id: user.id }
    });
    
    if (!pendaftaran) {
      req.flash('error_msg', 'Pendaftaran tidak ditemukan. Silakan daftar terlebih dahulu.');
      return res.redirect(`/mahasiswa/tugas/${id}`);
    }

    const tugas = await prisma.tugas.findUnique({
      where: { id: Number(id) }
    });
    if (!tugas) {
      req.flash('error_msg', 'Tugas tidak ditemukan.');
      return res.redirect('/mahasiswa/tugas');
    }

    if (new Date() > new Date(tugas.deadline)) {
      req.flash('error_msg', 'Deadline sudah lewat.');
      return res.redirect(`/mahasiswa/tugas/${id}`);
    }

    if (!req.file) {
      req.flash('error_msg', 'File tidak ditemukan.');
      return res.redirect(`/mahasiswa/tugas/${id}`);
    }

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

    req.flash('success_msg', 'Tugas berhasil dikumpulkan!');
    res.redirect(`/mahasiswa/tugas/${id}?success=1`);
  } catch (err) {
    console.error('Gagal submit tugas:', err);
    req.flash('error_msg', 'Terjadi kesalahan saat upload tugas.');
    res.redirect(`/mahasiswa/tugas/${id}`);
  }
});

export default router;



