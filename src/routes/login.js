import express from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../models/prisma.js';
import { validateLogin } from '../validation/login.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('login', {
        success_msg: req.flash('success_msg'),
        error_msg: req.flash('error_msg'),
        errors: [],
        old: {}
    });
});

router.post('/', async (req, res) => {
    const { nim, password } = req.body;

    // Validasi input
    const { error } = validateLogin(req.body);
    if (error) {
        return res.render('login', {
            success_msg: [],
            error_msg: [],
            errors: error.details.map(err => ({ msg: err.message })),
            old: req.body
        });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { nim }
        });

        if (!user) {
            return res.render('login', {
                success_msg: [],
                error_msg: [],
                errors: [{ msg: 'NIM tidak ditemukan. Silakan daftar terlebih dahulu.' }],
                old: req.body
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', {
                success_msg: [],
                error_msg: [],
                errors: [{ msg: 'NIM atau Password salah.' }],
                old: req.body
            });
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
        if (user.role === 'mahasiswa') {
            return res.redirect('/mahasiswa/dashboard');
        } else if (user.role === 'asisten_lab') {
            return res.redirect('/aslab/dashboard');
        } else if (user.role === 'admin') {
            return res.redirect('/superadmin/dashboard');
        } else {
            return res.render('login', {
                success_msg: [],
                error_msg: [],
                errors: [{ msg: 'Role tidak dikenali.' }],
                old: req.body
            });
        }

    } catch (err) {
        console.error(err);
        return res.render('login', {
            success_msg: [],
            error_msg: [],
            errors: [{ msg: 'Terjadi kesalahan server.' }],
            old: req.body
        });
    }
});

export default router;
