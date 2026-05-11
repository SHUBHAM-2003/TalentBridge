import prisma from '../utils/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

export const getProfile = async (req, res, next) => {
  try {
    const profile = await prisma.candidateProfile.findUnique({
      where: { userId: req.user.id },
      include: {
        user: { select: { email: true, role: true } },
        applications: {
          include: { job: { include: { company: true } } },
          orderBy: { appliedAt: 'desc' }
        }
      }
    });
    
    if (!profile) throw new AppError('Profile not found', 404);
    
    res.json({ status: 'success', data: { profile } });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { fullName, phone, city, state, bio, skills, experienceYears, education, linkedinUrl } = req.body;
    
    const profile = await prisma.candidateProfile.update({
      where: { userId: req.user.id },
      data: {
        fullName, phone, city, state, bio, skills, experienceYears, education, linkedinUrl
      },
      include: { user: { select: { email: true, role: true } } }
    });
    
    res.json({ status: 'success', data: { profile } });
  } catch (error) {
    next(error);
  }
};

export const uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) throw new AppError('No file uploaded', 400);
    
    const photoUrl = `/uploads/photos/${req.file.filename}`;
    
    const profile = await prisma.candidateProfile.update({
      where: { userId: req.user.id },
      data: { profilePhotoUrl: photoUrl }
    });
    
    res.json({ status: 'success', data: { profile } });
  } catch (error) {
    next(error);
  }
};

export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) throw new AppError('No file uploaded', 400);
    
    const resumeUrl = `/uploads/resumes/${req.file.filename}`;
    
    const profile = await prisma.candidateProfile.update({
      where: { userId: req.user.id },
      data: { resumeUrl }
    });
    
    res.json({ status: 'success', data: { profile } });
  } catch (error) {
    next(error);
  }
};
