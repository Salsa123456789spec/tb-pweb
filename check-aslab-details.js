import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAslabDetails() {
    try {
        const aslabUsers = await prisma.user.findMany({
            where: {
                role: 'asisten_lab'
            },
            select: {
                id: true,
                name: true,
                nim: true,
                no_aslab: true,
                email: true,
                role: true
            }
        });

        console.log('=== ASLAB USERS DETAILS ===');
        if (aslabUsers.length === 0) {
            console.log('Tidak ada user aslab di database');
        } else {
            aslabUsers.forEach((user, index) => {
                console.log(`${index + 1}. ID: ${user.id}`);
                console.log(`   Nama: ${user.name}`);
                console.log(`   NIM: ${user.nim || 'null'}`);
                console.log(`   No Aslab: ${user.no_aslab || 'null'}`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Role: ${user.role}`);
                console.log('---');
            });
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkAslabDetails(); 