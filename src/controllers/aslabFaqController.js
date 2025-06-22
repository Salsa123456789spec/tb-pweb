// controllers/aslabFaqController.js
import prisma from '../models/prisma.js';

export const listFaqs = async (req, res) => {
    const faqs = await prisma.fAQ.findMany();
    res.render('aslab/faq/index', { title: 'Manajemen FAQ', layout: 'aslab/layout/main',user: req.session.user, activePage: 'faq', faqs });
};

export const showCreateForm = (req, res) => {
    res.render('aslab/faq/create', { title: 'Tambah FAQ', layout: 'aslab/layout/main',user: req.session.user, activePage: 'faq' });
};

export const createFaq = async (req, res) => {
    const { pertanyaan, jawaban } = req.body;
    await prisma.fAQ.create({ data: { pertanyaan, jawaban } });
    req.flash('success_msg', 'FAQ berhasil ditambahkan.');
    res.redirect('/aslab/faq');
};

export const showEditForm = async (req, res) => {
    const id = Number(req.params.id);
    const faq = await prisma.fAQ.findUnique({ where: { id } });
    if (!faq) return res.redirect('/aslab/faq');
    res.render('aslab/faq/edit', { title: 'Edit FAQ', layout: 'aslab/layout/main',user: req.session.user, activePage: 'faq', faq });
};

export const updateFaq = async (req, res) => {
    const id = Number(req.params.id);
    const { pertanyaan, jawaban } = req.body;
    await prisma.fAQ.update({ where: { id }, data: { pertanyaan, jawaban } });
    req.flash('success_msg', 'FAQ berhasil diperbarui.');
    res.redirect('/aslab/faq');
};

export const deleteFaq = async (req, res) => {
    const id = Number(req.params.id);
    await prisma.fAQ.delete({ where: { id } });
    req.flash('success_msg', 'FAQ berhasil dihapus.');
    res.redirect('/aslab/faq');
};
