import express from 'express';
import { ensureAuthenticated, ensureRole } from '../middleware/auth.js';
import prisma from '../models/prisma.js';
import { getManajemenOprec } from '../controllers/rekapController.js';

const router = express.Router();

router.get('/dashboard', ensureAuthenticated, ensureRole('admin'), async (req, res) => {
    // Hitung total user dari database
    const totalUser = await prisma.user.count();

    res.render('superadmin/dashboard', {
        layout: 'superadmin/layout/main',
        title: 'Dashboard Superadmin',
        activePage: 'dashboard',
        totalUser,
        user: req.session.user
    });
});

router.get('/kelolaAslab', ensureAuthenticated, ensureRole('admin'), (req, res) => {
    res.render('superadmin/kelolaAslab', {
        layout: 'superadmin/layout/main',
        title: 'Kelola Aslab',
        activePage: 'kelolaAslab',
        user: req.session.user
    });
});

router.get('/manajemen-oprec', ensureAuthenticated, ensureRole('admin'), getManajemenOprec);

export default router;
