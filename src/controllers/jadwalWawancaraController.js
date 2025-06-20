// src/controllers/jadwalWawancaraController.js
import prisma from '../models/prisma.js';

export const getJadwalWawancara = async (req, res) => {
  try {
    const jadwalWawancara = await prisma.jadwalWawancara.findMany({
      include: {
        pendaftaran: true, // Include related Pendaftaran data if needed
      },
    });
    res.status(200).json(jadwalWawancara);
  } catch (error) {
    console.error('Error fetching jadwal wawancara:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data jadwal wawancara', error: error.message });
  }
};