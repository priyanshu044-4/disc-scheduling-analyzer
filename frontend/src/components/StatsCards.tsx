import React from 'react';
import type { AlgorithmResult, DiskConfig } from '../types';
import { Activity, Clock, ShieldAlert, Cpu, Gauge, Zap } from 'lucide-react';

interface Props {
  result: AlgorithmResult;
  config: DiskConfig;
}

export const StatsCards: React.FC<Props> = ({ result, config }) => {
  const getStarvationBadge = (risk: string) => {
    switch (risk) {
      case 'None':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Low':
        return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
      case 'Moderate':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'High':
        return 'bg-red-500/15 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 w-full">
      {/* 1. Total Head Movement */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-lg backdrop-blur flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
          <span>Total Seek</span>
          <Activity className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-cyan-300">
          {result.totalHeadMovement}{' '}
          <span className="text-xs font-normal text-slate-500">cyl</span>
        </div>
        <div className="text-[11px] text-slate-400 mt-1 font-mono">
          Avg: {result.avgSeekDistance.toFixed(1)} cyl/req
        </div>
      </div>

      {/* 2. Est. Seek Time */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-lg backdrop-blur flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
          <span>Seek Time</span>
          <Clock className="w-4 h-4 text-blue-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-blue-300">
          {result.estSeekTimeMs.toFixed(2)}{' '}
          <span className="text-xs font-normal text-slate-500">ms</span>
        </div>
        <div className="text-[11px] text-slate-400 mt-1">
          Mechanical arm travel
        </div>
      </div>

      {/* 3. Rotational Latency */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-lg backdrop-blur flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
          <span>Rot. Latency</span>
          <Gauge className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-indigo-300">
          {result.avgRotationalLatencyMs.toFixed(2)}{' '}
          <span className="text-xs font-normal text-slate-500">ms</span>
        </div>
        <div className="text-[11px] text-slate-400 mt-1 font-mono">
          @ {config.rpm} RPM
        </div>
      </div>

      {/* 4. Total Service Time */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-lg backdrop-blur flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
          <span>Service Time</span>
          <Zap className="w-4 h-4 text-amber-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-amber-300">
          {result.totalServiceTimeMs.toFixed(2)}{' '}
          <span className="text-xs font-normal text-slate-500">ms</span>
        </div>
        <div className="text-[11px] text-slate-400 mt-1">
          Seek + Rot + Transfer
        </div>
      </div>

      {/* 5. Jitter / StdDev */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-lg backdrop-blur flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
          <span>Variance (σ)</span>
          <Cpu className="w-4 h-4 text-purple-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-purple-300">
          ±{result.stdDevSeek.toFixed(1)}
        </div>
        <div className="text-[11px] text-slate-400 mt-1 font-mono">
          CV: {result.coefficientOfVariation.toFixed(2)}
        </div>
      </div>

      {/* 6. Starvation Risk */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-lg backdrop-blur flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
          <span>Starvation</span>
          <ShieldAlert className="w-4 h-4 text-emerald-400" />
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
        <div className="text-[11px] text-slate-400 mt-1">
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
