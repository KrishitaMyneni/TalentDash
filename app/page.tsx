import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

export default async function Home() {
  const companyCount = await prisma.company.count();
  const salaryCount = await prisma.salary.count();
  const topCompanies = await prisma.company.findMany({
    take: 12,
    orderBy: {
      salaries: {
        _count: "desc",
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      industry: true,
      _count: {
        select: {
          salaries: true,
        },
      },
    },
  });

  const recentSalaries = await prisma.salary.findMany({
    take: 3,
    orderBy: { submitted_at: "desc" },
    include: {
      company: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });

  const avgTC = await prisma.salary.aggregate({
    _avg: {
      total_compensation: true,
    },
  });

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#77dd77]/10 via-white to-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
            Compensation Intelligence,{" "}
            <span className="text-[#77dd77]">Simplified</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Access verified salary data across top tech companies. Make informed career decisions with real compensation benchmarks.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/salaries"
              className="rounded-lg bg-[#77dd77] px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-[#5cb85c] hover:shadow-xl"
            >
              Browse Salaries
            </Link>
            <Link
              href="/compare"
              className="rounded-lg border-2 border-gray-200 bg-white px-8 py-3.5 text-base font-semibold text-gray-900 transition-all hover:border-[#77dd77] hover:text-[#77dd77]"
            >
              Compare Offers
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-gray-100 bg-gray-50/50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#77dd77]">{salaryCount}+</div>
              <div className="mt-2 text-sm font-medium text-gray-600">Salary Records</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#77dd77]">{companyCount}+</div>
              <div className="mt-2 text-sm font-medium text-gray-600">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#77dd77]">
                {recentSalaries[0] ? new Date(recentSalaries[0].submitted_at).getFullYear() : "2024"}
              </div>
              <div className="mt-2 text-sm font-medium text-gray-600">Updated</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#77dd77]">
                {avgTC._avg.total_compensation
                  ? `₹${Math.round(Number(avgTC._avg.total_compensation) / 100000)}L`
                  : "N/A"}
              </div>
              <div className="mt-2 text-sm font-medium text-gray-600">Avg TC</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Companies */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Companies</h2>
              <p className="mt-2 text-gray-600">Explore salary data from top employers</p>
            </div>
            <Link
              href="/salaries"
              className="text-sm font-semibold text-[#77dd77] hover:text-[#5cb85c]"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {topCompanies.map((company: (typeof topCompanies)[number]) => (
              <Link
                key={company.slug}
                href={`/companies/${company.slug}`}
                className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-[#77dd77] hover:shadow-lg"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-[#77dd77]/10 text-xl font-bold text-[#77dd77]">
                  {company.name.charAt(0)}
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-[#77dd77]">
                  {company.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {company._count.salaries} salaries
                </p>
                {company.industry && (
                  <p className="mt-1 text-xs text-gray-400">{company.industry}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Submissions */}
      <section className="border-t border-gray-100 bg-gray-50/50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-3xl font-bold text-gray-900">Recent Submissions</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {recentSalaries.map((salary: (typeof recentSalaries)[number]) => (
              <div
                key={salary.id}
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">
                    {salary.company.name}
                  </h3>
                  <span className="rounded-full bg-[#77dd77]/10 px-2.5 py-0.5 text-xs font-semibold text-[#77dd77]">
                    {salary.level.replace("_", "-")}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">{salary.role}</p>
                <p className="mt-1 text-sm text-gray-500">{salary.location}</p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#77dd77]">
                    ₹{(Number(salary.total_compensation) / 100000).toFixed(1)}L
                  </span>
                  <span className="text-xs text-gray-400">TC</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-gray-900">Ready to Compare?</h2>
          <p className="mt-4 text-lg text-gray-600">
            Make data-driven decisions with our comprehensive salary comparison tool.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/compare"
              className="rounded-lg bg-[#77dd77] px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-[#5cb85c]"
            >
              Start Comparing
            </Link>
            <Link
              href="/salaries"
              className="rounded-lg border-2 border-gray-200 bg-white px-8 py-3.5 text-base font-semibold text-gray-900 transition-all hover:border-[#77dd77] hover:text-[#77dd77]"
            >
              Explore Data
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
