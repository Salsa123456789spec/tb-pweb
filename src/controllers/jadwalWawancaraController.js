  // src/controllers/jadwalWawancaraController.js
  import prisma from '../models/prisma.js';

  export const getJadwalWawancara = async (req, res) => {
    try {
      const jadwalWawancara = await prisma.jadwalWawancara.findMany({
        include: {
          pendaftaran: true, // Sertakan data pendaftaran jika diperlukan
        },
        orderBy: {
          tanggal: 'asc', // Urutkan berdasarkan tanggal agar lebih rapi
        }
      });

      // Render tampilan EJS dan kirim data jadwalWawancara
      res.render('mahasiswa/jadwalWawancara', {
        title: 'Jadwal Wawancara',
        jadwalWawancara, // Mengirimkan array data ke view
        user: req.session.user,
        activePage: 'wawancara' // <--- TAMBAHKAN INI
      });

    } catch (error) {
      console.error('Error fetching jadwal wawancara:', error);
      res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data jadwal wawancara', error: error.message });
    }
  };