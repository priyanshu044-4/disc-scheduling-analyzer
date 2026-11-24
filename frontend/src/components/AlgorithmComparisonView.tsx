import React from 'react';
import type { AlgorithmResult, DiskConfig } from '../types';
import { Trophy, FileSpreadsheet } from 'lucide-react';
import { useTheme } from '../ThemeContext';

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
  const { theme } = useTheme();
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
      <div
        className={`${theme.bgCard} ${theme.borderCard} border rounded-2xl p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 transition-all`}
        style={{
          background: theme.isLight
            ? 'linear-gradient(135deg, #e0e7ff 0%, #ffffff 100%)'
            : `linear-gradient(135deg, ${theme.primaryHex}15 0%, #0f172a 100%)`,
        }}
      >
        <div className="flex items-center gap-3.5">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center border shadow-md"
            style={{
              backgroundColor: `${theme.primaryHex}20`,
              borderColor: `${theme.primaryHex}40`,
            }}
          >
            <Trophy className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <div
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: theme.primaryHex }}
            >
              Optimal Seek Efficiency Leader
            </div>
            <div className={`text-xl font-bold ${theme.textTitle} flex items-center gap-2`}>
              <span>{bestResult.name}</span>
              <span className={`text-sm font-normal ${theme.textMuted}`}>
                — {bestResult.totalHeadMovement} cylinders ({bestResult.estSeekTimeMs.toFixed(2)} ms)
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={exportCSV}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-md border ${
            theme.isLight
              ? 'bg-white hover:bg-slate-50 text-indigo-700 border-indigo-200'
              : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" style={{ color: theme.primaryHex }} />
          Export Benchmark CSV
        </button>
      </div>

      {/* Relative Seek Efficiency Bar Chart */}
      <div className={`${theme.bgCard} ${theme.borderCard} border rounded-2xl p-5 shadow-2xl backdrop-blur-md transition-all`}>
        <h3 className={`font-semibold ${theme.textTitle} text-sm tracking-wide uppercase mb-4 flex items-center justify-between`}>
          <span>Comparative Seek Efficiency (Relative to Max Movement)</span>
          <span className={`text-xs ${theme.textMuted} font-normal`}>Click any row to view trace</span>
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
                    ? theme.isLight
                      ? 'bg-indigo-50/80 border-indigo-300'
                      : `${theme.bgCardSub} border-cyan-500/40`
                    : theme.isLight
                    ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
                }`}
                style={isWinner ? { borderColor: `${theme.primaryHex}60` } : {}}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${theme.textTitle} group-hover:opacity-90`}>
                      {res.name}
                    </span>
                    {isWinner && (
                      <span
                        className="px-2 py-0.2 rounded-full text-[10px] font-bold border"
                        style={{
                          backgroundColor: `${theme.primaryHex}20`,
                          color: theme.primaryHex,
                          borderColor: `${theme.primaryHex}40`,
                        }}
                      >
                        ★ BEST (Rank 1)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold" style={{ color: theme.primaryHex }}>
                      {res.totalHeadMovement} cyl
                    </span>
                    <span className={theme.textMuted}>({pct.toFixed(1)}%)</span>
                  </div>
                </div>

                {/* Bar */}
                <div className={`w-full h-3 rounded-full overflow-hidden p-0.5 ${theme.isLight ? 'bg-slate-200' : 'bg-slate-800'}`}>
                  <div
                    className="h-full rounded-full transition-all duration-700 shadow-sm"
                    style={{
                      width: `${pct}%`,
                      background: isWinner
                        ? `linear-gradient(90deg, ${theme.primaryHex}, ${theme.secondaryHex})`
                        : `linear-gradient(90deg, ${theme.isLight ? '#94a3b8' : '#475569'}, ${theme.primaryHex})`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comprehensive Performance Analysis Matrix */}
      <div className={`${theme.bgCard} ${theme.borderCard} border rounded-2xl p-5 shadow-2xl backdrop-blur-md overflow-x-auto transition-all`}>
        <h3 className={`font-semibold ${theme.textTitle} text-sm tracking-wide uppercase mb-4`}>
          Comprehensive Performance Analysis Matrix
        </h3>

        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr className={`border-b ${theme.borderSub} ${theme.textMuted}`}>
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
          <tbody className={`divide-y ${theme.borderSub} ${theme.textBody}`}>
            {results.map((res) => (
              <tr
                key={res.name}
                onClick={() => onSelectAlgorithm(res.name)}
                className={`cursor-pointer transition-colors ${
                  theme.isLight ? 'hover:bg-slate-100/70' : 'hover:bg-slate-800/40'
                }`}
              >
                <td className="py-2.5 px-3 font-bold" style={{ color: theme.primaryHex }}>#{res.rank}</td>
                <td className={`py-2.5 px-3 font-bold ${theme.textTitle}`}>{res.name}</td>
                <td className="py-2.5 px-3 font-bold" style={{ color: theme.primaryHex }}>{res.totalHeadMovement} cyl</td>
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

        <div className={`text-[11px] ${theme.textMuted} mt-4 pt-3 border-t ${theme.borderSub}`}>
          * Calculated based on physical disk model: {config.rpm} RPM spindle speed, {config.baseOverhead} ms seek overhead, and {config.seekPerCylinder} ms/cylinder traversal rate.
        </div>
      </div>
    </div>
  );
};
