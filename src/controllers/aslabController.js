// controllers/aslabController.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Tampilkan semua mahasiswa yang telah mengisi kuesioner
export const getKuesionerMahasiswa = async (req, res) => {
  try {
    const feedbackKuisioner = await prisma.feedbackKuisioner.findMany({
      include: {
        pendaftaran: {
          include: {
            user: {
              select: {
                name: true,
                nim: true,
              },
            },
          },
        },
      },
    });

    res.render('aslab/kuesioner', {
      title: 'Data Kuesioner Mahasiswa',
      feedbackKuisioner,
      activePage: 'rekap-kuisioner',
    });
  } catch (error) {
    console.error('Error fetching kuesioner data:', error);
    res.status(500).send('Terjadi kesalahan saat mengambil data kuesioner.');
  }
};

// Tampilkan detail kuesioner berdasarkan ID FeedbackKuisioner
export const getKuesionerDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const feedbackDetail = await prisma.feedbackKuisioner.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        pendaftaran: {
          include: {
            user: {
              select: {
                name: true,
                nim: true,
              },
            },
          },
        },
      },
    });

    if (!feedbackDetail) {
      return res.status(404).send('Data kuesioner tidak ditemukan.');
    }

    res.render('aslab/kuesioner_detail', {
      title: 'Detail Kuesioner Mahasiswa',
      feedback: feedbackDetail,
      activePage: 'rekap-kuisioner',
    });
  } catch (error) {
    console.error('Error fetching kuesioner detail:', error);
    res.status(500).send('Terjadi kesalahan saat mengambil detail kuesioner.');
  }
};

// Fungsi untuk menampilkan form buat absensi
export const showBuatAbsensiForm = async (req, res) => {
  try {
    // Ambil data pendaftar yang diterima
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
        }
      }
    });

    // Ambil riwayat absensi
    const riwayat = await prisma.kehadiran.groupBy({
      by: ['pertemuan', 'tanggal', 'pembahasan'],
      _count: {
        pendaftaran_id: true
      },
      where: {
        status: 'Hadir'
      }
    });

    // Hitung total mahasiswa
    const totalMahasiswa = pendaftar.length;

    // Format riwayat untuk ditampilkan
    const formattedRiwayat = riwayat.map(item => ({
      pertemuan: item.pertemuan,
      tanggal: item.tanggal.toLocaleDateString('id-ID'),
      pembahasan: item.pembahasan,
      jumlahHadir: item._count.pendaftaran_id,
      totalMahasiswa: totalMahasiswa
    }));

    res.render('aslab/buat-absensi', {
      layout: 'aslab/layout/main',
      title: 'Buat Absensi',
      pendaftar: pendaftar,
      riwayat: formattedRiwayat,
      activePage: 'absensi',
      user: req.session.user
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Terjadi kesalahan saat mengambil data pendaftar.');
  }
};

// Fungsi untuk menampilkan tabel absensi
export const showTabelAbsensi = async (req, res) => {
  try {
    const { pertemuan, tanggal, pembahasan } = req.body;
    
    // Ambil data mahasiswa yang diterima
    const mahasiswa = await prisma.pendaftaran.findMany({
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
        kehadiran: {
          where: {
            pertemuan: parseInt(pertemuan)
          }
        }
      }
    });

    // Format data mahasiswa untuk ditampilkan
    const formattedMahasiswa = mahasiswa.map(mhs => ({
      pendaftaranId: mhs.id,
      nim: mhs.user.nim || 'N/A',
      nama: mhs.user.name,
      status: mhs.kehadiran.length > 0 ? mhs.kehadiran[0].status : null
    }));

    const sesi = {
      pertemuan: pertemuan,
      tanggal: tanggal,
      pembahasan: pembahasan
    };

    res.render('aslab/tabel-absensi', {
      layout: 'aslab/layout/main',
      title: `Absensi Pertemuan ${pertemuan}`,
      mahasiswa: formattedMahasiswa,
      sesi: sesi,
      activePage: 'absensi',
      user: req.session.user
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Terjadi kesalahan saat mengambil data absensi.');
  }
};

// Fungsi untuk menyimpan absensi
export const simpanAbsensi = async (req, res) => {
  try {
    const { pertemuan, tanggal, pembahasan } = req.body;
    
    // Ambil semua data status dari form
    const statusData = Object.keys(req.body)
      .filter(key => key.startsWith('status-'))
      .map(key => ({
        pendaftaranId: parseInt(key.replace('status-', '')),
        status: req.body[key]
      }));

    // Proses data absensi
    for (const data of statusData) {
      if (data.status) {
        await prisma.kehadiran.upsert({
          where: {
            pendaftaran_id_pertemuan: {
              pendaftaran_id: data.pendaftaranId,
              pertemuan: parseInt(pertemuan)
            }
          },
          update: {
            status: data.status,
            tanggal: new Date(tanggal),
            pembahasan: pembahasan
          },
          create: {
            pendaftaran_id: data.pendaftaranId,
            pertemuan: parseInt(pertemuan),
            tanggal: new Date(tanggal),
            status: data.status,
            pembahasan: pembahasan
          }
        });
      }
    }

    res.redirect('/aslab/absensi');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Terjadi kesalahan saat menyimpan absensi.');
  }
};

// Fungsi untuk menampilkan form edit absensi
export const showEditAbsensiForm = async (req, res) => {
  try {
    const { pertemuan } = req.params;
    
    // Ambil data absensi untuk pertemuan tertentu
    const absensi = await prisma.kehadiran.findMany({
      where: {
        pertemuan: parseInt(pertemuan)
      },
      include: {
        pendaftaran: {
          include: {
            user: {
              select: {
                name: true,
                nim: true
              }
            }
          }
        }
      }
    });

    // Format data untuk ditampilkan
    const formattedAbsensi = absensi.map(abs => ({
      pendaftaranId: abs.pendaftaran_id,
      nim: abs.pendaftaran.user.nim || 'N/A',
      nama: abs.pendaftaran.user.name,
      status: abs.status,
      tanggal: abs.tanggal,
      pembahasan: abs.pembahasan
    }));

    res.render('aslab/edit-absensi', {
      layout: 'aslab/layout/main',
      title: `Edit Absensi Pertemuan ${pertemuan}`,
      absensi: formattedAbsensi,
      pertemuan: pertemuan,
      activePage: 'absensi',
      user: req.session.user
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Terjadi kesalahan saat mengambil data absensi.');
  }
};

// Fungsi untuk update absensi
export const updateAbsensi = async (req, res) => {
  try {
    const { pertemuan } = req.params;
    
    // Ambil semua data status dari form
    const statusData = Object.keys(req.body)
      .filter(key => key.startsWith('status-'))
      .map(key => ({
        pendaftaranId: parseInt(key.replace('status-', '')),
        status: req.body[key]
      }));

    // Proses update data absensi
    for (const data of statusData) {
      if (data.status) {
        await prisma.kehadiran.update({
          where: {
            pendaftaran_id_pertemuan: {
              pendaftaran_id: data.pendaftaranId,
              pertemuan: parseInt(pertemuan)
            }
          },
          data: {
            status: data.status
          }
        });
      }
    }

    res.redirect('/aslab/absensi');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Terjadi kesalahan saat mengupdate absensi.');
  }
};