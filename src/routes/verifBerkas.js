import express from 'express';
import prisma from '../models/prisma.js';

const router = express.Router();

// Halaman verifikasi berkas oleh aslab
router.get('/verifBerkas', async (req, res) => {
  try {
    const pendaftar = await prisma.pendaftaran.findMany({
      include: { user: true },
      orderBy: { id: 'desc' }
    });

    // res.render('aslab/verifBerkas', { pendaftar, activePage: 'verifBerkas' });
    res.render('aslab/verifBerkas', {
  pendaftar,
  activePage: 'verifBerkas',
  title: 'Verifikasi Berkas',
   layout: 'aslab/layout/main' ,
   user: req.session.user, 
});

  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal mengambil data.');
  }
});
router.get('/penilaian/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send('ID tidak valid');
  }

  try {
    const pendaftar = await prisma.pendaftaran.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!pendaftar) return res.status(404).send('Data tidak ditemukan');

    res.render('penilaian', { pendaftar });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan server');
  }
});

export default router;
