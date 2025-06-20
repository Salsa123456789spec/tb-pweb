import bcrypt from 'bcryptjs';

const hashPassword = async () => {
    const hashed = await bcrypt.hash('sayaadmin', 10);
    console.log('Hashed password:', hashed);
};

hashPassword();
