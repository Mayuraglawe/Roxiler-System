import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return 200 even if user not found to prevent email enumeration
      return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' }, { status: 200 });
    }

    // Generate a secure random token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

    // Delete any existing tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { email },
    });

    // Save the new token
    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expiresAt,
      },
    });

    // Simulate sending email by logging to console
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    console.log('\n======================================================');
    console.log('EMAIL SIMULATION: PASSWORD RESET LINK GENERATED');
    console.log('To:', email);
    console.log('Link:', resetLink);
    console.log('======================================================\n');

    return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' }, { status: 200 });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
