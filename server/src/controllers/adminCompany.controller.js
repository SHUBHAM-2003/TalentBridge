import prisma from '../utils/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

export const createCompany = async (req, res, next) => {
  try {
    const { name, industry, website, description, city, state } = req.body;
    
    if (!name || !industry) throw new AppError('Name and industry are required', 400);
    
    const company = await prisma.company.create({
      data: { name, industry, website, description, city, state }
    });
    
    res.status(201).json({ status: 'success', data: { company } });
  } catch (error) {
    next(error);
  }
};

export const updateCompany = async (req, res, next) => {
  try {
    const company = await prisma.company.update({
      where: { id: req.params.id },
      data: req.body
    });
    
    res.json({ status: 'success', data: { company } });
  } catch (error) {
    next(error);
  }
};

export const deleteCompany = async (req, res, next) => {
  try {
    await prisma.company.delete({ where: { id: req.params.id } });
    res.json({ status: 'success', message: 'Company deleted' });
  } catch (error) {
    next(error);
  }
};

export const getAdminCompanies = async (req, res, next) => {
  try {
    const companies = await prisma.company.findMany({
      include: { _count: { select: { jobs: true } } },
      orderBy: { name: 'asc' }
    });
    
    res.json({ status: 'success', data: { companies } });
  } catch (error) {
    next(error);
  }
};
