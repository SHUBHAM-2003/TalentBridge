import prisma from '../utils/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

export const createJob = async (req, res, next) => {
  try {
    const { companyId, title, description, requirements, responsibilities, jobType, location, salaryMin, salaryMax, salaryCurrency, experienceRequired, skillsRequired, deadline, status } = req.body;
    
    if (!companyId || !title || !description || !jobType || !location) {
      throw new AppError('Company, title, description, job type, and location are required', 400);
    }
    
    const company = await prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new AppError('Company not found', 404);
    
    const job = await prisma.job.create({
      data: {
        companyId, title, description, requirements, responsibilities, jobType,
        location, salaryMin, salaryMax, salaryCurrency, experienceRequired,
        skillsRequired, deadline, status: status || 'DRAFT',
        createdByAdminId: req.user.id
      },
      include: { company: true }
    });
    
    res.status(201).json({ status: 'success', data: { job } });
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const job = await prisma.job.update({
      where: { id: req.params.id },
      data: req.body,
      include: { company: true }
    });
    
    res.json({ status: 'success', data: { job } });
  } catch (error) {
    next(error);
  }
};

export const updateJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const job = await prisma.job.update({
      where: { id: req.params.id },
      data: { status }
    });
    
    res.json({ status: 'success', data: { job } });
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    await prisma.job.delete({ where: { id: req.params.id } });
    res.json({ status: 'success', message: 'Job deleted' });
  } catch (error) {
    next(error);
  }
};

export const getAdminJobs = async (req, res, next) => {
  try {
    const { status, companyId, search, page = 1 } = req.query;
    const take = 10;
    
    const where = {};
    if (status && status !== 'all') where.status = status;
    if (companyId) where.companyId = companyId;
    if (search) where.title = { contains: search, mode: 'insensitive' };
    
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: { company: true, _count: { select: { applications: true } } },
        skip: (parseInt(page) - 1) * take,
        take,
        orderBy: { createdAt: 'desc' }
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
