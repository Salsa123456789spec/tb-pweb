import express from 'express';
import { PrismaClient } from '@prisma/client';
import { ensureAuthenticated, ensureRole } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', ensureAuthenticated, ensureRole('asisten_lab'), async (req, res) => {
  try {
    const data = await prisma.pendaftaran.findMany({
      include: {
        user: true,
        pengumpulanTugas: {
          include: {
            tugas: true
          }
        }
      }
    });

    let hasil = data
      .map((pendaftar) => {
        const tugasDinilai = pendaftar.pengumpulanTugas.filter(t => t.nilai !== null);

        // 🚫 Jika tidak ada tugas dinilai, abaikan
        if (tugasDinilai.length === 0) return null;

        const kategoriDinilai = new Set(tugasDinilai.map(t => t.tugas.kategori));
        const totalKategori = 4;
        const jumlahKategoriDinilai = kategoriDinilai.size;

        let progress = 'Belum Dinilai';
        if (jumlahKategoriDinilai === totalKategori) {
          progress = 'Selesai';
        } else if (jumlahKategoriDinilai > 0) {
          progress = `${jumlahKategoriDinilai}/${totalKategori}`;
        }

        const nilaiArray = tugasDinilai.map(t => t.nilai);
        const rataRataNum = nilaiArray.reduce((a, b) => a + b, 0) / nilaiArray.length;

        return {
          nama: pendaftar.user.name,
          nim: pendaftar.user.nim,
          divisi: pendaftar.divisi,
          progress,
          rataRataNilai: rataRataNum,
        };
      })
      .filter(Boolean); // 🔥 Hilangkan null (peserta tanpa tugas dinilai)

    // Urutkan dari yang terbesar ke terkecil berdasarkan rataRataNilai
    hasil.sort((a, b) => b.rataRataNilai - a.rataRataNilai);

    // Beri nomor ranking dan format rata-rata 2 desimal
    hasil = hasil.map((item, index) => ({
      no: index + 1,
      nama: item.nama,
      nim: item.nim,
      divisi: item.divisi,
      progress: item.progress,
      rataRataNilai: item.rataRataNilai > 0 ? item.rataRataNilai.toFixed(2) : '-'
    }));

    res.render('aslab/penilaianTotal', {
      title: 'Penilaian Total',
      layout: 'aslab/layout/main',
      hasil
    });
  } catch (err) {
    console.error('❌ Gagal ambil penilaian total:', err);
    res.status(500).send('Gagal ambil data penilaian total.');
  }
});

export default router;
