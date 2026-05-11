import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { createJob, updateJob, updateJobStatus, deleteJob, getAdminJobs } from '../controllers/adminJob.controller.js';
import { createCompany, updateCompany, deleteCompany, getAdminCompanies } from '../controllers/adminCompany.controller.js';
import { getAllApplications, getApplication, updateApplicationStatus, updateApplicationNotes, scheduleInterview } from '../controllers/adminApplication.controller.js';
import { getAllCandidates, getCandidate } from '../controllers/adminCandidate.controller.js';
import { uploadLogo, handleUpload } from '../middleware/upload.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/jobs', getAdminJobs);
router.post('/jobs', createJob);
router.put('/jobs/:id', updateJob);
router.patch('/jobs/:id/status', updateJobStatus);
router.delete('/jobs/:id', deleteJob);

router.get('/companies', getAdminCompanies);
router.post('/companies', createCompany);
router.put('/companies/:id', updateCompany);
router.post('/companies/:id/logo', uploadLogo, handleUpload(uploadLogo));
router.delete('/companies/:id', deleteCompany);

router.get('/applications', getAllApplications);
router.get('/applications/:id', getApplication);
router.patch('/applications/:id/status', updateApplicationStatus);
router.put('/applications/:id/notes', updateApplicationNotes);
router.post('/applications/:id/interview', scheduleInterview);

router.get('/candidates', getAllCandidates);
router.get('/candidates/:id', getCandidate);

export default router;
