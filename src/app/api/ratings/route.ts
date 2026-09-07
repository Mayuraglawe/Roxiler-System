import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userRole = (session.user as any).role || 'USER';
    const userId = (session.user as any).id;

    if (userRole !== 'USER') {
      return NextResponse.json({ message: 'Only normal users can submit ratings' }, { status: 403 });
    }

    const { storeId, score } = await request.json();

    if (!storeId || score === undefined || score < 1 || score > 5) {
      return NextResponse.json({ message: 'Invalid rating data' }, { status: 400 });
    }

    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) {
      return NextResponse.json({ message: 'Store not found' }, { status: 404 });
    }

    const rating = await prisma.rating.upsert({
      where: {
        userId_storeId: {
          userId,
          storeId,
        }
      },
      update: {
        score,
      },
      create: {
        score,
        userId,
        storeId,
      }
    });

    return NextResponse.json({ message: 'Rating submitted successfully', rating }, { status: 201 });
  } catch (error) {
    console.error('Error submitting rating:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
