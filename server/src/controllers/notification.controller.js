import prisma from '../utils/prisma.js';

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    
    res.json({ status: 'success', data: { notifications } });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.id, id: { in: req.body.ids || [] } },
      data: { read: true }
    });
    
    res.json({ status: 'success' });
  } catch (error) {
    next(error);
  }
};
