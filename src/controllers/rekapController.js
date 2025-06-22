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