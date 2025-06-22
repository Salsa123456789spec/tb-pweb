import prisma from '../models/prisma.js';

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
            whereClause.OR = [
                {
                    user: {
                        name: {
                            contains: search,
                        },
                    },
                },
                {
                    user: {
                        nim: {
                            contains: search,
                        },
                    },
                }
            ];
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
            user: req.session.user,
            pendaftar,
            currentPage: page,
            totalPages,
            search,
            pageTitle: 'Verifikasi Dokumen'
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
            include: { user: true }
        });

        if (!pendaftar) {
            return res.status(404).send('Pendaftar tidak ditemukan');
        }

        res.render('aslab/layout/lihatdetail', {
            title: 'Detail Pendaftar',
            layout: 'aslab/layout/main',
            activePage: 'verifikasi',
            user: req.session.user,
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

        // Import PDFKit
        const PDFDocument = await import('pdfkit');
        const doc = new PDFDocument.default({
            size: 'A4',
            margin: 40,
            info: {
                Title: 'Laporan Pendaftar LEA',
                Author: 'Sistem LEA',
                Subject: 'Laporan Pendaftar',
                Keywords: 'LEA, Pendaftar, Laporan',
                CreationDate: new Date()
            }
        });

        // Set response headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=laporan-pendaftar-lea.pdf');

        // Pipe PDF to response
        doc.pipe(res);

        // Add gradient background for title
        const gradient = doc.linearGradient(40, 40, 40, 120, [0, 0, 0, 0], [0, 0, 0, 0.1]);
        doc.rect(40, 40, 515, 80).fill(gradient);

        // Add title with better styling
        doc.fontSize(28)
           .font('Helvetica-Bold')
           .fillColor('#1f2937')
           .text('LAPORAN PENDAFTAR LEA', { align: 'center' });
        
        doc.moveDown(0.3);
        doc.fontSize(14)
           .font('Helvetica')
           .fillColor('#6b7280')
           .text(`Laboratorium Enterprise Architecture`, { align: 'center' });
        
        doc.moveDown(0.5);
        doc.fontSize(12)
           .font('Helvetica-Oblique')
           .fillColor('#9ca3af')
           .text(`Dibuat pada: ${new Date().toLocaleDateString('id-ID', { 
               weekday: 'long', 
               year: 'numeric', 
               month: 'long', 
               day: 'numeric' 
           })}`, { align: 'center' });
        
        doc.moveDown(2);

        // Add table with better styling
        const tableTop = doc.y;
        const tableLeft = 40;
        const colWidths = [40, 150, 100, 120, 80]; // Adjusted column widths
        const rowHeight = 30;
        const headerHeight = 35;

        // Table header with background color
        doc.rect(tableLeft, tableTop, colWidths.reduce((a, b) => a + b, 0), headerHeight)
           .fill('#3b82f6')
           .stroke('#1d4ed8');

        // Header text
        doc.fontSize(11)
           .font('Helvetica-Bold')
           .fillColor('white')
           .text('No', tableLeft + 5, tableTop + 10)
           .text('Nama Lengkap', tableLeft + colWidths[0] + 5, tableTop + 10)
           .text('NIM', tableLeft + colWidths[0] + colWidths[1] + 5, tableTop + 10)
           .text('Divisi', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + 5, tableTop + 10)
           .text('Status', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 5, tableTop + 10);

        // Add table data with alternating row colors
        let currentY = tableTop + headerHeight;
        
        pendaftar.forEach((p, index) => {
            // Check if we need a new page
            if (currentY > 700) {
                doc.addPage();
                currentY = 40;
            }

            // Alternate row colors
            const isEven = index % 2 === 0;
            if (isEven) {
                doc.rect(tableLeft, currentY, colWidths.reduce((a, b) => a + b, 0), rowHeight)
                   .fill('#f8fafc')
                   .stroke('#e2e8f0');
            } else {
                doc.rect(tableLeft, currentY, colWidths.reduce((a, b) => a + b, 0), rowHeight)
                   .fill('white')
                   .stroke('#e2e8f0');
            }

            // Status color coding
            let statusColor = '#6b7280'; // Default gray
            if (p.status === 'diterima') {
                statusColor = '#059669'; // Green
            } else if (p.status === 'ditolak') {
                statusColor = '#dc2626'; // Red
            } else if (p.status === 'pending') {
                statusColor = '#d97706'; // Orange
            }

            // Row data
            doc.fontSize(10)
               .font('Helvetica')
               .fillColor('#1f2937')
               .text((index + 1).toString(), tableLeft + 5, currentY + 8)
               .text(p.user.name, tableLeft + colWidths[0] + 5, currentY + 8)
               .text(p.user.nim, tableLeft + colWidths[0] + colWidths[1] + 5, currentY + 8)
               .text(p.divisi, tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + 5, currentY + 8);

            // Status with color
            doc.fillColor(statusColor)
               .font('Helvetica-Bold')
               .text(p.status.charAt(0).toUpperCase() + p.status.slice(1), 
                    tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 5, currentY + 8);

            currentY += rowHeight;
        });

        // Add summary section with better styling
        doc.moveDown(2);
        
        // Summary box with better dimensions
        const summaryY = doc.y;
        const summaryHeight = 140; // Increased height for better spacing
        doc.rect(40, summaryY, 515, summaryHeight)
           .fill('#f0f9ff')
           .stroke('#0ea5e9');

        // Summary title with better positioning
        doc.fontSize(16)
           .font('Helvetica-Bold')
           .fillColor('#0c4a6e')
           .text('Ringkasan Statistik', 55, summaryY + 15);

        // Add separator line under title
        doc.moveTo(55, summaryY + 35)
           .lineTo(535, summaryY + 35)
           .stroke('#0ea5e9');

        // Total Pendaftar in table format
        const totalTableY = summaryY + 45;
        const totalTableWidth = 200;
        const totalTableHeight = 25;
        
        // Total table background
        doc.rect(55, totalTableY, totalTableWidth, totalTableHeight)
           .fill('#ffffff')
           .stroke('#0ea5e9');

        // Total table header
        doc.rect(55, totalTableY, 80, totalTableHeight)
           .fill('#0ea5e9')
           .stroke('#0ea5e9');

        // Total label
        doc.fontSize(11)
           .font('Helvetica-Bold')
           .fillColor('white')
           .text('Total', 60, totalTableY + 7);

        // Total value
        doc.fontSize(12)
           .font('Helvetica-Bold')
           .fillColor('#1e293b')
           .text(pendaftar.length.toString(), 145, totalTableY + 7);

        // Count by status with better layout
        let statusY = summaryY + 85;
        let statusX = 55;
        const statusSpacing = 180; // Increased spacing between status items
        
        const statusCount = pendaftar.reduce((acc, p) => {
            acc[p.status] = (acc[p.status] || 0) + 1;
            return acc;
        }, {});

        Object.entries(statusCount).forEach(([status, count], index) => {
            // Move to next row if we exceed width
            if (statusX > 400) {
                statusX = 55;
                statusY += 30;
            }

            let statusColor = '#6b7280';
            if (status === 'diterima') statusColor = '#059669';
            else if (status === 'ditolak') statusColor = '#dc2626';
            else if (status === 'pending') statusColor = '#d97706';

            // Status table background
            const statusTableWidth = 150;
            const statusTableHeight = 20;
            
            doc.rect(statusX, statusY, statusTableWidth, statusTableHeight)
               .fill('#ffffff')
               .stroke(statusColor);

            // Status label background
            doc.rect(statusX, statusY, 70, statusTableHeight)
               .fill(statusColor)
               .stroke(statusColor);

            // Status label
            doc.fontSize(10)
               .font('Helvetica-Bold')
               .fillColor('white')
               .text(status.charAt(0).toUpperCase() + status.slice(1), statusX + 5, statusY + 5);

            // Status count
            doc.fontSize(11)
               .font('Helvetica-Bold')
               .fillColor(statusColor)
               .text(count.toString(), statusX + 80, statusY + 5);

            // Move to next column
            statusX += statusSpacing;
        });

        // Add footer with better spacing
        doc.moveDown(4);
        doc.fontSize(10)
           .font('Helvetica-Oblique')
           .fillColor('#9ca3af')
           .text('Dokumen ini dibuat secara otomatis oleh Sistem LEA', { align: 'center' });

        // Finalize PDF
        doc.end();

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
        req.flash('success_msg', 'Dokumen berhasil diterima!');
        res.redirect('/aslab/verifikasi');
    } catch (error) {
        console.error('Error accepting document:', error);
        req.flash('error_msg', 'Gagal menerima dokumen.');
        res.redirect('/aslab/verifikasi');
    }
};

export const tolakDokumen = async (req, res) => {
    try {
        await prisma.pendaftaran.update({
            where: { id: parseInt(req.params.id) },
            data: { status: 'ditolak' }
        });
        req.flash('success_msg', 'Dokumen berhasil ditolak!');
        res.redirect('/aslab/verifikasi');
    } catch (error) {
        console.error('Error rejecting document:', error);
        req.flash('error_msg', 'Gagal menolak dokumen.');
        res.redirect('/aslab/verifikasi');
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
        const path = await import('path');
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