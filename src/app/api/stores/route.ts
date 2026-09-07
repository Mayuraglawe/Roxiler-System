import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userRole = (session.user as any).role || 'USER';
  const userId = (session.user as any).id;

  try {
    let stores;
    if (userRole === 'ADMIN' || userRole === 'USER') {
      stores = await prisma.store.findMany({
        include: {
          ratings: true,
          owner: { select: { name: true, email: true } },
        },
        orderBy: { name: 'asc' },
      });
    } else {
      // STORE_OWNER
      stores = await prisma.store.findMany({
        where: { ownerId: userId },
        include: {
          ratings: true,
        },
        orderBy: { name: 'asc' },
      });
    }

    // Compute average rating
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const storesWithRating = stores.map((store: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const totalScore = store.ratings.reduce((acc: any, rating: any) => acc + rating.score, 0);
      const avgRating = store.ratings.length > 0 ? (totalScore / store.ratings.length).toFixed(1) : 0;
      
      let userRating = null;
      if (userRole === 'USER') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rating = store.ratings.find((r: any) => r.userId === userId);
        if (rating) userRating = rating.score;
      }

      return {
        ...store,
        avgRating,
        totalRatings: store.ratings.length,
        userRating,
      };
    });

    return NextResponse.json(storesWithRating);
  } catch (error) {
    console.error('Error fetching stores:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userRole = (session.user as any).role || 'USER';

  if (userRole !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const { name, email, address, ownerEmail } = await request.json();

    if (!name || !email || !address || !ownerEmail) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const owner = await prisma.user.findUnique({ where: { email: ownerEmail } });
    
    if (!owner || owner.role !== 'STORE_OWNER') {
      return NextResponse.json({ message: 'Owner not found or is not a STORE_OWNER' }, { status: 400 });
    }

    const existingStore = await prisma.store.findUnique({ where: { email } });
    if (existingStore) {
      return NextResponse.json({ message: 'Store email already registered' }, { status: 409 });
    }

    const store = await prisma.store.create({
      data: {
        name,
        email,
        address,
        ownerId: owner.id,
      },
    });

    return NextResponse.json({ message: 'Store created successfully', store }, { status: 201 });
  } catch (error) {
    console.error('Error creating store:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
