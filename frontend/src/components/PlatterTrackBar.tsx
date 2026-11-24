import React from 'react';
import type { ScheduleStep, DiskConfig } from '../types';
import { ArrowRight, ArrowLeft } from 'lucide-react';

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
  const maxCyl = config.totalCylinders - 1;

  // Percentage positions
  const getPct = (cyl: number) => (cyl / maxCyl) * 100;

  const fromPct = currentStep ? getPct(currentStep.fromCylinder) : getPct(config.initialHead);
  const toPct = currentStep ? getPct(currentStep.toCylinder) : getPct(config.initialHead);

  const trailLeft = Math.min(fromPct, toPct);
  const trailWidth = Math.abs(toPct - fromPct);

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          Radial Platter Track Map [0 — {maxCyl}]
        </h4>
        {currentStep && (
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-400">
              Motion: <strong className="text-slate-200">{currentStep.fromCylinder}</strong>
            </span>
            {currentStep.toCylinder >= currentStep.fromCylinder ? (
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400 inline" />
            ) : (
              <ArrowLeft className="w-3.5 h-3.5 text-cyan-400 inline" />
            )}
            <span className="text-slate-400">
              Target: <strong className="text-cyan-300">{currentStep.toCylinder}</strong>
            </span>
            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded">
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
      <div className="relative w-full h-12 bg-slate-950 rounded-xl border border-slate-800 p-2 flex items-center">
        {/* Track groove baseline */}
        <div className="absolute left-4 right-4 h-1.5 bg-slate-800 rounded-full" />

        {/* Dynamic motion trail */}
        {currentStep && (
          <div
            className="absolute h-2.5 bg-gradient-to-r from-cyan-500/30 via-cyan-400 to-cyan-500/30 rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(6,182,212,0.5)]"
            style={{
              left: `calc(1rem + ${trailLeft}% * (100% - 2rem) / 100)`,
              width: `calc(${trailWidth}% * (100% - 2rem) / 100)`,
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
                    ? 'bg-cyan-400 border-white scale-125 shadow-[0_0_8px_#38bdf8]'
                    : 'bg-emerald-600 border-slate-900 group-hover:scale-125'
                }`}
              />
              <span className="text-[10px] font-mono text-slate-400 opacity-80 group-hover:opacity-100 group-hover:text-cyan-300 transition-opacity mt-1">
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
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-cyan-400 filter drop-shadow-[0_0_6px_#06b6d4]" />
          <span className="text-[11px] font-mono font-bold text-cyan-300 bg-slate-900/90 px-1.5 py-0.2 rounded border border-cyan-500/40 shadow-lg mt-0.5">
            {currentCylinder}
          </span>
        </div>
      </div>

      {/* Axis Ends */}
      <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-2 px-1">
        <span>Cylinder 0 (Inner Edge)</span>
        <span>Cylinder {maxCyl} (Outer Edge)</span>
      </div>
    </div>
  );
};
