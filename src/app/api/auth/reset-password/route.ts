import { NextRequest, NextResponse } from 'next/server';
import { resetPassword } from '@/lib/password-reset';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const schema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = schema.parse(body);

    // Get email from token validation
    const { email } = await resetPassword(token, password);

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json({ 
      success: true,
      message: 'Password reset successfully' 
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Failed to reset password' 
      },
      { status: 400 }
    );
  }
}












