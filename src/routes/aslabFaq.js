// routes/aslabFaq.js
import express from 'express';
import {
    listFaqs, showCreateForm, createFaq,
    showEditForm, updateFaq, deleteFaq
} from '../controllers/aslabFaqController.js';
import { ensureAuthenticated, ensureRole } from '../middleware/auth.js';

const router = express.Router();

router.use(ensureAuthenticated, ensureRole('asisten_lab'));

router.get('/', listFaqs);
router.get('/create', showCreateForm);
router.post('/create', createFaq);
router.get('/:id/edit', showEditForm);
router.post('/:id/edit', updateFaq);
router.post('/:id/delete', deleteFaq);

export default router;
