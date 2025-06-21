import express from 'express';
import prisma from '../models/prisma.js';
import upload from '../middleware/upload.js'; // multer upload config
import ensureNotRegistered from '../middleware/ensureNotRegistered.js';

const router = express.Router();

// GET: Tampilkan form jika belum pernah daftar
router.get('/', ensureNotRegistered, (req, res) => {
  const user = req.session.user;
  res.render('mahasiswa/formulirPendaftaran', { user });
});

// POST: Kirim formulir pendaftaran
router.post('/', ensureNotRegistered, upload.fields([
  { name: 'CV_file', maxCount: 1 },
  { name: 'KRS_file', maxCount: 1 },
  { name: 'KHS_file', maxCount: 1 },
  { name: 'surat_permohonan_file', maxCount: 1 }
]), async (req, res) => {
  try {
    const user = req.session.user;

    await prisma.pendaftaran.create({
      data: {
        user_id: user.id,
        domisili: req.body.domisili,
        asal: req.body.asal,
        nomor_whatsapp: req.body.nomor_whatsapp,
        divisi: Array.isArray(req.body.divisi) ? req.body.divisi.join(',') : req.body.divisi,
        CV_file: req.files['CV_file'][0].filename,
        KRS_file: req.files['KRS_file'][0].filename,
        KHS_file: req.files['KHS_file'][0].filename,
        surat_permohonan_file: req.files['surat_permohonan_file']?.[0]?.filename || '',
        alasan: req.body.alasan || null,
        pernyataan: req.body.pernyataan === 'on'
      }
    });

    req.flash('success_msg', 'Formulir berhasil disimpan!');
    res.redirect('/mahasiswa/konfirmasiPendaftaran');

  } catch (err) {
    console.error('Error saat simpan pendaftaran:', err);
    req.flash('error_msg', 'Terjadi kesalahan saat menyimpan data.');
    res.redirect('/mahasiswa/formulirPendaftaran');
  }
});

export default router;
