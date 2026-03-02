import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { recipeGenerator } from "@/lib/recipe-generator";

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

    const body = await request.json();
    const { ingredients, userProducts = [] } = body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json(
        { error: "Ingredients are required" },
        { status: 400 }
      );
    }

    // Форматируем ингредиенты: если это продукты Latvbelfruits, добавляем бренд
    const formattedIngredients = ingredients.map((ing: string) => {
      const lowerIng = ing.toLowerCase();
      if (lowerIng.includes('клюква') || lowerIng.includes('вишня') || lowerIng.includes('тыква') || lowerIng.includes('вялен')) {
        if (!ing.includes('от Latvbelfruits')) {
          return `${ing} от Latvbelfruits`;
        }
      }
      return ing;
    });

    // Генерируем рецепт
    const recipe = await recipeGenerator.generateRecipe(formattedIngredients, {
      difficulty: 'easy',
      timeLimit: 60,
      cuisine: 'российская'
    });

    if (!recipe) {
      return NextResponse.json(
        { error: "Failed to generate recipe" },
        { status: 500 }
      );
    }

    return NextResponse.json({ recipe });

  } catch (error) {
    console.error("Recipe generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

