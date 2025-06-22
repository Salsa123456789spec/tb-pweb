import prisma from '../models/prisma.js';

// Menampilkan halaman rekap kuisioner (daftar semua feedback)
export const getRekapKuisioner = async (req, res) => {
  try {
    const feedbackList = await prisma.feedbackKuisioner.findMany({
      include: {
        pendaftaran: {
          include: {
            user: true, // Untuk mendapatkan nama dan NIM
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });

    res.render('aslab/kuesioner', {
      layout: 'aslab/layout/main', // Menggunakan layout aslab
      title: 'Rekap Kuisioner',
      activePage: 'rekapKuisioner',
      feedbackList,
      user: req.session.user // Menambahkan data user ke view
    });
  } catch (error) {
    console.error('Error fetching kuisioner rekap:', error);
    req.flash('error_msg', 'Gagal memuat rekap kuisioner.');
    res.redirect('/aslab/dashboard'); // Redirect ke dashboard aslab
  }
};

// Menampilkan halaman detail dari satu feedback kuisioner
export const getDetailKuisioner = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await prisma.feedbackKuisioner.findUnique({
      where: { id: parseInt(id) },
      include: {
        pendaftaran: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!feedback) {
      req.flash('error_msg', 'Feedback tidak ditemukan.');
      return res.redirect('/aslab/rekap/kuisioner'); // Redirect ke rekap aslab
    }

    res.render('aslab/kuesioner_detail', {
      layout: 'aslab/layout/main', // Menggunakan layout aslab
      title: 'Detail Kuisioner',
      activePage: 'rekapKuisioner',
      feedback,
      user: req.session.user // Menambahkan data user ke view
    });
  } catch (error) {
    console.error('Error fetching kuisioner detail:', error);
    req.flash('error_msg', 'Gagal memuat detail kuisioner.');
    res.redirect('/aslab/rekap/kuisioner'); // Redirect ke rekap aslab
  }
};

// Menampilkan halaman rekap absensi
export const getRekapAbsensi = async (req, res) => {
  try {
    // Ambil semua pendaftar yang diterima
    const pendaftar = await prisma.pendaftaran.findMany({
      where: {
        status: 'diterima'
      },
      include: {
        user: {
          select: {
            name: true,
            nim: true
          }
        },
        kehadiran: true
      }
    });

    // Hitung rekap absensi untuk setiap mahasiswa
    const rekapData = pendaftar.map(p => {
      const kehadiran = p.kehadiran;
      const jumlahHadir = kehadiran.filter(k => k.status === 'Hadir').length;
      const jumlahTidakHadir = kehadiran.filter(k => k.status === 'Tidak_Hadir').length;
      
      return {
        nim: p.user.nim || 'N/A',
        nama: p.user.name,
        jumlah_hadir: jumlahHadir,
        jumlah_tidak_hadir: jumlahTidakHadir,
        total_pertemuan: kehadiran.length,
        persentase_kehadiran: kehadiran.length > 0 ? Math.round((jumlahHadir / kehadiran.length) * 100) : 0
      };
    });

    // Urutkan berdasarkan persentase kehadiran (descending)
    rekapData.sort((a, b) => b.persentase_kehadiran - a.persentase_kehadiran);

    res.render('aslab/rekap/absensi', {
      layout: 'aslab/layout/main',
      title: 'Rekap Absensi',
      activePage: 'rekapAbsensi',
      rekapData,
      user: req.session.user
    });
  } catch (error) {
    console.error('Error fetching rekap absensi:', error);
    req.flash('error_msg', 'Gagal memuat rekap absensi.');
    res.redirect('/aslab/dashboard');
  }
};

// Menampilkan halaman rekap kelulusan
export const getRekapKelulusan = async (req, res) => {
  try {
    // Ambil hanya pengumuman untuk tahap 3 (yang sudah lulus)
    const pengumumanTahap3 = await prisma.pengumuman.findMany({
      where: {
        tahapan: 'tahap3'
      },
      include: {
        user: {
          select: {
            name: true,
            nim: true
          }
        },
        pendaftaran: {
          select: {
            divisi: true
          }
        }
      }
    });

    // Format data untuk rekap kelulusan
    const rekapKelulusan = pengumumanTahap3.map(p => ({
      nim: p.user.nim || 'N/A',
      nama: p.user.name,
      divisi: p.pendaftaran.divisi,
      tahapan: 'tahap3',
      status_kelulusan: 'LULUS',
      keterangan: 'Lulus magang'
    }));

    // Urutkan berdasarkan nama
    rekapKelulusan.sort((a, b) => a.nama.localeCompare(b.nama));

    // Hitung statistik
    const totalMahasiswa = rekapKelulusan.length;
    const totalLulus = rekapKelulusan.length; // Semua yang ada di tahap 3 adalah lulus
    const totalTidakLulus = 0; // Tidak ada yang tidak lulus karena hanya menampilkan tahap 3
    const persentaseLulus = totalMahasiswa > 0 ? 100 : 0; // 100% karena hanya menampilkan yang lulus

    res.render('aslab/rekap/kelulusan', {
      layout: 'aslab/layout/main',
      title: 'Rekap Kelulusan',
      activePage: 'rekapKelulusan',
      rekapKelulusan,
      statistik: {
        totalMahasiswa,
        totalLulus,
        totalTidakLulus,
        persentaseLulus
      },
      user: req.session.user
    });
  } catch (error) {
    console.error('Error fetching rekap kelulusan:', error);
    req.flash('error_msg', 'Gagal memuat rekap kelulusan.');
    res.redirect('/aslab/dashboard');
  }
};

// Menampilkan halaman rekap pendaftar
export const getRekapPendaftar = async (req, res) => {
  try {
    // Ambil semua pendaftar
    const pendaftar = await prisma.pendaftaran.findMany({
      include: {
        user: {
          select: {
            name: true,
            nim: true,
            email: true
          }
        }
      },
      orderBy: {
        id: 'desc'
      }
    });

    // Format data untuk ditampilkan
    const formattedPendaftar = pendaftar.map(p => ({
      id: p.id,
      nim: p.user.nim || 'N/A',
      nama: p.user.name,
      email: p.user.email,
      no_hp: p.nomor_whatsapp,
      domisili: p.domisili,
      asal: p.asal,
      divisi: p.divisi,
      status: p.status,
      tanggal_daftar: p.createdAt || new Date()
    }));

    res.render('aslab/rekap/pendaftar', {
      layout: 'aslab/layout/main',
      title: 'Rekap Pendaftar',
      activePage: 'rekapPendaftar',
      pendaftar: formattedPendaftar,
      user: req.session.user
    });
  } catch (error) {
    console.error('Error fetching rekap pendaftar:', error);
    req.flash('error_msg', 'Gagal memuat rekap pendaftar.');
    res.redirect('/aslab/dashboard');
  }
};

// Menampilkan detail pendaftar
export const getDetailPendaftar = async (req, res) => {
  try {
    const { id } = req.params;
    
    const pendaftar = await prisma.pendaftaran.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        user: {
          select: {
            name: true,
            nim: true,
            email: true
          }
        },
        kehadiran: true,
        pengumpulanTugas: {
          include: {
            tugas: true
          }
        },
        feedbackKuisioner: true
      }
    });

    if (!pendaftar) {
      req.flash('error_msg', 'Data pendaftar tidak ditemukan.');
      return res.redirect('/aslab/rekap/pendaftar');
    }

    // Hitung statistik
    const kehadiran = pendaftar.kehadiran;
    const tugas = pendaftar.pengumpulanTugas;
    const feedback = pendaftar.feedbackKuisioner;
    
    const jumlahHadir = kehadiran.filter(k => k.status === 'Hadir').length;
    const totalPertemuan = kehadiran.length;
    const persentaseKehadiran = totalPertemuan > 0 ? Math.round((jumlahHadir / totalPertemuan) * 100) : 0;
    
    const tugasTerkumpul = tugas.filter(t => t.status === 'terkumpul').length;
    const totalTugas = tugas.length;
    const persentaseTugas = totalTugas > 0 ? Math.round((tugasTerkumpul / totalTugas) * 100) : 0;

    const detailData = {
      ...pendaftar,
      statistik: {
        persentase_kehadiran: persentaseKehadiran,
        persentase_tugas: persentaseTugas,
        mengisi_kuisioner: feedback !== null,
        total_pertemuan: totalPertemuan,
        total_tugas: totalTugas
      }
    };

    res.render('aslab/rekap/detail-pendaftar', {
      layout: 'aslab/layout/main',
      title: 'Detail Pendaftar',
      activePage: 'rekapPendaftar',
      pendaftar: detailData,
      user: req.session.user
    });
  } catch (error) {
    console.error('Error fetching detail pendaftar:', error);
    req.flash('error_msg', 'Gagal memuat detail pendaftar.');
    res.redirect('/aslab/rekap/pendaftar');
  }
};

// Menghapus data pendaftar
export const deletePendaftar = async (req, res) => {
  const { id } = req.params;
  const pendaftaranId = parseInt(id);

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Dapatkan semua ID JadwalWawancara yang terkait
      const jadwalWawancara = await tx.jadwalWawancara.findMany({
        where: { pendaftaran_id: pendaftaranId },
        select: { id: true },
      });
      const jadwalIds = jadwalWawancara.map(j => j.id);

      // 2. Hapus KomplainJadwal yang terkait
      if (jadwalIds.length > 0) {
        await tx.komplainJadwal.deleteMany({
          where: { jadwal_id: { in: jadwalIds } },
        });
      }

      // 3. Hapus JadwalWawancara
      await tx.jadwalWawancara.deleteMany({
        where: { pendaftaran_id: pendaftaranId },
      });
      
      // 4. Hapus data terkait lainnya
      await tx.pengumuman.deleteMany({ where: { pendaftaran_id: pendaftaranId } });
      await tx.pengumpulanTugas.deleteMany({ where: { pendaftaran_id: pendaftaranId } });
      await tx.feedbackKuisioner.deleteMany({ where: { pendaftaran_id: pendaftaranId } });
      await tx.kehadiran.deleteMany({ where: { pendaftaran_id: pendaftaranId } });

      // 5. Hapus Pendaftaran itu sendiri
      await tx.pendaftaran.delete({
        where: { id: pendaftaranId },
      });
    });

    req.flash('success_msg', 'Data pendaftar berhasil dihapus.');
    res.redirect('/aslab/rekap/pendaftar');
  } catch (error) {
    console.error('Error deleting pendaftar:', error);
    req.flash('error_msg', 'Gagal menghapus data pendaftar. Pastikan semua data terkait sudah dihapus.');
    res.redirect('/aslab/rekap/pendaftar');
  }
};

// Menampilkan halaman manajemen oprec untuk superadmin
export const getManajemenOprec = async (req, res) => {
  try {
    // Ambil semua pendaftar
    const pendaftar = await prisma.pendaftaran.findMany({
      include: {
        user: {
          select: {
            name: true,
            nim: true,
            email: true
          }
        }
      },
      orderBy: {
        id: 'desc'
      }
    });

    // Format data untuk ditampilkan
    const formattedPendaftar = pendaftar.map(p => ({
      id: p.id,
      nim: p.user.nim || 'N/A',
      nama: p.user.name,
      email: p.user.email,
      no_hp: p.nomor_whatsapp,
      domisili: p.domisili,
      asal: p.asal,
      divisi: p.divisi,
      status: p.status,
      tanggal_daftar: p.createdAt || new Date()
    }));

    res.render('superadmin/manajemen-oprec', {
      layout: 'superadmin/layout/main',
      title: 'Manajemen Oprec',
      activePage: 'manajemen-oprec',
      pendaftar: formattedPendaftar,
      user: req.session.user
    });
  } catch (error) {
    console.error('Error fetching manajemen oprec:', error);
    req.flash('error_msg', 'Gagal memuat data pendaftar.');
    res.redirect('/superadmin/dashboard');
  }
}; 