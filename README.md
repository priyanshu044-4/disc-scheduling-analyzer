# 💽 Disc Scheduling Analyzer & Hardware Simulator

[![Live Web Demo](https://img.shields.io/badge/Vercel-Live%20Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://frontend-indol-five-96.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/priyanshu044-4/disc-scheduling-analyzer)
[![Language C99](https://img.shields.io/badge/C-C99-00599C?style=for-the-badge&logo=c&logoColor=white)](#c-terminal-cli)
[![React Vite](https://img.shields.io/badge/React-Vite%20%2B%20Tailwind-61DAFB?style=for-the-badge&logo=react&logoColor=black)](#web-frontend)

An interactive, high-performance **Disc Scheduling Analyzer & Physical Platter Simulator** built for **Advanced Operating Systems (AOS)** and **Operating System Concepts** coursework, laboratory assignments, and academic demonstrations.

Featuring both a **Standard C (C99) Terminal Engine** and a **Modern Interactive Web Frontend** hosted live on Vercel!

---

## 🌐 Live Web Application

- **Live URL**: [https://frontend-indol-five-96.vercel.app](https://frontend-indol-five-96.vercel.app)
- **GitHub Repository**: [https://github.com/priyanshu044-4/disc-scheduling-analyzer](https://github.com/priyanshu044-4/disc-scheduling-analyzer)

### Web Features:
* 💽 **Physical Platter & Actuator Arm Simulator**: Real-time rotating magnetic platter with an animated voice-coil actuator arm that sweeps radially to the target cylinder track.
* 📈 **2D Cylinder Trajectory Timeline**: Interactive timeline plotting cylinder position vs. time steps with glowing halos and tooltips.
* 🧭 **Platter Track Map**: Visual radial track bar `[0 ... Max-1]` displaying all requested tracks, current head pointer, and seek paths.
* ⏯️ **Animation Playback**: Play, pause, step forward, step backward, and speed controls (0.5x, 1x, 2x, 4x).
* 🏆 **Compare All Algorithms**: Side-by-side relative seek efficiency bar charts, performance rankings (1st to 7th), and detailed metrics matrix.
* 📚 **Built-in Theory & Viva Guide**: Formula breakdowns ($T_{\text{seek}}$, $T_{\text{rot}}$, $T_{\text{transfer}}$), starvation trade-offs, and typical viva exam answers.
* 📊 **CSV Export**: Export all benchmark results to spreadsheet format with one click.

---

## 🌟 Supported Scheduling Algorithms

1. **FCFS (First-Come, First-Served)**: Strict chronological queue; 100% fair, zero starvation risk, high seek variance.
2. **SSTF (Shortest Seek Time First)**: Greedily services the closest cylinder; minimizes seek distance, high risk of starvation for outer tracks.
3. **SCAN (Elevator Algorithm)**: Sweeps in one direction to the disk boundary (0 or Max-1), reverses, and services return requests.
4. **C-SCAN (Circular SCAN)**: Sweeps to boundary, jumps back to opposite boundary without servicing requests on return, providing uniform wait times.
5. **LOOK**: Optimized elevator; reverses immediately at the last request in that direction, skipping unused boundaries.
6. **C-LOOK**: Circular elevator; wraps from the highest requested cylinder directly to the lowest requested cylinder.
7. **F-SCAN (Freeze SCAN)**: Advanced two-queue policy; freezes incoming requests during active sweep, preventing elevator trapping.

---

## 📂 Project Directory Structure

```
AOS Project/
├── frontend/                  # Modern Web Frontend (React + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/        # PlatterVisualizer, TrajectoryChart, TrackBar, StatsCards
│   │   ├── algorithms.ts      # Core scheduling algorithms in TypeScript
│   │   ├── types.ts           # Interfaces & data definitions
│   │   └── App.tsx            # Main application UI
│   ├── index.html             # HTML entry point with custom favicon
│   ├── package.json           # Node dependencies
│   └── vite.config.ts         # Vite bundler configuration
├── include/                   # C Header files
│   ├── disk_scheduler.h       # Hardware configuration & metrics structures
│   ├── algorithms.h           # Prototypes for all 7 scheduling algorithms
│   ├── metrics.h              # Statistical calculations, seek time & latency models
│   ├── visualizer.h           # Platter map, 2D trajectory graph & bar charts
│   ├── utils.h                # File I/O, synthetic generators, presets
│   └── colors.h               # ANSI escape colors and Windows Console API setup
├── src/                       # C Implementation files
│   ├── main.c                 # Application entry point & interactive menu
│   ├── algorithms.c           # Core scheduling algorithm implementations
│   ├── metrics.c              # Access time equations & starvation classifier
│   ├── visualizer.c           # Terminal ASCII rendering engines
│   └── utils.c                # Presets, random generators, file exporters
├── sample_inputs/             # Test workloads
│   ├── textbook_silberschatz.txt
│   ├── database_hotspots.txt
│   ├── extreme_oscillating.txt
│   ├── streaming_sequential.txt
│   └── large_workload.txt
├── docs/
│   ├── ALGORITHMS_EXPLAINED.md # Theoretical proofs, equations & complexity analysis
│   └── PROJECT_REPORT.md      # Formal academic report with Viva / Oral Q&A
├── Makefile                   # Multi-platform makefile
├── build.bat                  # One-click Windows CMD build script
├── build.ps1                  # PowerShell build & test automation script
├── vercel.json                # Vercel deployment configuration
└── README.md                  # Project documentation & manual
```

---

## 🖥️ Running the C Terminal Application

### Option 1: Using the Compiled Binary
```powershell
.\disk_analyzer.exe
```

The simplified menu opens:
```text
MAIN MENU:
  1. Simulate & Analyze Disk Scheduling Algorithm (Step-by-Step Platter Map & Trajectory Graph)
  0. Exit
```

Selecting **Option 1** lets you choose any algorithm (**FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK, F-SCAN**) or customize the request queue, head position, and disk cylinders.

### Option 2: Recompiling with GCC
```bash
# Windows Batch
.\build.bat

# Windows PowerShell
.\build.ps1 -Test

# Direct GCC
gcc -Wall -Wextra -std=c99 -Iinclude src/*.c -o disk_analyzer.exe -lm
```

---

## 💻 Running the Web Frontend Locally

```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

To build for production:
```bash
npm run build
```

---

## 🚀 Deploying to Vercel

The project includes pre-configured `vercel.json` files for zero-configuration deployments:

```bash
# Inside the frontend folder
cd frontend
vercel --prod
```

Or connect the GitHub repository [priyanshu044-4/disc-scheduling-analyzer](https://github.com/priyanshu044-4/disc-scheduling-analyzer) directly in the [Vercel Dashboard](https://vercel.com).

---

## 📚 Academic Deliverables Included

1. [PROJECT_REPORT.md](docs/PROJECT_REPORT.md): Formal academic project report with problem statement, system architecture, comparative analysis, test cases, and **Viva / Oral Exam Q&A guide**.
2. [ALGORITHMS_EXPLAINED.md](docs/ALGORITHMS_EXPLAINED.md): Mathematical formulations, timing models, and complexity proofs.
