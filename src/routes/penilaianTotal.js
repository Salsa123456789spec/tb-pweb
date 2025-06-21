import express from 'express';
const router = express.Router();

router.get('/penilaianTotal', (req, res) => {
  res.render('aslab/penilaianTotal', {
    title: 'Penilaian Total',
    layout: 'aslab/layout/main',
    activePage: 'penilaianTotal',
    user: req.session.user 
  });
});

export default router; // ← Penting!
