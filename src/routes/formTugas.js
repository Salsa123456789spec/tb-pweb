import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';

const router = express.Router();
const prisma = new PrismaClient();

// Setup multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads'); // pastikan folder ini ada
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ✅ GET: Tampilkan form input tugas
router.get('/formTugas', (req, res) => {
  res.render('aslab/formTugas', {
    title: 'Input Tugas',
    layout: 'aslab/layout/main',
    user: req.session.user,
    activePage: 'formTugas',
    success: req.query.success,
    error: req.query.error
  });
});

// ✅ POST: Simpan tugas baru (dengan file opsional)
router.post('/tugas', upload.single('lampiran'), async (req, res) => {
  const { judul, deskripsi, deadline } = req.body;
  const lampiran = req.file ? req.file.filename : null;

  try {
    await prisma.tugas.create({
      data: {
        judul,
        deskripsi,
        deadline: new Date(deadline),
        lampiran // pastikan kolom ini ada di schema.prisma
      }
    });

    res.redirect('/aslab/formTugas?success=1');
  } catch (err) {
    console.error(err);
    res.redirect('/aslab/formTugas?error=1');
  }
});

export default router;
