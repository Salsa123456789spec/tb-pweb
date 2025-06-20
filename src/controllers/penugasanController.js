import prisma from '../models/prisma.js';
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all assignments
export const getAssignments = async (req, res) => {
    try {
        const user = req.session.user; // Get the logged-in user from the session

        // Fetch all assignments and include submission status for the current user
        const assignmentsWithSubmissionStatus = await prisma.tugas.findMany({
            orderBy: {
                deadline: 'asc' // Order by deadline ascending
            },
            include: {
                pengumpulanTugas: {
                    where: {
                        user_id: user.id // Filter submissions for the current user
                    },
                    select: {
                        id: true // We only need to know if a submission exists
                    }
                }
            }
        });

        // Add a 'submitted' flag to each assignment object for easier rendering in EJS
        const assignments = assignmentsWithSubmissionStatus.map(assignment => ({
            ...assignment,
            submitted: assignment.pengumpulanTugas.length > 0 // Check if there's a submission for this user
        }));


        res.render('mahasiswa/assignments', {
            layout: 'mahasiswa/layout/main', // Use the main layout
            title: 'Daftar Penugasan', // Page title
            user: req.session.user, // Pass user data
            assignments, // Pass the augmented assignments array
            activePage: 'penugasan', // Set active page for sidebar highlighting
            success_msg: req.flash('success_msg'), // Pass flash messages
            error_msg: req.flash('error_msg') // Pass flash messages
        });
    } catch (error) {
        console.error('Error fetching assignments:', error);
        req.flash('error_msg', 'Terjadi kesalahan saat mengambil data penugasan.'); // Flash error message
        res.redirect('/mahasiswa/dashboard'); // Redirect on error
    }
};

// Get assignment detail
export const getAssignmentDetail = async (req, res) => {
    const { assignmentId } = req.params;
    try {
        const assignment = await prisma.tugas.findUnique({
            where: {
                id: parseInt(assignmentId)
            }
        });

        if (!assignment) {
            req.flash('error_msg', 'Tugas tidak ditemukan.');
            return res.redirect('/penugasan');
        }

        // Check if the current user has already submitted this assignment
        let submission = null;
        if (req.session.user && req.session.user.role === 'mahasiswa') {
            submission = await prisma.pengumpulanTugas.findFirst({
                where: {
                    tugas_id: parseInt(assignmentId),
                    user_id: req.session.user.id
                }
            });
        }

        res.render('mahasiswa/assignmentDetail', {
            layout: 'mahasiswa/layout/main',
            title: assignment.judul,
            user: req.session.user,
            assignment,
            submission, // Pass submission data to the view
            activePage: 'penugasan',
            success_msg: req.flash('success_msg'),
            error_msg: req.flash('error_msg')
        });
    } catch (error) {
        console.error('Error fetching assignment detail:', error);
        req.flash('error_msg', 'Terjadi kesalahan saat mengambil detail tugas.');
        res.redirect('/penugasan');
    }
};

// Display assignment upload form
export const getAssignmentUploadForm = async (req, res) => {
    const { assignmentId } = req.params;
    try {
        const assignment = await prisma.tugas.findUnique({
            where: {
                id: parseInt(assignmentId)
            }
        });

        if (!assignment) {
            req.flash('error_msg', 'Tugas tidak ditemukan.');
            return res.redirect('/penugasan');
        }

        // Check if the user has already submitted
        const existingSubmission = await prisma.pengumpulanTugas.findFirst({
            where: {
                tugas_id: parseInt(assignmentId),
                user_id: req.session.user.id
            }
        });

        res.render('mahasiswa/uploadAssignment', {
            layout: 'mahasiswa/layout/main',
            title: `Upload Tugas: ${assignment.judul}`,
            user: req.session.user,
            assignment,
            existingSubmission, // Pass existing submission to pre-fill/inform
            activePage: 'penugasan',
            success_msg: req.flash('success_msg'),
            error_msg: req.flash('error_msg')
        });
    } catch (error) {
        console.error('Error rendering upload form:', error);
        req.flash('error_msg', 'Terjadi kesalahan saat memuat halaman upload tugas.');
        res.redirect(`/mahasiswa/${assignmentId}`);
    }
};


// Handle assignment upload
export const uploadAssignment = async (req, res) => {
    const { assignmentId } = req.params;
    const user = req.session.user; // Mahasiswa who is submitting

    try {
        if (!req.file) {
            req.flash('error_msg', 'Silakan pilih file untuk diunggah.');
            return res.redirect(`/mahasiswa/${assignmentId}/upload`);
        }

        const submissionFileName = req.file.filename;

        // Check if an existing submission exists for this user and assignment
        const existingSubmission = await prisma.pengumpulanTugas.findFirst({
            where: {
                tugas_id: parseInt(assignmentId),
                user_id: user.id
            }
        });

        if (existingSubmission) {
            // Update existing submission
            await prisma.pengumpulanTugas.update({
                where: {
                    id: existingSubmission.id
                },
                data: {
                    file_path: submissionFileName,
                    submitted_at: new Date() // Update submission time
                }
            });
            req.flash('success_msg', 'Tugas berhasil diperbarui!');
        } else {
            // Create new submission
            await prisma.pengumpulanTugas.create({
                data: {
                    tugas_id: parseInt(assignmentId),
                    user_id: user.id,
                    file_path: submissionFileName,
                    submitted_at: new Date()
                }
            });
            req.flash('success_msg', 'Tugas berhasil diunggah!');
        }
        res.redirect(`/mahasiswa/${assignmentId}`);

    } catch (error) {
        console.error('Error uploading assignment:', error);
        req.flash('error_msg', 'Terjadi kesalahan saat mengunggah tugas.');
        res.redirect(`/mahasiswa/${assignmentId}/upload`);
    }
};