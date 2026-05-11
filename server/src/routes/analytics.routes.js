import express from 'express';
import { protect } from '../middleware/auth.js';
import { getOverview, getApplicationsOverTime, getStatusDistribution, getTopCompanies } from '../controllers/analytics.controller.js';

const router = express.Router();

router.get('/overview', protect, getOverview);
router.get('/applications-over-time', protect, getApplicationsOverTime);
router.get('/status-distribution', protect, getStatusDistribution);
router.get('/top-companies', protect, getTopCompanies);

export default router;
