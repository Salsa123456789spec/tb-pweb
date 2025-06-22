import prisma from '../models/prisma.js';

export const getAllMateri = async (req, res) => {
    try {
        // Ambil semua materi magang dari database
        // Untuk sementara, kita akan menggunakan data statis
        // Nanti bisa diganti dengan model Materi di Prisma
        
        const materi = [
            {
                id: 1,
                judul: 'Pengenalan Magang LEA',
                deskripsi: 'Materi pengenalan tentang program magang di Laboratorium of Enterprise Application',
                file: 'pengenalan-magang.pdf',
                createdAt: new Date()
            },
            {
                id: 2,
                judul: 'Teknologi yang Digunakan',
                deskripsi: 'Overview teknologi yang akan dipelajari selama magang',
                file: 'teknologi-magang.pdf',
                createdAt: new Date()
            },
            {
                id: 3,
                judul: 'Panduan Pengembangan',
                deskripsi: 'Panduan lengkap untuk pengembangan aplikasi enterprise',
                file: 'panduan-pengembangan.pdf',
                createdAt: new Date()
            }
        ];

        res.render('mahasiswa/materiMagang', {
            layout: 'mahasiswa/layout/main',
            title: 'Materi Magang',
            user: req.session.user,
            materi: materi,
            activePage: 'materi'
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Terjadi kesalahan saat mengambil data materi.');
        res.redirect('/mahasiswa/dashboard');
    }
};

export const getMateriById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Untuk sementara menggunakan data statis
        const materi = {
            id: parseInt(id),
            judul: 'Materi Detail',
            deskripsi: 'Deskripsi detail materi magang',
            file: 'materi-detail.pdf',
            content: 'Konten lengkap materi magang...'
        };

        res.render('mahasiswa/detailMateri', {
            layout: 'mahasiswa/layout/main',
            title: 'Detail Materi',
            user: req.session.user,
            materi: materi,
            activePage: 'materi'
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Terjadi kesalahan saat mengambil detail materi.');
        res.redirect('/mahasiswa/materiMagang');
    }
}; 