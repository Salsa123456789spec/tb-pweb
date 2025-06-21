// src/controllers/kuisionerController.js
import prisma from '../models/prisma.js';

export const getKuisionerPage = async (req, res) => {
  console.log('Kuisioner page accessed');
  
  try {
    // Check if user is logged in
    if (!req.session.user) {
      console.log('No user session found');
      req.flash('error_msg', 'Silakan login terlebih dahulu');
      return res.redirect('/login');
    }

    console.log('Session user:', req.session.user);
    
    const userId = req.session.user.id;
    console.log('Mahasiswa ID:', userId);

    // Find pendaftaran for this user
    const pendaftaran = await prisma.pendaftaran.findFirst({
      where: { 
        user_id: userId,
        status: {
          in: ['menunggu', 'diterima', 'ditolak'] // Allow all statuses for now
        }
      },
      include: {
        feedbackKuisioner: true
      }
    });

    console.log('Pendaftaran found:', pendaftaran);

    if (!pendaftaran) {
      console.log('No pendaftaran found for user');
      req.flash('error_msg', 'Anda belum mendaftar sebagai asisten lab. Silakan daftar terlebih dahulu.');
      return res.redirect('/mahasiswa/formulir-pendaftaran');
    }

    // Check if user wants to edit (from query parameter)
    if (req.query.edit === 'true' && pendaftaran.feedbackKuisioner) {
      console.log('User wants to edit kuisioner');
      return res.render('mahasiswa/kuisioner_form', {
        title: 'Edit Kuisioner Asisten Lab',
        layout: 'mahasiswa/layout/main',
        pendaftaranId: pendaftaran.id,
        existingFeedback: pendaftaran.feedbackKuisioner,
        messages: req.flash()
      });
    }

    // If kuisioner already filled, show view page with option to edit
    if (pendaftaran.feedbackKuisioner) {
      console.log('User already filled kuisioner');
      req.flash('info_msg', 'Anda sudah mengisi kuisioner. Klik tombol "Edit" jika ingin mengubah.');
      return res.render('mahasiswa/kuisioner_view', {
        title: 'Kuisioner Asisten Lab',
        layout: 'mahasiswa/layout/main',
        kuisioner: pendaftaran.feedbackKuisioner,
        pendaftaranId: pendaftaran.id,
        messages: req.flash()
      });
    }

    // Show form for new kuisioner
    console.log('Showing new kuisioner form');
    return res.render('mahasiswa/kuisioner_form', {
      title: 'Kuisioner Asisten Lab',
      layout: 'mahasiswa/layout/main',
      pendaftaranId: pendaftaran.id,
      messages: req.flash()
    });

  } catch (error) {
    console.error('Error in getKuisionerPage:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat mengakses halaman kuisioner');
    return res.redirect('/mahasiswa/dashboard');
  }
};

export const submitKuisioner = async (req, res) => {
  try {
    console.log('Kuisioner submitted:', req.body);
    
    const {
      pendaftaran_id,
      kejelasan_soal,
      alokasi_waktu,
      kondisi_ruangan,
      profesionalisme_pewawancara,
      bimbingan_arahan,
      supervisi,
      kualitas_mentoring,
      proses_keseluruhan,
      saran,
      kesan_pesan,
      is_edit,
      feedback_id
    } = req.body;

    // Validate required fields
    if (!pendaftaran_id || !kejelasan_soal || !alokasi_waktu || !kondisi_ruangan || 
        !profesionalisme_pewawancara || !bimbingan_arahan || !supervisi || 
        !kualitas_mentoring || !proses_keseluruhan) {
      req.flash('error_msg', 'Semua field rating harus diisi');
      return res.redirect('/mahasiswa/kuisioner');
    }

    // Check if this is an edit operation
    if (is_edit === 'true' && feedback_id) {
      console.log('Updating existing kuisioner:', feedback_id);
      
      // Update existing feedback
      const updatedFeedback = await prisma.feedbackKuisioner.update({
        where: { id: parseInt(feedback_id) },
        data: {
          kejelasan_soal: parseInt(kejelasan_soal),
          alokasi_waktu: parseInt(alokasi_waktu),
          kondisi_ruangan: parseInt(kondisi_ruangan),
          profesionalisme_pewawancara: parseInt(profesionalisme_pewawancara),
          bimbingan_arahan: parseInt(bimbingan_arahan),
          supervisi: parseInt(supervisi),
          kualitas_mentoring: parseInt(kualitas_mentoring),
          proses_keseluruhan: parseInt(proses_keseluruhan),
          saran: saran || '',
          kesan_pesan: kesan_pesan || ''
        }
      });

      console.log('Kuisioner updated successfully:', updatedFeedback);
      req.flash('success_msg', 'Kuisioner berhasil diperbarui');
      return res.redirect('/mahasiswa/kuisioner');
    } else {
      console.log('Creating new kuisioner for pendaftaran:', pendaftaran_id);
      
      // Check if feedback already exists for this pendaftaran
      const existingFeedback = await prisma.feedbackKuisioner.findFirst({
        where: { pendaftaran_id: parseInt(pendaftaran_id) }
      });

      if (existingFeedback) {
        req.flash('error_msg', 'Kuisioner sudah diisi untuk pendaftaran ini');
        return res.redirect('/mahasiswa/kuisioner');
      }

      // Create new feedback
      const newFeedback = await prisma.feedbackKuisioner.create({
        data: {
          pendaftaran_id: parseInt(pendaftaran_id),
          kejelasan_soal: parseInt(kejelasan_soal),
          alokasi_waktu: parseInt(alokasi_waktu),
          kondisi_ruangan: parseInt(kondisi_ruangan),
          profesionalisme_pewawancara: parseInt(profesionalisme_pewawancara),
          bimbingan_arahan: parseInt(bimbingan_arahan),
          supervisi: parseInt(supervisi),
          kualitas_mentoring: parseInt(kualitas_mentoring),
          proses_keseluruhan: parseInt(proses_keseluruhan),
          saran: saran || '',
          kesan_pesan: kesan_pesan || ''
        }
      });

      console.log('Kuisioner created successfully:', newFeedback);
      req.flash('success_msg', 'Kuisioner berhasil disimpan');
      return res.redirect('/mahasiswa/kuisioner');
    }
  } catch (error) {
    console.error('Error saving kuisioner:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat menyimpan kuisioner');
    return res.redirect('/mahasiswa/kuisioner');
  }
};