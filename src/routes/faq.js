import express from 'express';
import { ensureAuthenticated } from '../middleware/auth.js';
import { getFaqPage } from '../controllers/faqController.js';

const router = express.Router();

router.get('/', ensureAuthenticated, getFaqPage);

export default router;