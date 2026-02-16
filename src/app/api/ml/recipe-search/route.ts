import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { mlService, MLRecipeSearchRequest } from "@/lib/ml-service";

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

    const body: MLRecipeSearchRequest = await request.json();

    // Ищем рецепты в интернете
    const results = await mlService.searchInternetRecipes(body);

    return NextResponse.json(results);

  } catch (error) {
    console.error("ML recipe search error:", error);

    return NextResponse.json({
      recipes: [],
      totalFound: 0,
      searchQuery: "error",
      error: "Failed to search recipes"
    }, { status: 500 });
  }
}
