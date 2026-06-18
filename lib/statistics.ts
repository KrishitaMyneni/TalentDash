export function calculateMedianCompensation(values: number[]): number {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }

  return sorted[mid];
}

export function calculateSalaryRange(values: number[]): {
  min: number;
  max: number;
} {
  if (values.length === 0) return { min: 0, max: 0 };

  return {
    min: Math.min(...values),
    max: Math.max(...values),
  };
}

export function calculateLevelDistribution(levels: string[]): Record<string, number> {
  return levels.reduce((acc, level) => {
    acc[level] = (acc[level] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

export function calculatePercentiles(
  values: number[],
  percentiles: number[]
): Record<number, number> {
  if (values.length === 0) {
    return percentiles.reduce((acc, p) => {
      acc[p] = 0;
      return acc;
    }, {} as Record<number, number>);
  }

  const sorted = [...values].sort((a, b) => a - b);

  return percentiles.reduce((acc, p) => {
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    acc[p] = sorted[Math.max(0, index)];
    return acc;
  }, {} as Record<number, number>);
}
