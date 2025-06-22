import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Halaman utama penilaian magang
router.get('/', (req, res) => {
  res.render('aslab/penilaianMagang', {
    title: 'Penilaian Magang',
    layout: 'aslab/layout/main',
    user: req.session.user,
    activePage: 'penilaianMagang'
  });
});

// Filter berdasarkan jenis penilaian
router.get('/filter', async (req, res) => {
  const { jenis } = req.query;
  if (!jenis) return res.json([]);

  try {
    const data = await prisma.pengumpulanTugas.findMany({
      where: {
        status: 'terkumpul',
        tugas: { kategori: jenis }
      },
      include: {
        tugas: true,
        pendaftaran: {
          include: {
            user: true,
            pengumpulanTugas: { include: { tugas: true } }
          }
        }
      }
    });

    const hasil = data.map((item, index) => ({
      no: index + 1,
      id: item.id,
      nama: item.pendaftaran.user.name,
      nim: item.pendaftaran.user.nim,
      divisi: item.pendaftaran.divisi,
      jenis: item.tugas.kategori.replace('TUGAS_', 'Tugas '),
      file: item.file,
      nilai: item.nilai ?? '-'
    }));

    res.json(hasil);
  } catch (err) {
    console.error('❌ Gagal ambil data:', err);
    res.status(500).json({ error: 'Gagal ambil data' });
  }
});

// Halaman form penilaian
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const data = await prisma.pengumpulanTugas.findUnique({
      where: { id: parseInt(id) },
      include: {
        tugas: true,
        pendaftaran: {
          include: { user: true }
        }
      }
    });

    if (!data) {
      return res.status(404).render('404', {
        title: 'Data Tidak Ditemukan',
        layout: 'aslab/layout/main'
      });
    }

    res.render('aslab/beriNilaiMagang', {
      title: 'Form Penilaian',
      layout: 'aslab/layout/main',
      pengumpulan: data,
      success_msg: req.flash('success_msg')
    });
  } catch (err) {
    console.error('❌ Gagal tampilkan halaman penilaian:', err);
    res.status(500).send('Terjadi kesalahan saat membuka halaman penilaian.');
  }
});

// POST: Simpan nilai dan catatan
router.post('/:id', async (req, res) => {
  const { id } = req.params;
  const { nilai, catatan } = req.body;

  try {
    const pengumpulan = await prisma.pengumpulanTugas.findUnique({
      where: { id: parseInt(id) }
    });

    if (!pengumpulan) {
      return res.status(404).render('404', {
        title: 'Data Tidak Ditemukan',
        layout: 'aslab/layout/main'
      });
    }

    const parsedNilai = parseFloat(nilai);
    if (isNaN(parsedNilai) || parsedNilai < 0 || parsedNilai > 100) {
      return res.status(400).send('Nilai tidak valid.');
    }

    await prisma.pengumpulanTugas.update({
      where: { id: parseInt(id) },
      data: {
        nilai: parsedNilai,
        catatan: catatan?.trim() || null
      }
    });

    req.flash('success_msg', 'Penilaian berhasil disimpan.');
    res.redirect('/aslab/penilaianMagang');
  } catch (err) {
    console.error('❌ Gagal menyimpan nilai:', err);
    res.status(500).send('Gagal menyimpan penilaian.');
  }
});

export default router;
