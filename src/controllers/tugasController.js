import prisma from '../models/prisma.js';

/**
 * @desc    Menampilkan semua tugas magang
 * @route   GET /mahasiswa/tugas
 * @access  Private (Mahasiswa)
 */
export const getAllTugas = async (req, res) => {
    try {
        // Ambil semua data tugas dari database
        const tugas = await prisma.tugas.findMany({
            orderBy: {
                deadline: 'asc' // Urutkan berdasarkan deadline terdekat
            }
        });

        // Render halaman EJS dan kirim data tugas ke dalamnya
        res.render('mahasiswa/tugasMagang', {
            layout: 'mahasiswa/layout/main',
            title: 'Tugas Magang',
            user: req.session.user,
            tugas: tugas,
            activePage: 'tugas'
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Terjadi kesalahan saat mengambil data tugas.');
        res.redirect('/mahasiswa/dashboard');
    }
};

// Di sini Anda bisa menambahkan fungsi lain terkait tugas,
// misalnya getTugasById, submitTugas, dll.