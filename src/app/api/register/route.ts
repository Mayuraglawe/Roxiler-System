import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { name, email, password, role, address } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    if (name.length < 7 || name.length > 60) {
      return NextResponse.json({ message: 'Name must be between 7 and 60 characters' }, { status: 400 });
    }

    if (address && address.length > 400) {
      return NextResponse.json({ message: 'Address must be at most 400 characters' }, { status: 400 });
    }

    if (password.length < 8 || password.length > 16 || !/[A-Z]/.test(password) || !/[^a-zA-Z0-9]/.test(password)) {
      return NextResponse.json({ message: 'Password must be 8-16 characters, with at least 1 uppercase and 1 special character' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Invalid email address' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    // Determine role: if first user on platform, default to ADMIN, otherwise requested role or USER
    const userCount = await prisma.user.count();
    const assignedRole = userCount === 0 ? 'ADMIN' : (role === 'STORE_OWNER' ? 'STORE_OWNER' : 'USER');

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserPayload = {
      name,
      email,
      passwordHash: hashedPassword,
      address,
      role: assignedRole,
    };

    const user = await prisma.user.create({
      data: newUserPayload as unknown as Parameters<typeof prisma.user.create>[0]['data'],
    });

    const userObj = user as unknown as { id: string; name: string | null; email: string; address?: string | null; role?: string };

    // Return the user without the password hash
    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: userObj.id,
        name: userObj.name,
        email: userObj.email,
        address: userObj.address,
        role: userObj.role || assignedRole,
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
