import express from 'express';
const router = express.Router();

// Middleware auth (opsional)
import { ensureAuthenticated, ensureRole } from '../middleware/auth.js';

router.get('/dashboard', ensureAuthenticated, ensureRole('admin'), (req, res) => {
  res.render('superadmin/dashboard', {
    layout: 'superadmin/layout/main',
    user: req.session.user,
    title: 'Dashboard Admin',
    activePage: 'dashboard'
  });
});

export default router;
