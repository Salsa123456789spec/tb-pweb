// src/controllers/jadwalWawancaraController.js
import prisma from '../models/prisma.js';

export const getJadwalWawancaraMahasiswa = async (req, res) => {
    // ... (existing code for mahasiswa dashboard, no change needed here)
};

export const getJadwalWawancaraAdminForm = async (req, res) => {
    try {
        // Get existing jadwal wawancara for display
        const jadwalWawancaraList = await prisma.jadwalWawancara.findMany({
            include: {
                pendaftaran: {
                    select: {
                        domisili: true,
                        asal: true,
                        nomor_whatsapp: true,
                        divisi: true,
                        user: {
                            select: {
                                name: true,
                                nim: true
                            }
                        }
                    },
                },
            },
            orderBy: {
                tanggal: 'desc' // Order by date, latest first
            }
        });

        // Determine if this is admin or aslab route
        const isAslab = req.path.includes('/aslab/');
        const layout = isAslab ? 'aslab/layout/main' : 'superadmin/layout/admin';
        const viewPath = isAslab ? 'aslab/layout/jadwalwawancara1' : 'superadmin/jadwalWawancaraAdmin';

        res.render(viewPath, {
            layout: layout,
            title: 'Penjadwalan Wawancara',
            user: req.session.user,
            activePage: 'jadwalWawancara',
            jadwalWawancaraList: jadwalWawancaraList,
            errors: [],
            old: {},
            success_msg: req.flash('success_msg'),
            error_msg: req.flash('error_msg')
        });
    } catch (error) {
        console.error('Error fetching data for admin jadwal wawancara form:', error);
        req.flash('error_msg', 'Terjadi kesalahan saat memuat form penjadwalan wawancara.');
        res.redirect('/aslab/');
    }
};

export const createJadwalWawancara = async (req, res) => {
    const {
        peserta_id,
        pewawancara_id,
        tanggal_wawancara,
        waktu_wawancara_mulai,
        waktu_wawancara_selesai,
        lokasi_wawancara
    } = req.body;

    let errors = [];

    // Basic validation
    if (!peserta_id || peserta_id === '') {
        errors.push({ msg: 'Peserta wajib dipilih.' });
    }
    if (!pewawancara_id || pewawancara_id === '') {
        errors.push({ msg: 'Pewawancara wajib dipilih.' });
    }
    if (!tanggal_wawancara) {
        errors.push({ msg: 'Tanggal wawancara wajib diisi.' });
    }
    if (!waktu_wawancara_mulai) {
        errors.push({ msg: 'Waktu mulai wawancara wajib diisi.' });
    }
     if (!waktu_wawancara_selesai) {
        errors.push({ msg: 'Waktu selesai wawancara wajib diisi.' });
    }
    if (!lokasi_wawancara) {
        errors.push({ msg: 'Lokasi wawancara wajib diisi.' });
    }

    if (errors.length > 0) {
        // Determine if this is admin or aslab route
        const isAslab = req.path.includes('/aslab/');
        const layout = isAslab ? 'aslab/layout/main' : 'superadmin/layout/admin';
        const viewPath = isAslab ? 'aslab/layout/jadwalwawancara1' : 'superadmin/jadwalWawancaraAdmin';
        
        return res.render(viewPath, {
            layout: layout,
            title: 'Penjadwalan Wawancara',
            user: req.session.user,
            activePage: 'jadwalWawancara',
            jadwalWawancaraList: [],
            errors: errors,
            old: req.body
        });
    }

    try {
        // Combine date and time
        const combinedStartDateTime = new Date(`${tanggal_wawancara}T${waktu_wawancara_mulai}:00`);

        // Create a simple pendaftaran record for testing if it doesn't exist
        let pendaftaranId = 1; // Default ID
        
        // Check if pendaftaran exists, if not create a dummy one
        const existingPendaftaran = await prisma.pendaftaran.findFirst();
        if (!existingPendaftaran) {
            // Create a dummy user first
            const dummyUser = await prisma.user.create({
                data: {
                    name: 'Test User',
                    nim: '123456789',
                    email: 'test@test.com',
                    password: 'dummy123',
                    role: 'mahasiswa'
                }
            });

            // Create a dummy pendaftaran
            const dummyPendaftaran = await prisma.pendaftaran.create({
                data: {
                    user_id: dummyUser.id,
                    divisi: 'Test Divisi',
                    domisili: 'Test City',
                    asal: 'Test School',
                    nomor_whatsapp: '081234567890',
                    status: 'DITERIMA'
                }
            });
            
            pendaftaranId = dummyPendaftaran.id;
        } else {
            pendaftaranId = existingPendaftaran.id;
        }

        // Save to database
        await prisma.jadwalWawancara.create({
            data: {
                pendaftaran_id: pendaftaranId,
                waktu: combinedStartDateTime,
                tanggal: new Date(tanggal_wawancara),
                pewawancara: pewawancara_id, // Store the selected pewawancara name
                kontak_pewwc: 1, // Dummy contact
                ruang: lokasi_wawancara,
            }
        });

        req.flash('success_msg', 'Jadwal wawancara berhasil ditambahkan!');
        
        // Redirect based on route
        const isAslab = req.path.includes('/aslab/');
        const redirectPath = isAslab ? '/aslab/jadwalwawancara1' : '/superadmin/jadwalWawancara';
        res.redirect(redirectPath);

    } catch (error) {
        console.error('Error creating jadwal wawancara:', error);
        errors.push({ msg: 'Terjadi kesalahan saat menambahkan jadwal wawancara.' });
        
        // Determine if this is admin or aslab route
        const isAslab = req.path.includes('/aslab/');
        const layout = isAslab ? 'aslab/layout/main' : 'superadmin/layout/admin';
        const viewPath = isAslab ? 'aslab/layout/jadwalwawancara1' : 'superadmin/jadwalWawancaraAdmin';
        
        res.render(viewPath, {
            layout: layout,
            title: 'Penjadwalan Wawancara',
            user: req.session.user,
            activePage: 'jadwalWawancara',
            jadwalWawancaraList: [],
            errors: errors,
            old: req.body
        });
    }
};

// You might also want a function to display all existing schedules for admin
export const getAllJadwalWawancaraAdmin = async (req, res) => {
    try {
        const jadwalWawancaraList = await prisma.jadwalWawancara.findMany({
            include: {
                pendaftaran: {
                    select: {
                        domisili: true,
                        asal: true,
                        nomor_whatsapp: true,
                        divisi: true,
                        user: {
                            select: {
                                name: true,
                                nim: true
                            }
                        }
                    },
                },
            },
            orderBy: {
                tanggal: 'desc' // Order by date, latest first
            }
        });

        // Determine if this is admin or aslab route
        const isAslab = req.path.includes('/aslab/');
        const layout = isAslab ? 'aslab/layout/main' : 'superadmin/layout/admin';
        const viewPath = isAslab ? 'aslab/layout/jadwalwawancara1' : 'superadmin/jadwalWawancaraAdminList';

        res.render(viewPath, {
            layout: layout,
            title: 'Daftar Jadwal Wawancara',
            user: req.session.user,
            activePage: 'jadwalWawancara',
            jadwalWawancaraList: jadwalWawancaraList,
            success_msg: req.flash('success_msg'),
            error_msg: req.flash('error_msg')
        });
    } catch (err) {
        console.error("Error fetching jadwal wawancara list for admin:", err);
        req.flash('error_msg', 'Terjadi kesalahan saat memuat daftar jadwal wawancara.');
        
        // Redirect based on route
        const isAslab = req.path.includes('/aslab/');
        const redirectPath = isAslab ? '/aslab/' : '/superadmin/dashboard';
        res.redirect(redirectPath);
    }
};

