import prisma from '../models/prisma.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =================================================================
// FUNGSI UNTUK FITUR ABSENSI
// =================================================================

export const showBuatAbsensiForm = (req, res) => {
    res.render('aslab/buat-absensi', {
        layout: 'aslab/layout/main',
        title: 'Buat Sesi Absensi',
        user: req.session.user,
        activePage: 'absensi',
        success_msg: req.flash('success_msg'),
        error_msg: req.flash('error_msg')
    });
};

export const showTabelAbsensi = async (req, res) => {
    try {
        const { pertemuan, tanggal, pembahasan } = req.body;
        const pendaftarTahap2 = await prisma.pengumuman.findMany({
            where: {
                tahapan: 'tahap2'
            },
            include: {
                user: {
                    select: { nim: true, name: true }
                },
                pendaftaran: {
                    select: { id: true }
                }
            },
            orderBy: { user: { name: 'asc' } }
        });
        const mahasiswa = pendaftarTahap2.map(p => ({
            nim: p.user.nim,
            nama: p.user.name,
            pendaftaranId: p.pendaftaran.id
        }));
        res.render('aslab/tabel-absensi', {
            layout: 'aslab/layout/main',
            title: `Absensi Pertemuan ${pertemuan}`,
            user: req.session.user,
            activePage: 'absensi',
            sesi: { pertemuan, tanggal, pembahasan },
            mahasiswa: mahasiswa
        });
    } catch (error) {
        console.error("[ERROR] Gagal menampilkan tabel absensi:", error);
        req.flash('error_msg', 'Gagal memuat data mahasiswa.');
        res.redirect('/aslab/absensi');
    }
};

/**
 * FUNGSI FINAL UNTUK MENYIMPAN ABSENSI
 * Menggunakan metode Hapus-lalu-Buat yang sesuai dengan skema Anda.
 */
export const simpanAbsensi = async (req, res) => {
    const { pertemuan, tanggal, ...statuses } = req.body;
    console.log("Menerima data untuk disimpan:", req.body);

    try {
        const dataKehadiranBaru = [];
        const pendaftarIds = [];

        for (const key in statuses) {
            if (key.startsWith('status-')) {
                const pendaftaranId = parseInt(key.split('-')[1]);
                const statusValue = statuses[key];

                if (pendaftaranId && statusValue && ['Hadir', 'Izin', 'Alfa'].includes(statusValue)) {
                    pendaftarIds.push(pendaftaranId);
                    dataKehadiranBaru.push({
                        pendaftaran_id: pendaftaranId,
                        pertemuan: parseInt(pertemuan),
                        tanggal: new Date(tanggal),
                        status: statusValue,
                    });
                }
            }
        }

        if (dataKehadiranBaru.length === 0) {
            req.flash('error_msg', 'Tidak ada data absensi valid untuk disimpan.');
            return res.redirect('/aslab/absensi');
        }

        // Jalankan operasi dalam satu transaksi untuk keamanan data
        const transaction = await prisma.$transaction([
            // 1. Hapus semua data absensi LAMA untuk mahasiswa ini di pertemuan ini
            prisma.kehadiran.deleteMany({
                where: {
                    pertemuan: parseInt(pertemuan),
                    pendaftaran_id: {
                        in: pendaftarIds,
                    },
                },
            }),
            // 2. Buat semua data absensi BARU
            prisma.kehadiran.createMany({
                data: dataKehadiranBaru,
            }),
        ]);

        console.log("Transaksi berhasil:", transaction);
        req.flash('success_msg', `Absensi untuk pertemuan ${pertemuan} berhasil disimpan.`);
        res.redirect('/aslab/dashboard');

    } catch (error) {
        console.error('GAGAL MENYIMPAN ABSENSI:', error);
        req.flash('error_msg', 'Terjadi kesalahan pada server saat menyimpan data.');
        res.redirect('/aslab/absensi');
    }
};

// =================================================================
// FUNGSI LAINNYA YANG SUDAH ADA
// =================================================================

export const getRekapPendaftar = async (req, res) => {
    try {
        const semuaPendaftar = await prisma.pendaftaran.findMany({
            include: { user: { select: { name: true, nim: true } } },
            orderBy: { id: 'desc' }
        });
        const pendaftarFormatted = semuaPendaftar.map(p => ({
            nim: p.user.nim,
            nama: p.user.name,
            no_hp: p.nomor_whatsapp,
            id: p.id
        }));
        res.render('aslab/rekap/pendaftar', {
            layout: 'aslab/layout/main',
            title: 'Rekap Pendaftar',
            user: req.session.user,
            pendaftar: pendaftarFormatted,
            activePage: 'rekap/pendaftar',
            success_msg: req.flash('success_msg'),
            error_msg: req.flash('error_msg')
        });
    } catch (error) {
        console.error("[ERROR] Gagal mengambil data pendaftar:", error);
        req.flash('error_msg', 'Gagal memuat data pendaftar.');
        res.redirect('/aslab/dashboard');
    }
};

export const getDetailPendaftar = async (req, res) => {
    try {
        const pendaftarId = parseInt(req.params.id);
        const detailPendaftar = await prisma.pendaftaran.findUnique({
            where: { id: pendaftarId },
            include: { user: { select: { name: true, nim: true, email: true } } }
        });
        if (!detailPendaftar) {
            req.flash('error_msg', 'Data pendaftar tidak ditemukan.');
            return res.redirect('/aslab/rekap/pendaftar');
        }
        res.render('aslab/rekap/detail-pendaftar', {
            layout: 'aslab/layout/main',
            title: 'Detail Pendaftar',
            user: req.session.user,
            detail: detailPendaftar,
            activePage: 'rekap/pendaftar'
        });
    } catch (error) {
        console.error("Gagal mengambil detail pendaftar:", error);
        req.flash('error_msg', 'Terjadi kesalahan server.');
        res.redirect('/aslab/rekap/pendaftar');
    }
};

export const deletePendaftar = async (req, res) => {
    try {
        const pendaftarId = parseInt(req.params.id);
        const pendaftaran = await prisma.pendaftaran.findUnique({
            where: { id: pendaftarId },
        });
        if (pendaftaran) {
            await prisma.pendaftaran.delete({
                where: { id: pendaftarId },
            });
            req.flash('success_msg', 'Data pendaftar berhasil dihapus.');
        } else {
            req.flash('error_msg', 'Data pendaftar tidak ditemukan.');
        }
    } catch (error) {
        console.error("Gagal menghapus pendaftar:", error);
        req.flash('error_msg', 'Terjadi kesalahan saat menghapus data.');
    } finally {
        res.redirect('/aslab/rekap/pendaftar');
    }
};