import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// File ini sekarang kosong karena route /tugas/:id sudah ditangani oleh detailTugasMahasiswa.js

export default router;
