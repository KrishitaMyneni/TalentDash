import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const companies = await prisma.company.findMany({
    select: { slug: true, updated_at: true },
    orderBy: { updated_at: "desc" },
  });

  return [
    { url: `${SITE_URL}/`, lastModified: new Date() },
    { url: `${SITE_URL}/salaries`, lastModified: new Date() },
    { url: `${SITE_URL}/compare`, lastModified: new Date() },
    ...companies.map((company) => ({
      url: `${SITE_URL}/companies/${company.slug}`,
      lastModified: company.updated_at,
    })),
  ];
}
