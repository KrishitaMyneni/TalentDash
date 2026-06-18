"use client";

import { useState } from "react";

interface LevelDistribution {
  [level: string]: number;
}

interface PieChartProps {
  data: LevelDistribution;
}

const COLORS = [
  "#ff5a5f",
  "#ff8c8f",
  "#ffb3b6",
  "#ffd4d6",
  "#e04b50",
  "#cc3d42",
  "#991e23",
  "#660005",
];

export function LevelPieChart({ data }: PieChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const entries = Object.entries(data).sort(([a], [b]) => a.localeCompare(b));
  const total = entries.reduce((sum, [, count]) => sum + count, 0);

  if (total === 0) return null;

  let cumulativePercent = 0;
  const segments = entries.map(([level, count], index) => {
    const percent = (count / total) * 100;
    const startAngle = (cumulativePercent / 100) * 360;
    cumulativePercent += percent;
    const endAngle = (cumulativePercent / 100) * 360;

    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    const x1 = 50 + 40 * Math.cos(startRad);
    const y1 = 50 + 40 * Math.sin(startRad);
    const x2 = 50 + 40 * Math.cos(endRad);
    const y2 = 50 + 40 * Math.sin(endRad);

    const largeArcFlag = percent > 50 ? 1 : 0;

    const pathData =
      percent >= 100
        ? "M 50 10 A 40 40 0 1 1 50 90 A 40 40 0 1 1 50 10"
        : `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    return {
      level,
      count,
      percent,
      color: COLORS[index % COLORS.length],
      pathData,
    };
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Pie Chart */}
      <div className="relative mx-auto h-40 w-40">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          {segments.map((segment, index) => (
            <path
              key={segment.level}
              d={segment.pathData}
              fill={segment.color}
              className="transition-all duration-200"
              style={{
                opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.5,
                transform: hoveredIndex === index ? "scale(1.05)" : "scale(1)",
                transformOrigin: "center",
                cursor: "pointer",
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}
          {/* Center circle for donut effect */}
          <circle
            cx="50"
            cy="50"
            r="20"
            fill="white"
            className="pointer-events-none"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-foreground">{total}</span>
          <span className="text-xs text-muted-text">total</span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2">
        {segments.map((segment, index) => (
          <div
            key={segment.level}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-hover-surface"
            style={{
              opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.6,
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: segment.color }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">
                {segment.level.replace("_", "-")}
              </p>
              <p className="text-xs text-muted-text">
                {segment.count} ({segment.percent.toFixed(0)}%)
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
