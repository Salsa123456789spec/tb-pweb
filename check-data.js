import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
    try {
        console.log('=== CHECKING DATABASE DATA ===\n');
        
        // Check pendaftar with 'diterima' status
        const pendaftarDiterima = await prisma.pendaftaran.findMany({
            where: {
                status: 'diterima'
            },
            include: {
                user: true
            }
        });
        
        console.log('Pendaftar dengan status "diterima":', pendaftarDiterima.length);
        pendaftarDiterima.forEach((p, index) => {
            console.log(`${index + 1}. ${p.user.name} (${p.user.nim})`);
        });
        
        // Check pewawancara
        const pewawancara = await prisma.pewawancara.findMany();
        console.log('\nPewawancara:', pewawancara.length);
        pewawancara.forEach((p, index) => {
            console.log(`${index + 1}. ${p.nama} - ${p.kontak}`);
        });
        
        // Check jadwal wawancara
        const jadwalWawancara = await prisma.jadwalwawancara.findMany({
            include: {
                pendaftaran: {
                    include: {
                        user: true
                    }
                },
                pewawancara: true
            }
        });
        
        console.log('\nJadwal Wawancara:', jadwalWawancara.length);
        jadwalWawancara.forEach((j, index) => {
            console.log(`${index + 1}. ${j.pendaftaran.user.name} - ${j.pewawancara?.nama || 'N/A'}`);
        });
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkData(); 