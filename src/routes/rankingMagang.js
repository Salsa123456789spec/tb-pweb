import express from 'express';
const router = express.Router();

router.get('/rankingMagang', (req, res) => {
  res.render('aslab/rankingMagang', {
    title: 'Ranking Magang',
    layout: 'aslab/layout/main',
    activePage: 'rankingMagang',
    user: req.session.user 
  });
});

export default router; // ← Penting!
