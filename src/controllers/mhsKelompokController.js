import prisma from '../models/prisma.js';

/**
 * Menampilkan halaman daftar kelompok untuk mahasiswa.
 * Termasuk fungsionalitas pencarian berdasarkan nama kelompok.
 */
export const getKelompokPage = async (req, res) => {
    try {
        const { search } = req.query;
        const whereClause = {};

        // Jika ada query pencarian, tambahkan kondisi 'where'
        if (search) {
            whereClause.nama = {
                contains: search,
            };
        }

        const kelompok = await prisma.kelompok.findMany({
            where: whereClause,
            include: {
                user: true, // Untuk mendapatkan data mentor
                magang: {
                    include: {
                        pendaftaran: {
                            include: {
                                user: true, // Untuk mendapatkan data user anggota
                            },
                        },
                    },
                },
            },
            orderBy: {
                nama: 'asc',
            },
        });

        // Render view dan kirim data yang diperlukan
        res.render('mahasiswa/kelompok', {
            title: 'Daftar Kelompok',
            layout: 'mahasiswa/layout/main',
            user: req.user,
            kelompok,
            search: search || '', // Kirim kembali query pencarian ke view
        });
    } catch (error) {
        console.error('Error saat memuat halaman kelompok:', error);
        req.flash('error_msg', 'Gagal memuat halaman kelompok.');
        res.redirect('/mahasiswa/dashboard');
    }
};