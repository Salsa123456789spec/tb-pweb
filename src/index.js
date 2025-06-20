// src/index.js
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
import jadwalWawancaraRoutes from './routes/jadwalWawancaraRoutes.js'; // Import the new route

const app = express();
const port = 3000;
const __dirname = path.dirname(url.fileURLToPath(
    import.meta.url));

// Setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Static files
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use(express.urlencoded({ extended: true }));

// Session & Flash
app.use(session({
    secret: 'rahasia',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

// Global flash
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// Routes
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.get('/', (req, res) => {
    res.render('mahasiswa/layout/index');
});
app.use(expressLayouts);
app.set('layout', 'mahasiswa/layout/main');
app.use('/superadmin', adminRouter);
app.use('/mahasiswa/formulirPendaftaran', formulirRoutes);
app.use('/mahasiswa', mahasiswaRouter);
app.use('/jadwalWawancara', jadwalWawancaraRoutes); // Add the new route

app.listen(port, () => {
    console.log(`Server jalan di http://localhost:${port}`);
});