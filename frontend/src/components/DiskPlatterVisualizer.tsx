import React, { useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import type { AlgorithmResult, DiskConfig } from '../types';
import { useTheme } from '../ThemeContext';

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
  const { theme } = useTheme();
  const currentStep = result.steps[currentStepIndex - 1];
  const currentCylinder = currentStepIndex === 0 ? config.initialHead : result.sequence[currentStepIndex];

  // Inner track radius = 75px, Outer track radius = 185px
  const innerRadius = 75;
  const outerRadius = 185;
  const normalizedRadius = currentCylinder / (config.totalCylinders - 1);
  const headRadius = innerRadius + normalizedRadius * (outerRadius - innerRadius);

  const pivotX = 65;
  const pivotY = 65;
  const platterCenterX = 240;
  const platterCenterY = 240;

  const armAngle = -15 + normalizedRadius * 38;
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
    <div className={`${theme.bgCard} ${theme.borderCard} border rounded-2xl p-5 shadow-2xl backdrop-blur-md flex flex-col items-center transition-all`}>
      <div className={`w-full flex items-center justify-between pb-3 border-b ${theme.borderSub} mb-3`}>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full animate-pulse shadow-md"
            style={{ backgroundColor: theme.primaryHex }}
          />
          <h3 className={`font-semibold text-sm tracking-wide uppercase ${theme.textTitle}`}>
            Physical Platter & Actuator Arm Simulator
          </h3>
        </div>
        <div
          className={`text-xs font-mono px-3 py-1 rounded-full border ${
            theme.isLight
              ? 'bg-[#f4efe5] border-[#d1c8b4] text-[#40392f]'
              : 'bg-[#181f1a] border-[#465248] text-[#ece6da]'
          }`}
        >
          Cylinder: <span className="font-bold text-sm" style={{ color: theme.primaryHex }}>{currentCylinder}</span> / {config.totalCylinders - 1}
        </div>
      </div>

      {/* SVG Disk Drive Rendering */}
      <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center my-2">
        <svg viewBox="0 0 460 460" className="w-full h-full drop-shadow-2xl">
          <defs>
            <radialGradient id="platterGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={theme.isLight ? '#f1f5f9' : '#191a21'} />
              <stop offset="35%" stopColor={theme.isLight ? '#e2e8f0' : '#282a36'} />
              <stop offset="65%" stopColor={theme.isLight ? '#cbd5e1' : '#21222c'} />
              <stop offset="85%" stopColor={theme.isLight ? '#94a3b8' : '#343746'} />
              <stop offset="100%" stopColor={theme.isLight ? '#64748b' : '#191a21'} />
            </radialGradient>

            <linearGradient id="armGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={theme.accentHex} />
              <stop offset="50%" stopColor={theme.primaryHex} />
              <stop offset="100%" stopColor={theme.secondaryHex} />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* HDD Chassis Base */}
          <rect
            x="20"
            y="20"
            width="420"
            height="420"
            rx="30"
            fill={theme.isLight ? '#eae4d6' : '#14151f'}
            stroke={theme.isLight ? '#c8bfae' : '#44475a'}
            strokeWidth="4"
          />
          <rect
            x="28"
            y="28"
            width="404"
            height="404"
            rx="24"
            fill="none"
            stroke={theme.isLight ? '#d6cdbd' : '#6272a4'}
            strokeWidth="1"
            opacity="0.3"
          />

          {/* Mounting Screws */}
          <circle cx="45" cy="45" r="7" fill={theme.isLight ? '#94a3b8' : '#44475a'} stroke={theme.isLight ? '#cbd5e1' : '#6272a4'} />
          <circle cx="415" cy="45" r="7" fill={theme.isLight ? '#94a3b8' : '#44475a'} stroke={theme.isLight ? '#cbd5e1' : '#6272a4'} />
          <circle cx="45" cy="415" r="7" fill={theme.isLight ? '#94a3b8' : '#44475a'} stroke={theme.isLight ? '#cbd5e1' : '#6272a4'} />
          <circle cx="415" cy="415" r="7" fill={theme.isLight ? '#94a3b8' : '#44475a'} stroke={theme.isLight ? '#cbd5e1' : '#6272a4'} />

          {/* Rotating Platter */}
          <g transform={`rotate(${rotation} ${platterCenterX} ${platterCenterY})`}>
            <circle
              cx={platterCenterX}
              cy={platterCenterY}
              r={outerRadius + 8}
              fill={theme.isLight ? '#f1f5f9' : '#191a21'}
              stroke={theme.isLight ? '#cbd5e1' : '#44475a'}
              strokeWidth="2"
            />
            <circle cx={platterCenterX} cy={platterCenterY} r={outerRadius} fill="url(#platterGrad)" />

            {[0.2, 0.4, 0.6, 0.8, 1.0].map((frac, i) => (
              <circle
                key={i}
                cx={platterCenterX}
                cy={platterCenterY}
                r={innerRadius + frac * (outerRadius - innerRadius)}
                fill="none"
                stroke={theme.secondaryHex}
                strokeWidth="0.8"
                opacity="0.35"
                strokeDasharray="4 6"
              />
            ))}

            <path
              d={`M ${platterCenterX} ${platterCenterY} L ${platterCenterX + outerRadius} ${platterCenterY - 30} A ${outerRadius} ${outerRadius} 0 0 1 ${platterCenterX + 30} ${platterCenterY + outerRadius} Z`}
              fill={theme.primaryHex}
              opacity="0.08"
            />
          </g>

          {/* Active Cylinder Track Highlight */}
          <circle
            cx={platterCenterX}
            cy={platterCenterY}
            r={headRadius}
            fill="none"
            stroke={theme.primaryHex}
            strokeWidth="3.5"
            opacity="0.95"
            filter="url(#glow)"
          />

          {/* Central Spindle Motor */}
          <circle cx={platterCenterX} cy={platterCenterY} r={innerRadius - 20} fill={theme.isLight ? '#f1f5f9' : '#191a21'} stroke={theme.secondaryHex} strokeWidth="3" />
          <circle cx={platterCenterX} cy={platterCenterY} r="25" fill={theme.isLight ? '#cbd5e1' : '#282a36'} stroke={theme.primaryHex} strokeWidth="2" />
          <circle cx={platterCenterX} cy={platterCenterY} r="8" fill={theme.isLight ? '#64748b' : '#14151f'} />

          {[0, 60, 120, 180, 240, 300].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <circle
                key={i}
                cx={platterCenterX + 16 * Math.cos(rad)}
                cy={platterCenterY + 16 * Math.sin(rad)}
                r="2.5"
                fill={theme.primaryHex}
              />
            );
          })}

          {/* Actuator Voice Coil Magnet Assembly */}
          <path d="M 40 40 Q 90 25 120 70 L 100 110 Q 60 70 40 40 Z" fill={theme.isLight ? '#cbd5e1' : '#282a36'} stroke={theme.isLight ? '#94a3b8' : '#44475a'} strokeWidth="2" />

          {/* Actuator Pivot Axis */}
          <circle cx={pivotX} cy={pivotY} r="24" fill={theme.isLight ? '#f1f5f9' : '#191a21'} stroke={theme.primaryHex} strokeWidth="3" />
          <circle cx={pivotX} cy={pivotY} r="14" fill={theme.isLight ? '#cbd5e1' : '#282a36'} />
          <circle cx={pivotX} cy={pivotY} r="6" fill={theme.isLight ? '#64748b' : '#14151f'} />

          {/* Moving Actuator Arm */}
          <g
            transform={`rotate(${armAngle} ${pivotX} ${pivotY})`}
            style={{ transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)' }}
          >
            <polygon
              points={`${pivotX},${pivotY - 8} ${pivotX + 175},${pivotY + 130} ${pivotX + 178},${pivotY + 135} ${pivotX},${pivotY + 8}`}
              fill="url(#armGrad)"
              stroke={theme.isLight ? '#94a3b8' : '#44475a'}
              strokeWidth="1.5"
            />
            <polygon
              points={`${pivotX},${pivotY - 8} ${pivotX - 25},${pivotY - 18} ${pivotX - 22},${pivotY + 18} ${pivotX},${pivotY + 8}`}
              fill={theme.isLight ? '#cbd5e1' : '#282a36'}
            />

            <rect
              x={pivotX + 170}
              y={pivotY + 128}
              width="14"
              height="8"
              rx="2"
              fill={theme.accentHex}
              stroke="#ffffff"
              filter="url(#glow)"
            />

            <circle
              cx={pivotX + 177}
              cy={pivotY + 132}
              r="4"
              fill="#ffffff"
              filter="url(#glow)"
            />
          </g>

          <text x="35" y="430" fill={theme.secondaryHex} fontSize="12" fontFamily="monospace">
            SPEED: {config.rpm} RPM
          </text>
          <text x="310" y="430" fill={theme.primaryHex} fontSize="12" fontFamily="monospace" fontWeight="bold">
            TRACK: {currentCylinder}
          </text>
        </svg>
      </div>

      {/* Traversal Controls */}
      <div className={`w-full ${theme.bgCardSub} ${theme.borderSub} border rounded-xl p-3 flex flex-col gap-2 mt-1`}>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-mono w-16 ${theme.textMuted}`}>
            Step {currentStepIndex}/{result.steps.length}
          </span>
          <input
            type="range"
            min="0"
            max={result.steps.length}
            value={currentStepIndex}
            onChange={(e) => onStepChange(Number(e.target.value))}
            style={{ accentColor: theme.primaryHex }}
            className={`flex-1 h-2 rounded-lg appearance-none cursor-pointer ${theme.isLight ? 'bg-slate-300' : 'bg-[#44475a]'}`}
          />
          <span className="text-xs font-mono font-bold min-w-14 text-right" style={{ color: theme.primaryHex }}>
            {currentStepIndex > 0 ? `+${currentStep?.seekDistance} cyl` : 'Start'}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onStepChange(0)}
              title="Reset to Start"
              className={`p-1.5 rounded-lg border transition-colors ${
                theme.isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                  : `${theme.bgCardSub} hover:border-[#bd93f9] ${theme.textBody} ${theme.borderSub}`
              }`}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => onStepChange(Math.max(0, currentStepIndex - 1))}
              disabled={currentStepIndex === 0}
              title="Previous Step"
              className={`p-1.5 rounded-lg border transition-colors disabled:opacity-40 ${
                theme.isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                  : `${theme.bgCardSub} hover:border-[#bd93f9] ${theme.textBody} ${theme.borderSub}`
              }`}
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={onPlayToggle}
              title={isPlaying ? 'Pause' : 'Play Simulation'}
              style={{ backgroundColor: theme.primaryHex, color: theme.primaryTextHex }}
              className="px-4 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all shadow-lg hover:opacity-90"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" style={{ fill: theme.primaryTextHex }} />
              ) : (
                <Play className="w-4 h-4" style={{ fill: theme.primaryTextHex }} />
              )}
              <span className="text-xs uppercase">{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button
              onClick={() => onStepChange(Math.min(result.steps.length, currentStepIndex + 1))}
              disabled={currentStepIndex === result.steps.length}
              title="Next Step"
              className={`p-1.5 rounded-lg border transition-colors disabled:opacity-40 ${
                theme.isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                  : `${theme.bgCardSub} hover:border-[#bd93f9] ${theme.textBody} ${theme.borderSub}`
              }`}
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Speed Selector */}
          <div className={`flex items-center gap-1 p-1 rounded-lg border ${theme.isLight ? 'bg-slate-100 border-slate-300' : `${theme.bgCardSub} ${theme.borderSub}`}`}>
            {[0.5, 1, 2, 4].map((spd) => (
              <button
                key={spd}
                onClick={() => onSpeedChange(spd)}
                style={playbackSpeed === spd ? { backgroundColor: theme.primaryHex, color: theme.primaryTextHex } : {}}
                className={`px-2 py-0.5 text-[11px] rounded font-mono font-medium transition-colors ${
                  playbackSpeed === spd
                    ? 'font-bold shadow'
                    : `${theme.textMuted} hover:${theme.textTitle}`
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
