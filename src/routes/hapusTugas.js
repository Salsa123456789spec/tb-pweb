import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/tugas/delete/:id', async (req, res) => {
  const { id } = req.params;
  const tugasId = Number(id);
  console.log('ID yang diterima:', tugasId);

  try {
    // Hapus dulu semua pengumpulan tugas yang berelasi
    await prisma.pengumpulanTugas.deleteMany({
      where: { tugas_id: tugasId }
    });

    // Baru hapus tugasnya
    await prisma.tugas.delete({
      where: { id: tugasId }
    });

    console.log('Tugas dan relasi berhasil dihapus');
    res.redirect('/aslab/buatTugas');
  } catch (error) {
    console.error('Gagal menghapus tugas:', error);
    res.redirect('/aslab/buatTugas?error=1');
  }
});

export default router;
