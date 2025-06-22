import prisma from '../models/prisma.js';

// Menampilkan halaman evaluasi komplain
export const getEvaluasiPage = async (req, res) => {
    try {
        const komplainMenunggu = await prisma.komplainjadwal.count({ where: { status: 'menunggu' } });
        const komplainDiterima = await prisma.komplainjadwal.count({ where: { status: 'diterima' } });
        const komplainDitolak = await prisma.komplainjadwal.count({ where: { status: 'ditolak' } });

        const semuaKomplain = await prisma.komplainjadwal.findMany({
            include: {
                jadwalwawancara: {
                    include: {
                        pendaftaran: {
                            include: {
                                user: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                tanggal_pengajuan: 'desc'
            }
        });

        res.render('aslab/layout/evaluasipermohonan', {
            title: 'Evaluasi Permohonan Jadwal',
            layout: 'aslab/layout/main',
            activePage: 'evaluasiPermohonan',
            user: req.session.user,
            komplain: {
                menunggu: komplainMenunggu,
                diterima: komplainDiterima,
                ditolak: komplainDitolak
            },
            semuaKomplain: semuaKomplain
        });

    } catch (error) {
        console.error('Error fetching complaint data:', error);
        req.flash('error_msg', 'Gagal memuat halaman evaluasi.');
        res.redirect('/aslab');
    }
};

// Memperbarui status komplain
export const updateStatusKomplain = async (req, res) => {
    const { komplainId } = req.params;
    const { status } = req.body; // 'diterima' or 'ditolak'

    if (!['diterima', 'ditolak'].includes(status)) {
        req.flash('error_msg', 'Status tidak valid.');
        return res.redirect('/aslab/evaluasi-permohonan');
    }

    try {
        const komplain = await prisma.komplainjadwal.findUnique({
            where: { id: parseInt(komplainId) }
        });

        if (!komplain) {
            req.flash('error_msg', 'Komplain tidak ditemukan.');
            return res.redirect('/aslab/evaluasi-permohonan');
        }

        // Update status komplain
        await prisma.komplainjadwal.update({
            where: { id: parseInt(komplainId) },
            data: { status: status }
        });

        // Jika diterima, update jadwal wawancara utama
        if (status === 'diterima') {
            await prisma.jadwalwawancara.update({
                where: { id: komplain.jadwal_id },
                data: {
                    tanggal: komplain.tanggal_diajukan,
                    waktu: komplain.waktu_diajukan
                }
            });
        }

        req.flash('success_msg', `Permohonan berhasil ${status}.`);
        res.redirect('/aslab/evaluasi-permohonan');

    } catch (error) {
        console.error('Error updating complaint status:', error);
        req.flash('error_msg', 'Gagal memperbarui status permohonan.');
        res.redirect('/aslab/evaluasi-permohonan');
    }
}; 