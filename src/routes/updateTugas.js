import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/tugas/update/:id', async (req, res) => {
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

    res.redirect('/aslab/buatTugas'); // ganti dengan route ke daftar tugas kamu
  } catch (error) {
    console.error('Gagal update tugas:', error);
    res.redirect(`/aslab/tugas/${id}?error=1`);
  }
});

export default router;
