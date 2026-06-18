import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  calculateMedianCompensation,
  calculateSalaryRange,
  calculateLevelDistribution,
} from "@/lib/statistics";
import { CompanyHeader } from "@/components/features/CompanyHeader";
import { CompanyStats } from "@/components/features/CompanyStats";
import { RelatedCompanies } from "@/components/features/RelatedCompanies";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency } from "@/lib/currency";
import { Currency } from "@prisma/client";
import { buildCanonicalUrl, createMetadata } from "@/lib/seo";
import { organizationJsonLd, salaryJsonLd } from "@/lib/seo";

export const revalidate = 86400;

interface CompanyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const companies = await prisma.company.findMany({
    select: { slug: true },
  });

  return companies.map((company: { slug: string }) => ({ slug: company.slug }));
}

export async function generateMetadata({
  params,
}: CompanyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const company = await prisma.company.findUnique({
    where: { slug },
  });

  if (!company) {
    return {
      title: "Company Not Found",
    };
  }

  return createMetadata({
    title: `${company.name} Salaries`,
    description: `View ${company.name} salary data, median compensation, and level distribution on TalentDash.`,
    canonical: buildCanonicalUrl(`/companies/${slug}`),
    og: {
      title: `${company.name} Salaries - TalentDash`,
      description: `Median compensation and salary ranges at ${company.name}.`,
    },
  });
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { slug } = await params;

  const company = await prisma.company.findUnique({
    where: { slug },
  });

  if (!company) {
    notFound();
  }

  const rawSalaries = await prisma.salary.findMany({
    where: { company_id: company.id },
    orderBy: { total_compensation: "desc" },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  // Convert Prisma Decimal objects to numbers for Client Component serialization
  const salaries = rawSalaries.map((s: (typeof rawSalaries)[number]) => ({
    ...s,
    base_salary: Number(s.base_salary),
    bonus: Number(s.bonus),
    stock: Number(s.stock),
    total_compensation: Number(s.total_compensation),
    confidence_score: Number(s.confidence_score),
  })) as import("@/types").SalaryRecord[];

  const totalCompensations = salaries.map((s) => Number(s.total_compensation));
  const levels = salaries.map((s) => s.level);
  const primaryCurrency = (salaries[0]?.currency as Currency) ?? Currency.INR;

  const medianTotalCompensation =
    calculateMedianCompensation(totalCompensations);
  const salaryRange = calculateSalaryRange(totalCompensations);
  const levelDistribution = calculateLevelDistribution(levels);

  const allCompanies = await prisma.company.findMany({
    select: { name: true, slug: true },
    take: 20,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <CompanyHeader company={company} recordCount={salaries.length} />

      <div className="mt-6">
        <CompanyStats
          medianTotalCompensation={medianTotalCompensation}
          salaryRange={salaryRange}
          levelDistribution={levelDistribution}
          currency={primaryCurrency}
          recordCount={salaries.length}
        />
      </div>

      <div className="mt-12">
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Salary Records
        </h2>
        {salaries.length > 0 ? (
          <Table>
            <TableHead>
              <TableHeader>Role</TableHeader>
              <TableHeader>Level</TableHeader>
              <TableHeader>Location</TableHeader>
              <TableHeader>Experience</TableHeader>
              <TableHeader>Base Salary</TableHeader>
              <TableHeader>Stock</TableHeader>
              <TableHeader>Total Comp</TableHeader>
              <TableHeader>Compare</TableHeader>
            </TableHead>
            <TableBody>
              {salaries.map((salary) => (
                <TableRow key={salary.id}>
                  <TableCell>{salary.role}</TableCell>
                  <TableCell>
                    <Badge level={salary.level} />
                  </TableCell>
                  <TableCell className="capitalize">
                    {salary.location}
                  </TableCell>
                  <TableCell>{salary.experience_years} yrs</TableCell>
                  <TableCell>
                    {formatCurrency(
                      Number(salary.base_salary),
                      salary.currency as Currency
                    )}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(
                      Number(salary.stock),
                      salary.currency as Currency
                    )}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-900">
                    {formatCurrency(
                      Number(salary.total_compensation),
                      salary.currency as Currency
                    )}
                  </TableCell>
                  <TableCell>
                    <a
                      href={`/compare?s1=${salary.id}`}
                      className="text-sm font-medium text-slate-700 hover:text-slate-900"
                    >
                      Compare
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyState
            title="No salary submissions yet"
            description="Be the first to contribute salary data for this company."
            actions={[
              { label: "Browse salaries", href: "/salaries" },
              { label: "Compare", href: "/compare" },
            ]}
          />
        )}
      </div>

      <div className="mt-8">
        <RelatedCompanies currentSlug={slug} companies={allCompanies} />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            organizationJsonLd(company),
            ...salaries.map((s) => salaryJsonLd(s)),
          ]),
        }}
      />
    </div>
  );
}
