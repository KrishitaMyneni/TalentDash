import { Metadata } from "next";
import { Company } from "@prisma/client";

export const SITE_NAME = "TalentDash";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://talentdash.vercel.app";

export function buildCanonicalPath(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}

export function buildCanonicalUrl(
  path: string,
  searchParams?: Record<string, string | string[] | undefined>
): string {
  const url = new URL(buildCanonicalPath(path));

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value !== "" && value !== "undefined") {
        url.searchParams.set(key, Array.isArray(value) ? value[0] : value);
      }
    });
  }

  return url.toString();
}

export function createMetadata({
  title,
  description,
  canonical,
  og,
}: {
  title: string;
  description: string;
  canonical: string;
  og?: {
    title?: string;
    description?: string;
    url?: string;
  };
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: og?.title ?? title,
      description: og?.description ?? description,
      url: og?.url ?? canonical,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: og?.title ?? title,
      description: og?.description ?? description,
    },
  };
}

export function organizationJsonLd(company: Company): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    url: buildCanonicalPath(`/companies/${company.slug}`),
    identifier: company.slug,
    ...(company.industry && { industry: company.industry }),
    ...(company.headquarters && { location: company.headquarters }),
    ...(company.founded_year && { foundingDate: String(company.founded_year) }),
  };
}

export function salaryJsonLd(salary: { role: string; location: string; currency: string; base_salary: number | string; company: { name: string; slug: string } }): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: salary.role,
    hiringOrganization: {
      "@type": "Organization",
      name: salary.company.name,
      url: buildCanonicalPath(`/companies/${salary.company.slug}`),
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: salary.location,
      },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: salary.currency,
      value: {
        "@type": "QuantitativeValue",
        value: Number(salary.base_salary),
        unitText: "YEAR",
      },
    },
  };
}

export function comparisonJsonLd(
  s1: { id: string; role: string; location: string; currency: string; base_salary: number | string; company: { name: string; slug: string } },
  s2: { id: string; role: string; location: string; currency: string; base_salary: number | string; company: { name: string; slug: string } }
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${s1.company.name} vs ${s2.company.name} Salary Comparison`,
    url: buildCanonicalPath(`/compare?s1=${s1.id}&s2=${s2.id}`),
    about: [salaryJsonLd(s1), salaryJsonLd(s2)],
  };
}

export function renderJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data);
}
