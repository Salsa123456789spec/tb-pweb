import prisma from '../models/prisma.js';

class PengumumanAslabController {
    // Render halaman pengumuman aslab
    async index(req, res) {
        try {
            res.render('aslab/pengumumanaslab', {
                title: 'Pengumuman Aslab',
                layout: 'aslab/layout/main',
                user: req.session.user,
                activePage: 'pengumuman'
            });
        } catch (error) {
            console.error('Error in PengumumanAslab index:', error);
            res.status(500).send('Terjadi kesalahan server');
        }
    }

    // API: Get peserta per tahapan
    async getPendaftarByTahapan(req, res) {
        try {
            const { tahapan } = req.params;
            let whereCondition = {};
            if (tahapan === 'tahap1') {
                whereCondition = { pengumuman: { none: {} } };
            } else if (tahapan === 'tahap2') {
                whereCondition = { pengumuman: { some: { tahapan: 'tahap1' } } };
            } else if (tahapan === 'tahap3') {
                whereCondition = { pengumuman: { some: { tahapan: 'tahap2' } } };
            } else {
                return res.status(400).json({ error: 'Tahapan tidak valid' });
            }
            const pendaftar = await prisma.pendaftaran.findMany({
                where: whereCondition,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            nim: true,
                            email: true
                        }
                    }
                },
                orderBy: { id: 'asc' }
            });
            res.json(pendaftar);
        } catch (error) {
            console.error('Error in getPendaftarByTahapan:', error);
            res.status(500).json({ error: 'Terjadi kesalahan server', details: error.message });
        }
    }

    // API: Simpan pengumuman
    async simpanPengumuman(req, res) {
        try {
            const { tahapan, pendaftarIds } = req.body;
            if (!tahapan || !pendaftarIds || !Array.isArray(pendaftarIds)) {
                return res.status(400).json({ error: 'Data tidak lengkap' });
            }
            const validTahapan = ['tahap1', 'tahap2', 'tahap3'];
            if (!validTahapan.includes(tahapan)) {
                return res.status(400).json({ error: 'Tahapan tidak valid' });
            }
            const pengumumanData = pendaftarIds.map(pendaftarId => ({
                user_id: parseInt(pendaftarId),
                pendaftaran_id: parseInt(pendaftarId),
                tahapan: tahapan
            }));
            const result = await prisma.pengumuman.createMany({ data: pengumumanData });
            res.json({
                success: true,
                message: `Berhasil menyimpan pengumuman tahap ${tahapan} untuk ${result.count} peserta`,
                count: result.count,
                tahapan: tahapan
            });
        } catch (error) {
            console.error('Error in simpanPengumuman:', error);
            res.status(500).json({ error: 'Terjadi kesalahan server', details: error.message });
        }
    }

    // Mendapatkan status kelulusan pendaftar
    async getStatusKelulusan(req, res) {
        try {
            const pendaftar = await prisma.pendaftaran.findMany({
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            nim: true,
                            email: true
                        }
                    },
                    pengumuman: {
                        orderBy: { id: 'desc' },
                        take: 1
                    }
                },
                orderBy: { id: 'asc' }
            });
            const formattedData = pendaftar.map(p => ({
                id: p.id,
                user_id: p.user_id,
                name: p.user.name,
                nim: p.user.nim,
                email: p.user.email,
                status_terakhir: p.pengumuman.length > 0 ? p.pengumuman[0].tahapan : 'belum_ada_pengumuman'
            }));
            res.json(formattedData);
        } catch (error) {
            res.status(500).json({ error: 'Terjadi kesalahan server', details: error.message });
        }
    }

    // Debug: Melihat semua data pengumuman
    async getAllPengumuman(req, res) {
        try {
            const allPengumuman = await prisma.pengumuman.findMany({
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            nim: true,
                            email: true
                        }
                    },
                    pendaftaran: {
                        select: { id: true }
                    }
                },
                orderBy: { id: 'desc' }
            });
            res.json({
                success: true,
                data: allPengumuman,
                count: allPengumuman.length
            });
        } catch (error) {
            res.status(500).json({ error: 'Terjadi kesalahan server', details: error.message });
        }
    }
}

export default new PengumumanAslabController(); 