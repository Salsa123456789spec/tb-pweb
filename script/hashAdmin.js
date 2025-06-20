// salsa123456789spec/tb-pweb/tb-pweb-vin/script/hashAdmin.js
import bcrypt from 'bcryptjs';

const hashPassword = async () => {
    const passwordPolos = 'aslab123'; // <-- Ganti dengan password yang Anda mau
    const hashHasil = await bcrypt.hash(passwordPolos, 10);

    console.log(`Password Polos: ${passwordPolos}`);
    console.log(`==> HASH UNTUK DATABASE (COPY INI): ${hashHasil}`);
};

hashPassword();