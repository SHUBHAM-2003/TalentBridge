import prisma from '../utils/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

export const getCompanies = async (req, res, next) => {
  try {
    const { industry, search, page = 1 } = req.query;
    const take = 12;
    
    const where = {};
    if (industry) where.industry = industry;
    if (search) where.name = { contains: search, mode: 'insensitive' };
    
    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        include: { _count: { select: { jobs: true } } },
        skip: (parseInt(page) - 1) * take,
        take
      }),
      prisma.company.count({ where })
    ]);
    
    res.json({
      status: 'success',
      data: { companies, total, page: parseInt(page), totalPages: Math.ceil(total / take) }
    });
  } catch (error) {
    next(error);
  }
};

export const getCompany = async (req, res, next) => {
  try {
    const company = await prisma.company.findUnique({
      where: { id: req.params.id },
      include: {
        jobs: {
          where: { status: 'ACTIVE' },
          include: { _count: { select: { applications: true } } }
        }
      }
    });
    
    if (!company) throw new AppError('Company not found', 404);
    
    res.json({ status: 'success', data: { company } });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedCompanies = async (req, res, next) => {
  try {
    const companies = await prisma.company.findMany({
      take: 12,
      include: { _count: { select: { jobs: true } } }
    });
    
    res.json({ status: 'success', data: { companies } });
  } catch (error) {
    next(error);
  }
};
