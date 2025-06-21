// Tampilkan detail tugas
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/tugas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const tugas = await prisma.tugas.findUnique({ where: { id: Number(id) } });
    if (!tugas) {
      return res.status(404).send('Tugas tidak ditemukan');
    }

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

// Update tugas
router.post('/tugas/update/:id', async (req, res) => {
  const { id } = req.params;
  const { judul, deskripsi, deadline } = req.body;

  try {
    await prisma.tugas.update({
      where: { id: Number(id) },
      data: {
        judul,
        deskripsi,
        deadline: new Date(deadline),
      }
    });
    res.redirect('/aslab/buatTugas');
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal mengupdate tugas');
  }
});

export default router;