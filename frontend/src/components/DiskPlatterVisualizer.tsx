import React, { useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import type { AlgorithmResult, DiskConfig } from '../types';

interface Props {
  result: AlgorithmResult;
  config: DiskConfig;
  currentStepIndex: number;
  onStepChange: (index: number) => void;
  isPlaying: boolean;
  onPlayToggle: () => void;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
}

export const DiskPlatterVisualizer: React.FC<Props> = ({
  result,
  config,
  currentStepIndex,
  onStepChange,
  isPlaying,
  onPlayToggle,
  playbackSpeed,
  onSpeedChange,
}) => {
  const currentStep = result.steps[currentStepIndex - 1];
  const currentCylinder = currentStepIndex === 0 ? config.initialHead : result.sequence[currentStepIndex];

  // Map cylinder (0 to totalCylinders - 1) to normalized radius (0 to 1)
  // Inner track radius = 70px, Outer track radius = 180px
  const innerRadius = 75;
  const outerRadius = 185;
  const normalizedRadius = (currentCylinder / (config.totalCylinders - 1));
  const headRadius = innerRadius + normalizedRadius * (outerRadius - innerRadius);

  // Arm angle calculation based on radius
  // Pivot is located at (60, 60), platter center at (220, 220)
  const pivotX = 65;
  const pivotY = 65;
  const platterCenterX = 240;
  const platterCenterY = 240;

  // Arm tip angle
  const armAngle = -15 + normalizedRadius * 38;

  // Rotation animation state for platter texture
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let animId: number;
    const animate = () => {
      setRotation(prev => (prev + 1.2) % 360);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md flex flex-col items-center">
      <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
          <h3 className="font-semibold text-slate-200 text-sm tracking-wide uppercase">
            Physical Platter & Actuator Arm Simulator
          </h3>
        </div>
        <div className="text-xs font-mono bg-slate-800 px-3 py-1 rounded-full text-cyan-300 border border-slate-700">
          Cylinder: <span className="font-bold text-white text-sm">{currentCylinder}</span> / {config.totalCylinders - 1}
        </div>
      </div>

      {/* SVG Disk Drive Rendering */}
      <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center my-2">
        <svg viewBox="0 0 460 460" className="w-full h-full drop-shadow-2xl">
          <defs>
            {/* Platter metallic gradient */}
            <radialGradient id="platterGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="35%" stopColor="#334155" />
              <stop offset="65%" stopColor="#1e293b" />
              <stop offset="85%" stopColor="#475569" />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>

            {/* Arm gradient */}
            <linearGradient id="armGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="50%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>

            {/* Glow filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* HDD Chassis Base */}
          <rect x="20" y="20" width="420" height="420" rx="30" fill="#090d16" stroke="#1e293b" strokeWidth="4" />
          <rect x="28" y="28" width="404" height="404" rx="24" fill="none" stroke="#334155" strokeWidth="1" opacity="0.4" />

          {/* Mounting Screws */}
          <circle cx="45" cy="45" r="7" fill="#334155" stroke="#475569" />
          <circle cx="415" cy="45" r="7" fill="#334155" stroke="#475569" />
          <circle cx="45" cy="415" r="7" fill="#334155" stroke="#475569" />
          <circle cx="415" cy="415" r="7" fill="#334155" stroke="#475569" />

          {/* Rotating Platter */}
          <g transform={`rotate(${rotation} ${platterCenterX} ${platterCenterY})`}>
            {/* Outer Platter Rim */}
            <circle cx={platterCenterX} cy={platterCenterY} r={outerRadius + 8} fill="#1e293b" stroke="#475569" strokeWidth="2" />
            {/* Magnetic Surface */}
            <circle cx={platterCenterX} cy={platterCenterY} r={outerRadius} fill="url(#platterGrad)" />

            {/* Concentric Track Grooves */}
            {[0.2, 0.4, 0.6, 0.8, 1.0].map((frac, i) => (
              <circle
                key={i}
                cx={platterCenterX}
                cy={platterCenterY}
                r={innerRadius + frac * (outerRadius - innerRadius)}
                fill="none"
                stroke="#64748b"
                strokeWidth="0.8"
                opacity="0.35"
                strokeDasharray="4 6"
              />
            ))}

            {/* Platter reflection rays */}
            <path
              d={`M ${platterCenterX} ${platterCenterY} L ${platterCenterX + outerRadius} ${platterCenterY - 30} A ${outerRadius} ${outerRadius} 0 0 1 ${platterCenterX + 30} ${platterCenterY + outerRadius} Z`}
              fill="#ffffff"
              opacity="0.04"
            />
          </g>

          {/* Active Cylinder Track Highlight */}
          <circle
            cx={platterCenterX}
            cy={platterCenterY}
            r={headRadius}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="3"
            opacity="0.85"
            filter="url(#glow)"
          />

          {/* Central Spindle Motor */}
          <circle cx={platterCenterX} cy={platterCenterY} r={innerRadius - 20} fill="#1e293b" stroke="#64748b" strokeWidth="4" />
          <circle cx={platterCenterX} cy={platterCenterY} r="25" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
          <circle cx={platterCenterX} cy={platterCenterY} r="8" fill="#0f172a" />

          {/* Spindle Screws */}
          {[0, 60, 120, 180, 240, 300].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <circle
                key={i}
                cx={platterCenterX + 16 * Math.cos(rad)}
                cy={platterCenterY + 16 * Math.sin(rad)}
                r="2.5"
                fill="#cbd5e1"
              />
            );
          })}

          {/* Actuator Voice Coil Magnet Assembly */}
          <path d="M 40 40 Q 90 25 120 70 L 100 110 Q 60 70 40 40 Z" fill="#1e293b" stroke="#334155" strokeWidth="2" />

          {/* Actuator Pivot Axis */}
          <circle cx={pivotX} cy={pivotY} r="24" fill="#1e293b" stroke="#64748b" strokeWidth="3" />
          <circle cx={pivotX} cy={pivotY} r="14" fill="#475569" />
          <circle cx={pivotX} cy={pivotY} r="6" fill="#0f172a" />

          {/* Moving Actuator Arm */}
          <g
            transform={`rotate(${armAngle} ${pivotX} ${pivotY})`}
            style={{ transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)' }}
          >
            {/* Arm Body */}
            <polygon
              points={`${pivotX},${pivotY - 8} ${pivotX + 175},${pivotY + 130} ${pivotX + 178},${pivotY + 135} ${pivotX},${pivotY + 8}`}
              fill="url(#armGrad)"
              stroke="#475569"
              strokeWidth="1.5"
            />
            {/* Counter-weight tail */}
            <polygon
              points={`${pivotX},${pivotY - 8} ${pivotX - 25},${pivotY - 18} ${pivotX - 22},${pivotY + 18} ${pivotX},${pivotY + 8}`}
              fill="#334155"
            />

            {/* Read/Write Head Slider at Arm Tip */}
            <rect
              x={pivotX + 170}
              y={pivotY + 128}
              width="14"
              height="8"
              rx="2"
              fill="#0ea5e9"
              stroke="#38bdf8"
              filter="url(#glow)"
            />

            {/* Glowing Laser / Magnetic Sensor Dot */}
            <circle
              cx={pivotX + 177}
              cy={pivotY + 132}
              r="4"
              fill="#22d3ee"
              filter="url(#glow)"
            />
          </g>

          {/* Status Label on Platter */}
          <text x="35" y="430" fill="#64748b" fontSize="12" fontFamily="monospace">
            SPEED: {config.rpm} RPM
          </text>
          <text x="310" y="430" fill="#06b6d4" fontSize="12" fontFamily="monospace" fontWeight="bold">
            TRACK: {currentCylinder}
          </text>
        </svg>
      </div>

      {/* Traversal Controls */}
      <div className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-col gap-2 mt-1">
        {/* Progress Bar & Step Slider */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400 w-16">
            Step {currentStepIndex}/{result.steps.length}
          </span>
          <input
            type="range"
            min="0"
            max={result.steps.length}
            value={currentStepIndex}
            onChange={(e) => onStepChange(Number(e.target.value))}
            className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <span className="text-xs font-mono text-cyan-300 font-bold min-w-14 text-right">
            {currentStepIndex > 0 ? `${currentStep?.seekDistance} cyl` : 'Start'}
          </span>
        </div>

        {/* Playback Button Controls */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onStepChange(0)}
              title="Reset to Start"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => onStepChange(Math.max(0, currentStepIndex - 1))}
              disabled={currentStepIndex === 0}
              title="Previous Step"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={onPlayToggle}
              title={isPlaying ? 'Pause' : 'Play Simulation'}
              className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-cyan-500/20"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950" />}
              <span className="text-xs uppercase">{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button
              onClick={() => onStepChange(Math.min(result.steps.length, currentStepIndex + 1))}
              disabled={currentStepIndex === result.steps.length}
              title="Next Step"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700/50">
            {[0.5, 1, 2, 4].map((spd) => (
              <button
                key={spd}
                onClick={() => onSpeedChange(spd)}
                className={`px-2 py-0.5 text-[11px] rounded font-mono font-medium transition-colors ${
                  playbackSpeed === spd
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
