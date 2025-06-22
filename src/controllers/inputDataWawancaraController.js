import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all pewawancara
export const getAllPewawancara = async (req, res) => {
    try {
        const pewawancara = await prisma.pewawancara.findMany({
             orderBy: { id: 'asc' }
        });
        res.json(pewawancara);
    } catch (error) {
        console.error('Error fetching pewawancara:', error);
        res.status(500).json({ message: 'Error fetching data' });
    }
};

// Create new pewawancara
export const createPewawancara = async (req, res) => {
    try {
        const { nama, kontak } = req.body;
        if (!nama || !kontak) {
            return res.status(400).json({ message: 'Nama dan kontak harus diisi.' });
        }
        if (nama.length < 2 || kontak.length < 10) {
            return res.status(400).json({ message: 'Nama minimal 2 karakter dan kontak minimal 10 karakter.' });
        }
        const pewawancara = await prisma.pewawancara.create({
            data: { nama, kontak }
        });
        return res.status(201).json({ message: 'Pewawancara berhasil ditambahkan', data: pewawancara });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Gagal menambahkan pewawancara', error: error.message });
    }
};

// Update pewawancara
export const updatePewawancara = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama, kontak } = req.body;
        
        console.log('Updating pewawancara:', { id, nama, kontak });
        
        if (!nama || !kontak) {
            return res.status(400).json({ 
                message: "Nama dan kontak tidak boleh kosong" 
            });
        }
        
        if (nama.trim().length < 2) {
            return res.status(400).json({ 
                message: "Nama harus minimal 2 karakter" 
            });
        }
        
        if (kontak.trim().length < 10) {
            return res.status(400).json({ 
                message: "Kontak harus minimal 10 karakter" 
            });
        }
        
        const pewawancara = await prisma.pewawancara.update({
            where: { id: parseInt(id) },
            data: { 
                nama: nama.trim(), 
                kontak: kontak.trim() 
            }
        });
        
        console.log('Successfully updated pewawancara:', pewawancara);
        res.json({
            message: 'Data berhasil diperbarui',
            data: pewawancara
        });
    } catch (error) {
        console.error('Error updating pewawancara:', error);
        
        if (error.code === 'P2025') {
            return res.status(404).json({ 
                message: 'Data tidak ditemukan' 
            });
        }
        
        if (error.code === 'P2002') {
            return res.status(400).json({ 
                message: "Data dengan nama atau kontak yang sama sudah ada" 
            });
        }
        
        res.status(500).json({ 
            message: 'Gagal memperbarui data',
            error: error.message 
        });
    }
};

// Delete pewawancara
export const deletePewawancara = async (req, res) => {
    try {
        const { id } = req.params;
        
        console.log('Deleting pewawancara with ID:', id);
        
        await prisma.pewawancara.delete({
            where: { id: parseInt(id) }
        });
        
        console.log('Successfully deleted pewawancara with ID:', id);
        res.status(200).json({ message: 'Data berhasil dihapus' });
    } catch (error) {
        console.error('Error deleting pewawancara:', error);
        
        if (error.code === 'P2025') {
            return res.status(404).json({ 
                message: 'Data tidak ditemukan' 
            });
        }
        
        res.status(500).json({ 
            message: 'Gagal menghapus data',
            error: error.message 
        });
    }
};

// Render input data wawancara page
export const renderInputDataWawancara = async (req, res) => {
    try {
        res.render('aslab/layout/inputdatawawancara', {
            title: 'Input Data Pewawancara',
            layout: 'aslab/layout/main',
            activePage: 'inputDataWawancara',
            user: req.session.user || { name: 'Aslab' },
            success_msg: req.flash('success_msg'),
            error_msg: req.flash('error_msg')
        });
    } catch (error) {
        console.error('Error rendering page:', error);
        res.status(500).send('Error loading page');
    }
}; 