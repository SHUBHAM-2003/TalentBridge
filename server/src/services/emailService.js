import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('Email service not configured. Would have sent:', { to, subject });
      return { success: true, messageId: 'mock-id' };
    }
    const info = await transporter.sendMail({
      from: `"TalentBridge" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
};

export const emailTemplates = {
  applicationReceived: (candidateName, jobTitle, companyName) => ({
    subject: `Application Received - ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1E40AF;">Application Received!</h2>
        <p>Hi ${candidateName},</p>
        <p>Thank you for applying to <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
        <p>We have received your application and will review it shortly. You will be notified of any updates.</p>
        <p>Best regards,<br/>The TalentBridge Team</p>
      </div>
    `
  }),
  statusUpdate: (candidateName, jobTitle, status) => ({
    subject: `Application Status Update - ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1E40AF;">Application Status Update</h2>
        <p>Hi ${candidateName},</p>
        <p>Your application for <strong>${jobTitle}</strong> has been updated to: <strong style="color: #F59E0B;">${status.replace('_', ' ')}</strong></p>
        <p>Check your dashboard for more details.</p>
        <p>Best regards,<br/>The TalentBridge Team</p>
      </div>
    `
  }),
  interviewScheduled: (candidateName, jobTitle, date, location) => ({
    subject: `Interview Scheduled - ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1E40AF;">Interview Scheduled!</h2>
        <p>Hi ${candidateName},</p>
        <p>Congratulations! You have been invited to an interview for <strong>${jobTitle}</strong>.</p>
        <p><strong>Date:</strong> ${new Date(date).toLocaleString()}</p>
        <p><strong>Location/Link:</strong> ${location || 'Will be shared shortly'}</p>
        <p>Best regards,<br/>The TalentBridge Team</p>
      </div>
    `
  }),
  passwordReset: (resetUrl) => ({
    subject: 'Reset Your Password - TalentBridge',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1E40AF;">Password Reset Request</h2>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <p><a href="${resetUrl}" style="background: #1E40AF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
        <p>This link expires in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `
  })
};
