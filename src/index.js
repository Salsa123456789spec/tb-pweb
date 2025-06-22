import express from 'express';
import path from 'path';
import url from 'url';
import session from 'express-session';
import flash from 'connect-flash';
import expressLayouts from 'express-ejs-layouts';
import methodOverride from 'method-override';

import registerRouter from './routes/register.js';
import loginRouter from './routes/login.js';
import adminRouter from './routes/admin.js';
import mahasiswaRouter from './routes/mahasiswa.js';
import formulirRoutes from './routes/formulirPendaftaran.js';
import aslabRouter from './routes/aslab.js';

const app = express();
const port = 3000;
const __dirname = path.dirname(url.fileURLToPath(
    import.meta.url));

// Setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Setup express layouts - MUST be before routes
app.use(expressLayouts);
app.set('layout', 'mahasiswa/layout/main'); // Default layout

// Middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

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
app.use('/aslab', aslabRouter);
app.use('/superadmin', adminRouter);
app.use('/mahasiswa/formulirPendaftaran', formulirRoutes);
app.use('/mahasiswa', mahasiswaRouter);

// Root route
app.get('/', (req, res) => {
    // Mengarahkan ke halaman dashboard aslab secara default
    res.render('aslab/layout/index', { 
        title: 'Aslab Dashboard',
        layout: 'aslab/layout/main', // Menggunakan layout aslab
        activePage: 'dashboard'
    });
});

app.listen(port, () => {
    console.log(`Server jalan di http://localhost:${port}`);
});