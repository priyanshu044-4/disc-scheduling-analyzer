import React, { useState } from 'react';
import type { AlgorithmResult, DiskConfig } from '../types';
import { useTheme } from '../ThemeContext';

interface Props {
  result: AlgorithmResult;
  config: DiskConfig;
  currentStepIndex: number;
  onStepClick: (stepIndex: number) => void;
}

export const TrajectoryChart: React.FC<Props> = ({
  result,
  config,
  currentStepIndex,
  onStepClick,
}) => {
  const { theme } = useTheme();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const width = 640;
  const height = 360;
  const padding = { top: 30, right: 35, bottom: 45, left: 55 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const maxCyl = config.totalCylinders - 1;
  const maxSteps = Math.max(1, result.sequence.length - 1);

  const getX = (cylinder: number) => padding.left + (cylinder / maxCyl) * plotWidth;
  const getY = (step: number) => padding.top + (step / maxSteps) * plotHeight;

  const pathD = result.sequence
    .map((cyl, i) => `${i === 0 ? 'M' : 'L'} ${getX(cyl).toFixed(1)} ${getY(i).toFixed(1)}`)
    .join(' ');

  const activePathD = result.sequence
    .slice(0, currentStepIndex + 1)
    .map((cyl, i) => `${i === 0 ? 'M' : 'L'} ${getX(cyl).toFixed(1)} ${getY(i).toFixed(1)}`)
    .join(' ');

  return (
    <div className={`${theme.bgCard} ${theme.borderCard} border rounded-2xl p-5 shadow-2xl backdrop-blur-md flex flex-col transition-all`}>
      <div className={`flex items-center justify-between pb-3 border-b ${theme.borderSub} mb-3`}>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full shadow"
            style={{ backgroundColor: theme.primaryHex }}
          />
          <h3 className={`font-semibold text-sm tracking-wide uppercase ${theme.textTitle}`}>
            2D Head Trajectory Timeline Graph
          </h3>
        </div>
        <div className={`text-xs font-mono ${theme.textMuted}`}>
          Click any node to jump to step
        </div>
      </div>

      <div className="relative w-full overflow-hidden flex items-center justify-center">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto drop-shadow-lg">
          <defs>
            <linearGradient id="themeLineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={theme.primaryHex} />
              <stop offset="100%" stopColor={theme.secondaryHex} />
            </linearGradient>

            <filter id="pointGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>
          </defs>

          {/* Plot background */}
          <rect
            x={padding.left}
            y={padding.top}
            width={plotWidth}
            height={plotHeight}
            fill={theme.isLight ? '#f1f5f9' : '#090d16'}
            stroke={theme.isLight ? '#cbd5e1' : '#1e293b'}
            strokeWidth="1.5"
            rx="6"
          />

          {/* Vertical Grid Lines (Cylinders) */}
          {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => {
            const cylVal = Math.round(frac * maxCyl);
            const x = getX(cylVal);
            return (
              <g key={i}>
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={padding.top + plotHeight}
                  stroke={theme.isLight ? '#cbd5e1' : '#1e293b'}
                  strokeDasharray="3 3"
                />
                <text
                  x={x}
                  y={height - padding.bottom + 20}
                  fill={theme.isLight ? '#64748b' : '#64748b'}
                  fontSize="11"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {cylVal}
                </text>
              </g>
            );
          })}

          {/* Horizontal Grid Lines (Steps) */}
          {result.sequence.map((_, i) => {
            const y = getY(i);
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + plotWidth}
                  y2={y}
                  stroke={theme.isLight ? '#e2e8f0' : '#1e293b'}
                  strokeWidth="0.8"
                  opacity={i % 2 === 0 ? 0.8 : 0.3}
                />
                <text
                  x={padding.left - 12}
                  y={y + 4}
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  T{i}
                </text>
              </g>
            );
          })}

          {/* Full Inactive Trajectory Path (Dimmed) */}
          <path
            d={pathD}
            fill="none"
            stroke={theme.isLight ? '#94a3b8' : '#334155'}
            strokeWidth="2"
            strokeDasharray="4 4"
            opacity="0.5"
          />

          {/* Active Trajectory Path */}
          <path
            d={activePathD}
            fill="none"
            stroke="url(#themeLineGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Step Data Points */}
          {result.sequence.map((cyl, i) => {
            const cx = getX(cyl);
            const cy = getY(i);
            const isInitial = i === 0;
            const isCurrent = i === currentStepIndex;
            const stepObj = i > 0 ? result.steps[i - 1] : null;
            const isService = stepObj ? stepObj.isService : true;
            const isHovered = hoveredIdx === i;

            return (
              <g
                key={i}
                className="cursor-pointer transition-transform"
                onClick={() => onStepClick(i)}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Active halo */}
                {isCurrent && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="12"
                    fill="none"
                    stroke={theme.primaryHex}
                    strokeWidth="2.5"
                    className="animate-ping"
                    opacity="0.9"
                  />
                )}

                {/* Point circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isCurrent ? 7 : isHovered ? 6 : 4.5}
                  fill={
                    isInitial
                      ? '#f59e0b'
                      : isCurrent
                      ? theme.primaryHex
                      : isService
                      ? '#10b981'
                      : '#ef4444'
                  }
                  stroke={theme.isLight ? '#ffffff' : '#0f172a'}
                  strokeWidth="2"
                />

                {/* Tooltip */}
                {(isHovered || isCurrent) && (
                  <g transform={`translate(${cx}, ${cy - 16})`}>
                    <rect
                      x="-38"
                      y="-22"
                      width="76"
                      height="20"
                      rx="4"
                      fill={theme.isLight ? '#1e293b' : '#0f172a'}
                      stroke={theme.primaryHex}
                      strokeWidth="1.5"
                    />
                    <text
                      x="0"
                      y="-8"
                      fill="#ffffff"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      Cyl: {cyl}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          <text
            x={padding.left + plotWidth / 2}
            y={height - 8}
            fill={theme.isLight ? '#475569' : '#94a3b8'}
            fontSize="11"
            fontFamily="sans-serif"
            fontWeight="bold"
            textAnchor="middle"
          >
            Platter Cylinders [0 → {maxCyl}]
          </text>
        </svg>
      </div>

      <div className={`flex items-center justify-center gap-6 mt-3 pt-3 border-t ${theme.borderSub} text-xs ${theme.textMuted}`}>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500" />
          <span>Starting Head</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <span>Serviced Request</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span>Boundary Turnaround</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full shadow"
            style={{ backgroundColor: theme.primaryHex }}
          />
          <span className="font-semibold" style={{ color: theme.primaryHex }}>Active Step</span>
        </div>
      </div>
    </div>
  );
};
