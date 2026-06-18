import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buildCanonicalPath, createMetadata, SITE_NAME } from "@/lib/seo";
import { HomePageContent } from "@/components/features/HomePageContent";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    title: `${SITE_NAME} - Compensation Intelligence`,
    description:
      "Compare salaries, bonus, stock, and total compensation across top tech companies.",
    canonical: buildCanonicalPath("/"),
  });
}

export default async function Home() {
  const companyCount = await prisma.company.count();
  const salaryCount = await prisma.salary.count();
  const allCompanies = await prisma.company.findMany({
    select: {
      name: true,
      slug: true,
      _count: { select: { salaries: true } },
    },
    orderBy: { name: "asc" },
  }).then((companies) =>
    companies.map((c) => ({
      name: c.name,
      slug: c.slug,
      salaryCount: c._count.salaries,
    }))
  );

  const topCompaniesRaw = await prisma.company.findMany({
    take: 6,
    orderBy: { salaries: { _count: "desc" } },
    select: {
      name: true,
      slug: true,
      _count: { select: { salaries: true } },
    },
  });

  const topCompanies = topCompaniesRaw.map((c) => ({
    ...c,
    salaryCount: c._count.salaries,
  }));

  const avgTC = await prisma.salary.aggregate({
    _avg: { total_compensation: true },
  });

  const avgValue = avgTC._avg.total_compensation
    ? `Rs ${Math.round(Number(avgTC._avg.total_compensation) / 100000)}L`
    : "N/A";

  return (
    <HomePageContent
      allCompanies={allCompanies}
      topCompanies={topCompanies}
      companyCount={companyCount}
      salaryCount={salaryCount}
      avgValue={avgValue}
    />
  );
}
