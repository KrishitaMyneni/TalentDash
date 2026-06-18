import { z } from "zod";
import { Level, Currency, Source } from "@prisma/client";

export const ingestSalarySchema = z
  .object({
    company: z.string().min(1, "Company is required"),
    role: z.string().min(1, "Role is required"),
    level: z.nativeEnum(Level, {
      message: "Invalid level",
    }),
    location: z.string().min(1, "Location is required"),
    currency: z.nativeEnum(Currency, {
      message: "Invalid currency",
    }),
    experience_years: z.coerce
      .number()
      .int()
      .gt(0, "Experience must be greater than 0")
      .lt(51, "Experience must be less than 51"),
    base_salary: z.coerce
      .number()
      .positive("Base salary must be greater than 0"),
    bonus: z.coerce.number().min(0).default(0),
    stock: z.coerce.number().min(0).default(0),
    total_compensation: z.coerce.number().optional(),
    source: z.nativeEnum(Source, {
      message: "Invalid source",
    }),
    confidence_score: z.coerce
      .number()
      .min(0, "Confidence score must be at least 0")
      .max(1, "Confidence score must be at most 1"),
    is_verified: z.coerce.boolean().default(false),
  })
  .strict();

export type IngestSalaryInput = z.infer<typeof ingestSalarySchema>;

export const salaryQuerySchema = z.object({
  company: z.string().optional(),
  role: z.string().optional(),
  level: z.nativeEnum(Level).optional(),
  location: z.string().optional(),
  currency: z.nativeEnum(Currency).optional(),
  sort: z
    .enum(["total_compensation", "base_salary", "experience_years", "submitted_at"])
    .default("total_compensation"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(25),
});

export type SalaryQueryParams = z.infer<typeof salaryQuerySchema>;

export const compareQuerySchema = z.object({
  s1: z.string().uuid(),
  s2: z.string().uuid(),
});

export type CompareQueryParams = z.infer<typeof compareQuerySchema>;
