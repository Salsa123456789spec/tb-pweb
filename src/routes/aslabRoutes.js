// routes/aslabRoutes.js
const express = require('express');
const router = express.Router();
const aslabController = require('../controllers/aslabController');

// Route untuk melihat daftar mahasiswa yang sudah mengisi kuesioner
router.get('/rekap/kuisioner', aslabController.getKuesionerMahasiswa);

// Route untuk melihat detail kuesioner per mahasiswa
router.get('/rekap/kuisioner/:id', aslabController.getKuesionerDetail);

module.exports = router;