import express from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../models/prisma.js';
import { validateLogin } from '../validation/login.js';

const router = express.Router();

// Data default untuk layout
const layoutData = {
    title: 'Login Akun',
    activePage: 'login',
    layout: false
};

// GET Halaman Login
router.get('/', (req, res) => {
    res.render('login', {
        ...layoutData,
        errors: req.flash('errors'), // Ambil error dari flash
        old: req.flash('old')[0] || {} // Ambil old input dari flash
    });
});

// POST untuk proses Login (DIPERBAIKI)
router.post('/', async (req, res) => {
    const { nim, password } = req.body;

    const { error } = validateLogin(req.body);
    if (error) {
        req.flash('errors', error.details.map(err => ({ msg: err.message })));
        req.flash('old', req.body);
        return res.redirect('/login');
    }

    try {
        const user = await prisma.user.findUnique({ where: { nim } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            req.flash('errors', [{ msg: 'NIM atau Password salah.' }]);
            req.flash('old', req.body);
            return res.redirect('/login');
        }

        // Set session
        req.session.user = {
            id: user.id,
            role: user.role,
            email: user.email,
            name: user.name,
            nim: user.nim
        };

        // Redirect sesuai role
        switch (user.role) {
            case 'aslab':
                return res.redirect('/aslab/dashboard');
            case 'mahasiswa':
                return res.redirect('/mahasiswa/dashboard');
            case 'admin':
                return res.redirect('/superadmin/dashboard');
            default:
                req.flash('errors', [{ msg: 'Role tidak dikenali.' }]);
                return res.redirect('/login');
        }

    } catch (err) {
        console.error(err);
        req.flash('errors', [{ msg: 'Terjadi kesalahan server.' }]);
        return res.redirect('/login');
    }
});

export default router;