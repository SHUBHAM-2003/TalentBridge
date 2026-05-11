import prisma from '../utils/prisma.js';

export const getAllCandidates = async (req, res, next) => {
  try {
    const { search, city, experience, page = 1 } = req.query;
    const take = 10;
    
    const where = {};
    if (search) where.fullName = { contains: search, mode: 'insensitive' };
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (experience) where.experienceYears = { gte: parseInt(experience) };
    
    const [candidates, total] = await Promise.all([
      prisma.candidateProfile.findMany({
        where,
        include: {
          user: { select: { email: true } },
          _count: { select: { applications: true } }
        },
        skip: (parseInt(page) - 1) * take,
        take,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.candidateProfile.count({ where })
    ]);
    
    res.json({
      status: 'success',
      data: { candidates, total, page: parseInt(page), totalPages: Math.ceil(total / take) }
    });
  } catch (error) {
    next(error);
  }
};

export const getCandidate = async (req, res, next) => {
  try {
    const candidate = await prisma.candidateProfile.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { email: true } },
        applications: {
          include: { job: { include: { company: true } } }
        }
      }
    });
    
    if (!candidate) throw new AppError('Candidate not found', 404);
    
    res.json({ status: 'success', data: { candidate } });
  } catch (error) {
    next(error);
  }
};
