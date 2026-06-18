import { Currency } from "@prisma/client";

const currencyLocales: Record<Currency, string> = {
  INR: "en-IN",
  USD: "en-US",
  GBP: "en-GB",
  EUR: "en-DE",
};

const currencySymbols: Record<Currency, string> = {
  INR: "₹",
  USD: "$",
  GBP: "£",
  EUR: "€",
};

export function formatCurrency(
  value: number,
  currency: Currency,
  options?: { compact?: boolean }
): string {
  const locale = currencyLocales[currency];

  if (options?.compact && value >= 100000) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCurrencyWithSymbol(
  value: number,
  currency: Currency
): string {
  const symbol = currencySymbols[currency];
  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
  return `${symbol}${formatted}`;
}
