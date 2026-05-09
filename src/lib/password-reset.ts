import { sendEmail } from '@/lib/email';
import crypto from 'crypto';

// Temporary in-memory storage for reset tokens
const resetTokens = new Map<string, { email: string; expiresAt: Date }>();

export async function generatePasswordResetToken(email: string) {
  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
  
  // Store in memory
  resetTokens.set(resetToken, { email, expiresAt: resetTokenExpiry });
  
  // Clean up expired tokens
  cleanupExpiredTokens();

  return resetToken;
}

function cleanupExpiredTokens() {
  const now = new Date();
  const tokensToDelete: string[] = [];
  
  // Convert Map to Array for iteration
  resetTokens.forEach((data, token) => {
    if (data.expiresAt < now) {
      tokensToDelete.push(token);
    }
  });
  
  // Delete expired tokens
  tokensToDelete.forEach(token => resetTokens.delete(token));
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #16a34a;">Password Reset Request</h2>
      <p>You requested a password reset for your account.</p>
      <p>Click the button below to reset your password:</p>
      <a href="${resetUrl}" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0;">
        Reset Password
      </a>
      <p style="color: #666; font-size: 14px;">
        This link will expire in 1 hour. If you didn't request this reset, please ignore this email.
      </p>
      <p style="color: #666; font-size: 14px;">
        If the button doesn't work, copy and paste this link into your browser:<br>
        <a href="${resetUrl}">${resetUrl}</a>
      </p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: 'Password Reset Request - Vegetable Wholesale Co.',
    html,
  });
}

export async function resetPassword(token: string, newPassword: string) {
  const tokenData = resetTokens.get(token);
  
  if (!tokenData || tokenData.expiresAt < new Date()) {
    throw new Error('Invalid or expired reset token');
  }

  // Token is valid, now update the password via API
  // This will be handled by the reset-password API route
  
  // Clean up used token
  resetTokens.delete(token);
  
  return { email: tokenData.email };
}
