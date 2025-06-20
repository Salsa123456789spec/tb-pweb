// src/controllers/komplainWawancaraController.js
const prisma = require('../models/prisma'); // Pastikan path ini benar sesuai struktur proyek Anda

const getKomplainWawancaraForm = async (req, res) => {
    try {
        const { id } = req.params; // Ambil jadwal_id dari URL
        const jadwalId = parseInt(id);

        if (isNaN(jadwalId)) {
            return res.status(400).send('ID Jadwal tidak valid.');
        }

        // Ambil data jadwal wawancara beserta pendaftar dan user
        const jadwal = await prisma.jadwalWawancara.findUnique({
            where: { id: jadwalId },
            include: {
                pendaftaran: {
                    include: {
                        user: true // Termasuk data user dari pendaftar
                    }
                }
            }
        });

        if (!jadwal) {
            return res.status(404).send('Jadwal wawancara tidak ditemukan.');
        }

        res.render('komplainWawancara', {
            title: 'Komplain Jadwal Wawancara',
            jadwal // Kirim data jadwal ke view
        });
    } catch (error) {
        console.error('Error fetching interview schedule for complaint:', error);
        res.status(500).send('Terjadi kesalahan saat mengambil data jadwal.');
    }
};

const submitKomplainWawancara = async (req, res) => {
    try {
        const { jadwal_id, alasan, tanggal_diajukan, waktu_diajukan } = req.body;
        const jadwalId = parseInt(jadwal_id);

        if (isNaN(jadwalId)) {
            return res.status(400).send('ID Jadwal tidak valid.');
        }

        // Cek apakah jadwal ada
        const existingJadwal = await prisma.jadwalWawancara.findUnique({
            where: { id: jadwalId }
        });

        if (!existingJadwal) {
            return res.status(404).send('Jadwal wawancara tidak ditemukan.');
        }

        // Convert tanggal_diajukan and waktu_diajukan to valid DateTime objects
        // Combine date and time to create a full DateTime object for Prisma
        let proposedDateTime = null;
        if (tanggal_diajukan && waktu_diajukan) {
            try {
                // Parse date and time separately to avoid timezone issues during parsing
                const datePart = new Date(tanggal_diajukan);
                const timeParts = waktu_diajukan.split(':');
                datePart.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]), 0, 0);
                proposedDateTime = datePart;
            } catch (e) {
                console.error("Error parsing proposed date/time:", e);
                // Handle invalid date/time format, maybe set to null or return error
                proposedDateTime = null;
            }
        }


        // Buat entri komplain baru di database
        await prisma.komplainJadwal.create({
            data: {
                jadwal_id: jadwalId,
                alasan: alasan,
                tanggal_diajukan: proposedDateTime, // Menggunakan tanggal_diajukan yang digabungkan
                waktu_diajukan: proposedDateTime, // Waktu juga disimpan sebagai DateTime, atau bisa di-parse dari tanggal_diajukan
                status: "menunggu" // Default status
            }
        });

        // Anda bisa tambahkan logika notifikasi atau redirect ke halaman sukses
        res.redirect('/jadwal-wawancara?komplainSuccess=true'); // Redirect kembali ke jadwal dengan pesan sukses
    } catch (error) {
        console.error('Error submitting complaint:', error);
        res.status(500).send('Terjadi kesalahan saat mengajukan komplain.');
    }
};

module.exports = {
    getKomplainWawancaraForm,
    submitKomplainWawancara
};