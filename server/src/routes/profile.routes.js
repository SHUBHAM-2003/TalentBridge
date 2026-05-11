import express from 'express';
import { getProfile, updateProfile } from '../controllers/profile.controller.js';
import { protect, candidateOnly } from '../middleware/auth.js';
import { uploadPhoto, uploadResume, handleUpload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', protect, candidateOnly, getProfile);
router.put('/', protect, candidateOnly, updateProfile);
router.post('/photo', protect, candidateOnly, uploadPhoto, handleUpload(uploadPhoto));
router.post('/resume', protect, candidateOnly, uploadResume, handleUpload(uploadResume));

export default router;
