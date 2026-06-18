import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { salaryQuerySchema } from "@/lib/schemas";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const parseResult = salaryQuerySchema.safeParse({
      company: searchParams.get("company") ?? undefined,
      role: searchParams.get("role") ?? undefined,
      level: searchParams.get("level") ?? undefined,
      location: searchParams.get("location") ?? undefined,
      currency: searchParams.get("currency") ?? undefined,
      sort: searchParams.get("sort") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", issues: parseResult.error.issues },
        { status: 400 }
      );
    }

    const { company, role, level, location, currency, sort, page, limit } =
      parseResult.data;

    const where: Record<string, unknown> = {};

    if (company) {
      where.company = {
        OR: [
          { name: { contains: company, mode: "insensitive" } },
          { slug: { contains: company, mode: "insensitive" } },
        ],
      };
    }

    if (role) {
      where.role = { contains: role, mode: "insensitive" };
    }

    if (level) {
      where.level = level;
    }

    if (location) {
      where.location = { contains: location, mode: "insensitive" };
    }

    if (currency) {
      where.currency = currency;
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.salary.findMany({
        where,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: { [sort]: "desc" },
        skip,
        take: limit,
      }),
      prisma.salary.count({ where }),
    ]);

    const response = NextResponse.json(
      {
        data,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );

    response.headers.set(
      "Cache-Control",
      "s-maxage=300, stale-while-revalidate=3600"
    );

    return response;
  } catch (error) {
    console.error("Get salaries error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
