import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAslabUser() {
    try {
        // Hash password
        const hashedPassword = await bcrypt.hash('aslab123', 10);
        
        // Create aslab user
        const aslabUser = await prisma.user.create({
            data: {
                name: 'Aslab Admin',
                no_aslab: 'ASLAB001',
                email: 'aslab@test.com',
                password: hashedPassword,
                role: 'asisten_lab'
            }
        });

        console.log('=== ASLAB USER CREATED ===');
        console.log(`ID: ${aslabUser.id}`);
        console.log(`Nama: ${aslabUser.name}`);
        console.log(`No Aslab: ${aslabUser.no_aslab}`);
        console.log(`Email: ${aslabUser.email}`);
        console.log(`Role: ${aslabUser.role}`);
        console.log('\n=== LOGIN CREDENTIALS ===');
        console.log('No Aslab: ASLAB001');
        console.log('Password: aslab123');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAslabUser(); 