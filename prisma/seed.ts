import { Level, Currency, Source } from "@prisma/client";
import { normalizeCompanyName, generateSlug } from "../lib/data-quality";
import { prisma } from "../lib/prisma";

const companies = [
  {
    name: "Google",
    normalizedName: "google",
    industry: "Technology",
    headquarters: "Mountain View, CA",
    foundedYear: 1998,
    headcountRange: "100,000+",
  },
  {
    name: "Amazon",
    normalizedName: "amazon",
    industry: "Technology / E-commerce",
    headquarters: "Seattle, WA",
    foundedYear: 1994,
    headcountRange: "1,500,000+",
  },
  {
    name: "Meta",
    normalizedName: "meta",
    industry: "Technology / Social Media",
    headquarters: "Menlo Park, CA",
    foundedYear: 2004,
    headcountRange: "60,000+",
  },
  {
    name: "Microsoft",
    normalizedName: "microsoft",
    industry: "Technology",
    headquarters: "Redmond, WA",
    foundedYear: 1975,
    headcountRange: "220,000+",
  },
  {
    name: "Flipkart",
    normalizedName: "flipkart",
    industry: "E-commerce",
    headquarters: "Bengaluru, India",
    foundedYear: 2007,
    headcountRange: "30,000+",
  },
  {
    name: "Meesho",
    normalizedName: "meesho",
    industry: "E-commerce",
    headquarters: "Bengaluru, India",
    foundedYear: 2015,
    headcountRange: "1,000+",
  },
  {
    name: "NVIDIA",
    normalizedName: "nvidia",
    industry: "Semiconductors / AI",
    headquarters: "Santa Clara, CA",
    foundedYear: 1993,
    headcountRange: "30,000+",
  },
  {
    name: "TCS",
    normalizedName: "tcs",
    industry: "IT Services",
    headquarters: "Mumbai, India",
    foundedYear: 1968,
    headcountRange: "600,000+",
  },
  {
    name: "Infosys",
    normalizedName: "infosys",
    industry: "IT Services",
    headquarters: "Bengaluru, India",
    foundedYear: 1981,
    headcountRange: "300,000+",
  },
  {
    name: "Wipro",
    normalizedName: "wipro",
    industry: "IT Services",
    headquarters: "Bengaluru, India",
    foundedYear: 1945,
    headcountRange: "250,000+",
  },
  {
    name: "Razorpay",
    normalizedName: "razorpay",
    industry: "Fintech",
    headquarters: "Bengaluru, India",
    foundedYear: 2014,
    headcountRange: "3,000+",
  },
  {
    name: "Zepto",
    normalizedName: "zepto",
    industry: "Quick Commerce",
    headquarters: "Mumbai, India",
    foundedYear: 2021,
    headcountRange: "1,000+",
  },
];

interface SeedSalary {
  companyName: string;
  role: string;
  level: Level;
  location: string;
  currency: Currency;
  experienceYears: number;
  baseSalary: number;
  bonus: number;
  stock: number;
  source: Source;
  confidenceScore: number;
  isVerified: boolean;
}

const salaries: SeedSalary[] = [
  // Google India
  { companyName: "Google", role: "Software Engineer", level: Level.L3, location: "Bengaluru", currency: Currency.INR, experienceYears: 2, baseSalary: 2200000, bonus: 200000, stock: 800000, source: Source.CONTRIBUTOR, confidenceScore: 0.95, isVerified: true },
  { companyName: "Google", role: "Software Engineer", level: Level.L4, location: "Bengaluru", currency: Currency.INR, experienceYears: 4, baseSalary: 3600000, bonus: 450000, stock: 1800000, source: Source.CONTRIBUTOR, confidenceScore: 0.92, isVerified: true },
  { companyName: "Google", role: "Software Engineer", level: Level.L4, location: "Hyderabad", currency: Currency.INR, experienceYears: 5, baseSalary: 3800000, bonus: 500000, stock: 2000000, source: Source.CONTRIBUTOR, confidenceScore: 0.9, isVerified: false },
  { companyName: "Google", role: "Senior Software Engineer", level: Level.L5, location: "Bengaluru", currency: Currency.INR, experienceYears: 7, baseSalary: 5200000, bonus: 750000, stock: 3200000, source: Source.CONTRIBUTOR, confidenceScore: 0.88, isVerified: true },
  { companyName: "Google", role: "Staff Software Engineer", level: Level.L6, location: "Bengaluru", currency: Currency.INR, experienceYears: 10, baseSalary: 8000000, bonus: 1200000, stock: 6000000, source: Source.CONTRIBUTOR, confidenceScore: 0.85, isVerified: true },
  { companyName: "Google", role: "Principal Engineer", level: Level.PRINCIPAL, location: "Bengaluru", currency: Currency.INR, experienceYears: 15, baseSalary: 12000000, bonus: 2500000, stock: 15000000, source: Source.SCRAPED, confidenceScore: 0.7, isVerified: false },

  // Google US
  { companyName: "Google", role: "Software Engineer", level: Level.L3, location: "San Francisco", currency: Currency.USD, experienceYears: 2, baseSalary: 140000, bonus: 20000, stock: 45000, source: Source.CONTRIBUTOR, confidenceScore: 0.95, isVerified: true },
  { companyName: "Google", role: "Software Engineer", level: Level.L4, location: "San Francisco", currency: Currency.USD, experienceYears: 4, baseSalary: 180000, bonus: 35000, stock: 90000, source: Source.CONTRIBUTOR, confidenceScore: 0.92, isVerified: true },
  { companyName: "Google", role: "Senior Software Engineer", level: Level.L5, location: "San Francisco", currency: Currency.USD, experienceYears: 7, baseSalary: 230000, bonus: 55000, stock: 160000, source: Source.CONTRIBUTOR, confidenceScore: 0.9, isVerified: true },

  // Amazon India
  { companyName: "Amazon", role: "Software Development Engineer", level: Level.SDE_I, location: "Bengaluru", currency: Currency.INR, experienceYears: 1, baseSalary: 1800000, bonus: 150000, stock: 400000, source: Source.CONTRIBUTOR, confidenceScore: 0.93, isVerified: true },
  { companyName: "Amazon", role: "Software Development Engineer", level: Level.SDE_II, location: "Bengaluru", currency: Currency.INR, experienceYears: 3, baseSalary: 2800000, bonus: 350000, stock: 900000, source: Source.CONTRIBUTOR, confidenceScore: 0.91, isVerified: true },
  { companyName: "Amazon", role: "Software Development Engineer", level: Level.SDE_II, location: "Hyderabad", currency: Currency.INR, experienceYears: 4, baseSalary: 3100000, bonus: 400000, stock: 1000000, source: Source.CONTRIBUTOR, confidenceScore: 0.89, isVerified: false },
  { companyName: "Amazon", role: "Software Development Engineer", level: Level.SDE_III, location: "Bengaluru", currency: Currency.INR, experienceYears: 6, baseSalary: 4500000, bonus: 700000, stock: 2000000, source: Source.CONTRIBUTOR, confidenceScore: 0.87, isVerified: true },
  { companyName: "Amazon", role: "Senior Software Engineer", level: Level.SDE_III, location: "Pune", currency: Currency.INR, experienceYears: 7, baseSalary: 4800000, bonus: 750000, stock: 2200000, source: Source.CONTRIBUTOR, confidenceScore: 0.86, isVerified: true },
  { companyName: "Amazon", role: "Principal Engineer", level: Level.PRINCIPAL, location: "Bengaluru", currency: Currency.INR, experienceYears: 14, baseSalary: 11000000, bonus: 2200000, stock: 12000000, source: Source.SCRAPED, confidenceScore: 0.68, isVerified: false },

  // Amazon US
  { companyName: "Amazon", role: "Software Development Engineer", level: Level.SDE_II, location: "San Francisco", currency: Currency.USD, experienceYears: 3, baseSalary: 160000, bonus: 25000, stock: 60000, source: Source.CONTRIBUTOR, confidenceScore: 0.9, isVerified: true },
  { companyName: "Amazon", role: "Software Development Engineer", level: Level.SDE_III, location: "San Francisco", currency: Currency.USD, experienceYears: 6, baseSalary: 210000, bonus: 45000, stock: 130000, source: Source.CONTRIBUTOR, confidenceScore: 0.88, isVerified: true },

  // Meta
  { companyName: "Meta", role: "Software Engineer", level: Level.L4, location: "San Francisco", currency: Currency.USD, experienceYears: 3, baseSalary: 170000, bonus: 30000, stock: 80000, source: Source.CONTRIBUTOR, confidenceScore: 0.91, isVerified: true },
  { companyName: "Meta", role: "Software Engineer", level: Level.L5, location: "San Francisco", currency: Currency.USD, experienceYears: 6, baseSalary: 220000, bonus: 50000, stock: 180000, source: Source.CONTRIBUTOR, confidenceScore: 0.89, isVerified: true },
  { companyName: "Meta", role: "Software Engineer", level: Level.L4, location: "London", currency: Currency.GBP, experienceYears: 4, baseSalary: 95000, bonus: 15000, stock: 40000, source: Source.CONTRIBUTOR, confidenceScore: 0.85, isVerified: false },

  // Microsoft
  { companyName: "Microsoft", role: "Software Engineer", level: Level.L3, location: "Bengaluru", currency: Currency.INR, experienceYears: 2, baseSalary: 1900000, bonus: 200000, stock: 500000, source: Source.CONTRIBUTOR, confidenceScore: 0.9, isVerified: true },
  { companyName: "Microsoft", role: "Software Engineer", level: Level.L4, location: "Hyderabad", currency: Currency.INR, experienceYears: 3, baseSalary: 2400000, bonus: 300000, stock: 800000, source: Source.CONTRIBUTOR, confidenceScore: 0.88, isVerified: true },
  { companyName: "Microsoft", role: "Software Engineer", level: Level.L5, location: "Bengaluru", currency: Currency.INR, experienceYears: 5, baseSalary: 3500000, bonus: 500000, stock: 1500000, source: Source.CONTRIBUTOR, confidenceScore: 0.87, isVerified: true },
  { companyName: "Microsoft", role: "Senior Software Engineer", level: Level.L6, location: "Bengaluru", currency: Currency.INR, experienceYears: 8, baseSalary: 5000000, bonus: 800000, stock: 2500000, source: Source.CONTRIBUTOR, confidenceScore: 0.85, isVerified: true },
  { companyName: "Microsoft", role: "Principal Software Engineer", level: Level.PRINCIPAL, location: "Bengaluru", currency: Currency.INR, experienceYears: 13, baseSalary: 9500000, bonus: 1800000, stock: 8000000, source: Source.SCRAPED, confidenceScore: 0.7, isVerified: false },
  { companyName: "Microsoft", role: "Software Engineer", level: Level.L5, location: "San Francisco", currency: Currency.USD, experienceYears: 5, baseSalary: 165000, bonus: 30000, stock: 70000, source: Source.CONTRIBUTOR, confidenceScore: 0.88, isVerified: true },

  // Flipkart
  { companyName: "Flipkart", role: "Software Development Engineer", level: Level.SDE_I, location: "Bengaluru", currency: Currency.INR, experienceYears: 1, baseSalary: 1600000, bonus: 120000, stock: 300000, source: Source.CONTRIBUTOR, confidenceScore: 0.88, isVerified: true },
  { companyName: "Flipkart", role: "Software Development Engineer", level: Level.SDE_II, location: "Bengaluru", currency: Currency.INR, experienceYears: 3, baseSalary: 2600000, bonus: 350000, stock: 800000, source: Source.CONTRIBUTOR, confidenceScore: 0.86, isVerified: true },
  { companyName: "Flipkart", role: "Software Development Engineer", level: Level.SDE_III, location: "Bengaluru", currency: Currency.INR, experienceYears: 6, baseSalary: 4200000, bonus: 650000, stock: 1800000, source: Source.CONTRIBUTOR, confidenceScore: 0.84, isVerified: false },
  { companyName: "Flipkart", role: "Engineering Manager", level: Level.STAFF, location: "Bengaluru", currency: Currency.INR, experienceYears: 10, baseSalary: 6500000, bonus: 1200000, stock: 3500000, source: Source.CONTRIBUTOR, confidenceScore: 0.8, isVerified: true },

  // Meesho
  { companyName: "Meesho", role: "Software Engineer", level: Level.SDE_I, location: "Bengaluru", currency: Currency.INR, experienceYears: 1, baseSalary: 1400000, bonus: 100000, stock: 250000, source: Source.CONTRIBUTOR, confidenceScore: 0.85, isVerified: false },
  { companyName: "Meesho", role: "Software Engineer", level: Level.SDE_II, location: "Bengaluru", currency: Currency.INR, experienceYears: 3, baseSalary: 2200000, bonus: 250000, stock: 600000, source: Source.CONTRIBUTOR, confidenceScore: 0.83, isVerified: true },
  { companyName: "Meesho", role: "Senior Software Engineer", level: Level.SDE_III, location: "Bengaluru", currency: Currency.INR, experienceYears: 5, baseSalary: 3800000, bonus: 550000, stock: 1500000, source: Source.CONTRIBUTOR, confidenceScore: 0.8, isVerified: true },

  // NVIDIA
  { companyName: "NVIDIA", role: "Software Engineer", level: Level.IC4, location: "Bengaluru", currency: Currency.INR, experienceYears: 2, baseSalary: 2000000, bonus: 250000, stock: 700000, source: Source.CONTRIBUTOR, confidenceScore: 0.9, isVerified: true },
  { companyName: "NVIDIA", role: "Software Engineer", level: Level.IC5, location: "Bengaluru", currency: Currency.INR, experienceYears: 5, baseSalary: 4200000, bonus: 700000, stock: 2500000, source: Source.CONTRIBUTOR, confidenceScore: 0.88, isVerified: true },
  { companyName: "NVIDIA", role: "Senior Software Engineer", level: Level.IC5, location: "Pune", currency: Currency.INR, experienceYears: 6, baseSalary: 4800000, bonus: 800000, stock: 3000000, source: Source.CONTRIBUTOR, confidenceScore: 0.86, isVerified: true },
  { companyName: "NVIDIA", role: "Principal Software Engineer", level: Level.PRINCIPAL, location: "Bengaluru", currency: Currency.INR, experienceYears: 15, baseSalary: 13000000, bonus: 3000000, stock: 18000000, source: Source.SCRAPED, confidenceScore: 0.65, isVerified: false },
  { companyName: "NVIDIA", role: "Software Engineer", level: Level.IC5, location: "San Francisco", currency: Currency.USD, experienceYears: 5, baseSalary: 190000, bonus: 40000, stock: 220000, source: Source.CONTRIBUTOR, confidenceScore: 0.88, isVerified: true },

  // TCS
  { companyName: "TCS", role: "Software Engineer", level: Level.SDE_I, location: "Mumbai", currency: Currency.INR, experienceYears: 1, baseSalary: 450000, bonus: 20000, stock: 0, source: Source.CONTRIBUTOR, confidenceScore: 0.9, isVerified: true },
  { companyName: "TCS", role: "Software Engineer", level: Level.SDE_II, location: "Mumbai", currency: Currency.INR, experienceYears: 3, baseSalary: 700000, bonus: 40000, stock: 0, source: Source.CONTRIBUTOR, confidenceScore: 0.88, isVerified: true },
  { companyName: "TCS", role: "IT Analyst", level: Level.SDE_III, location: "Pune", currency: Currency.INR, experienceYears: 5, baseSalary: 1100000, bonus: 80000, stock: 0, source: Source.CONTRIBUTOR, confidenceScore: 0.85, isVerified: true },
  { companyName: "TCS", role: "Assistant Consultant", level: Level.STAFF, location: "Hyderabad", currency: Currency.INR, experienceYears: 8, baseSalary: 1800000, bonus: 150000, stock: 0, source: Source.CONTRIBUTOR, confidenceScore: 0.82, isVerified: false },
  { companyName: "TCS", role: "Consultant", level: Level.PRINCIPAL, location: "Delhi", currency: Currency.INR, experienceYears: 12, baseSalary: 2800000, bonus: 250000, stock: 0, source: Source.SCRAPED, confidenceScore: 0.75, isVerified: false },

  // Infosys
  { companyName: "Infosys", role: "Software Engineer", level: Level.SDE_I, location: "Bengaluru", currency: Currency.INR, experienceYears: 1, baseSalary: 420000, bonus: 18000, stock: 0, source: Source.CONTRIBUTOR, confidenceScore: 0.9, isVerified: true },
  { companyName: "Infosys", role: "Senior Software Engineer", level: Level.SDE_II, location: "Bengaluru", currency: Currency.INR, experienceYears: 3, baseSalary: 750000, bonus: 50000, stock: 0, source: Source.CONTRIBUTOR, confidenceScore: 0.87, isVerified: true },
  { companyName: "Infosys", role: "Technology Lead", level: Level.SDE_III, location: "Pune", currency: Currency.INR, experienceYears: 6, baseSalary: 1300000, bonus: 100000, stock: 0, source: Source.CONTRIBUTOR, confidenceScore: 0.84, isVerified: false },
  { companyName: "Infosys", role: "Project Manager", level: Level.STAFF, location: "Hyderabad", currency: Currency.INR, experienceYears: 10, baseSalary: 2200000, bonus: 200000, stock: 0, source: Source.CONTRIBUTOR, confidenceScore: 0.8, isVerified: true },

  // Wipro
  { companyName: "Wipro", role: "Software Engineer", level: Level.SDE_I, location: "Bengaluru", currency: Currency.INR, experienceYears: 1, baseSalary: 400000, bonus: 15000, stock: 0, source: Source.CONTRIBUTOR, confidenceScore: 0.89, isVerified: true },
  { companyName: "Wipro", role: "Software Engineer", level: Level.SDE_II, location: "Hyderabad", currency: Currency.INR, experienceYears: 3, baseSalary: 700000, bonus: 45000, stock: 0, source: Source.CONTRIBUTOR, confidenceScore: 0.86, isVerified: true },
  { companyName: "Wipro", role: "Senior Software Engineer", level: Level.SDE_III, location: "Pune", currency: Currency.INR, experienceYears: 5, baseSalary: 1150000, bonus: 90000, stock: 0, source: Source.CONTRIBUTOR, confidenceScore: 0.83, isVerified: false },

  // Razorpay
  { companyName: "Razorpay", role: "Software Engineer", level: Level.SDE_I, location: "Bengaluru", currency: Currency.INR, experienceYears: 1, baseSalary: 1700000, bonus: 150000, stock: 400000, source: Source.CONTRIBUTOR, confidenceScore: 0.86, isVerified: true },
  { companyName: "Razorpay", role: "Software Engineer", level: Level.SDE_II, location: "Bengaluru", currency: Currency.INR, experienceYears: 3, baseSalary: 2900000, bonus: 400000, stock: 1000000, source: Source.CONTRIBUTOR, confidenceScore: 0.84, isVerified: true },
  { companyName: "Razorpay", role: "Senior Software Engineer", level: Level.SDE_III, location: "Bengaluru", currency: Currency.INR, experienceYears: 6, baseSalary: 4600000, bonus: 750000, stock: 2200000, source: Source.CONTRIBUTOR, confidenceScore: 0.82, isVerified: false },
  { companyName: "Razorpay", role: "Staff Engineer", level: Level.STAFF, location: "Bengaluru", currency: Currency.INR, experienceYears: 9, baseSalary: 7000000, bonus: 1300000, stock: 4500000, source: Source.CONTRIBUTOR, confidenceScore: 0.78, isVerified: true },

  // Zepto
  { companyName: "Zepto", role: "Software Engineer", level: Level.SDE_I, location: "Mumbai", currency: Currency.INR, experienceYears: 1, baseSalary: 1500000, bonus: 120000, stock: 300000, source: Source.CONTRIBUTOR, confidenceScore: 0.84, isVerified: false },
  { companyName: "Zepto", role: "Software Engineer", level: Level.SDE_II, location: "Mumbai", currency: Currency.INR, experienceYears: 3, baseSalary: 2500000, bonus: 350000, stock: 900000, source: Source.CONTRIBUTOR, confidenceScore: 0.82, isVerified: true },
  { companyName: "Zepto", role: "Senior Software Engineer", level: Level.SDE_III, location: "Mumbai", currency: Currency.INR, experienceYears: 5, baseSalary: 4200000, bonus: 700000, stock: 2000000, source: Source.CONTRIBUTOR, confidenceScore: 0.8, isVerified: true },

  // Normalization demonstration: Google India must resolve to same entity as Google
  { companyName: "Google India", role: "Software Engineer", level: Level.L4, location: "Bengaluru", currency: Currency.INR, experienceYears: 4, baseSalary: 3500000, bonus: 400000, stock: 1500000, source: Source.CONTRIBUTOR, confidenceScore: 0.85, isVerified: true },

  // Edge cases
  { companyName: "Google", role: "Data Scientist", level: Level.L4, location: "Bengaluru", currency: Currency.INR, experienceYears: 4, baseSalary: 3400000, bonus: 0, stock: 1200000, source: Source.CONTRIBUTOR, confidenceScore: 0.8, isVerified: true },
  { companyName: "Amazon", role: "Business Analyst", level: Level.SDE_II, location: "Delhi", currency: Currency.INR, experienceYears: 3, baseSalary: 2500000, bonus: 300000, stock: 0, source: Source.CONTRIBUTOR, confidenceScore: 0.78, isVerified: false },
  { companyName: "NVIDIA", role: "Senior AI Engineer", level: Level.PRINCIPAL, location: "San Francisco", currency: Currency.USD, experienceYears: 12, baseSalary: 250000, bonus: 80000, stock: 1200000, source: Source.SCRAPED, confidenceScore: 0.6, isVerified: false },
];

// Demonstrate normalization: Google India, GOOGLE, google -> single entity
const normalizationDemonstrations = [
  { inputName: "Google India", expectedSlug: "google", expectedNormalized: "google" },
  { inputName: "GOOGLE", expectedSlug: "google", expectedNormalized: "google" },
  { inputName: "google", expectedSlug: "google", expectedNormalized: "google" },
];

async function main() {
  console.log("Seeding TalentDash database...");

  // Verify normalization demonstrations
  for (const demo of normalizationDemonstrations) {
    const normalized = normalizeCompanyName(demo.inputName);
    const slug = generateSlug(demo.inputName);
    console.log(`Normalization check: "${demo.inputName}" -> normalized: "${normalized}", slug: "${slug}"`);
  }

  // Create companies
  const companyMap = new Map<string, string>();

  for (const company of companies) {
    const upserted = await prisma.company.upsert({
      where: { normalized_name: company.normalizedName },
      update: {},
      create: {
        name: company.name,
        slug: generateSlug(company.name),
        normalized_name: company.normalizedName,
        industry: company.industry,
        headquarters: company.headquarters,
        founded_year: company.foundedYear,
        headcount_range: company.headcountRange,
      },
    });
    companyMap.set(company.normalizedName, upserted.id);
  }

  // Create salaries
  let createdCount = 0;
  for (const salary of salaries) {
    const normalizedName = normalizeCompanyName(salary.companyName);
    const companyId = companyMap.get(normalizedName);

    if (!companyId) {
      console.warn(`Company not found for ${salary.companyName}`);
      continue;
    }

    const totalCompensation = salary.baseSalary + salary.bonus + salary.stock;

    await prisma.salary.create({
      data: {
        company_id: companyId,
        role: salary.role,
        level: salary.level,
        location: salary.location,
        currency: salary.currency,
        experience_years: salary.experienceYears,
        base_salary: salary.baseSalary,
        bonus: salary.bonus,
        stock: salary.stock,
        total_compensation: totalCompensation,
        source: salary.source,
        confidence_score: salary.confidenceScore,
        is_verified: salary.isVerified,
        submitted_at: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
      },
    });

    createdCount++;
  }

  // Demonstrate normalization with actual data
  const googleIndia = await prisma.salary.count({
    where: { company: { normalized_name: "google" } },
  });

  console.log(`Created ${createdCount} salary records`);
  console.log(`Google records (including all normalized variants): ${googleIndia}`);

  const stats = await prisma.salary.groupBy({
    by: ["company_id"],
    _count: { id: true },
  });

  console.log("Records per company:", stats);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
