// src/routes/aslab.js

import express from "express";
import { ensureAuthenticated, ensureRole } from '../middleware/auth.js';
import { getRekapPendaftar } from '../controllers/aslabController.js';

const router = express.Router();

router.get(
    "/dashboard", 
    ensureAuthenticated, 
    ensureRole('asisten_lab'), // <-- DIUBAH DARI 'aslab'
    (req, res) => {
        res.render("aslab/dashboard", {
            layout: 'aslab/layout/main',
            title: 'Dashboard',
            user: req.session.user
        });
    }
);

router.get(
    "/rekap/pendaftar",
    ensureAuthenticated,
    ensureRole('asisten_lab'),      // <-- DIUBAH DARI 'aslab'
    getRekapPendaftar
);

export default router;