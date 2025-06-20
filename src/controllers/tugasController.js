// src/controllers/tugasController.js
import prisma from '../models/prisma.js';

// Fungsi untuk mendapatkan semua tugas magang
export const getTugasMagang = async (req, res) => {
  try {
    const user = req.session.user; // Ambil data user dari session

    if (!user) {
      req.flash('error_msg', 'Anda harus login untuk mengakses halaman ini.');
      return res.redirect('/login');
    }

    // Ambil semua tugas
    const tugas = await prisma.tugas.findMany({
      orderBy: {
        deadline: 'asc', // Urutkan tugas berdasarkan deadline terdekat
      },
      // Optional: Anda bisa include data pengumpulan jika ingin menampilkan status langsung di daftar
      // include: {
      //   pengumpulanTugas: {
      //     where: {
      //       userId: user.id
      //     }
      //   }
      // }
    });

    // Periksa status pengumpulan untuk setiap tugas
    const tugasWithStatus = await Promise.all(tugas.map(async (t) => {
      const pengumpulan = await prisma.pengumpulanTugas.findFirst({
        where: {
          tugasId: t.id,
          userId: user.id,
        },
      });

      return {
        ...t,
        statusPengumpulan: pengumpulan ? 'Sudah dikumpul' : 'Belum dikumpul',
        // Anda bisa menambahkan tanggal pengumpulan, nilai, dll. jika diperlukan
        tanggalPengumpulan: pengumpulan ? pengumpulan.tanggalPengumpulan : null,
      };
    }));

    res.render('mahasiswa/tugasMagang', {
      layout: 'mahasiswa/layout/main',
      title: 'Penugasan Magang',
      user: user,
      activePage: 'magang', // Untuk menandai navigasi aktif di sidebar
      tugas: tugasWithStatus, // Kirim data tugas yang sudah dilengkapi status
    });

  } catch (error) {
    console.error('Error fetching tugas magang:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat mengambil data tugas magang.');
    res.status(500).redirect('/mahasiswa/dashboard'); // Redirect ke dashboard atau halaman error
  }
};

// Fungsi untuk menampilkan detail tugas (opsional, jika Anda ingin ada halaman detail)
export const getDetailTugas = async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) {
      req.flash('error_msg', 'Anda harus login untuk mengakses halaman ini.');
      return res.redirect('/login');
    }

    const tugasId = parseInt(req.params.id);
    if (isNaN(tugasId)) {
      req.flash('error_msg', 'ID tugas tidak valid.');
      return res.redirect('/mahasiswa/tugasMagang');
    }

    const tugas = await prisma.tugas.findUnique({
      where: { id: tugasId },
      include: {
        pengumpulanTugas: {
          where: { userId: user.id }
        }
      }
    });

    if (!tugas) {
      req.flash('error_msg', 'Tugas tidak ditemukan.');
      return res.redirect('/mahasiswa/tugasMagang');
    }

    const pengumpulan = tugas.pengumpulanTugas.length > 0 ? tugas.pengumpulanTugas[0] : null;

    res.render('mahasiswa/detailTugasMagang', {
      layout: 'mahasiswa/layout/main',
      title: tugas.judul,
      user: user,
      activePage: 'magang',
      tugas: tugas,
      pengumpulan: pengumpulan, // Kirim data pengumpulan jika ada
      statusPengumpulan: pengumpulan ? 'Sudah dikumpul' : 'Belum dikumpul',
    });

  } catch (error) {
    console.error('Error fetching detail tugas:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat mengambil detail tugas.');
    res.status(500).redirect('/mahasiswa/tugasMagang');
  }
};

// Fungsi untuk mengumpulkan tugas (contoh, perlu implementasi upload file)
// Ini hanya placeholder, Anda perlu menambahkan logic upload file menggunakan multer
export const submitTugas = async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) {
      req.flash('error_msg', 'Anda harus login untuk mengumpulkan tugas.');
      return res.redirect('/login');
    }

    const tugasId = parseInt(req.params.id);
    if (isNaN(tugasId)) {
      req.flash('error_msg', 'ID tugas tidak valid.');
      return res.redirect('/mahasiswa/tugasMagang');
    }

    // Cek apakah tugas ada
    const tugas = await prisma.tugas.findUnique({ where: { id: tugasId } });
    if (!tugas) {
      req.flash('error_msg', 'Tugas tidak ditemukan.');
      return res.redirect('/mahasiswa/tugasMagang');
    }

    // Cek apakah sudah pernah mengumpulkan
    const existingSubmission = await prisma.pengumpulanTugas.findFirst({
      where: {
        tugasId: tugasId,
        userId: user.id,
      },
    });

    if (existingSubmission) {
      req.flash('error_msg', 'Anda sudah mengumpulkan tugas ini sebelumnya.');
      return res.redirect(`/mahasiswa/tugasMagang/${tugasId}`);
    }

    // Logika untuk menyimpan file yang diupload (gunakan middleware upload.js Anda)
    // Asumsi file yang diupload bisa diakses via req.file.filename atau req.body.fileUrl
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : req.body.fileUrl; // Sesuaikan dengan cara Anda menangani upload

    if (!fileUrl) {
      req.flash('error_msg', 'File tugas tidak ditemukan. Harap unggah file.');
      return res.redirect(`/mahasiswa/tugasMagang/${tugasId}`);
    }

    await prisma.pengumpulanTugas.create({
      data: {
        tugasId: tugasId,
        userId: user.id,
        fileUrl: fileUrl,
        tanggalPengumpulan: new Date(),
        status: "Belum Dinilai",
      },
    });

    req.flash('success_msg', 'Tugas berhasil dikumpulkan!');
    res.redirect(`/mahasiswa/tugasMagang/${tugasId}`);

  } catch (error) {
    console.error('Error submitting tugas:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat mengumpulkan tugas.');
    res.status(500).redirect(`/mahasiswa/tugasMagang/${req.params.id}`);
  }
};