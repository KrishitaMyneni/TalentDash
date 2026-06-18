import { Level, Currency, Source, Prisma } from "@prisma/client";

export type { Level, Currency, Source };

export type SalaryWithCompany = Prisma.SalaryGetPayload<{
  include: {
    company: {
      select: {
        id: true;
        name: true;
        slug: true;
      };
    };
  };
}>;

// Same as SalaryWithCompany but with Decimal fields converted to numbers for Client Components
export interface SalaryRecord {
  id: string;
  company_id: string;
  role: string;
  level: Level;
  location: string;
  currency: Currency;
  experience_years: number;
  base_salary: number;
  bonus: number;
  stock: number;
  total_compensation: number;
  source: Source;
  confidence_score: number;
  is_verified: boolean;
  submitted_at: Date;
  company: { id: string; name: string; slug: string };
}

export interface SalaryFilters {
  company?: string;
  role?: string;
  level?: Level;
  location?: string;
  currency?: Currency;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sort: string;
}

export interface CompanySummary {
  id: string;
  name: string;
  slug: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CompanyStats {
  medianTotalCompensation: number;
  minTotalCompensation: number;
  maxTotalCompensation: number;
  recordCount: number;
  levelDistribution: Record<string, number>;
}

export interface ComparisonDelta {
  base_delta: number;
  bonus_delta: number;
  stock_delta: number;
  tc_delta: number;
  experience_delta: number;
}
