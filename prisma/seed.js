import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // Membersihkan data lama secara berurutan untuk menghindari konflik relasi
    await prisma.komplainJadwal.deleteMany().catch(e => console.log("Ignoring delete error if table empty"));
    await prisma.jadwalWawancara.deleteMany().catch(e => console.log("Ignoring delete error if table empty"));
    // await prisma.pengumuman.deleteMany().catch(e => console.log("Ignoring delete error if table empty"));
    await prisma.pewawancara.deleteMany().catch(e => console.log("Ignoring delete error if table empty"));
    await prisma.pendaftaran.deleteMany().catch(e => console.log("Ignoring delete error if table empty"));
    await prisma.user.deleteMany({ where: { role: 'mahasiswa' } }).catch(e => console.log("Ignoring delete error if table empty"));
    
    // === DATA PEWAWANCARA ===
    console.log('Seeding pewawancara...');
    await prisma.pewawancara.createMany({
        data: [
            { nama: 'Rafi Asytar', kontak: '081111111111' },
            { nama: 'Astu', kontak: '082222222222' },
            { nama: 'Zhahra', kontak: '083333333333' },
            { nama: 'Sinta', kontak: '084444444444' },
            { nama: 'Ahmad', kontak: '085555555555' },
        ],
        skipDuplicates: true,
    });
    const allPewawancara = await prisma.pewawancara.findMany();
    const pewawancara1 = allPewawancara[0];

    // === DATA PENDAFTAR & DOKUMEN ===
    // Path file yang akan digunakan (pastikan file ini ada di public/uploads)
    const dummyPdfPath = 'uploads/1750407271136-1530-73-4737-1-10-20210728.pdf';

    // Pendaftar 1: Diterima
    const userRevin = await prisma.user.create({ data: { nim: '2311522022', name: 'Revin', email: 'revin@test.com', password: 'password123', role: 'mahasiswa' } });
    const pendaftaranRevin = await prisma.pendaftaran.create({
        data: {
            user_id: userRevin.id,
            divisi: 'Rumah Tangga', domisili: 'Padang', asal: 'SMA 1 Padang', nomor_whatsapp: '081234567890',
            CV_file: dummyPdfPath, KHS_file: dummyPdfPath, KRS_file: dummyPdfPath, surat_permohonan_file: dummyPdfPath,
            alasan: 'ingin belajar', pernyataan: true, status: 'diterima'
        }
    });

    // Pendaftar 2: Ditolak
    const userAldi = await prisma.user.create({ data: { nim: '2311521012', name: 'Aldi', email: 'aldi@test.com', password: 'password123', role: 'mahasiswa' } });
    await prisma.pendaftaran.create({
        data: {
            user_id: userAldi.id,
            divisi: 'Rumah Tangga', domisili: 'Payakumbuh', asal: 'SMA 2 Payakumbuh', nomor_whatsapp: '081234567891',
            CV_file: dummyPdfPath, KHS_file: dummyPdfPath, KRS_file: dummyPdfPath, surat_permohonan_file: dummyPdfPath,
            alasan: 'ingin pengalaman', pernyataan: true, status: 'ditolak'
        }
    });
    
    // Pendaftar 3: Diterima
    const userLevi = await prisma.user.create({ data: { nim: '2411521015', name: 'Levi', email: 'levi@test.com', password: 'password123', role: 'mahasiswa' } });
    await prisma.pendaftaran.create({
        data: {
            user_id: userLevi.id,
            divisi: 'Rumah Tangga', domisili: 'Bukittinggi', asal: 'SMA 3 Bukittinggi', nomor_whatsapp: '081234567892',
            CV_file: dummyPdfPath, KHS_file: dummyPdfPath, KRS_file: dummyPdfPath, surat_permohonan_file: dummyPdfPath,
            alasan: 'tertarik dengan LEA', pernyataan: true, status: 'diterima'
        }
    });

    // Pendaftar 4: Menunggu
    const userLuffy = await prisma.user.create({ data: { nim: '2411523031', name: 'Luffy', email: 'luffy@test.com', password: 'password123', role: 'mahasiswa' } });
    await prisma.pendaftaran.create({
        data: {
            user_id: userLuffy.id,
            divisi: 'Rumah Tangga', domisili: 'Solok', asal: 'SMA 4 Solok', nomor_whatsapp: '081234567893',
            CV_file: dummyPdfPath, KHS_file: dummyPdfPath, KRS_file: dummyPdfPath, surat_permohonan_file: dummyPdfPath,
            alasan: 'mencari tantangan', pernyataan: true, status: 'menunggu'
        }
    });
    
    // === DATA JADWAL WAWANCARA & KOMPLAIN ===
    const jadwalRevin = await prisma.jadwalWawancara.create({
        data: {
            pendaftaran_id: pendaftaranRevin.id,
            pewawancara_id: pewawancara1.id,
            tanggal: new Date('2025-07-15'),
            waktu: new Date('2025-07-15T10:00:00'),
            ruang: 'Ruang LAB EA',
        }
    });
    
    await prisma.komplainJadwal.create({
        data: {
            jadwal_id: jadwalRevin.id,
            alasan: 'Bentrok dengan jadwal ujian.',
            status: 'menunggu',
            tanggal_diajukan: new Date('2025-07-16'),
            waktu_diajukan: new Date('2025-07-16T14:00:00')
        }
    });

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
