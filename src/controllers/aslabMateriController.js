import prisma from '../models/prisma.js';
import fs from 'fs';
import path from 'path';

export const listMateri = async (req, res) => {
  const materi = await prisma.materi.findMany({ orderBy: { tanggal_upload: 'desc' } });
  res.render('aslab/materi/index', {
    layout: 'aslab/layout/main',
    title: 'Kelola Materi',
    user: req.session.user,
    activePage: 'materi',
    materi
  });
};

export const renderCreateForm = (req, res) => {
    res.render('aslab/materi/tambah', {
      layout: 'aslab/layout/main',
      title: 'Tambah Materi',
      user: req.session.user,
      activePage: 'materi',
      materi: {} // ⬅️ Tambahkan ini biar tidak error
    });
  };
  

export const createMateri = async (req, res) => {
  const { judul, deskripsi } = req.body;
  const file = req.file?.filename;

  await prisma.materi.create({
    data: {
      judul,
      deskripsi,
      file,
      user_id: req.session.user.id,
    },
  });

  res.redirect('/aslab/materi');
};

export const renderEditForm = async (req, res) => {
  const materi = await prisma.materi.findUnique({ where: { id: parseInt(req.params.id) } });
  res.render('aslab/materi/edit', {
    layout: 'aslab/layout/main',
    title: 'Edit Materi',
    user: req.session.user,
    activePage: 'materi',
    materi
  });
};

export const updateMateri = async (req, res) => {
  const { judul, deskripsi } = req.body;
  const file = req.file?.filename;

  const materi = await prisma.materi.findUnique({ where: { id: parseInt(req.params.id) } });

  // Hapus file lama jika ada file baru
  if (file && materi.file) {
    fs.unlinkSync(path.join('public/uploads', materi.file));
  }

  await prisma.materi.update({
    where: { id: materi.id },
    data: {
      judul,
      deskripsi,
      file: file || materi.file,
    },
  });

  res.redirect('/aslab/materi');
};

export const deleteMateri = async (req, res) => {
  const materi = await prisma.materi.findUnique({ where: { id: parseInt(req.params.id) } });

  if (materi.file) {
    fs.unlinkSync(path.join('public/uploads', materi.file));
  }

  await prisma.materi.delete({ where: { id: materi.id } });
  res.redirect('/aslab/materi');
};
