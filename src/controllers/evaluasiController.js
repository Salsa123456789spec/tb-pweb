import prisma from '../models/prisma.js';

// Menampilkan halaman evaluasi komplain
export const getEvaluasiPage = async (req, res) => {
    try {
        const komplainMenunggu = await prisma.komplainJadwal.count({ where: { status: 'menunggu' } });
        const komplainDiterima = await prisma.komplainJadwal.count({ where: { status: 'diterima' } });
        const komplainDitolak = await prisma.komplainJadwal.count({ where: { status: 'ditolak' } });

        const semuaKomplain = await prisma.komplainJadwal.findMany({
            include: {
                jadwal: {
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
            komplain: {
                menunggu: komplainMenunggu,
                diterima: komplainDiterima,
                ditolak: komplainDitolak
            },
            semuaKomplain: semuaKomplain,
            user: req.session.user
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
        const komplain = await prisma.komplainJadwal.findUnique({
            where: { id: parseInt(komplainId) }
        });

        if (!komplain) {
            req.flash('error_msg', 'Komplain tidak ditemukan.');
            return res.redirect('/aslab/evaluasi-permohonan');
        }

        // Update status komplain
        await prisma.komplainJadwal.update({
            where: { id: parseInt(komplainId) },
            data: { status: status }
        });

        // Jika diterima, update jadwal wawancara utama
        if (status === 'diterima') {
            await prisma.jadwalWawancara.update({
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