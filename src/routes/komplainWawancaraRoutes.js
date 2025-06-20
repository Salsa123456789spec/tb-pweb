// src/routes/komplainWawancaraRoutes.js
import express from 'express'; // Gunakan import
const router = express.Router();
import komplainController from '../controllers/komplainWawancaraController.js'; // Gunakan import dan tambahkan .js
// import { authenticateRole } from '../middleware/auth.js'; // Jika Anda memiliki middleware autentikasi/otorisasi, tambahkan .js

// Route untuk menampilkan formulir komplain wawancara
// Tambahkan middleware autentikasi jika diperlukan, contoh: authenticateRole(['mahasiswa'])
router.get('/komplain-wawancara/:id', komplainController.getKomplainWawancaraForm);

// Route untuk submit komplain wawancara
// Tambahkan middleware autentikasi jika diperlukan
router.post('/komplain-wawancara', komplainController.submitKomplainWawancara);

// Ekspor router sebagai default export
export default router; // <--- PERUBAHAN UTAMA DI SINI