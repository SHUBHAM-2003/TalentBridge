import express from 'express';
import { protect } from '../middleware/auth.js';
import { uploadPhoto, uploadResume, uploadLogo, handleUpload } from '../middleware/upload.js';

const router = express.Router();

router.post('/photo', protect, uploadPhoto, handleUpload(uploadPhoto));
router.post('/resume', protect, uploadResume, handleUpload(uploadResume));
router.post('/logo', protect, uploadLogo, handleUpload(uploadLogo));

export default router;
