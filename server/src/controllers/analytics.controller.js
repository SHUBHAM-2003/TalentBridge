import prisma from '../utils/prisma.js';

export const getOverview = async (req, res, next) => {
  try {
    const [totalJobs, activeJobs, totalCandidates, totalApplications, shortlisted, interviewsThisWeek, hiredThisMonth] = await Promise.all([
      prisma.job.count(),
      prisma.job.count({ where: { status: 'ACTIVE' } }),
      prisma.user.count({ where: { role: 'CANDIDATE' } }),
      prisma.application.count(),
      prisma.application.count({ where: { status: 'SHORTLISTED' } }),
      prisma.interview.count({
        where: {
          scheduledAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      }),
      prisma.application.count({
        where: {
          status: 'HIRED',
          updatedAt: { gte: new Date(new Date().setDate(1)) }
        }
      })
    ]);
    
    res.json({
      status: 'success',
      data: { totalJobs, activeJobs, totalCandidates, totalApplications, shortlisted, interviewsThisWeek, hiredThisMonth }
    });
  } catch (error) {
    next(error);
  }
};

export const getApplicationsOverTime = async (req, res, next) => {
  try {
    const days = 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const applications = await prisma.application.findMany({
      where: { appliedAt: { gte: startDate } },
      select: { appliedAt: true }
    });
    
    const data = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const count = applications.filter(a => a.appliedAt.toDateString() === date.toDateString()).length;
      data.push({ date: date.toISOString().split('T')[0], count });
    }
    
    res.json({ status: 'success', data: { chartData: data } });
  } catch (error) {
    next(error);
  }
};

export const getStatusDistribution = async (req, res, next) => {
  try {
    const statuses = ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'REJECTED', 'HIRED'];
    
    const counts = await Promise.all(
      statuses.map(status =>
        prisma.application.count({ where: { status } }).then(count => ({ status, count }))
      )
    );
    
    res.json({ status: 'success', data: { distribution: counts } });
  } catch (error) {
    next(error);
  }
};

export const getTopCompanies = async (req, res, next) => {
  try {
    const companies = await prisma.company.findMany({
      include: {
        _count: { select: { jobs: true } }
      },
      orderBy: { jobs: { _count: 'desc' } },
      take: 5
    });
    
    res.json({ status: 'success', data: { companies } });
  } catch (error) {
    next(error);
  }
};
