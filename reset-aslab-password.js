import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function resetAslabPassword() {
    try {
        // Hash password baru
        const hashedPassword = await bcrypt.hash('aslab123', 10);
        
        // Update password user aslab
        const updatedUser = await prisma.user.update({
            where: {
                no_aslab: 'ASLAB001'
            },
            data: {
                password: hashedPassword
            }
        });

        console.log('=== PASSWORD RESET SUCCESS ===');
        console.log(`User: ${updatedUser.name}`);
        console.log(`No Aslab: ${updatedUser.no_aslab}`);
        console.log(`Email: ${updatedUser.email}`);
        console.log('\n=== LOGIN CREDENTIALS ===');
        console.log('No Aslab: ASLAB001');
        console.log('Password: aslab123');

    } catch (error) {
        console.error('Error resetting password:', error);
    } finally {
        await prisma.$disconnect();
    }
}

resetAslabPassword(); 