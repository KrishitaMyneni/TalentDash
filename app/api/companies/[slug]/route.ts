import { NextResponse } from "next/server";
import { Salary } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  calculateMedianCompensation,
  calculateSalaryRange,
  calculateLevelDistribution,
} from "@/lib/statistics";

export const dynamic = "force-dynamic";
export const revalidate = 86400;

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;

    const company = await prisma.company.findUnique({
      where: { slug },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const salaries = await prisma.salary.findMany({
      where: { company_id: company.id },
      orderBy: { total_compensation: "desc" },
    });

    const totalCompensations = salaries.map((s: Salary) =>
      Number(s.total_compensation)
    );
    const levels = salaries.map((s: Salary) => s.level);

    const response = NextResponse.json(
      {
        company,
        salaries,
        median_total_compensation:
          calculateMedianCompensation(totalCompensations),
        salary_range: calculateSalaryRange(totalCompensations),
        record_count: salaries.length,
        level_distribution: calculateLevelDistribution(levels),
      },
      { status: 200 }
    );

    response.headers.set(
      "Cache-Control",
      "s-maxage=3600, stale-while-revalidate=86400"
    );

    return response;
  } catch (error) {
    console.error("Get company error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
