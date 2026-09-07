import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const currentUserId = (session.user as { id: string }).id;
    const currentUserRole = (session.user as { role?: string }).role || 'MEMBER';

    // Verify current user is an ADMIN or Project Owner
    if (currentUserRole !== 'ADMIN') {
      // Check if user owns any project to allow administrative invitation
      const ownedProjectCount = await prisma.project.count({
        where: { ownerId: currentUserId }
      });
      if (ownedProjectCount === 0) {
        return NextResponse.json({ message: 'Only Admins can invite teammates to the platform' }, { status: 403 });
      }
    }

    const { name, email, password, role, projectId } = await request.json();

    if (!email || !name) {
      return NextResponse.json({ message: 'Name and Email are required' }, { status: 400 });
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    const userRole = role === 'ADMIN' ? 'ADMIN' : 'MEMBER';

    if (!user) {
      // Auto-generate password if not provided
      const defaultPassword = password || 'NovaPass123!';
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      const newUserPayload = {
        name,
        email,
        passwordHash: hashedPassword,
        role: userRole,
      };

      user = await prisma.user.create({
        data: newUserPayload as unknown as Parameters<typeof prisma.user.create>[0]['data'],
      });
    } else {
      // Update role if changed
      const updateRolePayload = { role: userRole };
      user = await prisma.user.update({
        where: { id: user.id },
        data: updateRolePayload as unknown as Parameters<typeof prisma.user.update>[0]['data'],
      });
    }

    // If a projectId was provided, automatically assign user to the project as well
    if (projectId) {
      const existingMembership = await prisma.projectMember.findFirst({
        where: { projectId, userId: user.id }
      });

      if (!existingMembership) {
        await prisma.projectMember.create({
          data: {
            projectId,
            userId: user.id,
            role: userRole === 'ADMIN' ? 'ADMIN' : 'MEMBER'
          }
        });
      }
    }

    const invitedUserObj = user as unknown as { id: string; name: string | null; email: string; role?: string };

    return NextResponse.json({
      message: 'Teammate invited successfully',
      user: {
        id: invitedUserObj.id,
        name: invitedUserObj.name,
        email: invitedUserObj.email,
        role: invitedUserObj.role || userRole,
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Admin invite error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
