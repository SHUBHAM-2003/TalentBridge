import prisma from '../utils/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

const take = 12;

export const getJobs = async (req, res, next) => {
  try {
    const { keyword, city, jobType, industry, experience, salaryMin, salaryMax, sort, page = 1, status = 'ACTIVE' } = req.query;
    
    const where = { status: status === 'all' ? undefined : 'ACTIVE' };
    
    if (keyword) {
      where.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { skillsRequired: { hasSome: [keyword.toLowerCase()] } }
      ];
    }
    if (city) where.location = { contains: city, mode: 'insensitive' };
    if (jobType) where.jobType = jobType;
    if (salaryMin) where.salaryMin = { gte: parseInt(salaryMin) };
    if (salaryMax) where.salaryMax = { lte: parseInt(salaryMax) };
    if (experience) {
      const [min, max] = experience.split('-').map(v => v === '5+' ? 99 : parseInt(v));
      where.experienceRequired = { gte: min, lte: max || 99 };
    }
    
    const orderBy = sort === 'salary_high' ? { salaryMax: 'desc' } 
      : sort === 'salary_low' ? { salaryMin: 'asc' }
      : { createdAt: 'desc' };
    
    const skip = (parseInt(page) - 1) * take;
    
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: { company: true },
        orderBy,
        skip,
        take
      }),
      prisma.job.count({ where })
    ]);
    
    res.json({
      status: 'success',
      data: { jobs, total, page: parseInt(page), totalPages: Math.ceil(total / take) }
    });
  } catch (error) {
    next(error);
  }
};

export const getJob = async (req, res, next) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: req.params.id },
      include: { company: true }
    });
    
    if (!job) throw new AppError('Job not found', 404);
    
    res.json({ status: 'success', data: { job } });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedJobs = async (req, res, next) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { status: 'ACTIVE' },
      include: { company: true },
      orderBy: { createdAt: 'desc' },
      take: 6
    });
    
    res.json({ status: 'success', data: { jobs } });
  } catch (error) {
    next(error);
  }
};

export const getRelatedJobs = async (req, res, next) => {
  try {
    const job = await prisma.job.findUnique({ where: { id: req.params.id } });
    if (!job) throw new AppError('Job not found', 404);
    
    const jobs = await prisma.job.findMany({
      where: {
        id: { not: job.id },
        status: 'ACTIVE',
        OR: [
          { companyId: job.companyId },
          { skillsRequired: { hasSome: job.skillsRequired } }
        ]
      },
      include: { company: true },
      take: 3
    });
    
    res.json({ status: 'success', data: { jobs } });
  } catch (error) {
    next(error);
  }
};
