import { PrismaClient } from '@prisma/client';
import PDFDocument from 'pdfkit';
import puppeteer from 'puppeteer';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Menampilkan halaman verifikasi dengan daftar semua pendaftar
export const getVerifikasiPage = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const search = req.query.search || '';
        const skip = (page - 1) * limit;

        let whereClause = {};
        if (search) {
            whereClause.user = {
                name: {
                    contains: search,
                },
            };
        }

        const pendaftar = await prisma.pendaftaran.findMany({
            skip,
            take: limit,
            where: whereClause,
            include: {
                user: true
            },
            orderBy: {
                id: 'desc'
            }
        });

        const totalPendaftar = await prisma.pendaftaran.count({
            where: whereClause
        });

        const totalPages = Math.ceil(totalPendaftar / limit);

        res.render('aslab/layout/verifikasi', {
            title: 'Verifikasi Dokumen',
            layout: 'aslab/layout/main',
            activePage: 'verifikasi',
            pendaftar,
            currentPage: page,
            totalPages,
            search,
            pageTitle: 'Verifikasi Dokumen'
        });
    } catch (error) {
        console.error('Error fetching pendaftar for verification:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Menampilkan halaman detail untuk verifikasi satu pendaftar
export const getDetailPendaftar = async (req, res) => {
    try {
        const pendaftar = await prisma.pendaftaran.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { user: true }
        });

        if (!pendaftar) {
            return res.status(404).send('Pendaftar tidak ditemukan');
        }

        res.render('aslab/layout/lihatdetail', {
            title: 'Detail Pendaftar',
            layout: 'aslab/layout/main',
            activePage: 'verifikasi',
            pendaftar,
            pageTitle: 'Detail Pendaftar'
        });
    } catch (error) {
        console.error('Error fetching pendaftar detail:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Memperbarui status verifikasi dokumen
export const updateStatusVerifikasi = async (req, res) => {
    const { pendaftaranId } = req.params;
    const { status } = req.body;

    // Validasi status yang masuk
    if (!['lolos', 'tidak_lolos'].includes(status)) {
        return res.status(400).json({ message: 'Status tidak valid.' });
    }

    try {
        await prisma.pendaftaran.update({
            where: {
                id: parseInt(pendaftaranId)
            },
            data: {
                status_verifikasi_dokumen: status
            }
        });
        req.flash('success_msg', 'Status verifikasi berhasil diperbarui!');
        res.redirect('/aslab/verifikasi');
    } catch (error) {
        console.error('Error updating verification status:', error);
        req.flash('error_msg', 'Gagal memperbarui status verifikasi.');
        res.redirect(`/aslab/verifikasi`);
    }
};

// Generate PDF
export const exportPDF = async (req, res) => {
    try {
        const pendaftar = await prisma.pendaftaran.findMany({
            include: {
                user: true
            },
            orderBy: {
                user: {
                    name: 'asc'
                }
            }
        });

        const templatePath = path.join(__dirname, '../views/aslab/pdf-template.ejs');
        const html = await ejs.renderFile(templatePath, { pendaftar });

        try {
            const browser = await puppeteer.launch({ 
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'networkidle0' });
            const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
            
            await browser.close();

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=laporan-pendaftar.pdf');
            res.send(pdfBuffer);
        } catch (puppeteerError) {
            console.error('Puppeteer error:', puppeteerError);
            // Fallback: return HTML content instead of PDF
            res.setHeader('Content-Type', 'text/html');
            res.setHeader('Content-Disposition', 'attachment; filename=laporan-pendaftar.html');
            res.send(html);
        }

    } catch (error) {
        console.error('Error exporting PDF:', error);
        res.status(500).send('Gagal mengekspor PDF. Silakan coba lagi nanti.');
    }
};

export const terimaDokumen = async (req, res) => {
    try {
        await prisma.pendaftaran.update({
            where: { id: parseInt(req.params.id) },
            data: { status: 'diterima' }
        });
        res.redirect('/aslab/verifikasi');
    } catch (error) {
        console.error('Error accepting document:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const tolakDokumen = async (req, res) => {
    try {
        await prisma.pendaftaran.update({
            where: { id: parseInt(req.params.id) },
            data: { status: 'ditolak' }
        });
        res.redirect('/aslab/verifikasi');
    } catch (error) {
        console.error('Error rejecting document:', error);
        res.status(500).send('Internal Server Error');
    }
}; 