import React from 'react';
import type { AlgorithmResult, DiskConfig } from '../types';
import { Activity, Clock, ShieldAlert, Cpu, Gauge, Zap } from 'lucide-react';
import { useTheme } from '../ThemeContext';

interface Props {
  result: AlgorithmResult;
  config: DiskConfig;
}

export const StatsCards: React.FC<Props> = ({ result, config }) => {
  const { theme } = useTheme();

  const getStarvationBadge = (risk: string) => {
    switch (risk) {
      case 'None':
        return 'bg-[#7a7c64]/25 text-[#cec88a] border-[#7a7c64]/40';
      case 'Low':
        return 'bg-[#7a7c64]/15 text-[#ded7c8] border-[#7a7c64]/30';
      case 'Moderate':
        return 'bg-[#bcb096]/20 text-[#cec88a] border-[#bcb096]/40';
      case 'High':
        return 'bg-[#a85b4d]/25 text-[#e69b8f] border-[#a85b4d]/40';
      default:
        return 'bg-[#2b352f] text-[#bcb096] border-[#465248]';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 w-full">
      {/* 1. Total Head Movement */}
      <div className={`${theme.bgCard} ${theme.borderCard} border rounded-xl p-3.5 shadow-lg backdrop-blur flex flex-col justify-between transition-all`}>
        <div className={`flex items-center justify-between ${theme.textMuted} text-xs mb-1`}>
          <span>Total Seek</span>
          <Activity className="w-4 h-4" style={{ color: theme.primaryHex }} />
        </div>
        <div className="text-2xl font-bold font-mono" style={{ color: theme.primaryHex }}>
          {result.totalHeadMovement}{' '}
          <span className="text-xs font-normal opacity-60">cyl</span>
        </div>
        <div className={`text-[11px] ${theme.textMuted} mt-1 font-mono`}>
          Avg: {result.avgSeekDistance.toFixed(1)} cyl/req
        </div>
      </div>

      {/* 2. Est. Seek Time */}
      <div className={`${theme.bgCard} ${theme.borderCard} border rounded-xl p-3.5 shadow-lg backdrop-blur flex flex-col justify-between transition-all`}>
        <div className={`flex items-center justify-between ${theme.textMuted} text-xs mb-1`}>
          <span>Seek Time</span>
          <Clock className="w-4 h-4" style={{ color: theme.secondaryHex }} />
        </div>
        <div className={`text-2xl font-bold font-mono ${theme.textTitle}`}>
          {result.estSeekTimeMs.toFixed(2)}{' '}
          <span className="text-xs font-normal opacity-60">ms</span>
        </div>
        <div className={`text-[11px] ${theme.textMuted} mt-1`}>
          Mechanical arm travel
        </div>
      </div>

      {/* 3. Rotational Latency */}
      <div className={`${theme.bgCard} ${theme.borderCard} border rounded-xl p-3.5 shadow-lg backdrop-blur flex flex-col justify-between transition-all`}>
        <div className={`flex items-center justify-between ${theme.textMuted} text-xs mb-1`}>
          <span>Rot. Latency</span>
          <Gauge className="w-4 h-4" style={{ color: theme.primaryHex }} />
        </div>
        <div className={`text-2xl font-bold font-mono ${theme.textTitle}`}>
          {result.avgRotationalLatencyMs.toFixed(2)}{' '}
          <span className="text-xs font-normal opacity-60">ms</span>
        </div>
        <div className={`text-[11px] ${theme.textMuted} mt-1 font-mono`}>
          @ {config.rpm} RPM
        </div>
      </div>

      {/* 4. Total Service Time */}
      <div className={`${theme.bgCard} ${theme.borderCard} border rounded-xl p-3.5 shadow-lg backdrop-blur flex flex-col justify-between transition-all`}>
        <div className={`flex items-center justify-between ${theme.textMuted} text-xs mb-1`}>
          <span>Service Time</span>
          <Zap className="w-4 h-4" style={{ color: theme.primaryHex }} />
        </div>
        <div className="text-2xl font-bold font-mono" style={{ color: theme.primaryHex }}>
          {result.totalServiceTimeMs.toFixed(2)}{' '}
          <span className="text-xs font-normal opacity-60">ms</span>
        </div>
        <div className={`text-[11px] ${theme.textMuted} mt-1`}>
          Seek + Rot + Transfer
        </div>
      </div>

      {/* 5. Jitter / StdDev */}
      <div className={`${theme.bgCard} ${theme.borderCard} border rounded-xl p-3.5 shadow-lg backdrop-blur flex flex-col justify-between transition-all`}>
        <div className={`flex items-center justify-between ${theme.textMuted} text-xs mb-1`}>
          <span>Variance (σ)</span>
          <Cpu className="w-4 h-4" style={{ color: theme.secondaryHex }} />
        </div>
        <div className="text-2xl font-bold font-mono" style={{ color: theme.secondaryHex }}>
          ±{result.stdDevSeek.toFixed(1)}
        </div>
        <div className={`text-[11px] ${theme.textMuted} mt-1 font-mono`}>
          CV: {result.coefficientOfVariation.toFixed(2)}
        </div>
      </div>

      {/* 6. Starvation Risk */}
      <div className={`${theme.bgCard} ${theme.borderCard} border rounded-xl p-3.5 shadow-lg backdrop-blur flex flex-col justify-between transition-all`}>
        <div className={`flex items-center justify-between ${theme.textMuted} text-xs mb-1`}>
          <span>Starvation</span>
          <ShieldAlert className="w-4 h-4" style={{ color: theme.primaryHex }} />
        </div>
        <div>
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${getStarvationBadge(
              result.starvationRisk
            )}`}
          >
            {result.starvationRisk}
          </span>
        </div>
        <div className={`text-[11px] ${theme.textMuted} mt-1`}>
          {result.name === 'SSTF'
            ? 'Prone under load'
            : result.name === 'C-SCAN' || result.name === 'C-LOOK'
            ? 'Uniform wait times'
            : 'Bounded latency'}
        </div>
      </div>
    </div>
  );
};
