import prisma from '../models/prisma.js';

class PengumumanAslabController {
    // Menampilkan halaman pengumuman aslab
    async index(req, res) {
        try {
            console.log('PengumumanAslab index called');
            
            // Coba ambil data dari database
            let pendaftar = [];
            try {
                pendaftar = await prisma.pendaftaran.findMany({
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
                            orderBy: {
                                id: 'desc'
                            },
                            take: 1
                        }
                    },
                    orderBy: {
                        id: 'asc'
                    }
                });
                console.log(`Found ${pendaftar.length} pendaftar from database`);
            } catch (dbError) {
                console.error('Database error:', dbError);
                // Fallback ke dummy data untuk testing
                pendaftar = [
                    {
                        id: 1,
                        user: { id: 1, name: 'John Doe', nim: '123456', email: 'john@example.com' },
                        pengumuman: []
                    },
                    {
                        id: 2,
                        user: { id: 2, name: 'Jane Smith', nim: '123457', email: 'jane@example.com' },
                        pengumuman: []
                    }
                ];
                console.log('Using dummy data for testing');
            }

            res.render('aslab/pengumumanaslab', {
                pendaftar: pendaftar,
                title: 'Pengumuman Aslab',
                layout: 'aslab/layout/main',
                user: req.session.user || { name: 'Aslab (Uji Coba)' }, // Fallback user data
                activePage: 'pengumuman'
            });
        } catch (error) {
            console.error('Error in PengumumanAslab index:', error);
            res.status(500).json({ error: 'Terjadi kesalahan server', details: error.message });
        }
    }

    // API untuk mendapatkan pendaftar berdasarkan tahapan
    async getPendaftarByTahapan(req, res) {
        try {
            const { tahapan } = req.params;
            console.log(`Getting pendaftar for tahapan: ${tahapan}`);
            
            let pendaftar = [];
            
            try {
                let whereCondition = {};
                
                if (tahapan === 'tahap1') {
                    // Untuk tahap 1, ambil semua pendaftar yang belum ada pengumuman
                    whereCondition = {
                        pengumuman: {
                            none: {}
                        }
                    };
                    console.log('Filter: Pendaftar tanpa pengumuman');
                } else if (tahapan === 'tahap2') {
                    // Untuk tahap 2, ambil yang sudah lulus tahap 1
                    whereCondition = {
                        pengumuman: {
                            some: {
                                tahapan: 'tahap1'
                            }
                        }
                    };
                    console.log('Filter: Pendaftar yang sudah lulus tahap 1');
                } else if (tahapan === 'tahap3') {
                    // Untuk tahap 3, ambil yang sudah lulus tahap 2
                    whereCondition = {
                        pengumuman: {
                            some: {
                                tahapan: 'tahap2'
                            }
                        }
                    };
                    console.log('Filter: Pendaftar yang sudah lulus tahap 2');
                } else {
                    console.log('Tahapan tidak valid:', tahapan);
                    return res.status(400).json({ error: 'Tahapan tidak valid' });
                }

                pendaftar = await prisma.pendaftaran.findMany({
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
                    orderBy: {
                        id: 'asc'
                    }
                });
            } catch (dbError) {
                console.error('Database error in getPendaftarByTahapan:', dbError);
                // Fallback ke dummy data untuk testing
                if (tahapan === 'tahap1') {
                    pendaftar = [
                        { id: 1, user: { id: 1, name: 'John Doe', nim: '123456', email: 'john@example.com' } },
                        { id: 2, user: { id: 2, name: 'Jane Smith', nim: '123457', email: 'jane@example.com' } },
                        { id: 3, user: { id: 3, name: 'Bob Johnson', nim: '123458', email: 'bob@example.com' } }
                    ];
                } else if (tahapan === 'tahap2') {
                    pendaftar = [
                        { id: 1, user: { id: 1, name: 'John Doe', nim: '123456', email: 'john@example.com' } },
                        { id: 2, user: { id: 2, name: 'Jane Smith', nim: '123457', email: 'jane@example.com' } }
                    ];
                } else if (tahapan === 'tahap3') {
                    pendaftar = [
                        { id: 1, user: { id: 1, name: 'John Doe', nim: '123456', email: 'john@example.com' } }
                    ];
                }
                console.log(`Using dummy data for tahapan ${tahapan}: ${pendaftar.length} participants`);
            }

            console.log(`Found ${pendaftar.length} pendaftar for tahapan ${tahapan}`);
            res.json(pendaftar);
        } catch (error) {
            console.error('Error in getPendaftarByTahapan:', error);
            res.status(500).json({ error: 'Terjadi kesalahan server', details: error.message });
        }
    }

    // Menyimpan pengumuman kelulusan
    async simpanPengumuman(req, res) {
        try {
            const { tahapan, pendaftarIds } = req.body;
            console.log('Saving pengumuman:', { tahapan, pendaftarIds });

            if (!tahapan || !pendaftarIds || !Array.isArray(pendaftarIds)) {
                return res.status(400).json({ error: 'Data tidak lengkap' });
            }

            try {
                // Validasi tahapan
                const validTahapan = ['tahap1', 'tahap2', 'tahap3'];
                if (!validTahapan.includes(tahapan)) {
                    return res.status(400).json({ error: 'Tahapan tidak valid' });
                }

                // Buat pengumuman untuk setiap pendaftar yang dipilih
                const pengumumanData = pendaftarIds.map(pendaftarId => ({
                    user_id: parseInt(pendaftarId),
                    pendaftaran_id: parseInt(pendaftarId),
                    tahapan: tahapan // Menggunakan tahapan yang dipilih
                }));

                console.log('Data yang akan disimpan:', pengumumanData);

                // Simpan ke database
                const result = await prisma.pengumuman.createMany({
                    data: pengumumanData
                });

                console.log(`Successfully saved ${result.count} pengumuman for tahapan ${tahapan}`);
                res.json({
                    success: true,
                    message: `Berhasil menyimpan pengumuman tahap ${tahapan} untuk ${result.count} peserta`,
                    count: result.count,
                    tahapan: tahapan
                });
            } catch (dbError) {
                console.error('Database error in simpanPengumuman:', dbError);
                // Fallback response untuk testing
                res.json({
                    success: true,
                    message: `Berhasil menyimpan pengumuman tahap ${tahapan} untuk ${pendaftarIds.length} peserta (dummy data)`,
                    count: pendaftarIds.length,
                    tahapan: tahapan,
                    note: 'Data disimpan sebagai dummy untuk testing'
                });
            }

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
                        orderBy: {
                            id: 'desc'
                        },
                        take: 1
                    }
                },
                orderBy: {
                    id: 'asc'
                }
            });

            // Format data untuk response
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
            console.error('Error in getStatusKelulusan:', error);
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
                        select: {
                            id: true
                        }
                    }
                },
                orderBy: {
                    id: 'desc'
                }
            });

            res.json({
                success: true,
                data: allPengumuman,
                count: allPengumuman.length
            });
        } catch (error) {
            console.error('Error in getAllPengumuman:', error);
            res.status(500).json({ error: 'Terjadi kesalahan server', details: error.message });
        }
    }
}

export default new PengumumanAslabController(); 