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

    const { name, address } = await request.json();
    if (!name) {
      return NextResponse.json({ message: 'Store name is required' }, { status: 400 });
    }

    // Try Gemini API first if configured
    const prompt = `Write a catchy 1-sentence marketing tagline for a store named "${name}" located at "${address || 'Downtown'}". Return ONLY the tagline string without quotes.`;
    const geminiTagline = await generateGeminiContent(prompt);

    if (geminiTagline) {
      return NextResponse.json({
        name,
        tagline: geminiTagline.trim(),
        suggestedHighlights: ['⚡ Fast Service', '🌟 Customer Favorite', '🏆 Verified Business'],
        isLiveGemini: true,
      });
    }

    // Fallback engine
    const taglines = [
      `Premier destination for quality and service in ${address ? address.split(',')[0] : 'your city'}.`,
      `Bringing top-rated excellence and customer satisfaction to ${name}.`,
      `Where quality meets trust — your favorite store for top-tier service.`,
      `Delivering excellence, reliability, and 5-star customer experiences daily.`,
    ];

    const randomIndex = Math.floor(Math.random() * taglines.length);
    return NextResponse.json({
      name,
      tagline: taglines[randomIndex],
      suggestedHighlights: ['⚡ Fast Service', '🌟 Customer Favorite', '🏆 Verified Business'],
      isLiveGemini: false,
    });
  } catch (error) {
    console.error('AI Tagline Error:', error);
    return NextResponse.json({ message: 'Failed to generate tagline' }, { status: 500 });
  }
}
