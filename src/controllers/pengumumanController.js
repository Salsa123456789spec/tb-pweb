// src/controllers/pengumumanController.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Fungsi untuk Pengumuman Tahap 1
export const getHasilTahap1 = async (req, res) => {
    try {
        const user = req.session.user;

        const pengumumanTahap1 = await prisma.pengumuman.findMany({
            where: {
                tahapan: 'tahap1',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        nim: true,
                    },
                },
                pendaftaran: {
                    select: {
                        domisili: true,
                        asal: true,
                        divisi: true,
                    },
                },
            },
            orderBy: {
                user: {
                    name: 'asc',
                },
            },
        });

        // Map the data to match template expectations
        const mappedPengumumanTahap1 = pengumumanTahap1.map(item => ({
            ...item,
            user: {
                ...item.user,
                nama_lengkap: item.user.name // Map name to nama_lengkap
            }
        }));

        res.render('mahasiswa/hasiltahap1', {
            layout: 'mahasiswa/layout/main',
            title: 'Hasil Tahap 1 - Pendaftaran',
            user: user,
            pengumumanTahap1: mappedPengumumanTahap1,
            activePage: 'pengumuman',
        });

    } catch (error) {
        console.error('Error fetching Hasil Tahap 1:', error);
        res.status(500).send('Terjadi kesalahan saat memuat hasil Tahap 1.');
    }
};

// Fungsi untuk Pengumuman Tahap 2
export const getHasilTahap2 = async (req, res) => {
    try {
        const user = req.session.user;

        // Fetch tahap 1 results to check if user passed
        const pengumumanTahap1 = await prisma.pengumuman.findMany({
            where: {
                tahapan: 'tahap1',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        nim: true,
                    },
                },
                pendaftaran: {
                    select: {
                        domisili: true,
                        asal: true,
                        divisi: true,
                    },
                },
            },
        });

        const pengumumanTahap2 = await prisma.pengumuman.findMany({
            where: {
                tahapan: 'tahap2',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        nim: true,
                    },
                },
                pendaftaran: {
                    select: {
                        domisili: true,
                        asal: true,
                        divisi: true,
                    },
                },
            },
            orderBy: {
                user: {
                    name: 'asc',
                },
            },
        });

        // Map the data to match template expectations
        const mappedPengumumanTahap1 = pengumumanTahap1.map(item => ({
            ...item,
            user: {
                ...item.user,
                nama_lengkap: item.user.name
            }
        }));

        const mappedPengumumanTahap2 = pengumumanTahap2.map(item => ({
            ...item,
            user: {
                ...item.user,
                nama_lengkap: item.user.name // Map name to nama_lengkap
            }
        }));

        res.render('mahasiswa/hasiltahap2', {
            layout: 'mahasiswa/layout/main',
            title: 'Hasil Tahap 2 - Wawancara',
            user: user,
            pengumumanTahap1: mappedPengumumanTahap1,
            pengumumanTahap2: mappedPengumumanTahap2,
            activePage: 'pengumuman',
        });

    } catch (error) {
        console.error('Error fetching Hasil Tahap 2:', error);
        res.status(500).send('Terjadi kesalahan saat memuat hasil Tahap 2.');
    }
};

// Fungsi untuk Pengumuman Tahap 3
export const getHasilTahap3 = async (req, res) => {
    try {
        const user = req.session.user;

        // Fetch tahap 1 and 2 results to check if user passed previous stages
        const pengumumanTahap1 = await prisma.pengumuman.findMany({
            where: {
                tahapan: 'tahap1',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        nim: true,
                    },
                },
                pendaftaran: {
                    select: {
                        domisili: true,
                        asal: true,
                        divisi: true,
                    },
                },
            },
        });

        const pengumumanTahap2 = await prisma.pengumuman.findMany({
            where: {
                tahapan: 'tahap2',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        nim: true,
                    },
                },
                pendaftaran: {
                    select: {
                        domisili: true,
                        asal: true,
                        divisi: true,
                    },
                },
            },
        });

        const pengumumanTahap3 = await prisma.pengumuman.findMany({
            where: {
                tahapan: 'tahap3',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        nim: true,
                    },
                },
                pendaftaran: {
                    select: {
                        domisili: true,
                        asal: true,
                        divisi: true,
                    },
                },
            },
            orderBy: {
                user: {
                    name: 'asc',
                },
            },
        });

        // Map the data to match template expectations
        const mappedPengumumanTahap1 = pengumumanTahap1.map(item => ({
            ...item,
            user: {
                ...item.user,
                nama_lengkap: item.user.name
            }
        }));

        const mappedPengumumanTahap2 = pengumumanTahap2.map(item => ({
            ...item,
            user: {
                ...item.user,
                nama_lengkap: item.user.name
            }
        }));

        const mappedPengumumanTahap3 = pengumumanTahap3.map(item => ({
            ...item,
            user: {
                ...item.user,
                nama_lengkap: item.user.name // Map name to nama_lengkap
            }
        }));

        res.render('mahasiswa/hasiltahap3', {
            layout: 'mahasiswa/layout/main',
            title: 'Hasil Tahap 3 - Penerimaan Magang',
            user: user,
            pengumumanTahap1: mappedPengumumanTahap1,
            pengumumanTahap2: mappedPengumumanTahap2,
            pengumumanTahap3: mappedPengumumanTahap3,
            activePage: 'pengumuman',
        });

    } catch (error) {
        console.error('Error fetching Hasil Tahap 3:', error);
        res.status(500).send('Terjadi kesalahan saat memuat hasil Tahap 3.');
    }
};

// Anda mungkin perlu mengekspor semua fungsi ini
// atau mengekspor sebuah objek yang berisi fungsi-fungsi ini
// tergantung bagaimana Anda mengimpornya di file route
export default {
    getHasilTahap1,
    getHasilTahap2,
    getHasilTahap3
};