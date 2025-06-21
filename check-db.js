import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Checking database...\n');

    // Check users
    const users = await prisma.user.findMany({
      include: {
        pendaftaran: {
          include: {
            feedbackKuisioner: true
          }
        }
      }
    });

    console.log('👥 Users found:', users.length);
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
      if (user.pendaftaran) {
        console.log(`  📝 Pendaftaran: ${user.pendaftaran.status}`);
        if (user.pendaftaran.feedbackKuisioner) {
          console.log(`  ✅ Kuisioner: Filled`);
        } else {
          console.log(`  ❌ Kuisioner: Not filled`);
        }
      } else {
        console.log(`  ❌ No pendaftaran`);
      }
    });

    // Check if user Revin needs a pendaftaran
    const revin = users.find(u => u.email === 'asdasda@gmail.com');
    if (revin && !revin.pendaftaran) {
      console.log('\n📝 Creating pendaftaran for Revin...');
      
      const newPendaftaran = await prisma.pendaftaran.create({
        data: {
          user_id: revin.id,
          status: 'menunggu',
          // Add other required fields if needed
          created_at: new Date(),
          updated_at: new Date()
        }
      });
      
      console.log('✅ Pendaftaran created for Revin:', newPendaftaran);
    }

    // Check pendaftaran table
    const pendaftaran = await prisma.pendaftaran.findMany({
      include: {
        user: true,
        feedbackKuisioner: true
      }
    });

    console.log('\n📋 Pendaftaran entries:', pendaftaran.length);
    pendaftaran.forEach(p => {
      console.log(`- User: ${p.user.name} - Status: ${p.status}`);
      if (p.feedbackKuisioner) {
        console.log(`  ✅ Has kuisioner feedback`);
      } else {
        console.log(`  ❌ No kuisioner feedback`);
      }
    });

    // Check feedback kuisioner
    const feedback = await prisma.feedbackKuisioner.findMany({
      include: {
        pendaftaran: {
          include: {
            user: true
          }
        }
      }
    });

    console.log('\n📊 Feedback Kuisioner entries:', feedback.length);
    feedback.forEach(f => {
      console.log(`- User: ${f.pendaftaran.user.name}`);
      console.log(`  Kejelasan Soal: ${f.kejelasan_soal}`);
      console.log(`  Alokasi Waktu: ${f.alokasi_waktu}`);
      console.log(`  Kondisi Ruangan: ${f.kondisi_ruangan}`);
      console.log(`  Profesionalisme: ${f.profesionalisme_pewawancara}`);
      console.log(`  Bimbingan: ${f.bimbingan_arahan}`);
      console.log(`  Supervisi: ${f.supervisi}`);
      console.log(`  Kualitas Mentoring: ${f.kualitas_mentoring}`);
      console.log(`  Proses Keseluruhan: ${f.proses_keseluruhan}`);
      console.log(`  Saran: ${f.saran}`);
      console.log(`  Kesan: ${f.kesan_pesan}`);
    });

  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase(); 