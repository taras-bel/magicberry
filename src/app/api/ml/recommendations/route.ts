import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { mlService, MLRecommendationRequest } from "@/lib/ml-service";
import { aiRecommendationService } from "@/lib/ai-recommendations";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || 'guest';

    const body: MLRecommendationRequest = await request.json();

    // Получаем рекомендации с использованием ML
    const recommendations = await mlService.getProductRecommendations(body);

    return NextResponse.json({ recommendations });

  } catch (error) {
    console.error("ML recommendations error:", error);

    // Fallback к простым рекомендациям
    const { userProducts, limit = 6 } = await request.json();
    const session = await getServerSession(authOptions);
    const fallbackRecommendations = aiRecommendationService
      .getRecommendations(session?.user?.id || 'guest', undefined, limit);

    return NextResponse.json({
      recommendations: await fallbackRecommendations,
      fallback: true
    });
  }
}
