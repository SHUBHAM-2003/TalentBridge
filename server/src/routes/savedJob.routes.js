import express from 'express';
import { protect } from '../middleware/auth.js';
import { saveJob, unsaveJob, getSavedJobs } from '../controllers/savedJob.controller.js';

const router = express.Router();

router.get('/', protect, getSavedJobs);
router.post('/:jobId', protect, saveJob);
router.delete('/:jobId', protect, unsaveJob);

export default router;
