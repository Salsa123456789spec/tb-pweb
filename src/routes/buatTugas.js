import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// ⛔ INI SALAH, await langsung di luar fungsi
// const tugas = await prisma.tugas.findMany(...);

// ✅ BUNGKUS DENGAN FUNGSI ASYNC
router.get('/aslab/buatTugas', async (req, res) => {
  try {
    const tugas = await prisma.tugas.findMany({ orderBy: { deadline: 'asc' } });

    res.render('aslab/buatTugas', {
      title: 'Penugasan',
      layout: 'aslab/layout/main', // atau 'admin/layout/main' jika kamu punya file tersebut
      tugas,
      user: req.session.user,
     activePage: 'buatTugas'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
});





export default router;
