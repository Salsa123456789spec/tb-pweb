import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Cek apakah sudah ada admin
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'admin' }
  });

  if (existingAdmin) {
    console.log('✅ Admin sudah ada, seed dilewati.');
  } else {
    const hashedPassword = await bcrypt.hash('akuadmin', 10);

    await prisma.user.create({
      data: {
        name: 'Thomas Nobel',
        email: 'thomas@gmail.com',
        password: hashedPassword,
        role: 'admin',
        no_aslab: 'LEA004',
        nim: '-' // placeholder jika pakai field wajib
      }
    });

    console.log('✅ Super Admin berhasil ditambahkan!');
  }

  // Tambahkan beberapa user mahasiswa untuk testing
  const mahasiswaUsers = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      nim: '12345678',
      role: 'mahasiswa'
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      nim: '87654321',
      role: 'mahasiswa'
    },
    {
      name: 'Bob Johnson',
      email: 'bob@example.com',
      nim: '11223344',
      role: 'mahasiswa'
    }
  ];

  for (const userData of mahasiswaUsers) {
    const existingUser = await prisma.user.findFirst({
      where: { email: userData.email }
    });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      const user = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword
        }
      });

      // Buat pendaftaran untuk user ini
      const pendaftaran = await prisma.pendaftaran.create({
        data: {
          user_id: user.id,
          domisili: 'Jakarta',
          asal: 'Universitas Indonesia',
          nomor_whatsapp: '081234567890',
          divisi: 'Frontend Development',
          CV_file: 'cv.pdf',
          KRS_file: 'krs.pdf',
          KHS_file: 'khs.pdf',
          surat_permohonan_file: 'surat.pdf',
          alasan: 'Ingin belajar pengembangan aplikasi enterprise',
          pernyataan: true,
          status: 'diterima'
        }
      });

      // Buat pengumuman untuk tahap 1
      await prisma.pengumuman.create({
        data: {
          user_id: user.id,
          pendaftaran_id: pendaftaran.id,
          tahapan: 'tahap1'
        }
      });

      console.log(`✅ User ${userData.name} dan pengumuman tahap 1 berhasil ditambahkan!`);
    }
  }

  // Tambahkan data pewawancara
  const pewawancaraList = [
    { nama: 'Dr. John Smith', kontak: 'john.smith@example.com' },
    { nama: 'Jane Doe, M.Sc.', kontak: '081234567891' },
  ];

  for (const pewawancaraData of pewawancaraList) {
    const existingPewawancara = await prisma.pewawancara.findFirst({
        where: { nama: pewawancaraData.nama },
    });
    if (!existingPewawancara) {
        await prisma.pewawancara.create({ data: pewawancaraData });
        console.log(`✅ Pewawancara ${pewawancaraData.nama} berhasil ditambahkan!`);
    }
  }

  // Hubungkan jadwal dengan pewawancara
  const jadwalPertama = await prisma.jadwalWawancara.findFirst();
  const pewawancaraPertama = await prisma.pewawancara.findFirst();

  if (jadwalPertama && pewawancaraPertama && !jadwalPertama.pewawancara_id) {
    await prisma.jadwalWawancara.update({
      where: { id: jadwalPertama.id },
      data: { pewawancara_id: pewawancaraPertama.id },
    });
    console.log(`✅ Jadwal Wawancara berhasil dihubungkan dengan ${pewawancaraPertama.nama}`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Gagal seed:', e);
  })
  .finally(() => prisma.$disconnect());
