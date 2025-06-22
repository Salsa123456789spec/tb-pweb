import express from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../models/prisma.js';
import { validationResult } from 'express-validator';
import { validateRegister } from '../validation/register.js';

const router = express.Router();

// GET Register Page
router.get('/', (req, res) => {
    res.render('register', {
        layout: false,
        success_msg: req.flash('success_msg'),
        error_msg: req.flash('error_msg'),
        errors: [],
        old: {}
    });
});

// POST Register
router.post('/', async(req, res) => {
    const { name, nim, email, password, confirmPassword } = req.body;

    // Validasi dengan Joi
    const { error } = validateRegister(req.body);
    if (error) {
        return res.render('register', {
            layout: false,
            success_msg: [],
            error_msg: [],
            errors: error.details.map(err => ({ msg: err.message })),
            old: req.body
        });
    }

    try {
        // Cek user sudah ada atau belum
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ nim }, { email }]
            }
        });

        if (existingUser) {
            return res.render('register', {
                layout: false,
                success_msg: [],
                error_msg: ['NIM atau Email sudah digunakan.'],
                errors: [],
                old: req.body
            });
        }

        // Hash dan simpan password
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                nim,
                name,
                email,
                password: hashedPassword,
                role: 'mahasiswa'
            }
        });

        req.flash('success_msg', 'Berhasil mendaftar! Silakan login.');
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.render('register', {
            layout: false,
            success_msg: [],
            error_msg: ['Terjadi kesalahan saat registrasi.'],
            errors: [],
            old: req.body || {}
        });
    }
});

export default router;