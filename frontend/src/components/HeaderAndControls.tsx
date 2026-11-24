import React, { useState } from 'react';
import type { DiskConfig, PresetWorkload } from '../types';
import { Dices, HardDrive, Sparkles } from 'lucide-react';

interface Props {
  config: DiskConfig;
  onConfigChange: (newConfig: DiskConfig) => void;
  requests: number[];
  onRequestChange: (newRequests: number[]) => void;
}

export const PRESETS: PresetWorkload[] = [
  {
    name: 'Silberschatz Textbook',
    description: 'Standard OS textbook reference (200 cyl, Head 53, 8 requests)',
    cylinders: 200,
    head: 53,
    direction: 'UP',
    requests: [98, 183, 37, 122, 14, 124, 65, 67],
  },
  {
    name: 'Database Hotspots',
    description: 'Clustered transaction logs & index lookup spots (1000 cyl)',
    cylinders: 1000,
    head: 150,
    direction: 'UP',
    requests: [120, 125, 118, 130, 850, 860, 845, 870, 140, 855, 122, 880],
  },
  {
    name: 'Ping-Pong Thrashing',
    description: 'Extreme alternating inner/outer track workload (500 cyl)',
    cylinders: 500,
    head: 250,
    direction: 'UP',
    requests: [15, 485, 25, 475, 30, 460, 40, 450, 10, 490, 50, 440],
  },
  {
    name: 'Sequential Streaming',
    description: 'Contiguous audio/video blocks or backup streaming (500 cyl)',
    cylinders: 500,
    head: 100,
    direction: 'UP',
    requests: [102, 105, 110, 114, 119, 125, 131, 140, 150, 162, 175, 190],
  },
];

export const HeaderAndControls: React.FC<Props> = ({
  config,
  onConfigChange,
  requests,
  onRequestChange,
}) => {
  const [requestText, setRequestText] = useState(requests.join(', '));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleApplyRequests = (text: string) => {
    setRequestText(text);
    const tokens = text.split(/[,\s]+/).filter(Boolean);
    const parsed: number[] = [];
    let err: string | null = null;

    for (const t of tokens) {
      const num = parseInt(t, 10);
      if (isNaN(num)) {
        err = `Invalid number: "${t}"`;
        break;
      }
      if (num < 0 || num >= config.totalCylinders) {
        err = `Cylinder ${num} is out of bounds (0 to ${config.totalCylinders - 1})`;
        break;
      }
      parsed.push(num);
    }

    if (err) {
      setErrorMsg(err);
    } else if (parsed.length === 0) {
      setErrorMsg('Please enter at least one request cylinder.');
    } else {
      setErrorMsg(null);
      onRequestChange(parsed);
    }
  };

  const handleLoadPreset = (preset: PresetWorkload) => {
    onConfigChange({
      ...config,
      totalCylinders: preset.cylinders,
      initialHead: preset.head,
      direction: preset.direction,
    });
    onRequestChange(preset.requests);
    setRequestText(preset.requests.join(', '));
    setErrorMsg(null);
  };

  const handleGenerateRandom = (count = 10) => {
    const gen: number[] = [];
    for (let i = 0; i < count; i++) {
      gen.push(Math.floor(Math.random() * config.totalCylinders));
    }
    onRequestChange(gen);
    setRequestText(gen.join(', '));
    setErrorMsg(null);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md flex flex-col gap-4">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Disc Scheduling Analyzer
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                AOS Simulator
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Interactive Step-by-Step Platter Map, 2D Trajectory Visualizer & Performance Benchmarking
            </p>
          </div>
        </div>

        {/* Preset Selectors */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Presets:
          </span>
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => handleLoadPreset(p)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 rounded-lg text-xs font-medium transition-colors"
            >
              {p.name}
            </button>
          ))}
          <button
            onClick={() => handleGenerateRandom(12)}
            className="px-2.5 py-1.5 bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Dices className="w-3.5 h-3.5" /> Random
          </button>
        </div>
      </div>

      {/* Main Workload Parameters Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Total Cylinders */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Total Cylinders (0 - {config.totalCylinders - 1})
          </label>
          <input
            type="number"
            min="10"
            max="10000"
            value={config.totalCylinders}
            onChange={(e) => {
              const val = Math.max(10, parseInt(e.target.value) || 200);
              onConfigChange({
                ...config,
                totalCylinders: val,
                initialHead: Math.min(config.initialHead, val - 1),
              });
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Initial Head Position */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Initial Head Position
          </label>
          <input
            type="number"
            min="0"
            max={config.totalCylinders - 1}
            value={config.initialHead}
            onChange={(e) => {
              const val = Math.min(config.totalCylinders - 1, Math.max(0, parseInt(e.target.value) || 0));
              onConfigChange({ ...config, initialHead: val });
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm font-mono text-yellow-300 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Sweep Direction */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Sweep Direction
          </label>
          <div className="grid grid-cols-2 gap-1.5 mt-0.5">
            <button
              onClick={() => onConfigChange({ ...config, direction: 'UP' })}
              className={`py-1 text-xs font-semibold rounded-lg border transition-colors ${
                config.direction === 'UP'
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              UP (Towards Max)
            </button>
            <button
              onClick={() => onConfigChange({ ...config, direction: 'DOWN' })}
              className={`py-1 text-xs font-semibold rounded-lg border transition-colors ${
                config.direction === 'DOWN'
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              DOWN (Towards 0)
            </button>
          </div>
        </div>

        {/* Spindle RPM */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Spindle Speed (RPM)
          </label>
          <select
            value={config.rpm}
            onChange={(e) => onConfigChange({ ...config, rpm: Number(e.target.value) })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="5400">5400 RPM (Laptop HDD)</option>
            <option value="7200">7200 RPM (Desktop Standard)</option>
            <option value="10000">10,000 RPM (High-Performance)</option>
            <option value="15000">15,000 RPM (Enterprise SAS)</option>
          </select>
        </div>
      </div>

      {/* Request Queue Input Row */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            I/O Request Queue ({requests.length} requests loaded)
          </label>
          <span className="text-[11px] text-slate-500">Comma or space separated</span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={requestText}
            onChange={(e) => handleApplyRequests(e.target.value)}
            placeholder="e.g. 98, 183, 37, 122, 14, 124, 65, 67"
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-emerald-300 focus:outline-none focus:border-cyan-400"
          />
          <button
            onClick={() => handleApplyRequests(requestText)}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Apply
          </button>
        </div>
        {errorMsg && (
          <div className="text-xs text-rose-400 font-medium mt-1.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
};
