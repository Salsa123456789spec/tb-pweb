import prisma from '../models/prisma.js';

/**
 * Controller untuk mengambil dan menampilkan data semua pendaftar.
 * Data yang diambil adalah gabungan dari tabel Pendaftaran dan User.
 */
export const getRekapPendaftar = async (req, res) => {
  try {
    // Mengambil semua data dari tabel Pendaftaran
    const semuaPendaftar = await prisma.pendaftaran.findMany({
      include: {
        user: {
          select: {
            name: true,
            nim: true, // FIX 1: Ambil juga 'nim' dari tabel User
          },
        },
      },
      orderBy: {
        id: 'desc', // FIX 2: Mengganti sorting dari 'createdAt' menjadi 'id'
      }
    });

    // Memformat data agar sesuai dengan yang diharapkan oleh view
    const pendaftarFormatted = semuaPendaftar.map(p => ({
      nim: p.user.nim, // FIX 3: Pastikan nim diambil dari p.user.nim
      nama: p.user.name,
      no_hp: p.nomor_whatsapp, // Menggunakan 'nomor_whatsapp' dari skema
      id: p.id
    }));

    // Merender halaman 'pendaftar' dengan data yang sudah didapat
    res.render('aslab/pendaftar', {
      layout: 'aslab/layout/main',
      title: 'Rekap Pendaftar',
      user: req.session.user,
      pendaftar: pendaftarFormatted,
      activePage: 'rekap-pendaftar'
    });

  } catch (error) {
    console.error("Gagal mengambil data pendaftar:", error);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat data pendaftar.');
    res.redirect('/aslab/dashboard');
  }
};