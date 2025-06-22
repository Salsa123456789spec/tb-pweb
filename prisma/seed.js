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
    return;
  }

  const hashedPassword = await bcrypt.hash('akuadmin', 10); // Ganti dengan password yang aman

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

main()
  .catch((e) => {
    console.error('❌ Gagal seed:', e);
  })
  .finally(() => prisma.$disconnect());
