import express from 'express';
import path from 'path';
import url from 'url';
import session from 'express-session';
import flash from 'connect-flash';
import expressLayouts from 'express-ejs-layouts';
import appState from './config/appState.js'; // Impor state global
import prisma from './models/prisma.js'; // Menggunakan instance prisma yang sudah ada

import registerRouter from './routes/register.js';
import loginRouter from './routes/login.js';

import adminRouter from './routes/admin.js';
import mahasiswaRouter from './routes/mahasiswa.js';
import formulirRoutes from './routes/formulirPendaftaran.js';
import konfirmasiPendaftaranRoutes from './routes/konfirmasiPendaftaran.js';
import adminRoutes from './routes/admin.js';
import aslabRoutes from './routes/aslab.js';
import faqRouter from './routes/faq.js'; 
import tugasRouter from './routes/tugas.js';
import materiMagangRouter from './routes/materiMagang.js';
import kuisionerRoutes from './routes/kuisionerRoutes.js';

// Set DATABASE_URL environment variable
process.env.DATABASE_URL = "mysql://root:@127.0.0.1:3306/dbpweb";

const app = express();
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// Konfigurasi EJS dan Layouts
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts); // Menggunakan layout
app.set('layout', 'layout'); // Set default layout

// Middleware untuk parsing body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// MIDDLEWARE MAINTENANCE MODE
app.use((req, res, next) => {
    // Izinkan akses ke halaman admin dan login, serta file statis
    const allowedPaths = ['/superadmin', '/aslab', '/login', '/register', '/css', '/js', '/img'];
    if (allowedPaths.some(path => req.path.startsWith(path))) {
        return next();
    }

    // Jika web ditutup, tampilkan halaman maintenance
    if (!appState.isOprecOpen) {
        return res.status(503).render('maintenance', { layout: false, title: 'Maintenance' });
    }
    
    // Jika web dibuka, lanjutkan ke request berikutnya
    next();
});

// Session & Flash
app.use(session({
    secret: 'rahasia',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

// Global flash middleware (tanpa layout)
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.title = res.locals.title || 'LEA';
    res.locals.activePage = res.locals.activePage || '';
    next();
});

// Middleware untuk mengatur layout khusus /mahasiswa
app.use('/mahasiswa', (req, res, next) => {
    res.locals.layout = 'mahasiswa/layout/main';
    next();
});

// Middleware untuk mengatur layout khusus /aslab
app.use('/aslab', (req, res, next) => {
    res.locals.layout = 'aslab/layout/main';
    next();
});

// Routes
app.use('/register', registerRouter);
app.use('/login', loginRouter);

// Route dasar
app.get('/', (req, res) => {
    res.render('mahasiswa/index', {
        title: 'LEA - Home',
        activePage: 'home',
        layout: 'mahasiswa/layout/main'
    });
});

// Gunakan routes dengan awalan yang sesuai
app.use('/superadmin', adminRouter);
app.use('/mahasiswa/formulirPendaftaran', formulirRoutes);
app.use('/mahasiswa/konfirmasiPendaftaran', konfirmasiPendaftaranRoutes);
app.use('/admin', adminRoutes);
app.use('/aslab', aslabRoutes);
app.use('/mahasiswa/faq', faqRouter); 
app.use('/mahasiswa/tugas', tugasRouter);
app.use('/mahasiswa/materiMagang', materiMagangRouter);
app.use('/mahasiswa/kuisioner', kuisionerRoutes);
app.use('/mahasiswa', mahasiswaRouter);

// API Endpoint untuk mencari pendaftar berdasarkan NIM
app.get('/api/pendaftar/search', async (req, res) => {
    const { nim } = req.query;
    if (!nim) {
        return res.status(400).json({ message: 'NIM diperlukan.' });
    }
    
    try {
        const pendaftar = await prisma.pendaftaran.findFirst({
            where: {
                user: {
                    nim: nim
                }
            },
            include: {
                user: {
                    select: {
                        name: true,
                        nim: true
                    }
                }
            }
        });

        if (!pendaftar) {
            return res.status(404).json({ message: 'Pendaftar dengan NIM tersebut tidak ditemukan.' });
        }
        
        res.json(pendaftar);
    } catch (error) {
        console.error('Error saat mencari pendaftar:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});