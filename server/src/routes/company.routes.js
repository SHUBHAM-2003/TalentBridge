import express from 'express';
import { getCompanies, getCompany, getFeaturedCompanies } from '../controllers/company.controller.js';

const router = express.Router();

router.get('/', getCompanies);
router.get('/featured', getFeaturedCompanies);
router.get('/:id', getCompany);

export default router;
