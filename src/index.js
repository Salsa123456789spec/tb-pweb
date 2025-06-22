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
import verifikasiRoutes from './routes/verifBerkas.js';
import penilaianRoutes from './routes/penilaian.js';
import penilaianMagangRoutes from './routes/penilaianMagang.js';
import penilaianTotalRoutes from './routes/penilaianTotal.js';
import rankingMagangRoutes from './routes/rankingMagang.js';
import tugasMagangRoutes from './routes/tugasMagang.js';
import formTugasRoutes from './routes/formTugas.js';
import buatTugasRoutes from './routes/buatTugas.js';
import hapusTugasRouter from './routes/hapusTugas.js';
import detailTugasRoutes from './routes/detailTugas.js';
import detailTugasMahasiswaRoutes from './routes/detailTugasMahasiswa.js';
import updateTugasRoutes from './routes/updateTugas.js';
import nilaiRoutes from './routes/nilai.js';
import statistikRoutes from './routes/statistik.js';

// import formTugasAslabRoutes from './routes/formTugas.js';









const app = express();
const port = 3000;
const __dirname = path.dirname(url.fileURLToPath(
    import.meta.url));

// Setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));


// Static files
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use('/uploads/tugas', express.static(path.join(__dirname, '../public/uploads/tugas')));



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


// Middleware untuk set nilai default ke semua views
app.use((req, res, next) => {
  res.locals.activePage = ''; // biar tidak error kalau tidak diset
  res.locals.user = req.session.user || null; // kalau butuh user di sidebar
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
app.use('/mahasiswa/konfirmasiPendaftaran', konfirmasiPendaftaranRoutes);
app.use('/admin', adminRoutes);
app.use('/aslab', aslabRoutes);
app.use('/aslab', verifikasiRoutes);
app.use('/aslab', penilaianRoutes);
app.use('/aslab/penilaianMagang', penilaianMagangRoutes);
app.use('/aslab/penilaianTotal', penilaianTotalRoutes);
app.use('/aslab/rankingMagang', rankingMagangRoutes);
app.use('/aslab', formTugasRoutes);
app.use('/aslab', buatTugasRoutes);
app.use('/aslab', detailTugasRoutes);
app.use('/aslab', hapusTugasRouter);
app.use('/aslab', updateTugasRoutes);
app.use('/aslab', statistikRoutes);
// app.use('/aslab', formTugasAslabRoutes);

// Mahasiswa routes - detailTugasMahasiswa harus didefinisikan sebelum tugasMagang
app.use('/mahasiswa', detailTugasMahasiswaRoutes);
app.use('/mahasiswa', nilaiRoutes);
app.use('/mahasiswa', mahasiswaRouter);
app.use('/', tugasMagangRoutes);

app.listen(port, () => {
    console.log(`Server jalan di http://localhost:${port}`);
});

