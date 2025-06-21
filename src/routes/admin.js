import express from 'express';
import { ensureAuthenticated, ensureRole } from '../middleware/auth.js';
import { 
    getJadwalWawancaraAdminForm, 
    createJadwalWawancara, 
    getAllJadwalWawancaraAdmin 
} from '../controllers/jadwalWawancaraAdmin.js';

const router = express.Router();

router.get('/dashboard', ensureAuthenticated, ensureRole('admin'), (req, res) => {
    res.render('superadmin/layout/admin', {
        user: req.session.user
    });
});

// Jadwal Wawancara Routes for Admin
router.get('/jadwalWawancara', ensureAuthenticated, ensureRole('admin'), getJadwalWawancaraAdminForm);
router.post('/jadwalWawancara', ensureAuthenticated, ensureRole('admin'), createJadwalWawancara);
router.get('/jadwalWawancara/list', ensureAuthenticated, ensureRole('admin'), getAllJadwalWawancaraAdmin);

// Buat halaman tambah user, dll nanti di sini

export default router;
