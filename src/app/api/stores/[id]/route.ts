import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userRole = (session.user as any).role || 'USER';
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { id } = params;

    const store = await prisma.store.findUnique({ where: { id } });
    if (!store) {
      return NextResponse.json({ message: 'Store not found' }, { status: 404 });
    }

    await prisma.store.delete({ where: { id } });

    return NextResponse.json({ message: 'Store deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting store:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
