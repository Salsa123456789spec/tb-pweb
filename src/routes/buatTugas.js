import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const prisma = new PrismaClient();

// Setup multer untuk upload file lampiran
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './public/uploads/tugas';
    // Buat direktori jika belum ada
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
    // Memperbolehkan berbagai jenis file, tidak hanya PDF
    cb(null, true);
  }
});

// GET /aslab/tugas -> Halaman utama penugasan (daftar tugas)
router.get('/', async (req, res) => {
  try {
    const tugas = await prisma.tugas.findMany({ orderBy: { deadline: 'asc' } });

    res.render('aslab/buatTugas', {
      title: 'Daftar Penugasan',
      layout: 'aslab/layout/main',
      tugas,
      user: req.session.user,
      activePage: 'buatTugas'
    });
  } catch (err) {
    console.error('❌ Gagal ambil daftar tugas:', err);
    res.status(500).send('Terjadi kesalahan saat mengambil daftar tugas');
  }
});

// GET /aslab/tugas/form -> Halaman form untuk buat tugas baru
router.get('/form', (req, res) => {
  res.render('aslab/formTugas', {
    title: 'Form Tugas Baru',
    layout: 'aslab/layout/main',
    user: req.session.user,
    activePage: 'buatTugas',
    success: req.flash('success'),
    error: req.flash('error')
  });
});

// POST /aslab/tugas -> Proses pembuatan tugas baru
router.post('/', upload.single('lampiran'), async (req, res) => {
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
    req.flash('success', 'Tugas berhasil disimpan.');
    res.redirect('/aslab/tugas/form');
  } catch (err) {
    console.error('❌ Gagal menyimpan tugas:', err);
    req.flash('error', 'Gagal menyimpan tugas. Silakan coba lagi.');
    res.redirect('/aslab/tugas/form');
  }
});

// GET /aslab/tugas/delete/:id -> Proses hapus tugas
router.get('/delete/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    // Hapus dulu semua pengumpulan tugas yang terkait
    await prisma.pengumpulanTugas.deleteMany({
      where: { tugas_id: id }
    });

    // Baru hapus tugasnya
    await prisma.tugas.delete({
      where: { id: id }
    });
    
    req.flash('success', 'Tugas berhasil dihapus.');
    res.redirect('/aslab/tugas');
  } catch (err) {
    console.error('❌ Gagal hapus tugas:', err);
    req.flash('error', 'Gagal menghapus tugas.');
    res.redirect('/aslab/tugas');
  }
});

// GET /aslab/tugas/:id -> Halaman detail tugas (opsional, jika diperlukan)
router.get('/:id', async (req, res) => {
    try {
        const tugas = await prisma.tugas.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                pengumpulanTugas: {
                    include: {
                        pendaftaran: {
                            include: {
                                user: true
                            }
                        }
                    }
                }
            }
        });

        if (!tugas) {
            return res.status(404).send('Tugas tidak ditemukan');
        }

        res.render('aslab/detailTugas', {
            title: 'Detail Tugas',
            layout: 'aslab/layout/main',
            user: req.session.user,
            activePage: 'buatTugas',
            tugas
        });
    } catch (err) {
        console.error('❌ Gagal ambil detail tugas:', err);
        res.status(500).send('Gagal mengambil detail tugas');
    }
});

export default router;
