// src/routes/kuisionerRoutes.js
import express from 'express';
import { getKuisionerPage, submitKuisioner } from '../controllers/kuisionerController.js';
import { ensureAuthenticated, ensureRole } from '../middleware/auth.js'; // Fixed import

const router = express.Router();

// Route untuk menampilkan form kuisioner (temporary without auth for testing)
router.get('/', getKuisionerPage);

// Route untuk submit kuisioner (temporary without auth for testing)
router.post('/', submitKuisioner);

export default router;