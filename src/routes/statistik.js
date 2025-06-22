import express from 'express';
import { ensureAuthenticated, ensureRole } from '../middleware/auth.js';
import prisma from '../models/prisma.js';

const router = express.Router();

router.get('/statistik', ensureAuthenticated, ensureRole('asisten_lab'), async (req, res) => {
  try {
    // Get statistics by division
    const statistikDivisi = await prisma.pendaftaran.groupBy({
      by: ['divisi'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      }
    });

    // Get statistics by status
    const statistikStatus = await prisma.pendaftaran.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    });

    // Get total registrations
    const totalPendaftar = await prisma.pendaftaran.count();

    // Get registrations by status
    const menunggu = await prisma.pendaftaran.count({
      where: { status: 'menunggu' }
    });

    const diterima = await prisma.pendaftaran.count({
      where: { status: 'diterima' }
    });

    const ditolak = await prisma.pendaftaran.count({
      where: { status: 'ditolak' }
    });

    // Get recent registrations (last 10)
    const pendaftaranTerbaru = await prisma.pendaftaran.findMany({
      take: 10,
      orderBy: {
        id: 'desc'
      },
      include: {
        user: {
          select: {
            name: true,
            nim: true
          }
        }
      }
    });

    // Prepare data for charts
    const chartData = {
      labels: statistikDivisi.map(item => item.divisi),
      data: statistikDivisi.map(item => item._count.id)
    };

    const statusData = {
      labels: statistikStatus.map(item => item.status),
      data: statistikStatus.map(item => item._count.id)
    };

    res.render('aslab/statistik', {
      layout: 'aslab/layout/main',
      title: 'Statistik Pendaftaran',
      user: req.session.user,
      activePage: 'statistik',
      statistikDivisi,
      statistikStatus,
      totalPendaftar,
      menunggu,
      diterima,
      ditolak,
      pendaftaranTerbaru,
      chartData,
      statusData
    });

  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).render('error', {
      message: 'Terjadi kesalahan saat mengambil data statistik'
    });
  }
});

export default router; 