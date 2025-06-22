import prisma from '../models/prisma.js';

export const getKelompokPage = async (req, res) => {
    try {
        const kelompok = await prisma.kelompok.findMany({
            include: {
                user: true, // Mentor
                magang: {
                    include: {
                        pendaftaran: {
                            include: {
                                user: true // Detail user dari anggota
                            }
                        }
                    }
                }
            },
            orderBy: {
                nama: 'asc'
            }
        });
        res.render('aslab/kelompok/index', {
            kelompok,
            user: req.user,
            layout: 'aslab/layout/main',
            title: 'Manajemen Kelompok'
        });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Gagal memuat halaman kelompok.');
        res.redirect('/aslab/dashboard');
    }
};

export const getCreateKelompokPage = async (req, res) => {
    try {
        const existingMentorIds = (await prisma.kelompok.findMany({
            select: { user_id: true }
        })).map(k => k.user_id);

        const availableMentors = await prisma.user.findMany({
            where: {
                role: 'asisten_lab',
                id: { notIn: existingMentorIds }
            }
        });

        const existingMemberIds = (await prisma.magang.findMany({
            select: { pendaftaran_id: true }
        })).map(m => m.pendaftaran_id);

        const availableMembers = await prisma.pendaftaran.findMany({
            where: {
                status: 'diterima',
                id: { notIn: existingMemberIds }
            },
            include: {
                user: true
            }
        });

        res.render('aslab/kelompok/create', {
            mentors: availableMentors,
            members: availableMembers,
            user: req.user,
            layout: 'aslab/layout/main',
            title: 'Buat Kelompok'
        });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Gagal memuat halaman buat kelompok.');
        res.redirect('/aslab/kelompok');
    }
};

export const createKelompok = async (req, res) => {
    const { nama, deskripsi, user_id, anggota } = req.body;
    const memberIds = Array.isArray(anggota) ? anggota : (anggota ? [anggota] : []);

    if (!nama || !user_id || memberIds.length === 0) {
        req.flash('error_msg', 'Nama Kelompok, Mentor, dan Anggota wajib diisi.');
        return res.redirect('/aslab/kelompok/create');
    }
    if (memberIds.length > 4) {
        req.flash('error_msg', 'Jumlah anggota tidak boleh lebih dari 4 orang.');
        return res.redirect('/aslab/kelompok/create');
    }

    try {
        await prisma.$transaction(async (tx) => {
            const newKelompok = await tx.kelompok.create({
                data: {
                    nama,
                    deskripsi: deskripsi || null,
                    user_id: parseInt(user_id, 10),
                }
            });

            const magangData = memberIds.map(pendaftaranId => ({
                pendaftaran_id: parseInt(pendaftaranId, 10),
                kelompok_id: newKelompok.id,
            }));

            await tx.magang.createMany({ data: magangData });
        });

        req.flash('success_msg', 'Kelompok baru berhasil dibuat.');
        res.redirect('/aslab/kelompok');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Gagal membuat kelompok. Pastikan mentor atau anggota belum terdaftar di kelompok lain.');
        res.redirect('/aslab/kelompok/create');
    }
};

export const getEditKelompokPage = async (req, res) => {
    try {
        const { id } = req.params;
        const kelompok = await prisma.kelompok.findUnique({
            where: { id: parseInt(id) },
            include: {
                magang: { select: { pendaftaran_id: true } }
            }
        });

        if (!kelompok) {
            req.flash('error_msg', 'Kelompok tidak ditemukan.');
            return res.redirect('/aslab/kelompok');
        }

        const currentMemberIds = kelompok.magang.map(m => m.pendaftaran_id);
        const existingMentorIds = (await prisma.kelompok.findMany({
            where: { NOT: { id: parseInt(id) } },
            select: { user_id: true }
        })).map(k => k.user_id);

        const availableMentors = await prisma.user.findMany({
            where: {
                role: 'asisten_lab',
                id: { notIn: existingMentorIds }
            }
        });

        const existingMemberIdsInOtherGroups = (await prisma.magang.findMany({
            where: { NOT: { kelompok_id: parseInt(id) } },
            select: { pendaftaran_id: true }
        })).map(m => m.pendaftaran_id);

        const availableMembers = await prisma.pendaftaran.findMany({
            where: {
                status: 'diterima',
                id: { notIn: existingMemberIdsInOtherGroups }
            },
            include: { user: true }
        });

        res.render('aslab/kelompok/edit', {
            kelompok,
            mentors: availableMentors,
            members: availableMembers,
            currentMemberIds,
            user: req.user,
            layout: 'aslab/layout/main',
            title: 'Edit Kelompok'
        });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Gagal memuat halaman edit kelompok.');
        res.redirect('/aslab/kelompok');
    }
};

export const updateKelompok = async (req, res) => {
    const { id } = req.params;
    const { nama, deskripsi, user_id, anggota } = req.body;
    const memberIds = Array.isArray(anggota) ? anggota : (anggota ? [anggota] : []);

    if (!nama || !user_id || memberIds.length === 0) {
        req.flash('error_msg', 'Nama Kelompok, Mentor, dan Anggota wajib diisi.');
        return res.redirect(`/aslab/kelompok/edit/${id}`);
    }
    if (memberIds.length > 4) {
        req.flash('error_msg', 'Jumlah anggota tidak boleh lebih dari 4 orang.');
        return res.redirect(`/aslab/kelompok/edit/${id}`);
    }

    try {
        await prisma.$transaction(async (tx) => {
            await tx.kelompok.update({
                where: { id: parseInt(id) },
                data: {
                    nama,
                    deskripsi: deskripsi || null,
                    user_id: parseInt(user_id, 10)
                }
            });

            await tx.magang.deleteMany({ where: { kelompok_id: parseInt(id) } });

            const magangData = memberIds.map(pendaftaranId => ({
                pendaftaran_id: parseInt(pendaftaranId, 10),
                kelompok_id: parseInt(id)
            }));
            await tx.magang.createMany({ data: magangData });
        });

        req.flash('success_msg', 'Kelompok berhasil diperbarui.');
        res.redirect('/aslab/kelompok');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Gagal memperbarui kelompok.');
        res.redirect(`/aslab/kelompok/edit/${id}`);
    }
};

export const deleteKelompok = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.$transaction(async (tx) => {
            await tx.magang.deleteMany({
                where: { kelompok_id: parseInt(id) }
            });
            await tx.kelompok.delete({
                where: { id: parseInt(id) }
            });
        });

        req.flash('success_msg', 'Kelompok berhasil dihapus.');
        res.redirect('/aslab/kelompok');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Gagal menghapus kelompok.');
        res.redirect('/aslab/kelompok');
    }
};