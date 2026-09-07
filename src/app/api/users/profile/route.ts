import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { name, address } = await request.json();

    if (!name || name.trim().length < 2 || name.trim().length > 60) {
      return NextResponse.json({ message: 'Name must be between 2 and 60 characters' }, { status: 400 });
    }

    if (address && address.length > 400) {
      return NextResponse.json({ message: 'Address must not exceed 400 characters' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name.trim(),
        address: address ? address.trim() : null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
      },
    });

    return NextResponse.json({ message: 'Profile updated successfully!', user: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ message: 'An error occurred while updating profile' }, { status: 500 });
  }
}
