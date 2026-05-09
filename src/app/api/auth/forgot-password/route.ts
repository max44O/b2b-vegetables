import { NextRequest, NextResponse } from 'next/server';
import { generatePasswordResetToken, sendPasswordResetEmail } from '@/lib/password-reset';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = schema.parse(body);

    // Generate reset token
    const resetToken = await generatePasswordResetToken(email);
    
    // Send reset email
    await sendPasswordResetEmail(email, resetToken);

    return NextResponse.json({ 
      success: true,
      message: 'Password reset email sent successfully' 
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Failed to send reset email' 
      },
      { status: 400 }
    );
  }
}












