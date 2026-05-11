import prisma from '../utils/prisma.js';
import { AppError } from '../middleware/errorHandler.js';
import { sendEmail, emailTemplates } from '../services/emailService.js';

export const getAllApplications = async (req, res, next) => {
  try {
    const { status, jobId, companyId, search, page = 1 } = req.query;
    const take = 10;
    
    const where = {};
    if (status && status !== 'all') where.status = status;
    if (jobId) where.jobId = jobId;
    if (companyId) where.job = { companyId };
    if (search) {
      where.OR = [
        { candidate: { fullName: { contains: search, mode: 'insensitive' } } },
        { job: { title: { contains: search, mode: 'insensitive' } } }
      ];
    }
    
    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: {
          candidate: true,
          job: { include: { company: true } },
          interviews: true
        },
        skip: (parseInt(page) - 1) * take,
        take,
        orderBy: { appliedAt: 'desc' }
      }),
      prisma.application.count({ where })
    ]);
    
    res.json({
      status: 'success',
      data: { applications, total, page: parseInt(page), totalPages: Math.ceil(total / take) }
    });
  } catch (error) {
    next(error);
  }
};

export const getApplication = async (req, res, next) => {
  try {
    const application = await prisma.application.findUnique({
      where: { id: req.params.id },
      include: {
        candidate: { include: { user: { select: { email: true } } } },
        job: { include: { company: true } },
        interviews: true
      }
    });
    
    if (!application) throw new AppError('Application not found', 404);
    
    res.json({ status: 'success', data: { application } });
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    const application = await prisma.application.update({
      where: { id: req.params.id },
      data: { status },
      include: { candidate: true, job: { include: { company: true } } }
    });
    
    await prisma.notification.create({
      data: {
        userId: application.candidate.userId,
        title: 'Application Status Updated',
        message: `Your application for ${application.job.title} is now ${status.replace('_', ' ')}`
      }
    });
    
    await sendEmail({
      to: application.candidate.user.email,
      ...emailTemplates.statusUpdate(application.candidate.fullName, application.job.title, status)
    });
    
    res.json({ status: 'success', data: { application } });
  } catch (error) {
    next(error);
  }
};

export const updateApplicationNotes = async (req, res, next) => {
  try {
    const { adminNotes } = req.body;
    
    const application = await prisma.application.update({
      where: { id: req.params.id },
      data: { adminNotes }
    });
    
    res.json({ status: 'success', data: { application } });
  } catch (error) {
    next(error);
  }
};

export const scheduleInterview = async (req, res, next) => {
  try {
    const { scheduledAt, locationOrLink, notes } = req.body;
    
    const application = await prisma.application.update({
      where: { id: req.params.id },
      data: { status: 'INTERVIEW_SCHEDULED' },
      include: { candidate: true, job: { include: { company: true } } }
    });
    
    await prisma.interview.create({
      data: { applicationId: req.params.id, scheduledAt: new Date(scheduledAt), locationOrLink, notes }
    });
    
    await prisma.notification.create({
      data: {
        userId: application.candidate.userId,
        title: 'Interview Scheduled',
        message: `Interview for ${application.job.title} scheduled for ${new Date(scheduledAt).toLocaleString()}`
      }
    });
    
    await sendEmail({
      to: application.candidate.user.email,
      ...emailTemplates.interviewScheduled(application.candidate.fullName, application.job.title, scheduledAt, locationOrLink)
    });
    
    res.json({ status: 'success', message: 'Interview scheduled' });
  } catch (error) {
    next(error);
  }
};
