import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/products/[slug]/reviews - Получить отзывы о продукте
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Найти продукт по slug
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
      select: { id: true, name: true }
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Получить отзывы
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: {
          productId: product.id,
          isVerified: true // Только проверенные отзывы
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      }),
      prisma.review.count({
        where: {
          productId: product.id,
          isVerified: true
        }
      })
    ]);

    // Рассчитать средний рейтинг
    const ratings = await prisma.review.findMany({
      where: {
        productId: product.id,
        isVerified: true
      },
      select: { rating: true }
    });

    const averageRating = ratings.length > 0
      ? ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / ratings.length
      : 0;

    const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
      rating,
      count: ratings.filter((r: any) => r.rating === rating).length
    }));

    return NextResponse.json({
      reviews: reviews.map((review: any) => ({
        id: review.id,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        createdAt: review.createdAt,
        user: {
          name: review.user.name || 'Анонимный пользователь',
          isVerified: review.user.email ? true : false
        }
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution,
      totalReviews: ratings.length
    });

  } catch (error) {
    console.error("Get reviews error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/products/[slug]/reviews - Создать отзыв
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { rating, title, comment } = body;

    // Валидация
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    if (!comment || comment.trim().length < 10) {
      return NextResponse.json(
        { error: "Comment must be at least 10 characters long" },
        { status: 400 }
      );
    }

    // Найти продукт
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
      select: { id: true }
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Проверить, не оставлял ли пользователь уже отзыв
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        productId: product.id
      }
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 400 }
      );
    }

    // Создать отзыв
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        productId: product.id,
        rating,
        title: title?.trim(),
        comment: comment.trim()
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      review: {
        id: review.id,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        createdAt: review.createdAt,
        user: {
          name: review.user.name || 'Анонимный пользователь',
          isVerified: review.user.email ? true : false
        }
      }
    }, { status: 201 });

  } catch (error) {
    console.error("Create review error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
