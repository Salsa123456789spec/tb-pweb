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
        console.log('=== DEBUG: getVerifikasiPage started ===');
        
        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const search = req.query.search || '';
        const skip = (page - 1) * limit;

        console.log('Page:', page, 'Limit:', limit, 'Search:', search);

        let whereClause = {};
        if (search) {
            whereClause.user = {
                name: {
                    contains: search,
                },
            };
        }

        console.log('Where clause:', JSON.stringify(whereClause));

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

        console.log('Pendaftar found:', pendaftar.length);

        const totalPendaftar = await prisma.pendaftaran.count({
            where: whereClause
        });

        const totalPages = Math.ceil(totalPendaftar / limit);

        console.log('Total pendaftar:', totalPendaftar, 'Total pages:', totalPages);

        res.render('aslab/layout/verifikasi', {
            title: 'Verifikasi Dokumen',
            layout: 'aslab/layout/main',
            activePage: 'verifikasi',
            pendaftar,
            currentPage: page,
            totalPages,
            search,
            pageTitle: 'Verifikasi Dokumen',
            user: req.session.user
        });
        
        console.log('=== DEBUG: getVerifikasiPage completed successfully ===');
    } catch (error) {
        console.error('=== ERROR in getVerifikasiPage ===');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('=== END ERROR ===');
        res.status(500).send('Internal Server Error: ' + error.message);
    }
};

// Menampilkan halaman detail untuk verifikasi satu pendaftar
export const getDetailPendaftar = async (req, res) => {
    try {
        const pendaftar = await prisma.pendaftaran.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { user: true },
            // Pastikan field dokumen diambil
        });

        if (!pendaftar) {
            return res.status(404).send('Pendaftar tidak ditemukan');
        }

        res.render('aslab/layout/lihatdetail', {
            title: 'Detail Pendaftar',
            layout: 'aslab/layout/main',
            activePage: 'verifikasi',
            pendaftar,
            pageTitle: 'Detail Pendaftar',
            user: req.session.user
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
        res.redirect('/aslab/verifikasi');
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

// Menampilkan file dokumen
export const viewDocument = async (req, res) => {
    try {
        const { pendaftaranId, documentType } = req.params;
        
        // Ambil data pendaftaran
        const pendaftaran = await prisma.pendaftaran.findUnique({
            where: { id: parseInt(pendaftaranId) },
            include: { user: true }
        });

        if (!pendaftaran) {
            return res.status(404).send('Pendaftaran tidak ditemukan');
        }

        // Tentukan file path berdasarkan tipe dokumen
        let filePath;
        let fileName;
        
        switch (documentType) {
            case 'cv':
                filePath = pendaftaran.CV_file;
                fileName = `CV_${pendaftaran.user.name}.pdf`;
                break;
            case 'khs':
                filePath = pendaftaran.KHS_file;
                fileName = `KHS_${pendaftaran.user.name}.pdf`;
                break;
            case 'krs':
                filePath = pendaftaran.KRS_file;
                fileName = `KRS_${pendaftaran.user.name}.pdf`;
                break;
            case 'surat':
                filePath = pendaftaran.surat_permohonan_file;
                fileName = `SuratPermohonan_${pendaftaran.user.name}.pdf`;
                break;
            default:
                return res.status(400).send('Tipe dokumen tidak valid');
        }

        if (!filePath) {
            return res.status(404).send('File tidak ditemukan di database');
        }

        // Path lengkap ke file
        const fullPath = path.join(process.cwd(), 'public', filePath);
        
        // Periksa apakah file ada
        const fs = await import('fs');
        if (!fs.existsSync(fullPath)) {
            // Jika file tidak ada, buat file dummy PDF atau tampilkan pesan
            console.log(`File tidak ditemukan: ${fullPath}`);
            
            // Buat file dummy PDF sederhana
            const PDFDocument = await import('pdfkit');
            const doc = new PDFDocument.default();
            
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
            
            doc.pipe(res);
            doc.fontSize(16).text(`Dokumen ${documentType.toUpperCase()}`, {align: 'center'});
            doc.moveDown();
            doc.fontSize(12).text(`Nama: ${pendaftaran.user.name}`);
            doc.text(`NIM: ${pendaftaran.user.nim}`);
            doc.text(`Divisi: ${pendaftaran.divisi}`);
            doc.moveDown();
            doc.text('File asli tidak ditemukan di server.');
            doc.text('Silakan hubungi administrator untuk mengupload file yang benar.');
            doc.end();
            
            return;
        }

        // Set header untuk menampilkan PDF di browser
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
        
        // Stream file ke response
        const fileStream = fs.createReadStream(fullPath);
        fileStream.pipe(res);

    } catch (error) {
        console.error('Error viewing document:', error);
        res.status(500).send('Gagal menampilkan dokumen');
    }
};