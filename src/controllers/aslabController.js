import prisma from '../models/prisma.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Controller untuk menampilkan semua pendaftar
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

    // Menggunakan path 'aslab/rekap/pendaftar' untuk rendering
    res.render('aslab/rekap/pendaftar', {
      layout: 'aslab/layout/main',
      title: 'Rekap Pendaftar',
      user: req.session.user,
      pendaftar: pendaftarFormatted,
      // DISESUAIKAN: Menggunakan 'rekap/pendaftar' agar cocok dengan logika di sidebar.ejs
      activePage: 'rekap/pendaftar',
      success_msg: req.flash('success_msg'),
      error_msg: req.flash('error_msg') // Menambahkan error_msg untuk konsistensi
    });

  } catch (error) {
    console.error("[ERROR] Terjadi kegagalan saat mengambil data pendaftar:", error);
    req.flash('error_msg', 'Gagal memuat data pendaftar. Silakan periksa log server.');
    res.redirect('/aslab/dashboard');
  }
};

// Controller untuk melihat detail satu pendaftar
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

        // Menggunakan path 'aslab/rekap/detail-pendaftar' untuk rendering
        res.render('aslab/rekap/detail-pendaftar', {
            layout: 'aslab/layout/main',
            title: 'Detail Pendaftar',
            user: req.session.user,
            detail: detailPendaftar,
            // DISESUAIKAN: Nilai ini memastikan menu "Rekap" tetap terbuka saat melihat detail
            activePage: 'rekap/pendaftar'
        });
    } catch (error) {
        console.error("Gagal mengambil detail pendaftar:", error);
        req.flash('error_msg', 'Terjadi kesalahan server.');
        res.redirect('/aslab/rekap/pendaftar');
    }
};

// Controller untuk menghapus data pendaftar
export const deletePendaftar = async (req, res) => {
    try {
        const pendaftarId = parseInt(req.params.id);
        const pendaftaran = await prisma.pendaftaran.findUnique({
            where: { id: pendaftarId },
        });

        if (pendaftaran) {
            const filesToDelete = [
                pendaftaran.CV_file, 
                pendaftaran.KRS_file, 
                pendaftaran.KHS_file, 
                pendaftaran.surat_permohonan_file
            ];

            filesToDelete.forEach(file => {
                if (file) {
                    // Path relatif dari root proyek ke folder uploads
                    const filePath = path.join(process.cwd(), 'public/uploads', file);
                    fs.unlink(filePath, (err) => {
                        if (err) console.error(`Gagal menghapus file: ${filePath}`, err);
                    });
                }
            });

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