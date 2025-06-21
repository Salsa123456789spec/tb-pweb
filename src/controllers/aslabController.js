// src/controllers/aslabController.js

import prisma from '../models/prisma.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Controller untuk menampilkan semua pendaftar (DIPERBAIKI DENGAN LOGGING)
export const getRekapPendaftar = async (req, res) => {
  console.log(`[LOG] Memulai proses untuk rute: /aslab/rekap/pendaftar...`);
  try {
    console.log(`[LOG] Mencoba mengambil data dari tabel 'pendaftaran' di database...`);
    const semuaPendaftar = await prisma.pendaftaran.findMany({
      include: { user: { select: { name: true, nim: true } } },
      orderBy: { id: 'desc' }
    });
    console.log(`[LOG] Berhasil! Ditemukan ${semuaPendaftar.length} data pendaftar.`);

    const pendaftarFormatted = semuaPendaftar.map(p => ({
      nim: p.user.nim,
      nama: p.user.name,
      no_hp: p.nomor_whatsapp,
      id: p.id
    }));

    console.log(`[LOG] Mulai me-render view 'aslab/pendaftar.ejs'...`);
    res.render('aslab/pendaftar', {
      layout: 'aslab/layout/main',
      title: 'Rekap Pendaftar',
      user: req.session.user,
      pendaftar: pendaftarFormatted,
      activePage: 'rekap-pendaftar',
      success_msg: req.flash('success_msg')
    });
    console.log(`[LOG] View berhasil di-render.`);

  } catch (error) {
    // Jika ada error di blok 'try', kode ini akan dijalankan.
    console.error("[ERROR] Terjadi kegagalan saat mengambil data pendaftar:", error);
    req.flash('error_msg', 'Gagal memuat data pendaftar. Silakan periksa log server.');
    
    console.log(`[LOG] Mengalihkan (redirect) ke '/aslab/dashboard' karena terjadi error.`);
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

        res.render('aslab/detail-pendaftar', {
            layout: 'aslab/layout/main',
            title: 'Detail Pendaftar',
            user: req.session.user,
            detail: detailPendaftar,
            activePage: 'rekap-pendaftar'
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
                    const filePath = path.join(__dirname, '../../../public/uploads', file);
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