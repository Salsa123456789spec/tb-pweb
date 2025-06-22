import express from 'express';
import path from 'path';
import url from 'url';
import session from 'express-session';
import flash from 'connect-flash';
import expressLayouts from 'express-ejs-layouts';

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

const app = express();
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// Konfigurasi EJS dan Layouts
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts); // Menggunakan layout

// Middleware untuk parsing body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

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

// Routes
app.use('/register', registerRouter);
app.use('/login', loginRouter);

// Route dasar
app.get('/', (req, res) => {
    res.render('mahasiswa/layout/index', {
        title: 'LEA - Home',
        activePage: 'home'
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

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});