import express from 'express';
import { getJobs, getJob, getFeaturedJobs, getRelatedJobs } from '../controllers/job.controller.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/featured', getFeaturedJobs);
router.get('/:id', optionalAuth, getJob);
router.get('/:id/related', getRelatedJobs);

export default router;
