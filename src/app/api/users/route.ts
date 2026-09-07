import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userRole = (session.user as any).role || 'USER';
    const userId = (session.user as any).id;
    const url = new URL(request.url);
    const storeOnly = url.searchParams.get('storeOnly'); // For Store Owners to see their raters

    if (userRole === 'STORE_OWNER' && storeOnly === 'true') {
      const store = await prisma.store.findFirst({ where: { ownerId: userId } });
      if (!store) return NextResponse.json([]);
      
      const ratings = await prisma.rating.findMany({
        where: { storeId: store.id },
        include: { user: { select: { id: true, name: true, email: true, address: true, role: true } } }
      });
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const users = ratings.map((r: any) => ({ ...r.user, submittedRating: r.score }));
      return NextResponse.json(users);
    }

    if (userRole !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        ownedStores: {
          select: {
            ratings: { select: { score: true } }
          }
        }
      },
      orderBy: { name: 'asc' },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const usersWithRatings = users.map((u: any) => {
      let storeRating = null;
      if (u.role === 'STORE_OWNER' && u.ownedStores.length > 0) {
        const store = u.ownedStores[0];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const total = store.ratings.reduce((acc: any, r: any) => acc + r.score, 0);
        storeRating = store.ratings.length > 0 ? (total / store.ratings.length).toFixed(1) : 0;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { ownedStores, ...rest } = u;
      return { ...rest, storeRating };
    });

    return NextResponse.json(usersWithRatings);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
