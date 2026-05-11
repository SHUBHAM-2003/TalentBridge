import express from 'express';
import { applyToJob, getMyApplications, withdrawApplication } from '../controllers/application.controller.js';
import { protect, candidateOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, candidateOnly, applyToJob);
router.get('/mine', protect, candidateOnly, getMyApplications);
router.delete('/:id', protect, candidateOnly, withdrawApplication);

export default router;
