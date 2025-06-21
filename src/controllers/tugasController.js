import prisma from '../models/prisma.js';

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

/**
 * @desc    Menampilkan detail tugas magang berdasarkan ID
 * @route   GET /mahasiswa/tugas/:id
 * @access  Private (Mahasiswa)
 */
export const getTugasById = async(req, res) => {
    try {
        const { id } = req.params;
        const userId = req.session.user.id;

        const tugas = await prisma.tugas.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (!tugas) {
            req.flash('error_msg', 'Tugas tidak ditemukan.');
            return res.redirect('/mahasiswa/tugas');
        }

        // Cek apakah user sudah mengisi pendaftaran untuk mendapatkan pendaftaran_id
        const pendaftaran = await prisma.pendaftaran.findFirst({
            where: { user_id: userId },
        });

        let pengumpulan = null;
        if (pendaftaran) {
            // Cek apakah tugas ini sudah pernah dikumpulkan oleh user
            pengumpulan = await prisma.pengumpulanTugas.findFirst({
                where: {
                    tugas_id: parseInt(id),
                    pendaftaran_id: pendaftaran.id,
                },
            });
        }


        res.render('mahasiswa/detailTugas', {
            layout: 'mahasiswa/layout/main',
            title: 'Detail Tugas',
            user: req.session.user,
            tugas: tugas,
            pengumpulan: pengumpulan, // Kirim status pengumpulan ke view
            activePage: 'tugas'
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Terjadi kesalahan saat mengambil detail tugas.');
        res.redirect('/mahasiswa/tugas');
    }
};


/**
 * @desc    Mengumpulkan file tugas
 * @route   POST /mahasiswa/tugas/:id/kumpul
 * @access  Private (Mahasiswa)
 */
export const submitTugas = async(req, res) => {
    const { id: tugasId } = req.params;
    const userId = req.session.user.id;

    try {
        // 1. Pastikan file terupload
        if (!req.file) {
            req.flash('error_msg', 'Silakan pilih file untuk diunggah.');
            return res.redirect(`/mahasiswa/tugas/${tugasId}`);
        }

        // 2. Dapatkan pendaftaran_id dari user yang sedang login
        const pendaftaran = await prisma.pendaftaran.findFirst({
            where: { user_id: userId },
            select: { id: true } // Hanya butuh ID pendaftaran
        });

        if (!pendaftaran) {
            req.flash('error_msg', 'Anda harus menyelesaikan pendaftaran terlebih dahulu.');
            return res.redirect(`/mahasiswa/tugas/${tugasId}`);
        }

        // 3. Cek apakah tugas sudah pernah dikumpulkan
        const existingSubmission = await prisma.pengumpulanTugas.findFirst({
            where: {
                tugas_id: parseInt(tugasId),
                pendaftaran_id: pendaftaran.id
            }
        });

        if (existingSubmission) {
            req.flash('error_msg', 'Anda sudah mengumpulkan tugas ini.');
            return res.redirect(`/mahasiswa/tugas/${tugasId}`);
        }

        // 4. Simpan informasi file ke database
        await prisma.pengumpulanTugas.create({
            data: {
                tugas_id: parseInt(tugasId),
                pendaftaran_id: pendaftaran.id,
                file: req.file.filename, // Nama file yang disimpan oleh multer
                // tanggal_kumpul akan otomatis diisi oleh database
            }
        });

        req.flash('success_msg', 'Tugas berhasil dikumpulkan!');
        res.redirect(`/mahasiswa/tugas/${tugasId}`);

    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Terjadi kesalahan saat mengumpulkan tugas.');
        res.redirect(`/mahasiswa/tugas/${tugasId}`);
    }
};