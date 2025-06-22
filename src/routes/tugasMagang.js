import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Tampilkan semua tugas + status pengumpulan untuk user login
router.get('/mahasiswa/tugas', async (req, res) => {
  try {
    const userId = req.session.user.id;

    // Ambil pendaftaran user
    const pendaftaran = await prisma.pendaftaran.findFirst({
      where: { user_id: userId }
    });

    if (!pendaftaran) {
      return res.status(403).send('Anda belum melakukan pendaftaran.');
    }

    // Ambil semua tugas
    const semuaTugas = await prisma.tugas.findMany({
      orderBy: { deadline: 'asc' }
    });

    // Ambil semua pengumpulan tugas milik user (berdasarkan pendaftaran.id)
    const semuaPengumpulan = await prisma.pengumpulanTugas.findMany({
      where: { pendaftaran_id: pendaftaran.id }
    });

    // Buat map status pengumpulan
    const dikumpulMap = {};
    semuaPengumpulan.forEach(p => {
      dikumpulMap[p.tugas_id] = true;
    });

    res.render('mahasiswa/tugasMagang', {
      title: 'Tugas Magang',
      tugas: semuaTugas,
      dikumpulMap,
      activePage: 'tugasMagang',
      layout: 'mahasiswa/layout/main',
      user: req.session.user
    });
  } catch (error) {
    console.error('Gagal mengambil daftar tugas:', error);
    res.status(500).send('Terjadi kesalahan saat mengambil tugas');
  }
});

export default router;
