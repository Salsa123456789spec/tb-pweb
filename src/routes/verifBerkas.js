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
   user: req.session.user,
   layout: 'aslab/layout/main'  
});

  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal mengambil data.');
  }
});

export default router;
