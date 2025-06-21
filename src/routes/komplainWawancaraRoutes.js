// src/routes/komplainWawancaraRoutes.js
import express from 'express';
const router = express.Router();
// <--- PERBAIKAN: Import named exports langsung dari controller
import { getKomplainWawancaraForm, submitKomplainWawancara } from '../controllers/komplainWawancaraController.js'; //
// import { authenticateRole } from '../middleware/auth.js';

// Route untuk menampilkan formulir komplain wawancara
router.get('/komplain-wawancara/:id', getKomplainWawancaraForm); //

// Route untuk submit komplain wawancara
router.post('/komplain-wawancara', submitKomplainWawancara); //

export default router; //