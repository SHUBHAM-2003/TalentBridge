import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadDir = path.join(__dirname, '..', '..', process.env.UPLOAD_DIR || 'uploads');

['/photos', '/resumes', '/logos'].forEach(dir => {
  const fullPath = path.join(uploadDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = '/misc';
    if (file.fieldname === 'photo') folder = '/photos';
    else if (file.fieldname === 'resume') folder = '/resumes';
    else if (file.fieldname === 'logo') folder = '/logos';
    
    const dest = path.join(uploadDir, folder);
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = {
    photo: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    resume: ['application/pdf'],
    logo: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  };
  
  const field = file.fieldname;
  if (allowed[field]?.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${field}`), false);
  }
};

const limits = {
  fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024
};

export const uploadPhoto = multer({ storage, fileFilter: (req, file, cb) => fileFilter(req, file, cb), limits: { fileSize: limits.fileSize } }).single('photo');
export const uploadResume = multer({ storage, fileFilter: (req, file, cb) => fileFilter(req, file, cb), limits: { fileSize: limits.fileSize } }).single('resume');
export const uploadLogo = multer({ storage, fileFilter: (req, file, cb) => fileFilter(req, file, cb), limits: { fileSize: limits.fileSize } }).single('logo');

export const handleUpload = (upload) => (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ status: 'error', message: 'File too large. Maximum size is 5MB.' });
      }
      return res.status(400).json({ status: 'error', message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No file uploaded' });
    }
    next();
  });
};
