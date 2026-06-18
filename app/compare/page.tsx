import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ComparisonView } from "@/components/features/ComparisonView";
import { CompareSelector } from "@/components/features/CompareSelector";
import { EmptyState } from "@/components/ui/EmptyState";
import { compareQuerySchema } from "@/lib/schemas";
import { buildCanonicalUrl, createMetadata, comparisonJsonLd } from "@/lib/seo";

export const revalidate = 3600;

interface ComparePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  searchParams,
}: ComparePageProps): Promise<Metadata> {
  const params = await searchParams;
  const s1 = typeof params.s1 === "string" ? params.s1 : "";
  const s2 = typeof params.s2 === "string" ? params.s2 : "";

  return createMetadata({
    title: "Compare Salaries",
    description:
      "Side-by-side salary comparison across companies, roles, and locations.",
    canonical: buildCanonicalUrl("/compare", { s1, s2 }),
  });
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const params = await searchParams;
  const s1 = typeof params.s1 === "string" ? params.s1 : "";
  const s2 = typeof params.s2 === "string" ? params.s2 : "";

  const rawSalaries = await prisma.salary.findMany({
    include: {
      company: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: { total_compensation: "desc" },
    take: 100,
  });

  // Convert Prisma Decimal objects to numbers for Client Component serialization
  const allSalaries = rawSalaries.map((s: (typeof rawSalaries)[number]) => ({
    ...s,
    base_salary: Number(s.base_salary),
    bonus: Number(s.bonus),
    stock: Number(s.stock),
    total_compensation: Number(s.total_compensation),
    confidence_score: Number(s.confidence_score),
  })) as import("@/types").SalaryRecord[];

  if (!s1 || !s2) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Compare Salaries
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Select two salary records to compare side by side.
          </p>
        </div>
        {allSalaries.length > 0 ? (
          <CompareSelector salaries={allSalaries} />
        ) : (
          <EmptyState
            title="No comparison available"
            description="There are no salary records to compare yet."
            actions={[{ label: "Browse salaries", href: "/salaries" }]}
          />
        )}
      </div>
    );
  }

  const parseResult = compareQuerySchema.safeParse({ s1, s2 });

  if (!parseResult.success || s1 === s2) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <EmptyState
          title="Invalid comparison"
          description="Please select two different salary records to compare."
          actions={[{ label: "Start over", href: "/compare" }]}
        />
      </div>
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
    notFound();
  }

  // Convert Prisma Decimal objects to numbers for Client Component serialization
  const convSalary1 = {
    ...salary1,
    base_salary: Number(salary1.base_salary),
    bonus: Number(salary1.bonus),
    stock: Number(salary1.stock),
    total_compensation: Number(salary1.total_compensation),
    confidence_score: Number(salary1.confidence_score),
  };
  const convSalary2 = {
    ...salary2,
    base_salary: Number(salary2.base_salary),
    bonus: Number(salary2.bonus),
    stock: Number(salary2.stock),
    total_compensation: Number(salary2.total_compensation),
    confidence_score: Number(salary2.confidence_score),
  };

  const baseDelta = Number(salary2.base_salary) - Number(salary1.base_salary);
  const bonusDelta = Number(salary2.bonus) - Number(salary1.bonus);
  const stockDelta = Number(salary2.stock) - Number(salary1.stock);
  const tcDelta =
    Number(salary2.total_compensation) - Number(salary1.total_compensation);
  const experienceDelta = salary2.experience_years - salary1.experience_years;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Salary Comparison
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {salary1.company.name} vs {salary2.company.name}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            The right-side offer is compared against the left-side offer.
          </p>
        </div>
        <Link
          href="/compare"
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          New Comparison
        </Link>
      </div>

      <ComparisonView
        salary1={convSalary1}
        salary2={convSalary2}
        delta={{
          base_delta: baseDelta,
          bonus_delta: bonusDelta,
          stock_delta: stockDelta,
          tc_delta: tcDelta,
          experience_delta: experienceDelta,
        }}
      />

      <div className="mt-8 flex justify-center">
        <Link
          href={`/companies/${convSalary1.company.slug}`}
          className="text-sm font-medium text-slate-700 hover:text-slate-900"
        >
          Back to {convSalary1.company.name}
        </Link>
        <span className="mx-3 text-slate-300">|</span>
        <Link
          href={`/companies/${convSalary2.company.slug}`}
          className="text-sm font-medium text-slate-700 hover:text-slate-900"
        >
          Back to {convSalary2.company.name}
        </Link>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(comparisonJsonLd(convSalary1, convSalary2)),
        }}
      />
    </div>
  );
}
