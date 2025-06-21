import express from 'express';
import { ensureAuthenticated, ensureRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', ensureAuthenticated, ensureRole('admin'), (req, res) => {
    res.render('superadmin/layout/admin', {
        user: req.session.user
    });
});

// Buat halaman tambah user, dll nanti di sini

export default router;
