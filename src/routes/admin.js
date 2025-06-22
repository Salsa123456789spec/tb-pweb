import express from 'express';
import { ensureAuthenticated, ensureRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', ensureAuthenticated, ensureRole('admin'), (req, res) => {
    res.render('superadmin/dashboard', {
        layout: 'superadmin/layout/main',
        title: 'Dashboard Superadmin',
        activePage: 'dashboard'
    });
});

router.get('/kelolaAslab', ensureAuthenticated, ensureRole('admin'), (req, res) => {
    res.render('superadmin/kelolaAslab', {
        layout: 'superadmin/layout/main',
        title: 'Kelola Aslab',
        activePage: 'kelolaAslab'
    });
});

export default router;
