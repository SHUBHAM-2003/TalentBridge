import prisma from '../utils/prisma.js';
import { AppError } from '../middleware/errorHandler.js';
import { sendEmail, emailTemplates } from '../services/emailService.js';

export const applyToJob = async (req, res, next) => {
  try {
    const { jobId, coverLetter } = req.body;
    
    const profile = await prisma.candidateProfile.findUnique({ where: { userId: req.user.id } });
    if (!profile) throw new AppError('Profile not found', 404);
    
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { company: true }
    });
    if (!job) throw new AppError('Job not found', 404);
    if (job.status !== 'ACTIVE') throw new AppError('Job is not accepting applications', 400);
    
    const existing = await prisma.application.findUnique({
      where: { jobId_candidateId: { jobId, candidateId: profile.id } }
    });
    if (existing) throw new AppError('Already applied to this job', 400);
    
    const application = await prisma.application.create({
      data: { jobId, candidateId: profile.id, coverLetter },
      include: { job: { include: { company: true } }, candidate: true }
    });
    
    await prisma.notification.create({
      data: {
        userId: req.user.id,
        title: 'Application Submitted',
        message: `You applied to ${job.title} at ${job.company.name}`
      }
    });
    
    await sendEmail({
      to: req.user.email,
      ...emailTemplates.applicationReceived(profile.fullName, job.title, job.company.name)
    });
    
    res.status(201).json({ status: 'success', data: { application } });
  } catch (error) {
    next(error);
  }
};

export const getMyApplications = async (req, res, next) => {
  try {
    const profile = await prisma.candidateProfile.findUnique({ where: { userId: req.user.id } });
    if (!profile) throw new AppError('Profile not found', 404);
    
    const applications = await prisma.application.findMany({
      where: { candidateId: profile.id },
      include: {
        job: { include: { company: true } },
        interviews: true
      },
      orderBy: { appliedAt: 'desc' }
    });
    
    res.json({ status: 'success', data: { applications } });
  } catch (error) {
    next(error);
  }
};

export const withdrawApplication = async (req, res, next) => {
  try {
    const profile = await prisma.candidateProfile.findUnique({ where: { userId: req.user.id } });
    if (!profile) throw new AppError('Profile not found', 404);
    
    const application = await prisma.application.findUnique({
      where: { id: req.params.id }
    });
    
    if (!application || application.candidateId !== profile.id) {
      throw new AppError('Application not found', 404);
    }
    if (application.status !== 'APPLIED') {
      throw new AppError('Can only withdraw applications with "Applied" status', 400);
    }
    
    await prisma.application.delete({ where: { id: req.params.id } });
    
    res.json({ status: 'success', message: 'Application withdrawn' });
  } catch (error) {
    next(error);
  }
};
