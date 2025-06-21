// src/controllers/jadwalWawancaraController.js
import prisma from '../models/prisma.js'; // Pastikan path ini benar untuk instance Prisma Anda

export const getJadwalWawancaraMahasiswa = async (req, res) => {
    try {
        // Asumsi user ID tersedia dari sesi atau middleware autentikasi
        // Ganti 'req.user.id' dengan cara Anda mendapatkan ID pengguna saat ini.
        const userId = req.user.id; // Contoh: Asumsi user ID tersedia di req.user

        const jadwalWawancara = await prisma.jadwalWawancara.findMany({
            where: {
                pendaftaran: {
                    user_id: userId // Filter jadwal berdasarkan user yang sedang login
                }
            },
            include: {
                pendaftaran: {
                    include: {
                        user: true
                    }
                },
                KomplainJadwal: { // Sertakan data komplain terkait
                    where: {
                        status: "menunggu" // Hanya ambil komplain yang berstatus "menunggu"
                    },
                    // Jika Anda yakin hanya ada satu komplain menunggu per jadwal,
                    // Anda bisa menambahkan take: 1 di sini.
                    // take: 1
                }
            }
        });

        res.render('mahasiswa/jadwalWawancara', {
            title: 'Jadwal Wawancara',
            jadwalWawancara: jadwalWawancara // Kirim data yang sudah diperkaya ke template EJS
        });
    } catch (error) {
        console.error('Error fetching jadwal wawancara for mahasiswa:', error);
        res.status(500).send('Terjadi kesalahan saat memuat jadwal wawancara.');
    }
};