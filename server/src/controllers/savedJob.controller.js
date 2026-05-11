import prisma from '../utils/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

export const saveJob = async (req, res, next) => {
  try {
    const job = await prisma.job.findUnique({ where: { id: req.params.jobId } });
    if (!job) throw new AppError('Job not found', 404);
    
    const existing = await prisma.savedJob.findUnique({
      where: { userId_jobId: { userId: req.user.id, jobId: req.params.jobId } }
    });
    if (existing) throw new AppError('Job already saved', 400);
    
    await prisma.savedJob.create({
      data: { userId: req.user.id, jobId: req.params.jobId }
    });
    
    res.status(201).json({ status: 'success', message: 'Job saved' });
  } catch (error) {
    next(error);
  }
};

export const unsaveJob = async (req, res, next) => {
  try {
    await prisma.savedJob.delete({
      where: { userId_jobId: { userId: req.user.id, jobId: req.params.jobId } }
    });
    
    res.json({ status: 'success', message: 'Job removed from saved' });
  } catch (error) {
    if (error.code !== 'P2025') next(error);
    else res.json({ status: 'success', message: 'Job not in saved list' });
  }
};

export const getSavedJobs = async (req, res, next) => {
  try {
    const saved = await prisma.savedJob.findMany({
      where: { userId: req.user.id },
      include: { job: { include: { company: true } } },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ status: 'success', data: { jobs: saved.map(s => s.job) } });
  } catch (error) {
    next(error);
  }
};
