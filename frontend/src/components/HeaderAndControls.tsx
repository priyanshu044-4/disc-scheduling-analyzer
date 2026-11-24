import React, { useState } from 'react';
import type { DiskConfig, PresetWorkload } from '../types';
import { Dices, HardDrive, Sparkles } from 'lucide-react';
import { useTheme } from '../ThemeContext';

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
  const { theme } = useTheme();
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
    <div className={`${theme.bgCard} ${theme.borderCard} border rounded-2xl p-5 shadow-2xl backdrop-blur-md flex flex-col gap-4 transition-all`}>
      {/* Top Header Row */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b ${theme.borderSub}`}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-md"
            style={{
              backgroundColor: `${theme.primaryHex}20`,
              borderColor: `${theme.primaryHex}40`,
              color: theme.primaryHex,
            }}
          >
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h1 className={`text-xl font-bold ${theme.textTitle} tracking-tight flex items-center gap-2`}>
              Disc Scheduling Analyzer
              <span
                className="text-xs px-2 py-0.5 rounded-full font-mono border"
                style={{
                  backgroundColor: `${theme.primaryHex}20`,
                  color: theme.primaryHex,
                  borderColor: `${theme.primaryHex}40`,
                }}
              >
                AOS Simulator
              </span>
            </h1>
            <p className={`text-xs ${theme.textMuted}`}>
              Step-by-Step Platter Map, 2D Trajectory Visualizer & Hardware Performance Benchmark
            </p>
          </div>
        </div>

        {/* Preset Selectors */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-semibold ${theme.textMuted} uppercase tracking-wider flex items-center gap-1.5`}>
            <Sparkles className="w-3.5 h-3.5" style={{ color: theme.primaryHex }} /> Presets:
          </span>
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => handleLoadPreset(p)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                theme.isLight
                  ? 'bg-[#faf7f0] hover:bg-[#ede6d9] text-[#40392f] border-[#d1c8b4]'
                  : 'bg-[#222a24] hover:bg-[#2b352f] text-[#ded7c8] hover:text-[#ece6da] border-[#465248]'
              }`}
            >
              {p.name}
            </button>
          ))}
          <button
            onClick={() => handleGenerateRandom(12)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border"
            style={{
              backgroundColor: `${theme.primaryHex}20`,
              color: theme.primaryHex,
              borderColor: `${theme.primaryHex}40`,
            }}
          >
            <Dices className="w-3.5 h-3.5" /> Random
          </button>
        </div>
      </div>

      {/* Main Workload Parameters Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Total Cylinders */}
        <div className={`${theme.bgCardSub} ${theme.borderSub} border rounded-xl p-3`}>
          <label className={`text-[11px] font-semibold ${theme.textMuted} uppercase tracking-wider block mb-1`}>
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
            className={`w-full rounded-lg px-3 py-1.5 text-sm font-mono border focus:outline-none transition-colors ${
              theme.isLight
                ? 'bg-white border-[#d1c8b4] text-[#40392f]'
                : 'bg-[#141a16] border-[#465248] text-[#cec88a] focus:border-[#cec88a]'
            }`}
          />
        </div>

        {/* Initial Head Position */}
        <div className={`${theme.bgCardSub} ${theme.borderSub} border rounded-xl p-3`}>
          <label className={`text-[11px] font-semibold ${theme.textMuted} uppercase tracking-wider block mb-1`}>
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
            className={`w-full rounded-lg px-3 py-1.5 text-sm font-mono border focus:outline-none transition-colors ${
              theme.isLight
                ? 'bg-white border-[#d1c8b4] text-[#40392f]'
                : 'bg-[#141a16] border-[#465248] text-[#cec88a] focus:border-[#cec88a]'
            }`}
          />
        </div>

        {/* Sweep Direction */}
        <div className={`${theme.bgCardSub} ${theme.borderSub} border rounded-xl p-3`}>
          <label className={`text-[11px] font-semibold ${theme.textMuted} uppercase tracking-wider block mb-1`}>
            Sweep Direction
          </label>
          <div className="grid grid-cols-2 gap-1.5 mt-0.5">
            <button
              onClick={() => onConfigChange({ ...config, direction: 'UP' })}
              style={
                config.direction === 'UP'
                  ? { backgroundColor: theme.primaryHex, color: theme.primaryTextHex }
                  : {}
              }
              className={`py-1 text-xs font-semibold rounded-lg border transition-colors ${
                config.direction === 'UP'
                  ? 'border-transparent shadow'
                  : theme.isLight
                  ? 'bg-white text-[#40392f] border-[#d1c8b4]'
                  : 'bg-[#141a16] text-[#ded7c8] border-[#465248] hover:border-[#7a7c64]'
              }`}
            >
              UP (Max)
            </button>
            <button
              onClick={() => onConfigChange({ ...config, direction: 'DOWN' })}
              style={
                config.direction === 'DOWN'
                  ? { backgroundColor: theme.primaryHex, color: theme.primaryTextHex }
                  : {}
              }
              className={`py-1 text-xs font-semibold rounded-lg border transition-colors ${
                config.direction === 'DOWN'
                  ? 'border-transparent shadow'
                  : theme.isLight
                  ? 'bg-white text-[#40392f] border-[#d1c8b4]'
                  : 'bg-[#141a16] text-[#ded7c8] border-[#465248] hover:border-[#7a7c64]'
              }`}
            >
              DOWN (0)
            </button>
          </div>
        </div>

        {/* Spindle RPM */}
        <div className={`${theme.bgCardSub} ${theme.borderSub} border rounded-xl p-3 flex flex-col justify-between`}>
          <label className={`text-[11px] font-semibold ${theme.textMuted} uppercase tracking-wider block`}>
            Spindle Speed (RPM)
          </label>
          <select
            value={config.rpm}
            onChange={(e) => onConfigChange({ ...config, rpm: Number(e.target.value) })}
            className={`w-full rounded-lg px-3 py-1.5 text-sm font-mono border focus:outline-none transition-colors ${
              theme.isLight
                ? 'bg-white border-[#d1c8b4] text-[#40392f]'
                : 'bg-[#141a16] border-[#465248] text-[#cec88a] focus:border-[#cec88a]'
            }`}
          >
            <option value="5400">5400 RPM (Laptop)</option>
            <option value="7200">7200 RPM (Desktop)</option>
            <option value="10000">10,000 RPM (High-End)</option>
            <option value="15000">15,000 RPM (Enterprise)</option>
          </select>
        </div>
      </div>

      {/* Request Queue Input Row */}
      <div className={`${theme.bgCardSub} ${theme.borderSub} border rounded-xl p-3`}>
        <div className="flex items-center justify-between mb-1.5">
          <label className={`text-[11px] font-semibold ${theme.textMuted} uppercase tracking-wider`}>
            I/O Request Queue ({requests.length} requests loaded)
          </label>
          <span className={`text-[11px] ${theme.textMuted}`}>Comma or space separated</span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={requestText}
            onChange={(e) => handleApplyRequests(e.target.value)}
            placeholder="e.g. 98, 183, 37, 122, 14, 124, 65, 67"
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-mono border focus:outline-none transition-colors ${
              theme.isLight
                ? 'bg-white border-[#d1c8b4] text-[#40392f]'
                : 'bg-[#141a16] border-[#465248] text-[#ded7c8] focus:border-[#cec88a]'
            }`}
          />
          <button
            onClick={() => handleApplyRequests(requestText)}
            style={{ backgroundColor: theme.primaryHex, color: theme.primaryTextHex }}
            className="px-4 py-2 rounded-lg text-xs font-bold transition-all hover:opacity-90 shadow-md"
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
