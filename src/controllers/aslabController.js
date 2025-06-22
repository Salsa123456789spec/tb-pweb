// controllers/aslabController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Tampilkan semua mahasiswa yang telah mengisi kuesioner
exports.getKuesionerMahasiswa = async (req, res) => {
  try {
    const feedbackKuisioner = await prisma.feedbackKuisioner.findMany({
      include: {
        pendaftaran: {
          select: {
            nama_mahasiswa: true,
            nim: true,
          },
        },
      },
    });

    res.render('aslab/kuesioner', {
      title: 'Data Kuesioner Mahasiswa',
      feedbackKuisioner,
      activePage: 'rekap-kuisioner', // Sesuaikan dengan activePage di sidebar Anda
    });
  } catch (error) {
    console.error('Error fetching kuesioner data:', error);
    res.status(500).send('Terjadi kesalahan saat mengambil data kuesioner.');
  }
};

// Tampilkan detail kuesioner berdasarkan ID FeedbackKuisioner
exports.getKuesionerDetail = async (req, res) => {
  const { id } = req.params; // Ini adalah ID dari FeedbackKuisioner

  try {
    const feedbackDetail = await prisma.feedbackKuisioner.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        pendaftaran: {
          select: {
            nama_mahasiswa: true,
            nim: true,
            // ... tambahkan field lain dari pendaftaran jika diperlukan
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
      activePage: 'rekap-kuisioner', // Tetap aktifkan rekap-kuisioner
    });
  } catch (error) {
    console.error('Error fetching kuesioner detail:', error);
    res.status(500).send('Terjadi kesalahan saat mengambil detail kuesioner.');
  }
};