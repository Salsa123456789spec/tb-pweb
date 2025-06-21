import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';

const router = express.Router();
const prisma = new PrismaClient();
router.get('/tugas/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.tugas.delete({ where: { id: Number(id) } });
    res.redirect('/aslab/buatTugas'); // Ganti sesuai route daftar tugas kamu
  } catch (err) {
    console.error(err);
    res.redirect('/aslab/buatTugas?error=1');
  }
});

export default router;