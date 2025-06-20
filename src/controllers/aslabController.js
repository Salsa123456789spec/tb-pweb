// src/controllers/aslabController.js

import prisma from '../models/prisma.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Controller untuk menampilkan semua pendaftar (sudah ada)
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
    res.render('aslab/pendaftar', {
      layout: 'aslab/layout/main',
      title: 'Rekap Pendaftar',
      user: req.session.user,
      pendaftar: pendaftarFormatted,
      activePage: 'rekap-pendaftar',
      success_msg: req.flash('success_msg') // Tambahkan ini untuk menampilkan notifikasi
    });
  } catch (error) {
    console.error("Gagal mengambil data pendaftar:", error);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat data pendaftar.');
    res.redirect('/aslab/dashboard');
  }
};

// (FUNGSI BARU) Controller untuk melihat detail satu pendaftar
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

// (FUNGSI BARU) Controller untuk menghapus data pendaftar
export const deletePendaftar = async (req, res) => {
    try {
        const pendaftarId = parseInt(req.params.id);

        // 1. Cari data pendaftaran untuk mendapatkan nama file yang akan dihapus
        const pendaftaran = await prisma.pendaftaran.findUnique({
            where: { id: pendaftarId },
        });

        if (pendaftaran) {
            // 2. Hapus file-file dari folder /public/uploads
            const filesToDelete = [
                pendaftaran.CV_file, 
                pendaftaran.KRS_file, 
                pendaftaran.KHS_file, 
                pendaftaran.surat_permohonan_file
            ];

            filesToDelete.forEach(file => {
                if (file) { // Cek jika nama file ada
                    const filePath = path.join(__dirname, '../../../public/uploads', file);
                    fs.unlink(filePath, (err) => {
                        if (err) console.error(`Gagal menghapus file: ${filePath}`, err);
                    });
                }
            });

            // 3. Hapus data dari database
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