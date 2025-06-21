import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Route untuk menampilkan daftar semua tugas
router.get('/mahasiswa/tugas', async (req, res) => {
  try {
    const semuaTugas = await prisma.tugas.findMany(); // ✅ ambil dari DB

    res.render('mahasiswa/tugasMagang', {
      title: 'Tugas Magang',
      tugas: semuaTugas,
      activePage: 'tugasMagang',
      layout: 'mahasiswa/layout/main',
      user: req.session.user
    });
  } catch (error) {
    console.error('Gagal mengambil daftar tugas:', error);
    res.status(500).send('Terjadi kesalahan saat mengambil tugas');
  }
});

// Route untuk detail tugas (ambil dari DB + status pengumpulan)
router.get('/mahasiswa/tugas/:id', async (req, res) => {
  const tugasId = parseInt(req.params.id);

  try {
    const tugas = await prisma.tugas.findUnique({
      where: { id: tugasId }
    });

    if (!tugas) {
      return res.status(404).send('Tugas tidak ditemukan');
    }

    const pengumpulan = await prisma.pengumpulanTugas.findFirst({
      where: {
        tugas_id: tugasId,
        // Sesuaikan kalau kamu pakai relasi ke pendaftaran:
        // pendaftaran_id: req.session.user?.id
      }
    });

    res.render('mahasiswa/detailTugas', {
      title: 'Detail Tugas',
      tugas,
      pengumpulan,
      layout: 'mahasiswa/layout/main',
      user: req.session.user
    });
  } catch (error) {
    console.error('Gagal mengambil detail tugas:', error);
    res.status(500).send('Terjadi kesalahan saat mengambil detail tugas');
  }
});

export default router;
