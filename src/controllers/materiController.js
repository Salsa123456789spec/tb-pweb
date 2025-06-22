import prisma from '../models/prisma.js';

export const getAllMateri = async (req, res) => {
    try {
        const materi = await prisma.materi.findMany({
            orderBy: { tanggal_upload: 'desc' }
        });

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

        const materi = await prisma.materi.findUnique({
            where: { id: parseInt(id) }
        });

        if (!materi) {
            req.flash('error_msg', 'Materi tidak ditemukan.');
            return res.redirect('/mahasiswa/materiMagang');
        }

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
