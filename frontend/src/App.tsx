import React, { useState, useEffect, useRef } from 'react';
import type { DiskConfig, AlgorithmType, AlgorithmResult } from './types';
import { DEFAULT_CONFIG, runSingleAlgorithm, runAllAlgorithms } from './algorithms';
import { HeaderAndControls, PRESETS } from './components/HeaderAndControls';
import { DiskPlatterVisualizer } from './components/DiskPlatterVisualizer';
import { TrajectoryChart } from './components/TrajectoryChart';
import { PlatterTrackBar } from './components/PlatterTrackBar';
import { StatsCards } from './components/StatsCards';
import { AlgorithmComparisonView } from './components/AlgorithmComparisonView';
import {
  Layers,
  BarChart3,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Cpu,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function App() {
  const [config, setConfig] = useState<DiskConfig>(DEFAULT_CONFIG);
  const [requests, setRequests] = useState<number[]>(PRESETS[0].requests);
  const [activeTab, setActiveTab] = useState<'simulate' | 'compare' | 'theory'>('simulate');
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmType>('LOOK');

  // Playback animation states
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const timerRef = useRef<number | null>(null);

  // Compute current single algorithm result
  const currentResult: AlgorithmResult = React.useMemo(() => {
    return runSingleAlgorithm(selectedAlgo, requests, config);
  }, [selectedAlgo, requests, config]);

  // Compute all algorithms for comparison
  const allResults: AlgorithmResult[] = React.useMemo(() => {
    return runAllAlgorithms(requests, config);
  }, [requests, config]);

  // Handle animation playback loop
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = 900 / playbackSpeed;
      timerRef.current = window.setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= currentResult.steps.length) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, currentResult.steps.length]);

  // Reset playback step when algorithm or requests change
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [selectedAlgo, requests, config]);

  const handleAlgoSelect = (algo: AlgorithmType) => {
    setSelectedAlgo(algo);
    setActiveTab('simulate');
    setCurrentStepIndex(0);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-slate-950 shadow-lg shadow-cyan-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-base tracking-tight">DiscSched</span>
              <span className="text-cyan-400 font-bold text-base">.analyzer</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('simulate')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'simulate'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Simulate & Analyze</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('compare');
                triggerConfetti();
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'compare'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Compare All</span>
            </button>
            <button
              onClick={() => setActiveTab('theory')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'theory'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Theory & Viva</span>
            </button>
          </nav>

          {/* External Links */}
          <div className="flex items-center gap-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/60"
              title="GitHub Repository"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col gap-6">
        {/* Global Workload & Configuration Header */}
        <HeaderAndControls
          config={config}
          onConfigChange={setConfig}
          requests={requests}
          onRequestChange={setRequests}
        />

        {/* Tab 1: Simulate Specific Algorithm */}
        {activeTab === 'simulate' && (
          <div className="flex flex-col gap-6">
            {/* Algorithm Selector Bar */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-xl flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-2 pr-1">
                  Algorithm:
                </span>
                {(['FCFS', 'SSTF', 'SCAN', 'C-SCAN', 'LOOK', 'C-LOOK', 'F-SCAN'] as AlgorithmType[]).map(
                  (algo) => (
                    <button
                      key={algo}
                      onClick={() => handleAlgoSelect(algo)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                        selectedAlgo === algo
                          ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30 scale-105'
                          : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {algo}
                    </button>
                  )
                )}
              </div>

              <div className="text-xs font-mono text-cyan-300 pr-2">
                Total Seek: <strong className="text-white text-sm">{currentResult.totalHeadMovement}</strong> cylinders
              </div>
            </div>

            {/* Visualizer Row: Platter + 2D Trajectory Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 flex flex-col">
                <DiskPlatterVisualizer
                  result={currentResult}
                  config={config}
                  currentStepIndex={currentStepIndex}
                  onStepChange={setCurrentStepIndex}
                  isPlaying={isPlaying}
                  onPlayToggle={() => setIsPlaying(!isPlaying)}
                  playbackSpeed={playbackSpeed}
                  onSpeedChange={setPlaybackSpeed}
                />
              </div>

              <div className="lg:col-span-7 flex flex-col">
                <TrajectoryChart
                  result={currentResult}
                  config={config}
                  currentStepIndex={currentStepIndex}
                  onStepClick={setCurrentStepIndex}
                />
              </div>
            </div>

            {/* Horizontal Platter Track Bar */}
            <PlatterTrackBar
              currentStep={currentStepIndex > 0 ? currentResult.steps[currentStepIndex - 1] : null}
              config={config}
              allRequests={requests}
              currentCylinder={
                currentStepIndex === 0
                  ? config.initialHead
                  : currentResult.sequence[currentStepIndex]
              }
            />

            {/* Performance Metric Cards */}
            <StatsCards result={currentResult} config={config} />

            {/* Step-by-Step Traversal Trace Table */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md overflow-x-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <h3 className="font-semibold text-slate-200 text-sm tracking-wide uppercase">
                  Step-by-Step Traversal Log ({currentResult.name})
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  Initial Head: {config.initialHead}
                </span>
              </div>

              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2 px-3">Step #</th>
                    <th className="py-2 px-3">From Cylinder</th>
                    <th className="py-2 px-3">To Cylinder</th>
                    <th className="py-2 px-3">Seek Distance</th>
                    <th className="py-2 px-3">Action Type</th>
                    <th className="py-2 px-3">Est. Time (ms)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {currentResult.steps.map((st, i) => {
                    const isActive = i + 1 === currentStepIndex;
                    const timeMs = config.baseOverhead + st.seekDistance * config.seekPerCylinder;
                    return (
                      <tr
                        key={i}
                        onClick={() => setCurrentStepIndex(i + 1)}
                        className={`cursor-pointer transition-colors ${
                          isActive
                            ? 'bg-cyan-500/15 text-cyan-200 font-bold'
                            : 'hover:bg-slate-800/40 text-slate-300'
                        }`}
                      >
                        <td className="py-2 px-3 text-cyan-400">Step {st.stepNum}</td>
                        <td className="py-2 px-3">{st.fromCylinder}</td>
                        <td className="py-2 px-3 font-bold text-white">{st.toCylinder}</td>
                        <td className="py-2 px-3 text-cyan-300">+{st.seekDistance} cyl</td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                              st.isService
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}
                          >
                            {st.isService ? 'Service I/O' : 'Boundary Swing'}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-400">{timeMs.toFixed(3)} ms</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Compare All Algorithms */}
        {activeTab === 'compare' && (
          <AlgorithmComparisonView
            results={allResults}
            config={config}
            onSelectAlgorithm={(name) => handleAlgoSelect(name as AlgorithmType)}
          />
        )}

        {/* Tab 3: Theory & Viva Guide */}
        {activeTab === 'theory' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md flex flex-col gap-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                Advanced Operating Systems — Disc Scheduling Theory
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Theoretical foundations, physical timing decomposition, and viva examination answers.
              </p>
            </div>

            {/* Access Time Formula Box */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs">
              <div className="text-cyan-400 font-bold mb-2">Total Disk Access Time Decomposition:</div>
              <div className="text-slate-300 text-sm">
                T_access = T_seek + T_rotational + T_transfer + T_controller
              </div>
              <div className="text-slate-500 mt-2 text-[11px] leading-relaxed">
                • <strong>T_seek:</strong> Time to move the actuator arm to target cylinder (dominant mechanical delay).<br />
                • <strong>T_rotational:</strong> 0.5 × (60,000 / RPM) ms waiting for the sector to spin under head.<br />
                • <strong>T_transfer:</strong> Sector Size (Bytes) / Transfer Rate (Bytes/ms).
              </div>
            </div>

            {/* Quick Algorithm Reference Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-white text-sm mb-1 text-cyan-300">FCFS (First-Come First-Served)</h3>
                <p className="text-slate-400 leading-relaxed">
                  Processes requests in strict FIFO order. Guaranteed 100% fair and zero starvation risk, but suffers from severe head thrashing and high seek times.
                </p>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-white text-sm mb-1 text-cyan-300">SSTF (Shortest Seek Time First)</h3>
                <p className="text-slate-400 leading-relaxed">
                  Greedily services the closest cylinder to the current head. Drastically reduces seek times but causes severe starvation for requests on distant platter tracks.
                </p>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-white text-sm mb-1 text-cyan-300">SCAN (Elevator Algorithm)</h3>
                <p className="text-slate-400 leading-relaxed">
                  Head moves in one direction to the disk boundary (0 or Max-1), reverses, and services requests on the return sweep. Prevents starvation and bounds max latency.
                </p>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-white text-sm mb-1 text-cyan-300">C-SCAN (Circular SCAN)</h3>
                <p className="text-slate-400 leading-relaxed">
                  Provides uniform wait times across all tracks by sweeping to one boundary and immediately jumping back to the opposite boundary without serving on the return jump.
                </p>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-white text-sm mb-1 text-cyan-300">LOOK & C-LOOK</h3>
                <p className="text-slate-400 leading-relaxed">
                  Boundary-optimized variants of SCAN/C-SCAN. The head travels only as far as the last request in that direction, eliminating wasteful travel to unused track edges.
                </p>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-white text-sm mb-1 text-cyan-300">F-SCAN (Freeze SCAN)</h3>
                <p className="text-slate-400 leading-relaxed">
                  Freezes incoming requests into a secondary batch during the active sweep. Prevents continuous dynamic arrivals from delaying opposite-side requests.
                </p>
              </div>
            </div>

            {/* Viva Q&A Guide */}
            <div className="border-t border-slate-800 pt-4">
              <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                Essential Viva / Oral Exam Questions
              </h3>
              <div className="flex flex-col gap-3 text-xs">
                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80">
                  <strong className="text-cyan-300 block mb-1">
                    Q: Why do Solid-State Drives (SSDs) not use SCAN or LOOK scheduling?
                  </strong>
                  <span className="text-slate-400">
                    SSDs have no physical moving actuator arm or spinning platter. Block access times are near-constant regardless of logical block addressing. SSDs use simple FIFO (noop / none) or mq-deadline schedulers to avoid unnecessary CPU sorting overhead.
                  </span>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80">
                  <strong className="text-cyan-300 block mb-1">
                    Q: What causes starvation in SSTF?
                  </strong>
                  <span className="text-slate-400">
                    If new I/O requests continuously arrive at tracks near the active head position, the head stays localized within that cluster, causing requests on distant tracks to wait indefinitely.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            Disc Scheduling Analyzer & Hardware Simulator — Advanced Operating Systems (AOS) Project
          </span>
          <div className="flex items-center gap-3">
            <span className="text-emerald-400 flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" /> Vercel Ready
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
