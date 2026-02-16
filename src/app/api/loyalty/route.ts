import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getLoyaltyStats, getLoyaltyHistory, getAvailableRewards, initializeLoyaltyRewards } from "@/lib/loyalty-service";

// GET /api/loyalty - Получить информацию о лояльности пользователя
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'stats':
        const stats = await getLoyaltyStats(session.user.id);
        return NextResponse.json(stats);

      case 'history':
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = (page - 1) * limit;
        const history = await getLoyaltyHistory(session.user.id, limit, offset);
        return NextResponse.json(history);

      case 'rewards':
        const availableRewards = await getAvailableRewards();
        return NextResponse.json({ rewards: availableRewards });

      default:
        // Возвращаем общую информацию
        const [userStats, rewardsList] = await Promise.all([
          getLoyaltyStats(session.user.id),
          getAvailableRewards()
        ]);

        return NextResponse.json({
          stats: userStats,
          availableRewards: rewardsList
        });
    }

  } catch (error) {
    console.error("Loyalty API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/loyalty - Действия с программой лояльности
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
    const { action } = body;

    switch (action) {
      case 'init-rewards':
        // Инициализация стандартных наград (только для админов)
        if (session.user.role !== 'ADMIN') {
          return NextResponse.json(
            { error: "Admin access required" },
            { status: 403 }
          );
        }

        const result = await initializeLoyaltyRewards();
        return NextResponse.json(result);

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error("Loyalty POST API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
