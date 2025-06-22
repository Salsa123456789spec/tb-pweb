# Sistem Pendaftaran Aslab

Aplikasi web untuk mengelola pendaftaran asisten laboratorium dengan fitur verifikasi, penjadwalan wawancara, dan pengumuman.

## 🚀 Fitur Utama

- **Dashboard Aslab**: Manajemen data pendaftar
- **Verifikasi Dokumen**: Review dan approval dokumen pendaftar
- **Penjadwalan Wawancara**: Atur jadwal wawancara dengan pewawancara
- **Input Data Pewawancara**: Kelola data pewawancara
- **Pengumuman**: Buat pengumuman hasil seleksi
- **Export PDF**: Export data ke format PDF

## 📋 Prerequisites

Sebelum menjalankan aplikasi, pastikan sudah terinstall:

- **Node.js** (versi 16 atau lebih baru)
- **MySQL** (versi 8.0 atau lebih baru)
- **npm** atau **yarn**

## 🛠️ Installation & Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd tb-pweb-zhahra
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database

#### A. Buat Database MySQL
```sql
CREATE DATABASE nama_database;
```

#### B. Konfigurasi Environment Variables
1. Copy file `env.example` menjadi `.env`
```bash
cp env.example .env
```

2. Edit file `.env` dengan konfigurasi database kamu:
```env
DATABASE_URL="mysql://username:password@localhost:3306/nama_database"
SESSION_SECRET="rahasia_session_anda"
PORT=3000
NODE_ENV=development
```

**Ganti dengan data kamu:**
- `username`: username MySQL kamu
- `password`: password MySQL kamu  
- `localhost`: host MySQL (biasanya localhost)
- `3306`: port MySQL (default 3306)
- `nama_database`: nama database yang sudah dibuat

### 4. Setup Database Schema

#### A. Push Schema ke Database
```bash
npx prisma db push
```

#### B. Generate Prisma Client
```bash
npx prisma generate
```

#### C. Seed Database (Opsional - untuk data contoh)
```bash
npx prisma db seed
```

### 5. Jalankan Aplikasi

#### Development Mode
```bash
npm start
```

#### Production Mode
```bash
npm run build
npm run start:prod
```

Aplikasi akan berjalan di: `http://localhost:3000`

## 📁 Struktur Project

```
tb-pweb-zhahra/
├── src/
│   ├── controllers/     # Logic bisnis
│   ├── routes/         # Definisi route
│   ├── views/          # Template EJS
│   ├── middleware/     # Middleware Express
│   └── index.js        # Entry point
├── prisma/
│   ├── schema.prisma   # Schema database
│   └── seed.js         # Data seeding
├── public/             # Static files (CSS, JS, images)
└── package.json
```

## 🔧 Konfigurasi Database

### Struktur Database
Aplikasi menggunakan **Prisma ORM** dengan schema yang sudah didefinisikan di `prisma/schema.prisma`.

### Tabel Utama:
- **User**: Data pengguna (mahasiswa, admin, aslab)
- **Pendaftaran**: Data pendaftaran aslab
- **Pewawancara**: Data pewawancara
- **JadwalWawancara**: Jadwal wawancara
- **Pengumuman**: Pengumuman hasil seleksi

## 🚨 Troubleshooting

### Error "Database connection failed"
1. Pastikan MySQL server berjalan
2. Cek konfigurasi DATABASE_URL di file `.env`
3. Pastikan database sudah dibuat
4. Cek username dan password MySQL

### Error "Prisma schema not found"
```bash
npx prisma generate
```

### Error "Port already in use"
Ganti port di file `.env`:
```env
PORT=3001
```

## 📝 Default Accounts

Setelah menjalankan seed, tersedia akun default:

**Aslab:**
- Email: aslab@example.com
- Password: password123

**Admin:**
- Email: admin@example.com  
- Password: password123

## 🔒 Security Notes

- Ganti `SESSION_SECRET` dengan string random yang aman
- Jangan commit file `.env` ke repository
- Gunakan environment variables untuk konfigurasi sensitif

## 📞 Support

Jika ada masalah, cek:
1. Log error di terminal
2. Konfigurasi database
3. Versi Node.js dan MySQL

---

**Happy Coding! 🎉** 