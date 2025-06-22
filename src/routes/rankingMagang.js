import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
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
      .map(pendaftar => {
        const tugasDinilai = pendaftar.pengumpulanTugas.filter(t => t.nilai !== null);

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
          rataRataNilai: rataRataNum
        };
      })
      .filter(Boolean);

    // Urutkan berdasarkan rata-rata nilai
    hasil.sort((a, b) => b.rataRataNilai - a.rataRataNilai);

    // Hitung ranking
    let ranking = 0;
    let skip = 0;
    let prevNilai = null;

    hasil = hasil.map((item, index) => {
      if (item.rataRataNilai !== prevNilai) {
        ranking = ranking + 1 + skip;
        skip = 0;
      } else {
        skip++;
      }
      prevNilai = item.rataRataNilai;

      return {
        no: ranking,
        nama: item.nama,
        nim: item.nim,
        divisi: item.divisi,
        progress: item.progress,
        rataRataNilai: item.rataRataNilai > 0 ? item.rataRataNilai.toFixed(2) : '-'
      };
    });

    res.render('aslab/rankingMagang', {
      title: 'Ranking Penilaian',
      layout: 'aslab/layout/main',
      user: req.session.user,
      activePage: 'ranking',
      hasil
    });

  } catch (err) {
    console.error('Error mengambil data ranking:', err);
    res.status(500).send('Gagal mengambil data ranking');
  }
});

export default router;
