import React, { useState } from 'react';
import type { AlgorithmResult, DiskConfig } from '../types';

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
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const width = 640;
  const height = 360;
  const padding = { top: 30, right: 35, bottom: 45, left: 55 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Scale functions
  const maxCyl = config.totalCylinders - 1;
  const maxSteps = Math.max(1, result.sequence.length - 1);

  const getX = (cylinder: number) => padding.left + (cylinder / maxCyl) * plotWidth;
  const getY = (step: number) => padding.top + (step / maxSteps) * plotHeight;

  // Generate SVG path for the trajectory line
  const pathD = result.sequence
    .map((cyl, i) => `${i === 0 ? 'M' : 'L'} ${getX(cyl).toFixed(1)} ${getY(i).toFixed(1)}`)
    .join(' ');

  // Generate path up to current step
  const activePathD = result.sequence
    .slice(0, currentStepIndex + 1)
    .map((cyl, i) => `${i === 0 ? 'M' : 'L'} ${getX(cyl).toFixed(1)} ${getY(i).toFixed(1)}`)
    .join(' ');

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md flex flex-col">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
          <h3 className="font-semibold text-slate-200 text-sm tracking-wide uppercase">
            2D Head Trajectory Timeline Graph
          </h3>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Click any node to jump to step
        </div>
      </div>

      <div className="relative w-full overflow-hidden flex items-center justify-center">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto drop-shadow-lg">
          <defs>
            <linearGradient id="gridGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#334155" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#334155" stopOpacity="0.4" />
            </linearGradient>

            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
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
            fill="#090d16"
            stroke="#1e293b"
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
                  stroke="#1e293b"
                  strokeDasharray="3 3"
                />
                <text
                  x={x}
                  y={height - padding.bottom + 20}
                  fill="#64748b"
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
                  stroke="#1e293b"
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
            stroke="#334155"
            strokeWidth="2"
            strokeDasharray="4 4"
            opacity="0.6"
          />

          {/* Active Trajectory Path (Rendered up to current step) */}
          <path
            d={activePathD}
            fill="none"
            stroke="url(#lineGrad)"
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
                    stroke="#22d3ee"
                    strokeWidth="2"
                    className="animate-ping"
                    opacity="0.8"
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
                      ? '#06b6d4'
                      : isService
                      ? '#10b981'
                      : '#ef4444'
                  }
                  stroke="#0f172a"
                  strokeWidth="2"
                />

                {/* Hover / Active tooltip box */}
                {(isHovered || isCurrent) && (
                  <g transform={`translate(${cx}, ${cy - 16})`}>
                    <rect
                      x="-38"
                      y="-22"
                      width="76"
                      height="20"
                      rx="4"
                      fill="#0f172a"
                      stroke="#38bdf8"
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="-8"
                      fill="#f8fafc"
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

          {/* Axis Labels */}
          <text
            x={padding.left + plotWidth / 2}
            y={height - 8}
            fill="#94a3b8"
            fontSize="11"
            fontFamily="sans-serif"
            fontWeight="bold"
            textAnchor="middle"
          >
            Platter Cylinders [0 → {maxCyl}]
          </text>
        </svg>
      </div>

      {/* Trajectory Legend */}
      <div className="flex items-center justify-center gap-6 mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
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
          <span className="w-3 h-3 rounded-full bg-cyan-400 ring-2 ring-cyan-400/40" />
          <span>Active Step</span>
        </div>
      </div>
    </div>
  );
};
