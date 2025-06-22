import prisma from '../models/prisma.js';

// =================================================================
// FUNGSI UNTUK FITUR ABSENSI
// =================================================================

/**
 * Menampilkan halaman utama absensi yang berisi form pembuatan
 * dan tabel riwayat absensi yang sudah ada.
 */
export const showBuatAbsensiForm = async (req, res) => {
    try {
        const totalMahasiswaMagang = await prisma.pengumuman.count({
            where: { tahapan: 'tahap2' }
        });
        const sesiUnik = await prisma.kehadiran.groupBy({
            by: ['pertemuan', 'tanggal', 'pembahasan'],
            orderBy: { pertemuan: 'desc' },
        });
        const kehadiranCounts = await prisma.kehadiran.groupBy({
            by: ['pertemuan'],
            _count: { _all: true },
            where: { status: 'Hadir' }
        });
        const kehadiranMap = new Map(kehadiranCounts.map(item => [item.pertemuan, item._count._all]));
        const riwayatAbsensi = sesiUnik.map(sesi => ({
            pertemuan: sesi.pertemuan,
            tanggal: new Date(sesi.tanggal).toLocaleDateString('id-ID', {
                day: '2-digit', month: '2-digit', year: 'numeric'
            }),
            pembahasan: sesi.pembahasan,
            jumlahHadir: kehadiranMap.get(sesi.pertemuan) || 0,
            totalMahasiswa: totalMahasiswaMagang
        }));
        res.render('aslab/buat-absensi', {
            layout: 'aslab/layout/main',
            title: 'Buat Sesi Absensi',
            user: req.session.user,
            activePage: 'absensi',
            riwayat: riwayatAbsensi,
            success_msg: req.flash('success_msg'),
            error_msg: req.flash('error_msg')
        });
    } catch (error) {
        console.error("[ERROR] Gagal menampilkan halaman absensi:", error);
        req.flash('error_msg', 'Gagal memuat halaman absensi.');
        res.redirect('/aslab/dashboard');
    }
};

/**
 * Menampilkan tabel absensi yang siap diisi.
 */
export const showTabelAbsensi = async (req, res) => {
    try {
        const { pertemuan, tanggal, pembahasan } = req.body;
        const pendaftarTahap2 = await prisma.pengumuman.findMany({
            where: { tahapan: 'tahap2' },
            include: {
                user: { select: { nim: true, name: true } },
                pendaftaran: { select: { id: true } }
            },
            orderBy: { user: { name: 'asc' } }
        });
        const mahasiswa = pendaftarTahap2
            .filter(p => p.pendaftaran && p.user)
            .map(p => ({
                nim: p.user.nim,
                nama: p.user.name,
                pendaftaranId: p.pendaftaran.id
            }));
        res.render('aslab/tabel-absensi', {
            layout: 'aslab/layout/main',
            title: `Absensi Pertemuan ${pertemuan}`,
            user: req.session.user,
            activePage: 'absensi',
            sesi: { pertemuan, tanggal, pembahasan },
            mahasiswa: mahasiswa
        });
    } catch (error) {
        console.error("[ERROR] Gagal menampilkan tabel absensi:", error);
        req.flash('error_msg', 'Gagal memuat data mahasiswa.');
        res.redirect('/aslab/absensi');
    }
};

/**
 * Menyimpan data absensi ke database. Fungsi ini juga menangani update.
 */
export const simpanAbsensi = async (req, res) => {
    const { pertemuan, tanggal, pembahasan, ...statuses } = req.body;
    if (!pertemuan || !tanggal || !pembahasan) {
        req.flash('error_msg', 'Informasi pertemuan, tanggal, atau pembahasan tidak lengkap.');
        return res.redirect('/aslab/absensi');
    }
    try {
        const dataKehadiranBaru = [];
        for (const key in statuses) {
            if (key.startsWith('status-')) {
                const pendaftaranId = parseInt(key.split('-')[1]);
                const statusValue = statuses[key];
                if (pendaftaranId && statusValue) {
                    dataKehadiranBaru.push({
                        pendaftaran_id: pendaftaranId,
                        pertemuan: parseInt(pertemuan),
                        tanggal: new Date(tanggal),
                        status: statusValue,
                        pembahasan: pembahasan,
                    });
                }
            }
        }
        if (dataKehadiranBaru.length === 0) {
            req.flash('error_msg', 'Tidak ada data absensi valid untuk disimpan.');
            return res.redirect('/aslab/absensi');
        }
        await prisma.$transaction(async (tx) => {
            await tx.kehadiran.deleteMany({
                where: { pertemuan: parseInt(pertemuan) },
            });
            await tx.kehadiran.createMany({
                data: dataKehadiranBaru,
            });
        });
        req.flash('success_msg', `Absensi untuk pertemuan ${pertemuan} berhasil diperbarui.`);
        res.redirect('/aslab/absensi');
    } catch (error) {
        console.error('GAGAL MENYIMPAN ABSENSI:', error);
        req.flash('error_msg', 'Terjadi kesalahan pada server saat menyimpan data.');
        res.redirect('/aslab/absensi');
    }
};

/**
 * Menampilkan form untuk mengedit absensi yang sudah ada.
 */
export const showEditAbsensiForm = async (req, res) => {
    try {
        const pertemuanToEdit = parseInt(req.params.pertemuan);
        const existingSessionData = await prisma.kehadiran.findFirst({
            where: { pertemuan: pertemuanToEdit }
        });
        if (!existingSessionData) {
            req.flash('error_msg', 'Sesi absensi yang ingin diedit tidak ditemukan.');
            return res.redirect('/aslab/absensi');
        }
        const pendaftarTahap2 = await prisma.pengumuman.findMany({
            where: { tahapan: 'tahap2' },
            include: {
                user: { select: { nim: true, name: true } },
                pendaftaran: { select: { id: true } }
            },
            orderBy: { user: { name: 'asc' } }
        });
        const savedKehadiran = await prisma.kehadiran.findMany({
            where: { pertemuan: pertemuanToEdit }
        });
        const statusMap = new Map(savedKehadiran.map(k => [k.pendaftaran_id, k.status]));
        const mahasiswa = pendaftarTahap2
            .filter(p => p.pendaftaran && p.user)
            .map(p => ({
                nim: p.user.nim,
                nama: p.user.name,
                pendaftaranId: p.pendaftaran.id,
                status: statusMap.get(p.pendaftaran.id) || 'Tidak_Hadir'
            }));
        res.render('aslab/tabel-absensi', {
            layout: 'aslab/layout/main',
            title: `Edit Absensi Pertemuan ${pertemuanToEdit}`,
            user: req.session.user,
            activePage: 'absensi',
            sesi: {
                pertemuan: pertemuanToEdit,
                tanggal: existingSessionData.tanggal.toISOString().split('T')[0],
                pembahasan: existingSessionData.pembahasan
            },
            mahasiswa: mahasiswa,
            isEdit: true
        });
    } catch (error) { // <-- Kurung kurawal yang hilang sudah ditambahkan di sini
        console.error("[ERROR] Gagal menampilkan form edit absensi:", error);
        req.flash('error_msg', 'Gagal memuat data untuk diedit.');
        res.redirect('/aslab/absensi');
    }
};

// =================================================================
// FUNGSI UNTUK FITUR REKAP
// =================================================================

/**
 * Menampilkan halaman rekapitulasi absensi.
 */
export const getRekapAbsensi = async (req, res) => {
    try {
        const semuaKehadiran = await prisma.kehadiran.findMany({
            select: {
                status: true,
                pendaftaran: {
                    select: {
                        user: {
                            select: {
                                nim: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });

        const rekapMap = new Map();

        for (const kehadiran of semuaKehadiran) {
            if (!kehadiran.pendaftaran || !kehadiran.pendaftaran.user) {
                continue;
            }

            const nim = kehadiran.pendaftaran.user.nim;
            const nama = kehadiran.pendaftaran.user.name;

            if (!rekapMap.has(nim)) {
                rekapMap.set(nim, {
                    nim: nim,
                    nama: nama,
                    jumlah_hadir: 0,
                    jumlah_tidak_hadir: 0
                });
            }

            const dataMahasiswa = rekapMap.get(nim);
            if (kehadiran.status === 'Hadir') {
                dataMahasiswa.jumlah_hadir++;
            } else if (kehadiran.status === 'Tidak_Hadir') {
                dataMahasiswa.jumlah_tidak_hadir++;
            }
        }

        const rekapData = Array.from(rekapMap.values());
        rekapData.sort((a, b) => a.nama.localeCompare(b.nama));
        
        res.render('aslab/rekap/absensi', {
            layout: 'aslab/layout/main',
            title: 'Rekap Absensi',
            user: req.session.user,
            activePage: 'rekap/absensi',
            rekapData: rekapData
        });
    } catch (error) {
        console.error("[ERROR] Gagal mengambil rekap absensi:", error);
        req.flash('error_msg', 'Gagal memuat halaman rekap absensi.');
        res.redirect('/aslab/dashboard');
    }
};

/**
 * Menampilkan halaman rekap pendaftar.
 */
export const getRekapPendaftar = async (req, res) => {
    try {
        const semuaPendaftar = await prisma.pendaftaran.findMany({
            include: { user: { select: { name: true, nim: true } } },
            orderBy: { id: 'desc' }
        });
        const pendaftarFormatted = semuaPendaftar.map(p => ({
            nim: p.user.nim,
            nama: p.user.name,
            no_hp: p.nomor_whatsapp,
            id: p.id
        }));
        res.render('aslab/rekap/pendaftar', {
            layout: 'aslab/layout/main',
            title: 'Rekap Pendaftar',
            user: req.session.user,
            pendaftar: pendaftarFormatted,
            activePage: 'rekap/pendaftar',
            success_msg: req.flash('success_msg'),
            error_msg: req.flash('error_msg')
        });
    } catch (error) {
        console.error("[ERROR] Gagal mengambil data pendaftar:", error);
        req.flash('error_msg', 'Gagal memuat data pendaftar.');
        res.redirect('/aslab/dashboard');
    }
};

export const getDetailPendaftar = async (req, res) => {
    try {
        const pendaftarId = parseInt(req.params.id);
        const detailPendaftar = await prisma.pendaftaran.findUnique({
            where: { id: pendaftarId },
            include: { user: { select: { name: true, nim: true, email: true } } }
        });
        if (!detailPendaftar) {
            req.flash('error_msg', 'Data pendaftar tidak ditemukan.');
            return res.redirect('/aslab/rekap/pendaftar');
        }
        res.render('aslab/rekap/detail-pendaftar', {
            layout: 'aslab/layout/main',
            title: 'Detail Pendaftar',
            user: req.session.user,
            detail: detailPendaftar,
            activePage: 'rekap/pendaftar'
        });
    } catch (error) {
        console.error("Gagal mengambil detail pendaftar:", error);
        req.flash('error_msg', 'Terjadi kesalahan server.');
        res.redirect('/aslab/rekap/pendaftar');
    }
};

export const deletePendaftar = async (req, res) => {
    try {
        const pendaftarId = parseInt(req.params.id);
        const pendaftaran = await prisma.pendaftaran.findUnique({
            where: { id: pendaftarId },
        });
        if (pendaftaran) {
            await prisma.pendaftaran.delete({
                where: { id: pendaftarId },
            });
            req.flash('success_msg', 'Data pendaftar berhasil dihapus.');
        } else {
            req.flash('error_msg', 'Data pendaftar tidak ditemukan.');
        }
    } catch (error) {
        console.error("Gagal menghapus pendaftar:", error);
        req.flash('error_msg', 'Terjadi kesalahan saat menghapus data.');
    } finally {
        res.redirect('/aslab/rekap/pendaftar');
    }
};