import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';
import { AppError } from '../middleware/errorHandler.js';
import { sendEmail, emailTemplates } from '../services/emailService.js';

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '15m' });
const signRefreshToken = (id) => jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' });

export const register = async (req, res, next) => {
  try {
    const { email, password, fullName, phone, city } = req.body;
    
    if (!email || !password || !fullName) {
      throw new AppError('Email, password, and full name are required', 400);
    }
    
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new AppError('Email already registered', 400);
    
    const passwordHash = await bcrypt.hash(password, 12);
    
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'CANDIDATE',
        candidateProfile: {
          create: { fullName, phone, city }
        }
      },
      include: { candidateProfile: true }
    });
    
    const accessToken = signToken(user.id);
    const refreshToken = signRefreshToken(user.id);
    
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
    
    res.status(201).json({
      status: 'success',
      data: {
        user: { id: user.id, email: user.email, role: user.role, profile: user.candidateProfile },
        accessToken
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) throw new AppError('Email and password required', 400);
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new AppError('Invalid email or password', 401);
    }
    
    const accessToken = signToken(user.id);
    const refreshToken = signRefreshToken(user.id);
    
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
    
    const profile = user.role === 'CANDIDATE' 
      ? await prisma.candidateProfile.findUnique({ where: { userId: user.id } })
      : null;
    
    res.json({
      status: 'success',
      data: { user: { id: user.id, email: user.email, role: user.role, profile }, accessToken }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ status: 'success', message: 'Logged out' });
};

export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) throw new AppError('No refresh token', 401);
    
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) throw new AppError('User not found', 401);
    
    const accessToken = signToken(user.id);
    res.json({ status: 'success', data: { accessToken } });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { candidateProfile: true }
    });
    
    if (!user) throw new AppError('User not found', 404);
    
    res.json({ status: 'success', data: { user } });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (user) {
      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
      
      await prisma.emailToken.create({
        data: { userId: user.id, token, type: 'password_reset', expiresAt }
      });
      
      const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
      await sendEmail({ to: email, ...emailTemplates.passwordReset(resetUrl) });
    }
    
    res.json({ status: 'success', message: 'If email exists, reset link will be sent' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    
    const emailToken = await prisma.emailToken.findUnique({ where: { token } });
    if (!emailToken || emailToken.expiresAt < new Date()) {
      throw new AppError('Invalid or expired token', 400);
    }
    
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { id: emailToken.userId },
      data: { passwordHash }
    });
    
    await prisma.emailToken.delete({ where: { id: emailToken.id } });
    
    res.json({ status: 'success', message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};
