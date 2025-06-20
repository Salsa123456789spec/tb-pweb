import express from 'express';
import path from 'path';
import url from 'url';
import session from 'express-session';
import flash from 'connect-flash';
import expressLayouts from 'express-ejs-layouts';

// Import semua router
import registerRouter from './routes/register.js';
import loginRouter from './routes/login.js';
import adminRouter from './routes/admin.js';
import mahasiswaRouter from './routes/mahasiswa.js';
import formulirRoutes from './routes/formulirPendaftaran.js';
import aslabRoutes from './routes/aslab.js';

const app = express();
const port = 3000;
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// Setup EJS view engine dan express-ejs-layouts
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'mahasiswa/layout/main'); // Set default layout

// Middleware untuk file statis (CSS, gambar, dll.)
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Middleware untuk mem-parsing body dari request (form data)
app.use(express.urlencoded({ extended: true }));

// Middleware untuk session dan flash messages
app.use(session({
    secret: 'rahasia-pweb', // Sebaiknya gunakan secret yang lebih kompleks
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

// Middleware custom untuk meneruskan flash messages ke semua view
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.user = req.session.user; // Juga teruskan data user jika ada
    next();
});

// Definisi Routes
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/superadmin', adminRouter);
app.use('/mahasiswa', mahasiswaRouter);
app.use('/mahasiswa/formulirPendaftaran', formulirRoutes);
app.use('/aslab', aslabRoutes); // Route untuk Aslab sudah terpasang

// Route untuk halaman utama/beranda
app.get('/', (req, res) => {
    // FIX: Menambahkan variabel 'title' dan 'activePage' untuk layout
    res.render('mahasiswa/layout/index', {
        title: 'Beranda',
        activePage: 'beranda' // Ditambahkan untuk mengatasi error ActivePage
    });
});

// Menjalankan server
app.listen(port, () => {
    console.log(`Server jalan di http://localhost:${port}`);
});