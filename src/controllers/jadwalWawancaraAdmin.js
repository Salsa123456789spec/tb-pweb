// src/controllers/jadwalWawancaraAdmin.js
import prisma from '../models/prisma.js';

export const getJadwalWawancaraMahasiswa = async (req, res) => {
    // ... (existing code for mahasiswa dashboard, no change needed here)
};

export const getJadwalWawancaraAdminForm = async (req, res) => {
    try {
        const pendaftar = await prisma.pendaftaran.findMany({
            where: {
                status: 'diterima'
            },
            include: {
                user: true
            }
        });
        
        const pewawancara = await prisma.pewawancara.findMany();
        
        const jadwalTerkini = await prisma.jadwalwawancara.findMany({
            include: {
                pendaftaran: {
                    include: {
                        user: true
                    }
                },
                pewawancara: true
            },
            orderBy: {
                tanggal: 'desc'
            }
        });

        res.render('aslab/layout/jadwalwawancara1', { 
            title: 'Jadwal Wawancara',
            layout: 'aslab/layout/main',
            activePage: 'jadwalWawancara',
            pendaftar,
            pewawancara,
            jadwalTerkini,
            old: req.body,
            user: req.session.user
        });
    } catch (error) {
        console.error("Error fetching data for jadwal form:", error);
        res.status(500).send("Internal Server Error");
    }
};

export const createJadwalWawancara = async (req, res) => {
    try {
        const { pendaftaran_id, pewawancara_id, tanggal, waktu, ruang } = req.body;
        
        if (!pendaftaran_id || !pewawancara_id || !tanggal || !waktu || !ruang) {
            req.flash('error_msg', 'Semua field harus diisi');
            return res.redirect('/aslab/jadwal-wawancara');
        }
        
        // Gabungkan tanggal dan waktu
        const tanggalWaktu = new Date(`${tanggal}T${waktu}:00`);
        
        await prisma.jadwalwawancara.create({
            data: {
                pendaftaran_id: parseInt(pendaftaran_id),
                pewawancara_id: parseInt(pewawancara_id),
                tanggal: new Date(tanggal),
                waktu: tanggalWaktu,
                ruang: ruang
            }
        });
        
        req.flash('success_msg', 'Jadwal wawancara berhasil dibuat');
        res.redirect('/aslab/jadwal-wawancara');
        
    } catch (error) {
        console.error('Error creating jadwal wawancara:', error);
        req.flash('error_msg', 'Terjadi kesalahan saat membuat jadwal');
        res.redirect('/aslab/jadwal-wawancara');
    }
};

export const renderEditJadwalForm = async (req, res) => {
    try {
        const { id } = req.params;
        const jadwal = await prisma.jadwalwawancara.findUnique({
            where: { id: parseInt(id) }
        });

        if (!jadwal) {
            req.flash('error_msg', 'Jadwal tidak ditemukan.');
            return res.redirect('/aslab/jadwal-wawancara');
        }

        const pendaftar = await prisma.pendaftaran.findMany({
            where: {
                status: 'diterima'
            },
            include: { user: true }
        });
        
        const pewawancara = await prisma.pewawancara.findMany();

        res.render('aslab/layout/editJadwalWawancara', {
            title: 'Edit Jadwal Wawancara',
            layout: 'aslab/layout/main',
            activePage: 'jadwalWawancara',
            jadwal,
            pendaftar,
            pewawancara,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error rendering edit form:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const updateJadwalWawancara = async (req, res) => {
    try {
        const { id } = req.params;
        const { pendaftaran_id, pewawancara_id, tanggal, waktu, ruang } = req.body;

        const tanggalWaktu = new Date(`${tanggal}T${waktu}:00`);

        await prisma.jadwalwawancara.update({
            where: { id: parseInt(id) },
            data: {
                pendaftaran_id: parseInt(pendaftaran_id),
                pewawancara_id: parseInt(pewawancara_id),
                tanggal: new Date(tanggal),
                waktu: tanggalWaktu,
                ruang
            }
        });

        req.flash('success_msg', 'Jadwal wawancara berhasil diperbarui.');
        res.redirect('/aslab/jadwal-wawancara');
    } catch (error) {
        console.error('Error updating jadwal:', error);
        req.flash('error_msg', 'Gagal memperbarui jadwal.');
        res.redirect(`/aslab/jadwal-wawancara/edit/${req.params.id}`);
    }
};

export const deleteJadwalWawancara = async (req, res) => {
    try {
        const { id } = req.params;
        
        console.log('Deleting jadwal wawancara with ID:', id);
        
        // First delete related komplain records
        await prisma.komplainjadwal.deleteMany({
            where: { jadwal_id: parseInt(id) }
        });
        
        // Then delete the jadwal wawancara
        await prisma.jadwalwawancara.delete({
            where: { id: parseInt(id) }
        });
        
        console.log('Successfully deleted jadwal wawancara with ID:', id);
        res.status(200).json({ message: 'Jadwal wawancara berhasil dihapus' });
    } catch (error) {
        console.error('Error deleting jadwal wawancara:', error);
        
        if (error.code === 'P2025') {
            return res.status(404).json({ 
                message: 'Jadwal tidak ditemukan' 
            });
        }
        
        res.status(500).json({ 
            message: 'Gagal menghapus jadwal',
            error: error.message 
        });
    }
};

// You might also want a function to display all existing schedules for admin
export const getAllJadwalWawancaraAdmin = async (req, res) => {
    // Fungsi ini mungkin bisa digunakan untuk API atau halaman list terpisah jika dibutuhkan
    try {
        const jadwalWawancaraList = await prisma.jadwalwawancara.findMany({
            include: {
                pendaftaran: {
                    include: {
                        user: true,
                    },
                },
            },
            orderBy: {
                tanggal: 'desc',
            },
        });
        res.json(jadwalWawancaraList);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}; 