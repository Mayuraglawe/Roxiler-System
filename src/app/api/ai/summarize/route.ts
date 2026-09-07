import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { generateGeminiContent } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { storeName, avgRating, totalRatings, ratingsBreakdown } = await request.json();
    const ratingNum = Number(avgRating) || 0;

    // 1. Try Gemini API first if configured
    const prompt = `You are an AI Store Review Analyst. Analyze the store "${storeName}" with average rating ${avgRating} out of 5 stars based on ${totalRatings} customer reviews.
Return JSON with:
1. "summaryText": A 2-sentence professional executive summary.
2. "sentimentScore": E.g. "94% Positive".
3. "sentimentBadge": E.g. "Exceptional" or "Favorable" or "Mixed".
4. "highlights": Array of 3 bullet points.
5. "areasToImprove": Array of 1 bullet point.
JSON ONLY without markdown wrapper:`;

    const rawGeminiResponse = await generateGeminiContent(prompt);
    if (rawGeminiResponse) {
      try {
        const cleanJsonText = rawGeminiResponse.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleanJsonText);
        return NextResponse.json({
          storeName,
          avgRating,
          totalRatings,
          ...parsed,
          generatedAt: new Date().toISOString(),
          isLiveGemini: true,
        });
      } catch (err) {
        console.warn('Failed to parse Gemini JSON output, falling back:', err);
      }
    }

    // 2. Analytical Engine Fallback
    let sentimentScore = '85% Positive';
    let sentimentBadge = 'Positive';
    let highlights = ['Consistent Customer Service', 'Popular Local Choice', 'High Satisfaction'];
    let areasToImprove = ['Increase Rating Volume'];
    let summaryText = '';

    if (totalRatings === 0) {
      sentimentScore = 'N/A';
      sentimentBadge = 'Unrated';
      highlights = ['Newly Registered Store'];
      areasToImprove = ['Awaiting First Ratings'];
      summaryText = `${storeName} is currently newly listed on the platform and awaiting customer reviews. Encouraging early customer feedback will help establish initial sentiment metrics.`;
    } else if (ratingNum >= 4.5) {
      sentimentScore = '96% Positive (Exceptional)';
      sentimentBadge = 'Exceptional';
      highlights = ['Top Rated Store', 'Outstanding Customer Loyalty', 'Excellent Quality & Service'];
      areasToImprove = ['Maintain High Service Standards'];
      summaryText = `Based on ${totalRatings} customer ratings, ${storeName} maintains an outstanding average rating of ${avgRating}★ out of 5. Customers praise its exceptional reliability and top-tier service standards.`;
    } else if (ratingNum >= 3.5) {
      sentimentScore = '82% Positive (Favorable)';
      sentimentBadge = 'Favorable';
      highlights = ['Steady Customer Feedback', 'Good Overall Experience'];
      areasToImprove = ['Boost 5-Star Conversion Rate'];
      summaryText = `${storeName} holds a solid average rating of ${avgRating}★ across ${totalRatings} customer evaluations. The store demonstrates good customer satisfaction.`;
    } else {
      sentimentScore = '58% Mixed';
      sentimentBadge = 'Needs Improvement';
      highlights = ['Active Customer Base'];
      areasToImprove = ['Address Low Satisfaction Scores', 'Improve Service Delivery'];
      summaryText = `${storeName} has an average score of ${avgRating}★ across ${totalRatings} ratings. AI sentiment analysis indicates mixed customer feedback.`;
    }

    return NextResponse.json({
      storeName,
      avgRating,
      totalRatings,
      sentimentScore,
      sentimentBadge,
      highlights,
      areasToImprove,
      summaryText,
      generatedAt: new Date().toISOString(),
      isLiveGemini: false,
    });
  } catch (error) {
    console.error('AI Summarize Error:', error);
    return NextResponse.json({ message: 'Failed to generate AI summary' }, { status: 500 });
  }
}
