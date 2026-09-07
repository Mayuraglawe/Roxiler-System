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

    const { query } = await request.json();
    if (!query || !query.trim()) {
      return NextResponse.json({ message: 'Query is required' }, { status: 400 });
    }

    const stores = await prisma.store.findMany({
      include: { ratings: true },
    });

    // Compute average ratings
    const storesWithRating = stores.map(store => {
      const totalScore = store.ratings.reduce((acc, r) => acc + r.score, 0);
      const avgRating = store.ratings.length > 0 ? Number((totalScore / store.ratings.length).toFixed(1)) : 0;
      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        avgRating,
        totalRatings: store.ratings.length,
      };
    });

    const searchLower = query.toLowerCase().trim();

    // Match stores based on intent
    const matchingStores = storesWithRating
      .filter(s => {
        if (searchLower.includes('best') || searchLower.includes('top') || searchLower.includes('highest')) {
          return s.avgRating >= 4.0;
        }
        return (
          s.name.toLowerCase().includes(searchLower) ||
          s.address.toLowerCase().includes(searchLower) ||
          s.email.toLowerCase().includes(searchLower)
        );
      })
      .sort((a, b) => b.avgRating - a.avgRating);

    const results = matchingStores.length > 0 ? matchingStores : storesWithRating.sort((a, b) => b.avgRating - a.avgRating).slice(0, 3);

    let aiReasoning = '';
    if (searchLower.includes('best') || searchLower.includes('top')) {
      aiReasoning = `Based on high rating threshold algorithms, I have prioritized stores with the highest customer satisfaction scores.`;
    } else if (matchingStores.length > 0) {
      aiReasoning = `Found ${matchingStores.length} store(s) directly matching your query "${query}". Recommended based on customer rating metrics.`;
    } else {
      aiReasoning = `No direct keyword match found for "${query}". Here are the top-rated stores overall on the platform.`;
    }

    return NextResponse.json({
      query,
      aiReasoning,
      recommendedStores: results,
      totalMatches: results.length,
    });
  } catch (error) {
    console.error('AI Recommend Error:', error);
    return NextResponse.json({ message: 'Failed to process AI recommendation' }, { status: 500 });
  }
}
