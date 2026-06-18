import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { salaryQuerySchema } from "@/lib/schemas";
import { SalaryFilters } from "@/components/features/SalaryFilters";
import { SalaryTable } from "@/components/features/SalaryTable";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { RelatedRoles } from "@/components/features/RelatedRoles";
import { buildCanonicalUrl, createMetadata } from "@/lib/seo";
import { salaryJsonLd } from "@/lib/seo";

export const revalidate = 3600;

interface SalariesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  searchParams,
}: SalariesPageProps): Promise<Metadata> {
  const params = await searchParams;
  const company = typeof params.company === "string" ? params.company : "";
  const role = typeof params.role === "string" ? params.role : "";
  const location = typeof params.location === "string" ? params.location : "";

  const titleParts = ["Salary Data"];
  if (company) titleParts.push(`${company}`);
  if (role) titleParts.push(`${role}`);
  if (location) titleParts.push(location);

  const title = titleParts.join(" - ");
  const description = `Browse ${
    company ? `${company} ` : ""
  }salary data${role ? ` for ${role}` : ""}${
    location ? ` in ${location}` : ""
  }. Real compensation intelligence from TalentDash.`;

  return createMetadata({
    title,
    description,
    canonical: buildCanonicalUrl("/salaries", params),
  });
}

export default async function SalariesPage({ searchParams }: SalariesPageProps) {
  const params = await searchParams;

  const parseResult = salaryQuerySchema.safeParse({
    company: params.company ?? undefined,
    role: params.role ?? undefined,
    level: params.level ?? undefined,
    location: params.location ?? undefined,
    currency: params.currency ?? undefined,
    sort: params.sort ?? undefined,
    page: params.page ?? undefined,
    limit: params.limit ?? undefined,
  });

  const { company, role, level, location, currency, sort, page, limit } =
    parseResult.success ? parseResult.data : salaryQuerySchema.parse({});

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

  const [rawSalaries, total] = await Promise.all([
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

  const salaries = rawSalaries.map((s: (typeof rawSalaries)[number]) => ({
    ...s,
    base_salary: Number(s.base_salary),
    bonus: Number(s.bonus),
    stock: Number(s.stock),
    total_compensation: Number(s.total_compensation),
    confidence_score: Number(s.confidence_score),
  })) as import("@/types").SalaryRecord[];

  const totalPages = Math.ceil(total / limit);
  const roles = salaries.map((s) => s.role);

  const buildHref = (p: number) => {
    const query = new URLSearchParams();
    if (company) query.set("company", company);
    if (role) query.set("role", role);
    if (level) query.set("level", level);
    if (location) query.set("location", location);
    if (currency) query.set("currency", currency);
    if (sort && sort !== "total_compensation") query.set("sort", sort);
    query.set("page", String(p));
    const q = query.toString();
    return `/salaries${q ? `?${q}` : ""}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Salary Data
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Browse real compensation data across companies, roles, and locations.
        </p>
      </div>

      <SalaryFilters />

      <div className="mt-8">
        {salaries.length > 0 ? (
          <>
            <SalaryTable salaries={salaries} />
            <div className="mt-4">
              <Pagination
                page={page}
                totalPages={totalPages}
                buildHref={buildHref}
              />
            </div>
          </>
        ) : (
          <EmptyState
            title="No salary records found"
            description="Try adjusting your filters or browse all companies."
            actions={[
              { label: "Clear filters", href: "/salaries" },
              { label: "Browse companies", href: "/" },
            ]}
          />
        )}
      </div>

      {roles.length > 0 && (
        <div className="mt-8">
          <RelatedRoles roles={roles} />
        </div>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(salaries.map((s) => salaryJsonLd(s))),
        }}
      />
    </div>
  );
}
