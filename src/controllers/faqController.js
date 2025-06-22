import prisma from '../models/prisma.js';

export const getFaqPage = async (req, res) => {
    try {
        const searchQuery = req.query.q || '';
        let faqs;

        const whereClause = {
            OR: [
                {
                    pertanyaan: {
                        contains: searchQuery,
                    },
                },
                {
                    jawaban: {
                        contains: searchQuery,
                    },
                },
            ],
        };

        if (searchQuery) {
            faqs = await prisma.fAQ.findMany({
                where: whereClause,
            });
        } else {
            faqs = await prisma.fAQ.findMany();
        }

        // Render halaman faq.ejs tanpa layout utama (sidebar, navbar)
        res.render('mahasiswa/faq', {
            layout: false, // Penting: menonaktifkan layout default
            title: 'Frequently Asked Questions',
            user: req.session.user,
            faqs: faqs,
            searchQuery: searchQuery
        });

    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Terjadi kesalahan saat memuat halaman FAQ.');
        res.redirect('/mahasiswa/dashboard');
    }
};