import React from 'react';
import type { AlgorithmResult, DiskConfig } from '../types';
import { Trophy, FileSpreadsheet } from 'lucide-react';

interface Props {
  results: AlgorithmResult[];
  config: DiskConfig;
  onSelectAlgorithm: (algoName: string) => void;
}

export const AlgorithmComparisonView: React.FC<Props> = ({
  results,
  config,
  onSelectAlgorithm,
}) => {
  const maxSeek = Math.max(...results.map(r => r.totalHeadMovement), 1);
  const bestResult = results.find(r => r.rank === 1) || results[0];

  const exportCSV = () => {
    const headers = [
      'Algorithm',
      'Total_Head_Movement',
      'Avg_Seek_Distance',
      'Est_Seek_Time_ms',
      'Avg_Rotational_Latency_ms',
      'Est_Transfer_Time_ms',
      'Total_Service_Time_ms',
      'Seek_Variance',
      'Seek_StdDev',
      'Starvation_Risk',
      'Rank',
    ];
    const rows = results.map(r => [
      r.name,
      r.totalHeadMovement,
      r.avgSeekDistance.toFixed(2),
      r.estSeekTimeMs.toFixed(3),
      r.avgRotationalLatencyMs.toFixed(3),
      r.estTransferTimeMs.toFixed(4),
      r.totalServiceTimeMs.toFixed(3),
      r.varianceSeek.toFixed(2),
      r.stdDevSeek.toFixed(2),
      r.starvationRisk,
      r.rank,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'disc_scheduling_analysis.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Optimal Callout */}
      <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900 to-emerald-950/80 border border-cyan-500/30 rounded-2xl p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <Trophy className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              Optimal Seek Efficiency Leader
            </div>
            <div className="text-xl font-bold text-white flex items-center gap-2">
              <span>{bestResult.name}</span>
              <span className="text-sm font-normal text-slate-300">
                — {bestResult.totalHeadMovement} cylinders ({bestResult.estSeekTimeMs.toFixed(2)} ms)
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-md"
        >
          <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
          Export Benchmark CSV
        </button>
      </div>

      {/* Relative Seek Efficiency Bar Chart */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
        <h3 className="font-semibold text-slate-200 text-sm tracking-wide uppercase mb-4 flex items-center justify-between">
          <span>Comparative Seek Efficiency (Relative to Max Movement)</span>
          <span className="text-xs text-slate-400 font-normal">Click any row to view trace</span>
        </h3>

        <div className="flex flex-col gap-3">
          {results.map((res) => {
            const pct = (res.totalHeadMovement / maxSeek) * 100;
            const isWinner = res.rank === 1;

            return (
              <div
                key={res.name}
                onClick={() => onSelectAlgorithm(res.name)}
                className={`group p-3 rounded-xl border transition-all cursor-pointer ${
                  isWinner
                    ? 'bg-cyan-950/40 border-cyan-500/40 hover:border-cyan-400'
                    : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {res.name}
                    </span>
                    {isWinner && (
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.2 rounded-full text-[10px] font-bold">
                        ★ BEST (Rank 1)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-cyan-300 font-bold">{res.totalHeadMovement} cyl</span>
                    <span className="text-slate-400">({pct.toFixed(1)}%)</span>
                  </div>
                </div>

                {/* Bar */}
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isWinner
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-[0_0_10px_#22d3ee]'
                        : 'bg-gradient-to-r from-slate-600 to-cyan-600'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comprehensive Performance Analysis Matrix */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md overflow-x-auto">
        <h3 className="font-semibold text-slate-200 text-sm tracking-wide uppercase mb-4">
          Comprehensive Performance Analysis Matrix
        </h3>

        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="py-2.5 px-3">Rank</th>
              <th className="py-2.5 px-3">Algorithm</th>
              <th className="py-2.5 px-3">Total Seek</th>
              <th className="py-2.5 px-3">Avg Seek</th>
              <th className="py-2.5 px-3">Seek Time</th>
              <th className="py-2.5 px-3">Service Time</th>
              <th className="py-2.5 px-3">Jitter (σ)</th>
              <th className="py-2.5 px-3">Starvation Risk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {results.map((res) => (
              <tr
                key={res.name}
                onClick={() => onSelectAlgorithm(res.name)}
                className="hover:bg-slate-800/40 cursor-pointer transition-colors"
              >
                <td className="py-2.5 px-3 font-bold text-cyan-400">#{res.rank}</td>
                <td className="py-2.5 px-3 font-bold text-white">{res.name}</td>
                <td className="py-2.5 px-3 text-cyan-300">{res.totalHeadMovement} cyl</td>
                <td className="py-2.5 px-3">{res.avgSeekDistance.toFixed(2)}</td>
                <td className="py-2.5 px-3">{res.estSeekTimeMs.toFixed(2)} ms</td>
                <td className="py-2.5 px-3">{res.totalServiceTimeMs.toFixed(2)} ms</td>
                <td className="py-2.5 px-3">±{res.stdDevSeek.toFixed(2)}</td>
                <td className="py-2.5 px-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      res.starvationRisk === 'None'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : res.starvationRisk === 'Low'
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                        : res.starvationRisk === 'Moderate'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}
                  >
                    {res.starvationRisk}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-[11px] text-slate-500 mt-4 pt-3 border-t border-slate-800">
          * Calculated based on physical disk model: {config.rpm} RPM spindle speed, {config.baseOverhead} ms seek overhead, and {config.seekPerCylinder} ms/cylinder traversal rate.
        </div>
      </div>
    </div>
  );
};
