import express from 'express';
const router = express.Router();

router.get('/penilaianMagang', (req, res) => {
  res.render('aslab/penilaianMagang', {
    title: 'Penilaian Magang',
    layout: 'aslab/layout/main',
    activePage: 'penilaianMagang',
    user: req.session.user 
  });
});

export default router; // ← Penting!
