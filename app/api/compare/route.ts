import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { compareQuerySchema } from "@/lib/schemas";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const parseResult = compareQuerySchema.safeParse({
      s1: searchParams.get("s1") ?? undefined,
      s2: searchParams.get("s2") ?? undefined,
    });

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", issues: parseResult.error.issues },
        { status: 400 }
      );
    }

    const { s1, s2 } = parseResult.data;

    if (s1 === s2) {
      return NextResponse.json(
        { error: "Cannot compare a salary record with itself" },
        { status: 400 }
      );
    }

    const [salary1, salary2] = await Promise.all([
      prisma.salary.findUnique({
        where: { id: s1 },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),
      prisma.salary.findUnique({
        where: { id: s2 },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),
    ]);

    if (!salary1 || !salary2) {
      return NextResponse.json(
        { error: "One or both salary records not found" },
        { status: 404 }
      );
    }

    const baseDelta = Number(salary2.base_salary) - Number(salary1.base_salary);
    const bonusDelta = Number(salary2.bonus) - Number(salary1.bonus);
    const stockDelta = Number(salary2.stock) - Number(salary1.stock);
    const tcDelta =
      Number(salary2.total_compensation) - Number(salary1.total_compensation);
    const experienceDelta = salary2.experience_years - salary1.experience_years;

    const response = NextResponse.json(
      {
        salary1,
        salary2,
        delta: {
          base_delta: baseDelta,
          bonus_delta: bonusDelta,
          stock_delta: stockDelta,
          tc_delta: tcDelta,
          experience_delta: experienceDelta,
        },
      },
      { status: 200 }
    );

    response.headers.set(
      "Cache-Control",
      "s-maxage=3600, stale-while-revalidate=86400"
    );

    return response;
  } catch (error) {
    console.error("Compare error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
