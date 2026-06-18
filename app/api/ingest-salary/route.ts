import { NextRequest, NextResponse } from "next/server";
import { Salary } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ingestSalarySchema } from "@/lib/schemas";
import {
  normalizeCompanyName,
  generateSlug,
  isPotentialDuplicate,
} from "@/lib/data-quality";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = ingestSalarySchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parseResult.error.issues },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    const normalizedName = normalizeCompanyName(data.company);
    const slug = generateSlug(data.company);

    const company = await prisma.company.upsert({
      where: { normalized_name: normalizedName },
      update: {},
      create: {
        name: data.company,
        slug,
        normalized_name: normalizedName,
      },
    });

    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

    const recentRecords = await prisma.salary.findMany({
      where: {
        company_id: company.id,
        role: data.role,
        level: data.level,
        location: data.location,
        submitted_at: { gte: fortyEightHoursAgo },
      },
    });

    const candidate = {
      company_id: company.id,
      role: data.role,
      level: data.level,
      location: data.location,
      base_salary: data.base_salary,
      submitted_at: new Date(),
    };

    const duplicate = recentRecords.find((existing: Salary) =>
      isPotentialDuplicate(
        {
          company_id: existing.company_id,
          role: existing.role,
          level: existing.level,
          location: existing.location,
          base_salary: existing.base_salary,
          submitted_at: existing.submitted_at,
        },
        candidate
      )
    );

    if (duplicate) {
      return NextResponse.json(
        {
          error: "Duplicate salary record detected",
          duplicate_id: duplicate.id,
        },
        { status: 409 }
      );
    }

    const totalCompensation = data.base_salary + data.bonus + data.stock;

    const salary = await prisma.salary.create({
      data: {
        company_id: company.id,
        role: data.role,
        level: data.level,
        location: data.location,
        currency: data.currency,
        experience_years: data.experience_years,
        base_salary: data.base_salary,
        bonus: data.bonus,
        stock: data.stock,
        total_compensation: totalCompensation,
        source: data.source,
        confidence_score: data.confidence_score,
        is_verified: data.is_verified,
      },
      include: { company: true },
    });

    return NextResponse.json(
      {
        id: salary.id,
        company: salary.company.name,
        role: salary.role,
        level: salary.level,
        location: salary.location,
        total_compensation: totalCompensation,
        created_at: salary.submitted_at,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Ingest salary error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
