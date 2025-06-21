import express from 'express';
import prisma from '../models/prisma.js';

const router = express.Router();

// GET form penilaian
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const pendaftar = await prisma.pendaftaran.findUnique({
      where: { id },
      include: { user: true }, // relasi ke tabel user
    });

    if (!pendaftar) return res.status(404).send('Pendaftar tidak ditemukan');

   res.render('aslab/penilaian', { 
  pendaftar, 
   activePage: 'penilaian',
  title: 'Penilaian Pendaftaran',
   user: req.session.user,
   layout: 'aslab/layout/main' 
});

  } catch (err) {
    console.error('❌ Error saat ambil data:', err);
    res.status(500).send('Terjadi kesalahan saat memuat data');
  }
});

// POST hasil penilaian
router.post('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { catatan, aksi } = req.body;

  try {
    const pendaftar = await prisma.pendaftaran.findUnique({ where: { id } });

    if (!pendaftar) return res.status(404).send('Pendaftar tidak ditemukan');

    const status = aksi === 'approve' ? 'diterima' : 'ditolak';

    await prisma.pendaftaran.update({
      where: { id },
      data: {
        status,
        catatan,
      },
    });

    res.redirect('/verifikasi');
  } catch (err) {
    console.error('❌ Gagal menyimpan hasil penilaian:', err);
    res.status(500).send('Gagal memproses penilaian');
  }
});

export default router;
