import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Function to create dummy data for testing
const createDummyData = async () => {
    try {
        const existingCount = await prisma.pewawancara.count();
        if (existingCount === 0) {
            const dummyData = [
                { nama: 'Zhahra', kontak: '+62 812-3456-7899' },
                { nama: 'Salsa', kontak: '+62 812-3456-7890' },
                { nama: 'Astu', kontak: '+62 812-3456-7891' },
                { nama: 'Astar', kontak: '+62 812-3456-7892' },
                { nama: 'Ahmad', kontak: '+62 812-3456-7893' },
                { nama: 'Budi', kontak: '+62 812-3456-7894' },
                { nama: 'Citra', kontak: '+62 812-3456-7895' },
                { nama: 'Dewi', kontak: '+62 812-3456-7896' },
                { nama: 'Eko', kontak: '+62 812-3456-7897' },
                { nama: 'Fina', kontak: '+62 812-3456-7898' },
                { nama: 'Gita', kontak: '+62 812-3456-7899' },
                { nama: 'Hadi', kontak: '+62 812-3456-7900' },
                { nama: 'Indah', kontak: '+62 812-3456-7901' },
                { nama: 'Joko', kontak: '+62 812-3456-7902' },
                { nama: 'Kartika', kontak: '+62 812-3456-7903' }
            ];

            for (const data of dummyData) {
                await prisma.pewawancara.create({
                    data: {
                        nama: data.nama,
                        kontak: data.kontak
                    }
                });
            }
            console.log('Dummy data created successfully');
        }
    } catch (error) {
        console.error('Error creating dummy data:', error);
    }
};

// Get all pewawancara with pagination
export const getAllPewawancara = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const offset = (page - 1) * limit;

        const [pewawancara, totalCount] = await Promise.all([
            prisma.pewawancara.findMany({
                select: {
                    id: true,
                    nama: true,
                    kontak: true
                },
                skip: offset,
                take: limit,
                orderBy: {
                    id: 'asc'
                }
            }),
            prisma.pewawancara.count()
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        res.json({
            success: true,
            data: pewawancara,
            pagination: {
                currentPage: page,
                totalPages,
                totalCount,
                limit,
                hasNext: page < totalPages,
                hasPrevious: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching pewawancara:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data pewawancara'
        });
    }
};

// Create new pewawancara
export const createPewawancara = async (req, res) => {
    try {
        const { nama_aslab, kontak } = req.body;

        if (!nama_aslab || !kontak) {
            return res.status(400).json({
                success: false,
                message: 'Nama Aslab dan Kontak harus diisi'
            });
        }

        // Create a new pewawancara entry
        const newPewawancara = await prisma.pewawancara.create({
            data: {
                nama: nama_aslab,
                kontak: kontak.toString()
            }
        });

        res.json({
            success: true,
            message: 'Data pewawancara berhasil ditambahkan',
            data: {
                id: newPewawancara.id,
                nama: newPewawancara.nama,
                kontak: newPewawancara.kontak
            }
        });
    } catch (error) {
        console.error('Error creating pewawancara:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menambahkan data pewawancara'
        });
    }
};

// Delete pewawancara
export const deletePewawancara = async (req, res) => {
    try {
        const { id } = req.params;

        const pewawancara = await prisma.pewawancara.findUnique({
            where: { id: parseInt(id) }
        });

        if (!pewawancara) {
            return res.status(404).json({
                success: false,
                message: 'Data pewawancara tidak ditemukan'
            });
        }

        await prisma.pewawancara.delete({
            where: { id: parseInt(id) }
        });

        res.json({
            success: true,
            message: 'Data pewawancara berhasil dihapus'
        });
    } catch (error) {
        console.error('Error deleting pewawancara:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menghapus data pewawancara'
        });
    }
};

// Render input data wawancara page
export const renderInputDataWawancara = async (req, res) => {
    try {
        // Create dummy data if table is empty
        await createDummyData();

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const offset = (page - 1) * limit;

        const [pewawancara, totalCount] = await Promise.all([
            prisma.pewawancara.findMany({
                select: {
                    id: true,
                    nama: true,
                    kontak: true
                },
                skip: offset,
                take: limit,
                orderBy: {
                    id: 'asc'
                }
            }),
            prisma.pewawancara.count()
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        res.render('aslab/layout/inputdatawawancara', {
            title: 'Input Data Wawancara',
            layout: 'aslab/layout/main',
            activePage: 'jadwalWawancara',
            pewawancara,
            pagination: {
                currentPage: page,
                totalPages,
                totalCount,
                limit,
                hasNext: page < totalPages,
                hasPrevious: page > 1
            }
        });
    } catch (error) {
        console.error('Error rendering input data wawancara:', error);
        res.status(500).send('Error loading page: ' + error.message);
    }
}; 