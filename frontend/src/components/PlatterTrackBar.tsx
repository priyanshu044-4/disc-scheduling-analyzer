import React from 'react';
import type { ScheduleStep, DiskConfig } from '../types';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useTheme } from '../ThemeContext';

interface Props {
  currentStep: ScheduleStep | null;
  config: DiskConfig;
  allRequests: number[];
  currentCylinder: number;
}

export const PlatterTrackBar: React.FC<Props> = ({
  currentStep,
  config,
  allRequests,
  currentCylinder,
}) => {
  const { theme } = useTheme();
  const maxCyl = config.totalCylinders - 1;

  const getPct = (cyl: number) => (cyl / maxCyl) * 100;

  const fromPct = currentStep ? getPct(currentStep.fromCylinder) : getPct(config.initialHead);
  const toPct = currentStep ? getPct(currentStep.toCylinder) : getPct(config.initialHead);

  const trailLeft = Math.min(fromPct, toPct);
  const trailWidth = Math.abs(toPct - fromPct);

  return (
    <div className={`w-full ${theme.bgCard} ${theme.borderCard} border rounded-2xl p-5 shadow-2xl backdrop-blur-md transition-all`}>
      <div className={`flex items-center justify-between pb-3 mb-3 border-b ${theme.borderSub}`}>
        <h4 className={`text-xs font-semibold ${theme.textTitle} uppercase tracking-wider flex items-center gap-2`}>
          <span
            className="w-2.5 h-2.5 rounded-full shadow"
            style={{ backgroundColor: theme.primaryHex }}
          />
          Radial Platter Track Map [0 — {maxCyl}]
        </h4>
        {currentStep && (
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className={theme.textMuted}>
              Motion: <strong className={theme.textTitle}>{currentStep.fromCylinder}</strong>
            </span>
            {currentStep.toCylinder >= currentStep.fromCylinder ? (
              <ArrowRight className="w-3.5 h-3.5 inline" style={{ color: theme.primaryHex }} />
            ) : (
              <ArrowLeft className="w-3.5 h-3.5 inline" style={{ color: theme.primaryHex }} />
            )}
            <span className={theme.textMuted}>
              Target: <strong style={{ color: theme.primaryHex }}>{currentStep.toCylinder}</strong>
            </span>
            <span
              className="px-2 py-0.5 rounded border text-[11px]"
              style={{
                backgroundColor: `${theme.primaryHex}15`,
                color: theme.primaryHex,
                borderColor: `${theme.primaryHex}35`,
              }}
            >
              Seek: +{currentStep.seekDistance} cyl
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                currentStep.isService
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}
            >
              {currentStep.isService ? 'Service I/O' : 'Boundary Swing'}
            </span>
          </div>
        )}
      </div>

      {/* Track Bar Container */}
      <div className={`relative w-full h-12 rounded-xl border p-2 flex items-center ${theme.bgCardSub} ${theme.borderSub}`}>
        <div className={`absolute left-4 right-4 h-1.5 rounded-full ${theme.isLight ? 'bg-slate-300' : 'bg-slate-800'}`} />

        {/* Dynamic motion trail */}
        {currentStep && (
          <div
            className="absolute h-2.5 rounded-full transition-all duration-300 shadow-md"
            style={{
              left: `calc(1rem + ${trailLeft}% * (100% - 2rem) / 100)`,
              width: `calc(${trailWidth}% * (100% - 2rem) / 100)`,
              backgroundColor: theme.primaryHex,
              boxShadow: `0 0 12px ${theme.primaryGlow}`,
            }}
          />
        )}

        {/* Request Position Nodes */}
        {allRequests.map((req, idx) => {
          const pct = getPct(req);
          const isCurrent = req === currentCylinder;
          return (
            <div
              key={idx}
              className="absolute -top-1.5 -translate-x-1/2 flex flex-col items-center group cursor-pointer"
              style={{ left: `calc(1rem + ${pct}% * (100% - 2rem) / 100)` }}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full border-2 transition-transform duration-200 ${
                  isCurrent
                    ? 'scale-125 shadow-lg'
                    : 'bg-emerald-600 border-slate-900 group-hover:scale-125'
                }`}
                style={isCurrent ? { backgroundColor: theme.primaryHex, borderColor: '#ffffff' } : {}}
              />
              <span className={`text-[10px] font-mono opacity-80 group-hover:opacity-100 transition-opacity mt-1 ${theme.textMuted}`}>
                {req}
              </span>
            </div>
          );
        })}

        {/* Current Head Indicator Marker */}
        <div
          className="absolute -bottom-2 -translate-x-1/2 flex flex-col items-center transition-all duration-300 pointer-events-none"
          style={{ left: `calc(1rem + ${getPct(currentCylinder)}% * (100% - 2rem) / 100)` }}
        >
          <div
            className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px]"
            style={{ borderBottomColor: theme.primaryHex }}
          />
          <span
            className="text-[11px] font-mono font-bold px-1.5 py-0.2 rounded border shadow-lg mt-0.5"
            style={{
              backgroundColor: theme.isLight ? '#ffffff' : '#0f172a',
              color: theme.primaryHex,
              borderColor: `${theme.primaryHex}60`,
            }}
          >
            {currentCylinder}
          </span>
        </div>
      </div>

      <div className={`flex justify-between text-[11px] font-mono mt-2 px-1 ${theme.textMuted}`}>
        <span>Cylinder 0 (Inner Edge)</span>
        <span>Cylinder {maxCyl} (Outer Edge)</span>
      </div>
    </div>
  );
};
