import express from 'express';
import prisma from '../models/prisma.js';
import upload from '../middleware/upload.js'; // asumsi kamu pakai multer di sini

const router = express.Router();

router.post('/', upload.fields([
  { name: 'CV_file', maxCount: 1 },
  { name: 'KRS_file', maxCount: 1 },
  { name: 'KHS_file', maxCount: 1 },
  { name: 'surat_permohonan_file', maxCount: 1 }
]), async (req, res) => {
  try {
    const user = req.session.user; // pastikan user sudah login

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
        pernyataan: req.body.pernyataan === 'on' ? true : false,
      }
    });

    req.flash('success_msg', 'Formulir berhasil disimpan!');
    res.redirect('/mahasiswa/dashboard');

  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Terjadi kesalahan saat menyimpan data.');
    res.redirect('/mahasiswa/formulirPendaftaran');
  }
});

export default router;
