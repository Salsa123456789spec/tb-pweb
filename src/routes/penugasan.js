import express from 'express';
import { ensureAuthenticated, ensureRole } from '../middleware/auth.js';
import {
    getAssignments,
    getAssignmentDetail,
    uploadAssignment,
    getAssignmentUploadForm
} from '../controllers/penugasanController.js';
import upload from '../middleware/upload.js'; // Import the upload middleware


const router = express.Router();

// Route to display assignments (accessible by aslab and mahasiswa)
router.get('/mahasiswa/assignments', ensureAuthenticated, ensureRole(['asisten_lab', 'mahasiswa']), getAssignments);

// Route to display the assignment upload form
router.get('/:assignmentId/upload', ensureAuthenticated, ensureRole('mahasiswa'), getAssignmentUploadForm);

// Route to handle assignment submission (file upload)
router.post('/:assignmentId/upload', ensureAuthenticated, ensureRole('mahasiswa'), upload.single('submission_file'), uploadAssignment);

// Route to display individual assignment details
router.get('/:assignmentId', ensureAuthenticated, ensureRole(['asisten_lab', 'mahasiswa']), getAssignmentDetail);


export default router;