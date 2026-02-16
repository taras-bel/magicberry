import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { mlService, MLChatRequest } from "@/lib/ml-service";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body: MLChatRequest = await request.json();

    // Обрабатываем сообщение с использованием ML
    const response = await mlService.processChatMessage(body);

    return NextResponse.json(response);

  } catch (error) {
    console.error("ML chat error:", error);

    // Fallback к простому чату
    const { message } = await request.json();

    const fallbackResponse = {
      response: "Извините, ИИ временно недоступен. Попробуйте спросить о рецептах или продуктах.",
      suggestions: [
        {
          type: "recipe" as const,
          title: "Попробуйте этот рецепт",
          description: "Классический рецепт с вашими продуктами",
          data: { recipeSlug: "maffiny-s-klyukvoj" }
        }
      ],
      confidence: 0.5
    };

    return NextResponse.json(fallbackResponse);
  }
}
