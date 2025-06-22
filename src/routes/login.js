import express from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../models/prisma.js';
import { validateLogin } from '../validation/login.js';

const router = express.Router();

// GET login page
router.get('/', (req, res) => {
    // Check if user just logged out
    const logoutSuccess = req.query.logout === 'success';
    
    res.render('login', {
        success_msg: logoutSuccess ? ['Berhasil logout'] : req.flash('success_msg'),
        error_msg: req.flash('error_msg'),
        errors: [],
        old: {}
    });
});

// GET logout
router.get('/logout', (req, res) => {
    // Store success message before destroying session
    const successMessage = 'Berhasil logout';
    
    // Destroy session
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.redirect('/login');
        }
        
        // Clear cookie
        res.clearCookie('connect.sid');
        
        // Redirect to login with success message using query parameter
        res.redirect('/login?logout=success');
    });
});

router.post('/', async (req, res) => {
  const { role, identifier, password } = req.body;

  const { error } = validateLogin(req.body); // pakai validasi sesuai field
  if (error) {
    return res.render('login', {
      success_msg: [],
      error_msg: [],
      errors: error.details.map(err => ({ msg: err.message })),
      old: req.body
    });
  }

  try {
    // Tentukan field pencarian berdasarkan role
    let whereClause;
    if (role === 'mahasiswa') {
      whereClause = { role: 'mahasiswa', nim: identifier };
    } else {
      whereClause = { role: role, no_aslab: identifier }; // untuk asisten_lab & admin
    }

    const user = await prisma.user.findFirst({ where: whereClause });

    if (!user) {
      return res.render('login', {
        success_msg: [],
        error_msg: [],
        errors: [{ msg: 'Akun tidak ditemukan.' }],
        old: req.body
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', {
        success_msg: [],
        error_msg: [],
        errors: [{ msg: 'Password salah.' }],
        old: req.body
      });
    }

    req.session.user = {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
      nim: user.nim,
      no_aslab: user.no_aslab
    };

    // Redirect berdasarkan role
    if (user.role === 'mahasiswa') {
      return res.redirect('/mahasiswa/dashboard');
    } else if (user.role === 'asisten_lab') {
      return res.redirect('/aslab/dashboard');
    } else if (user.role === 'admin') {
      return res.redirect('/superadmin/dashboard');
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
