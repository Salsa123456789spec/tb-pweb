// File: src/routes/aslab/penilaian.js

import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Tampilkan detail tugas dan pengumpulan untuk penilaian
router.get('/tugas/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const tugas = await prisma.tugas.findUnique({
      where: { id: Number(id) },
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

    res.render('aslab/detailTugas', {
      layout: 'aslab/layout/main',
      title: 'Penilaian Tugas',
      tugas,
      user: req.session.user
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal menampilkan penilaian tugas.');
  }
});

// Simpan nilai dari Aslab
router.post('/penilaian/:id', async (req, res) => {
  const { id } = req.params;
  const { nilai } = req.body;

  try {
    await prisma.pengumpulanTugas.update({
      where: { id: Number(id) },
      data: { nilai: Number(nilai) }
    });

    res.redirect('back');
  } catch (err) {
    console.error('Gagal menyimpan nilai:', err);
    res.status(500).send('Terjadi kesalahan saat menyimpan nilai.');
  }
});

export default router;
