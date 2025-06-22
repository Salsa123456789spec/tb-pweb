import puppeteer from 'puppeteer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const generatePDFTahap1 = async (req, res) => {
    try {
        console.log('Starting PDF generation for Tahap 1...');
        
        const pengumumanTahap1 = await prisma.pengumuman.findMany({
            where: {
                tahapan: 'tahap1',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        nim: true,
                    },
                },
                pendaftaran: {
                    select: {
                        domisili: true,
                        asal: true,
                        divisi: true,
                    },
                },
            },
            orderBy: {
                user: {
                    name: 'asc',
                },
            },
        });

        console.log(`Found ${pengumumanTahap1.length} records for Tahap 1`);

        const mappedPengumumanTahap1 = pengumumanTahap1.map(item => ({
            ...item,
            user: {
                ...item.user,
                nama_lengkap: item.user.name
            }
        }));

        console.log('Generating HTML content...');
        const htmlContent = generateHTMLContent('Hasil Tahap 1 - Verifikasi Berkas', mappedPengumumanTahap1);
        
        console.log('Generating PDF...');
        const pdfBuffer = await generatePDF(htmlContent);
        
        console.log(`PDF generated successfully, size: ${pdfBuffer.length} bytes`);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="hasil-tahap-1.pdf"');
        res.setHeader('Content-Length', pdfBuffer.length);
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF Tahap 1:', error);
        res.status(500).send(`Terjadi kesalahan saat generate PDF: ${error.message}`);
    }
};

export const generatePDFTahap2 = async (req, res) => {
    try {
        console.log('Starting PDF generation for Tahap 2...');
        
        const pengumumanTahap2 = await prisma.pengumuman.findMany({
            where: {
                tahapan: 'tahap2',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        nim: true,
                    },
                },
                pendaftaran: {
                    select: {
                        domisili: true,
                        asal: true,
                        divisi: true,
                    },
                },
            },
            orderBy: {
                user: {
                    name: 'asc',
                },
            },
        });

        console.log(`Found ${pengumumanTahap2.length} records for Tahap 2`);

        const mappedPengumumanTahap2 = pengumumanTahap2.map(item => ({
            ...item,
            user: {
                ...item.user,
                nama_lengkap: item.user.name
            }
        }));

        console.log('Generating HTML content...');
        const htmlContent = generateHTMLContent('Hasil Tahap 2 - Wawancara', mappedPengumumanTahap2);
        
        console.log('Generating PDF...');
        const pdfBuffer = await generatePDF(htmlContent);
        
        console.log(`PDF generated successfully, size: ${pdfBuffer.length} bytes`);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="hasil-tahap-2.pdf"');
        res.setHeader('Content-Length', pdfBuffer.length);
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF Tahap 2:', error);
        res.status(500).send(`Terjadi kesalahan saat generate PDF: ${error.message}`);
    }
};

export const generatePDFTahap3 = async (req, res) => {
    try {
        console.log('Starting PDF generation for Tahap 3...');
        
        const pengumumanTahap3 = await prisma.pengumuman.findMany({
            where: {
                tahapan: 'tahap3',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        nim: true,
                    },
                },
                pendaftaran: {
                    select: {
                        domisili: true,
                        asal: true,
                        divisi: true,
                    },
                },
            },
            orderBy: {
                user: {
                    name: 'asc',
                },
            },
        });

        console.log(`Found ${pengumumanTahap3.length} records for Tahap 3`);

        const mappedPengumumanTahap3 = pengumumanTahap3.map(item => ({
            ...item,
            user: {
                ...item.user,
                nama_lengkap: item.user.name
            }
        }));

        console.log('Generating HTML content...');
        const htmlContent = generateHTMLContent('Hasil Tahap 3 - Kelulusan Magang', mappedPengumumanTahap3);
        
        console.log('Generating PDF...');
        const pdfBuffer = await generatePDF(htmlContent);
        
        console.log(`PDF generated successfully, size: ${pdfBuffer.length} bytes`);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="hasil-tahap-3.pdf"');
        res.setHeader('Content-Length', pdfBuffer.length);
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF Tahap 3:', error);
        res.status(500).send(`Terjadi kesalahan saat generate PDF: ${error.message}`);
    }
};

export const generatePDFKelulusan = async (req, res) => {
    try {
        console.log('Starting PDF generation for Kelulusan...');
        
        // Ambil hanya pengumuman untuk tahap 3 (yang sudah lulus)
        const pengumumanTahap3 = await prisma.pengumuman.findMany({
            where: {
                tahapan: 'tahap3'
            },
            include: {
                user: {
                    select: {
                        name: true,
                        nim: true
                    }
                },
                pendaftaran: {
                    select: {
                        divisi: true
                    }
                }
            }
        });

        // Format data untuk rekap kelulusan
        const rekapKelulusan = pengumumanTahap3.map(p => ({
            nim: p.user.nim || 'N/A',
            nama: p.user.name,
            divisi: p.pendaftaran.divisi,
            tahapan: 'tahap3',
            status_kelulusan: 'LULUS',
            keterangan: 'Lulus magang'
        }));

        // Urutkan berdasarkan nama
        rekapKelulusan.sort((a, b) => a.nama.localeCompare(b.nama));

        // Hitung statistik
        const totalMahasiswa = rekapKelulusan.length;
        const totalLulus = rekapKelulusan.length; // Semua yang ada di tahap 3 adalah lulus
        const totalTidakLulus = 0; // Tidak ada yang tidak lulus karena hanya menampilkan tahap 3
        const persentaseLulus = totalMahasiswa > 0 ? 100 : 0; // 100% karena hanya menampilkan yang lulus

        console.log(`Found ${rekapKelulusan.length} records for Kelulusan`);

        console.log('Generating HTML content...');
        const htmlContent = generateKelulusanHTMLContent(rekapKelulusan, {
            totalMahasiswa,
            totalLulus,
            totalTidakLulus,
            persentaseLulus
        });
        
        console.log('Generating PDF...');
        const pdfBuffer = await generatePDF(htmlContent);
        
        console.log(`PDF generated successfully, size: ${pdfBuffer.length} bytes`);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="rekap-kelulusan.pdf"');
        res.setHeader('Content-Length', pdfBuffer.length);
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF Kelulusan:', error);
        res.status(500).send(`Terjadi kesalahan saat generate PDF: ${error.message}`);
    }
};

export const generatePDFAbsensi = async (req, res) => {
    try {
        console.log('Starting PDF generation for Absensi...');
        
        // Ambil semua pendaftar yang diterima
        const pendaftar = await prisma.pendaftaran.findMany({
            where: {
                status: 'diterima'
            },
            include: {
                user: {
                    select: {
                        name: true,
                        nim: true
                    }
                },
                kehadiran: true
            }
        });

        // Hitung rekap absensi untuk setiap mahasiswa
        const rekapData = pendaftar.map(p => {
            const kehadiran = p.kehadiran;
            const jumlahHadir = kehadiran.filter(k => k.status === 'Hadir').length;
            const jumlahTidakHadir = kehadiran.filter(k => k.status === 'Tidak_Hadir').length;
            
            return {
                nim: p.user.nim || 'N/A',
                nama: p.user.name,
                jumlah_hadir: jumlahHadir,
                jumlah_tidak_hadir: jumlahTidakHadir,
                total_pertemuan: kehadiran.length,
                persentase_kehadiran: kehadiran.length > 0 ? Math.round((jumlahHadir / kehadiran.length) * 100) : 0
            };
        });

        // Urutkan berdasarkan persentase kehadiran (descending)
        rekapData.sort((a, b) => b.persentase_kehadiran - a.persentase_kehadiran);

        // Hitung statistik
        const totalMahasiswa = rekapData.length;
        const totalHadir = rekapData.reduce((sum, item) => sum + item.jumlah_hadir, 0);
        const totalTidakHadir = rekapData.reduce((sum, item) => sum + item.jumlah_tidak_hadir, 0);
        const rataRataKehadiran = totalMahasiswa > 0 ? Math.round(rekapData.reduce((sum, item) => sum + item.persentase_kehadiran, 0) / totalMahasiswa) : 0;

        console.log(`Found ${rekapData.length} records for Absensi`);

        console.log('Generating HTML content...');
        const htmlContent = generateAbsensiHTMLContent(rekapData, {
            totalMahasiswa,
            totalHadir,
            totalTidakHadir,
            rataRataKehadiran
        });
        
        console.log('Generating PDF...');
        const pdfBuffer = await generatePDF(htmlContent);
        
        console.log(`PDF generated successfully, size: ${pdfBuffer.length} bytes`);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="rekap-absensi.pdf"');
        res.setHeader('Content-Length', pdfBuffer.length);
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF Absensi:', error);
        res.status(500).send(`Terjadi kesalahan saat generate PDF: ${error.message}`);
    }
};

export const generatePDFPendaftar = async (req, res) => {
    try {
        console.log('Starting PDF generation for Pendaftar...');
        
        // Ambil semua pendaftar
        const pendaftar = await prisma.pendaftaran.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        nim: true,
                        email: true
                    }
                }
            },
            orderBy: {
                id: 'desc'
            }
        });

        // Format data untuk ditampilkan
        const formattedPendaftar = pendaftar.map(p => ({
            id: p.id,
            nim: p.user.nim || 'N/A',
            nama: p.user.name,
            email: p.user.email,
            no_hp: p.nomor_whatsapp,
            domisili: p.domisili,
            asal: p.asal,
            divisi: p.divisi,
            status: p.status,
            tanggal_daftar: p.createdAt || new Date()
        }));

        // Hitung statistik
        const totalPendaftar = formattedPendaftar.length;
        const totalMenunggu = formattedPendaftar.filter(p => p.status === 'menunggu').length;
        const totalDiterima = formattedPendaftar.filter(p => p.status === 'diterima').length;
        const totalDitolak = formattedPendaftar.filter(p => p.status === 'ditolak').length;

        console.log(`Found ${formattedPendaftar.length} records for Pendaftar`);

        console.log('Generating HTML content...');
        const htmlContent = generatePendaftarHTMLContent(formattedPendaftar, {
            totalPendaftar,
            totalMenunggu,
            totalDiterima,
            totalDitolak
        });
        
        console.log('Generating PDF...');
        const pdfBuffer = await generatePDF(htmlContent);
        
        console.log(`PDF generated successfully, size: ${pdfBuffer.length} bytes`);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="rekap-pendaftar.pdf"');
        res.setHeader('Content-Length', pdfBuffer.length);
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF Pendaftar:', error);
        res.status(500).send(`Terjadi kesalahan saat generate PDF: ${error.message}`);
    }
};

function generateHTMLContent(title, data) {
    const currentDate = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                color: #333;
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 2px solid #2563eb;
                padding-bottom: 20px;
            }
            .header h1 {
                color: #1e40af;
                margin: 0 0 10px 0;
                font-size: 24px;
            }
            .header p {
                color: #6b7280;
                margin: 0;
                font-size: 14px;
            }
            .info {
                background-color: #f3f4f6;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
            }
            .info p {
                margin: 5px 0;
                font-size: 14px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
                font-size: 12px;
            }
            th {
                background-color: #1f2937;
                color: white;
                padding: 12px 8px;
                text-align: left;
                font-weight: bold;
            }
            td {
                padding: 10px 8px;
                border-bottom: 1px solid #e5e7eb;
            }
            tr:nth-child(even) {
                background-color: #f9fafb;
            }
            tr:hover {
                background-color: #f3f4f6;
            }
            .status {
                background-color: #10b981;
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 11px;
                font-weight: bold;
            }
            .footer {
                margin-top: 30px;
                text-align: center;
                font-size: 12px;
                color: #6b7280;
                border-top: 1px solid #e5e7eb;
                padding-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>${title}</h1>
            <p>Program Magang Enterprise Application Development</p>
        </div>
        
        <div class="info">
            <p><strong>Tanggal Generate:</strong> ${currentDate}</p>
            <p><strong>Total Peserta:</strong> ${data.length} orang</p>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama Lengkap</th>
                    <th>Divisi</th>
                    <th>NIM</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${data.map((item, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.user.nama_lengkap}</td>
                        <td>${item.pendaftaran.divisi}</td>
                        <td>${item.user.nim || 'Tidak tersedia'}</td>
                        <td><span class="status">LOLOS</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        
        <div class="footer">
            <p>Dokumen ini digenerate secara otomatis pada ${currentDate}</p>
            <p>Sistem Informasi Magang Enterprise Application Development</p>
        </div>
    </body>
    </html>
    `;
}

function generateKelulusanHTMLContent(data, statistik) {
    const currentDate = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Rekapitulasi Kelulusan</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                color: #333;
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 2px solid #2563eb;
                padding-bottom: 20px;
            }
            .header h1 {
                color: #1e40af;
                margin: 0 0 10px 0;
                font-size: 24px;
            }
            .header p {
                color: #6b7280;
                margin: 0;
                font-size: 14px;
            }
            .info {
                background-color: #f3f4f6;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
            }
            .info p {
                margin: 5px 0;
                font-size: 14px;
            }
            .statistik {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
                flex-wrap: wrap;
            }
            .stat-item {
                background-color: #ffffff;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                padding: 15px;
                text-align: center;
                flex: 1;
                margin: 0 5px;
                min-width: 120px;
            }
            .stat-item h3 {
                margin: 0 0 5px 0;
                font-size: 12px;
                color: #6b7280;
            }
            .stat-item p {
                margin: 0;
                font-size: 18px;
                font-weight: bold;
                color: #1f2937;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
                font-size: 11px;
            }
            th {
                background-color: #1f2937;
                color: white;
                padding: 10px 6px;
                text-align: left;
                font-weight: bold;
            }
            td {
                padding: 8px 6px;
                border-bottom: 1px solid #e5e7eb;
            }
            tr:nth-child(even) {
                background-color: #f9fafb;
            }
            .status-lulus {
                background-color: #10b981;
                color: white;
                padding: 3px 6px;
                border-radius: 4px;
                font-size: 10px;
                font-weight: bold;
            }
            .divisi {
                background-color: #6366f1;
                color: white;
                padding: 2px 4px;
                border-radius: 3px;
                font-size: 9px;
            }
            .footer {
                margin-top: 30px;
                text-align: center;
                font-size: 12px;
                color: #6b7280;
                border-top: 1px solid #e5e7eb;
                padding-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Rekapitulasi Kelulusan</h1>
            <p>Program Magang Enterprise Application Development</p>
        </div>
        
        <div class="info">
            <p><strong>Tanggal Generate:</strong> ${currentDate}</p>
            <p><strong>Total Mahasiswa:</strong> ${statistik.totalMahasiswa} orang</p>
        </div>

        <div class="statistik">
            <div class="stat-item">
                <h3>Total Mahasiswa</h3>
                <p>${statistik.totalMahasiswa}</p>
            </div>
            <div class="stat-item">
                <h3>Lulus</h3>
                <p style="color: #10b981;">${statistik.totalLulus}</p>
            </div>
            <div class="stat-item">
                <h3>Tidak Lulus</h3>
                <p style="color: #ef4444;">${statistik.totalTidakLulus}</p>
            </div>
            <div class="stat-item">
                <h3>Persentase Lulus</h3>
                <p style="color: #2563eb;">${statistik.persentaseLulus}%</p>
            </div>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>NIM</th>
                    <th>Nama</th>
                    <th>Divisi</th>
                    <th>Status</th>
                    <th>Keterangan</th>
                </tr>
            </thead>
            <tbody>
                ${data.map((item, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.nim}</td>
                        <td>${item.nama}</td>
                        <td>
                            <span class="divisi">${item.divisi}</span>
                        </td>
                        <td>
                            <span class="status-lulus">LULUS</span>
                        </td>
                        <td>${item.keterangan}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        
        <div class="footer">
            <p>Dokumen ini digenerate secara otomatis pada ${currentDate}</p>
            <p>Sistem Informasi Magang Enterprise Application Development</p>
        </div>
    </body>
    </html>
    `;
}

function generateAbsensiHTMLContent(data, statistik) {
    const currentDate = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Rekapitulasi Absensi</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                color: #333;
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 2px solid #059669;
                padding-bottom: 20px;
            }
            .header h1 {
                color: #047857;
                margin: 0 0 10px 0;
                font-size: 24px;
            }
            .header p {
                color: #6b7280;
                margin: 0;
                font-size: 14px;
            }
            .info {
                background-color: #f3f4f6;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
            }
            .info p {
                margin: 5px 0;
                font-size: 14px;
            }
            .statistik {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
                flex-wrap: wrap;
            }
            .stat-item {
                background-color: #ffffff;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                padding: 15px;
                text-align: center;
                flex: 1;
                margin: 0 5px;
                min-width: 120px;
            }
            .stat-item h3 {
                margin: 0 0 5px 0;
                font-size: 12px;
                color: #6b7280;
            }
            .stat-item p {
                margin: 0;
                font-size: 18px;
                font-weight: bold;
                color: #1f2937;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
                font-size: 11px;
            }
            th {
                background-color: #047857;
                color: white;
                padding: 10px 6px;
                text-align: left;
                font-weight: bold;
            }
            td {
                padding: 8px 6px;
                border-bottom: 1px solid #e5e7eb;
            }
            tr:nth-child(even) {
                background-color: #f9fafb;
            }
            .persentase-tinggi {
                color: #059669;
                font-weight: bold;
            }
            .persentase-sedang {
                color: #d97706;
                font-weight: bold;
            }
            .persentase-rendah {
                color: #dc2626;
                font-weight: bold;
            }
            .footer {
                margin-top: 30px;
                text-align: center;
                font-size: 12px;
                color: #6b7280;
                border-top: 1px solid #e5e7eb;
                padding-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Rekapitulasi Absensi</h1>
            <p>Program Magang Enterprise Application Development</p>
        </div>
        
        <div class="info">
            <p><strong>Tanggal Generate:</strong> ${currentDate}</p>
            <p><strong>Total Mahasiswa:</strong> ${statistik.totalMahasiswa} orang</p>
        </div>

        <div class="statistik">
            <div class="stat-item">
                <h3>Total Mahasiswa</h3>
                <p>${statistik.totalMahasiswa}</p>
            </div>
            <div class="stat-item">
                <h3>Total Hadir</h3>
                <p style="color: #059669;">${statistik.totalHadir}</p>
            </div>
            <div class="stat-item">
                <h3>Total Tidak Hadir</h3>
                <p style="color: #dc2626;">${statistik.totalTidakHadir}</p>
            </div>
            <div class="stat-item">
                <h3>Rata-rata Kehadiran</h3>
                <p style="color: #047857;">${statistik.rataRataKehadiran}%</p>
            </div>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>NIM</th>
                    <th>Nama</th>
                    <th>Hadir</th>
                    <th>Tidak Hadir</th>
                    <th>Total Pertemuan</th>
                    <th>Persentase</th>
                </tr>
            </thead>
            <tbody>
                ${data.map((item, index) => {
                    let persentaseClass = '';
                    if (item.persentase_kehadiran >= 80) {
                        persentaseClass = 'persentase-tinggi';
                    } else if (item.persentase_kehadiran >= 60) {
                        persentaseClass = 'persentase-sedang';
                    } else {
                        persentaseClass = 'persentase-rendah';
                    }
                    
                    return `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${item.nim}</td>
                            <td>${item.nama}</td>
                            <td style="color: #059669; font-weight: bold; text-align: center;">${item.jumlah_hadir}</td>
                            <td style="color: #dc2626; font-weight: bold; text-align: center;">${item.jumlah_tidak_hadir}</td>
                            <td style="color: #6b7280; font-weight: bold; text-align: center;">${item.total_pertemuan}</td>
                            <td class="${persentaseClass}" style="text-align: center;">${item.persentase_kehadiran}%</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
        
        <div class="footer">
            <p>Dokumen ini digenerate secara otomatis pada ${currentDate}</p>
            <p>Sistem Informasi Magang Enterprise Application Development</p>
        </div>
    </body>
    </html>
    `;
}

function generatePendaftarHTMLContent(data, statistik) {
    const currentDate = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Rekap Data Pendaftar</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                color: #333;
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 2px solid #059669;
                padding-bottom: 20px;
            }
            .header h1 {
                color: #047857;
                margin: 0 0 10px 0;
                font-size: 24px;
            }
            .header p {
                color: #6b7280;
                margin: 0;
                font-size: 14px;
            }
            .info {
                background-color: #f3f4f6;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
            }
            .info p {
                margin: 5px 0;
                font-size: 14px;
            }
            .statistik {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
                flex-wrap: wrap;
            }
            .stat-item {
                background-color: #ffffff;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                padding: 15px;
                text-align: center;
                flex: 1;
                margin: 0 5px;
                min-width: 120px;
            }
            .stat-item h3 {
                margin: 0 0 5px 0;
                font-size: 12px;
                color: #6b7280;
            }
            .stat-item p {
                margin: 0;
                font-size: 18px;
                font-weight: bold;
                color: #1f2937;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
                font-size: 10px;
            }
            th {
                background-color: #047857;
                color: white;
                padding: 8px 4px;
                text-align: left;
                font-weight: bold;
            }
            td {
                padding: 6px 4px;
                border-bottom: 1px solid #e5e7eb;
            }
            tr:nth-child(even) {
                background-color: #f9fafb;
            }
            .status-menunggu {
                background-color: #f59e0b;
                color: white;
                padding: 2px 4px;
                border-radius: 3px;
                font-size: 8px;
            }
            .status-diterima {
                background-color: #10b981;
                color: white;
                padding: 2px 4px;
                border-radius: 3px;
                font-size: 8px;
            }
            .status-ditolak {
                background-color: #ef4444;
                color: white;
                padding: 2px 4px;
                border-radius: 3px;
                font-size: 8px;
            }
            .footer {
                margin-top: 30px;
                text-align: center;
                font-size: 12px;
                color: #6b7280;
                border-top: 1px solid #e5e7eb;
                padding-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Rekap Data Pendaftar</h1>
            <p>Program Magang Enterprise Application Development</p>
        </div>
        
        <div class="info">
            <p><strong>Tanggal Generate:</strong> ${currentDate}</p>
            <p><strong>Total Pendaftar:</strong> ${statistik.totalPendaftar} orang</p>
        </div>

        <div class="statistik">
            <div class="stat-item">
                <h3>Total Pendaftar</h3>
                <p>${statistik.totalPendaftar}</p>
            </div>
            <div class="stat-item">
                <h3>Menunggu</h3>
                <p style="color: #f59e0b;">${statistik.totalMenunggu}</p>
            </div>
            <div class="stat-item">
                <h3>Diterima</h3>
                <p style="color: #10b981;">${statistik.totalDiterima}</p>
            </div>
            <div class="stat-item">
                <h3>Ditolak</h3>
                <p style="color: #ef4444;">${statistik.totalDitolak}</p>
            </div>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>NIM</th>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>No HP</th>
                    <th>Divisi</th>
                    <th>Status</th>
                    <th>Tanggal Daftar</th>
                </tr>
            </thead>
            <tbody>
                ${data.map((item, index) => {
                    let statusClass = '';
                    let statusText = '';
                    switch(item.status) {
                        case 'menunggu':
                            statusClass = 'status-menunggu';
                            statusText = 'Menunggu';
                            break;
                        case 'diterima':
                            statusClass = 'status-diterima';
                            statusText = 'Diterima';
                            break;
                        case 'ditolak':
                            statusClass = 'status-ditolak';
                            statusText = 'Ditolak';
                            break;
                        default:
                            statusClass = 'status-menunggu';
                            statusText = item.status;
                    }
                    
                    const tanggalDaftar = new Date(item.tanggal_daftar).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    });
                    
                    return `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${item.nim}</td>
                            <td>${item.nama}</td>
                            <td>${item.email}</td>
                            <td>${item.no_hp || '-'}</td>
                            <td>${item.divisi}</td>
                            <td>
                                <span class="${statusClass}">${statusText}</span>
                            </td>
                            <td>${tanggalDaftar}</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
        
        <div class="footer">
            <p>Dokumen ini digenerate secara otomatis pada ${currentDate}</p>
            <p>Sistem Informasi Magang Enterprise Application Development</p>
        </div>
    </body>
    </html>
    `;
}

async function generatePDF(htmlContent) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: {
            top: '20mm',
            right: '20mm',
            bottom: '20mm',
            left: '20mm'
        },
        printBackground: true
    });
    
    await browser.close();
    return pdfBuffer;
}

export default {
    generatePDFTahap1,
    generatePDFTahap2,
    generatePDFTahap3,
    generatePDFKelulusan,
    generatePDFAbsensi,
    generatePDFPendaftar
}; 