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
            ? 'linear-gradient(135deg, #f4efe5 0%, #ffffff 100%)'
            : `linear-gradient(135deg, ${theme.primaryHex}20 0%, #181d19 100%)`,
        }}
      >
        <div className="flex items-center gap-3.5">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center border shadow-md"
            style={{
              backgroundColor: `${theme.primaryHex}25`,
              borderColor: `${theme.primaryHex}50`,
            }}
          >
            <Trophy className="w-6 h-6" style={{ color: theme.primaryHex }} />
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
              ? 'bg-[#faf7f0] hover:bg-[#ede6d9] text-[#40392f] border-[#d1c8b4]'
              : 'bg-[#222a24] hover:bg-[#2b352f] text-[#ece6da] border-[#465248]'
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
          <span className={`text-xs ${theme.textMuted} font-normal`}>Click any row to simulate</span>
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
                      ? 'bg-[#f4efe5] border-[#cec88a]'
                      : `${theme.bgCardSub} border-[#cec88a]/50`
                    : theme.isLight
                    ? 'bg-[#faf7f0] border-[#ded5c2] hover:border-[#bcb096]'
                    : 'bg-[#181d19]/80 border-[#465248]/60 hover:border-[#7a7c64]'
                }`}
                style={isWinner ? { borderColor: `${theme.primaryHex}80` } : {}}
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
                          backgroundColor: `${theme.primaryHex}25`,
                          color: theme.primaryHex,
                          borderColor: `${theme.primaryHex}50`,
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
                <div className={`w-full h-3 rounded-full overflow-hidden p-0.5 ${theme.isLight ? 'bg-[#d6cdbd]' : 'bg-[#121714]'}`}>
                  <div
                    className="h-full rounded-full transition-all duration-700 shadow-sm"
                    style={{
                      width: `${pct}%`,
                      background: isWinner
                        ? `linear-gradient(90deg, ${theme.primaryHex}, ${theme.secondaryHex})`
                        : `linear-gradient(90deg, #465248, ${theme.secondaryHex})`,
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
                  theme.isLight ? 'hover:bg-[#f0e9dc]' : 'hover:bg-[#2b352f]/50'
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
                        ? 'bg-[#7a7c64]/25 text-[#cec88a] border-[#7a7c64]/40'
                        : res.starvationRisk === 'Low'
                        ? 'bg-[#7a7c64]/15 text-[#ded7c8] border-[#7a7c64]/30'
                        : res.starvationRisk === 'Moderate'
                        ? 'bg-[#bcb096]/20 text-[#cec88a] border-[#bcb096]/40'
                        : 'bg-[#a85b4d]/25 text-[#e69b8f] border-[#a85b4d]/40'
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
