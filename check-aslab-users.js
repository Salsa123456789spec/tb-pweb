import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAslabUsers() {
    try {
        const aslabUsers = await prisma.user.findMany({
            where: {
                role: 'asisten_lab'
            },
            select: {
                id: true,
                name: true,
                nim: true,
                email: true,
                role: true
            }
        });

        console.log('=== ASLAB USERS ===');
        if (aslabUsers.length === 0) {
            console.log('Tidak ada user aslab di database');
        } else {
            aslabUsers.forEach((user, index) => {
                console.log(`${index + 1}. ID: ${user.id}`);
                console.log(`   Nama: ${user.name}`);
                console.log(`   NIM: ${user.nim}`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Role: ${user.role}`);
                console.log('---');
            });
        }

        // Cek semua user untuk referensi
        const allUsers = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                nim: true,
                email: true,
                role: true
            }
        });

        console.log('\n=== ALL USERS ===');
        allUsers.forEach((user, index) => {
            console.log(`${index + 1}. ${user.name} (${user.nim}) - ${user.role}`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkAslabUsers(); 