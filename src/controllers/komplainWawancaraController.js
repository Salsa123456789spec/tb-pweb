// src/controllers/komplainWawancaraController.js
import prisma from '../models/prisma.js';

export const getKomplainWawancaraForm = async (req, res) => {
    try {
        const { id } = req.params;
        const jadwalId = parseInt(id);

        if (isNaN(jadwalId)) {
            return res.status(400).send('ID Jadwal tidak valid.');
        }

        const jadwal = await prisma.jadwalWawancara.findUnique({
            where: { id: jadwalId },
            include: {
                pendaftaran: {
                    include: {
                        user: true
                    }
                }
            }
        });

        if (!jadwal) {
            return res.status(404).send('Jadwal wawancara tidak ditemukan.');
        }

        res.render('mahasiswa/komplainWawancara', {
            title: 'Komplain Jadwal Wawancara',
            jadwal,
            activePage: 'wawancara' // <--- PERBAIKAN DI SINI: Tambahkan activePage
        });
    } catch (error) {
        console.error('Error fetching interview schedule for complaint:', error);
        res.status(500).send('Terjadi kesalahan saat mengambil data jadwal.');
    }
};

export const submitKomplainWawancara = async (req, res) => {
    try {
        const { jadwal_id, alasan, tanggal_diajukan, waktu_diajukan } = req.body;
        const jadwalId = parseInt(jadwal_id);

        if (isNaN(jadwalId)) {
            return res.status(400).send('ID Jadwal tidak valid.');
        }

        const existingJadwal = await prisma.jadwalWawancara.findUnique({
            where: { id: jadwalId }
        });

        if (!existingJadwal) {
            return res.status(404).send('Jadwal wawancara tidak ditemukan.');
        }

        let proposedDateTime = null;
        if (tanggal_diajukan && waktu_diajukan) {
            try {
                const datePart = new Date(tanggal_diajukan);
                const timeParts = waktu_diajukan.split(':');
                datePart.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]), 0, 0);
                proposedDateTime = datePart;
            } catch (e) {
                console.error("Error parsing proposed date/time:", e);
                proposedDateTime = null;
            }
        }

        await prisma.komplainJadwal.create({
            data: {
                jadwal_id: jadwalId,
                alasan: alasan,
                tanggal_diajukan: proposedDateTime,
                waktu_diajukan: proposedDateTime,
                status: "menunggu"
            }
        });

        res.redirect('/mahasiswa/jadwalWawancara?komplainSuccess=true');
    } catch (error) {
        console.error('Error submitting complaint:', error);
        res.status(500).send('Terjadi kesalahan saat mengajukan komplain.');
    }
};