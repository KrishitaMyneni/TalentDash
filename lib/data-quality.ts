import { Prisma } from "@prisma/client";

const COMMON_COMPANY_SUFFIXES = [
  "india",
  "usa",
  "uk",
  "us",
  "inc",
  "llc",
  "ltd",
  "limited",
  "pvt",
  "private",
  "corp",
  "corporation",
  "co",
  "company",
  "technologies",
  "technology",
  "solutions",
  "services",
  "labs",
];

export function normalizeCompanyName(name: string): string {
  const normalized = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ");

  const words = normalized.split(" ");

  while (
    words.length > 1 &&
    COMMON_COMPANY_SUFFIXES.includes(words[words.length - 1])
  ) {
    words.pop();
  }

  return words.join(" ").trim();
}

export function generateSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function normalizeRole(role: string): string {
  return role
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ");
}

export function normalizeLocation(location: string): string {
  return location
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ");
}

export interface DuplicateCheckInput {
  company_id: string;
  role: string;
  level: string;
  location: string;
  base_salary: Prisma.Decimal | number;
  submitted_at: Date;
}

export function isPotentialDuplicate(
  existing: DuplicateCheckInput,
  candidate: DuplicateCheckInput
): boolean {
  const sameCompany = existing.company_id === candidate.company_id;
  const sameRole = normalizeRole(existing.role) === normalizeRole(candidate.role);
  const sameLevel = existing.level === candidate.level;
  const sameLocation =
    normalizeLocation(existing.location) === normalizeLocation(candidate.location);

  if (!sameCompany || !sameRole || !sameLevel || !sameLocation) {
    return false;
  }

  const hoursDiff =
    Math.abs(existing.submitted_at.getTime() - candidate.submitted_at.getTime()) /
    (1000 * 60 * 60);

  if (hoursDiff > 48) {
    return false;
  }

  const existingBase =
    existing.base_salary instanceof Prisma.Decimal
      ? existing.base_salary.toNumber()
      : Number(existing.base_salary);
  const candidateBase =
    candidate.base_salary instanceof Prisma.Decimal
      ? candidate.base_salary.toNumber()
      : Number(candidate.base_salary);

  if (existingBase === 0) return false;

  const variance = Math.abs(candidateBase - existingBase) / existingBase;
  return variance <= 0.1;
}

export function deduplicateSalaryRecords<T extends DuplicateCheckInput>(
  records: T[]
): T[] {
  const unique: T[] = [];

  for (const record of records) {
    const isDup = unique.some((existing) => isPotentialDuplicate(existing, record));
    if (!isDup) unique.push(record);
  }

  return unique;
}
