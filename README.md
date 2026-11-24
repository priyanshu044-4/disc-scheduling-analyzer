# 💽 Disc Scheduling Analyzer & Hardware Simulator

An interactive, high-performance **Disc Scheduling Analyzer** written in **Standard C (C99)** for **Advanced Operating Systems (AOS)** and **Operating System Concepts** coursework and lab projects.

---

## 🌟 Key Highlights

- **7 Algorithms Implemented**: FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK, and F-SCAN (Freeze SCAN).
- **Physical Hardware Simulation**: Real-world disk modeling including Spindle RPM (5400/7200/10000/15000), rotational delay, mechanical arm acceleration overhead, per-cylinder seek traversal, and sector transfer rates.
- **ASCII & ANSI Visualizer**:
  - Live step-by-step **Platter Track Map** with directional motion trails.
  - 2D **Cylinder Trajectory Timeline** plotting head position vs. time step.
  - Comparative **ASCII Bar Chart** showing relative seek efficiency.
- **Statistical Fairness & Starvation Modeling**: Calculates average seek distance, variance, standard deviation ($\sigma$), coefficient of variation ($CV$), and starvation risk classifications.
- **Flexible Workload Input**:
  - Interactive terminal menu with colorized prompts.
  - Preloaded academic presets (Silberschatz OS textbook classic, Database hotspots, Ping-Pong thrashing, Streaming sequential).
  - Synthetic workload generators (Uniform random, Hotspot clustered, Ping-pong stress).
  - Custom file import (`.txt`).
- **Reporting & Data Export**: One-click export to full text report (`.txt`) and data analysis spreadsheet (`.csv`).
- **Zero External Dependencies**: Compiles cleanly with standard GCC across Windows (cmd/PowerShell), Linux, and macOS.

---

## 📂 Project Directory Structure

```
AOS Project/
├── include/
│   ├── disk_scheduler.h       # Hardware configuration & metrics structures
│   ├── algorithms.h           # Prototypes for all 7 scheduling algorithms
│   ├── metrics.h              # Statistical calculations, seek time & latency models
│   ├── visualizer.h           # Platter map, 2D trajectory graph & bar charts
│   ├── utils.h                # File I/O, synthetic generators, presets
│   └── colors.h               # ANSI escape colors and Windows Console API setup
├── src/
│   ├── main.c                 # Application entry point, interactive menu & CLI parser
│   ├── algorithms.c           # Scheduling algorithm implementations
│   ├── metrics.c              # Access time equations & starvation classifier
│   ├── visualizer.c           # Visual rendering engines
│   └── utils.c                # Presets, random generators, file exporters
├── sample_inputs/             # Test workloads
│   ├── textbook_silberschatz.txt
│   ├── database_hotspots.txt
│   ├── extreme_oscillating.txt
│   ├── streaming_sequential.txt
│   └── large_workload.txt
├── docs/
│   ├── ALGORITHMS_EXPLAINED.md # In-depth theoretical formulas & complexity analysis
│   └── PROJECT_REPORT.md      # Comprehensive academic report with Viva Q&A
├── Makefile                   # Multi-platform makefile
├── build.bat                  # One-click Windows CMD build script
├── build.ps1                  # PowerShell build & automated test script
└── README.md                  # Project documentation & manual
```

---

## 🚀 Quickstart & Compilation

### Option 1: Windows (Command Prompt)
```cmd
build.bat
disk_analyzer.exe
```

### Option 2: Windows (PowerShell)
```powershell
# Compile and run automated test suite
.\build.ps1 -Test

# Or launch interactive mode
.\build.ps1 -Run
```

### Option 3: Direct GCC Compilation (Any Platform)
```bash
gcc -Wall -Wextra -std=c99 -Iinclude src/*.c -o disk_analyzer.exe -lm
./disk_analyzer.exe
```

### Option 4: Using Make
```bash
make
./disk_analyzer.exe --all
```

---

## 🖥️ Usage Modes

### 1. Interactive Terminal Menu
Run the executable without flags to enter the menu:
```bash
./disk_analyzer.exe
```
Menu structure:
* **Option 1: Simulate & Analyze Disk Scheduling Algorithm (Step-by-Step Platter Map & Trajectory Graph)**:
  - Select any of the 7 algorithms (**FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK, F-SCAN**) to immediately generate:
    - Step-by-step table with **Platter Track Map** `[---*---]`
    - 2D **Cylinder Trajectory Timeline Graph**
    - **Detailed Performance & Analytics Summary**
  - Directly customize the request queue, head position, and disk cylinders, or load standard benchmark presets.
* **Option 0: Exit**

---

### 2. Command-Line Interface (CLI)
You can automate tests and scripting via command-line flags:

```bash
# Display help and usage manual
./disk_analyzer.exe --help

# Run all algorithms on Silberschatz textbook benchmark
./disk_analyzer.exe --preset textbook --all

# Run specific algorithm with step-by-step visualization
./disk_analyzer.exe --preset textbook --algo look

# Load custom file and run all algorithms
./disk_analyzer.exe --file sample_inputs/database_hotspots.txt --all

# Generate 20 random requests on a 1000-cylinder disk starting at head 250
./disk_analyzer.exe --random 20 --cylinders 1000 --head 250 --direction up --all

# Run benchmark and export full report to text and CSV
./disk_analyzer.exe --preset textbook --all --export report.txt --csv results.csv
```

---

## 📊 Sample Benchmark Execution

### Standard Textbook Example (Silberschatz OS)
* **Configuration**: 200 Cylinders (0–199), Initial Head: 53, Direction: UP
* **Requests**: `98, 183, 37, 122, 14, 124, 65, 67`

#### Comparative Bar Chart:
```
========================================================================================
   ALGORITHM EFFICIENCY COMPARISON (TOTAL SEEK DISTANCE)
========================================================================================
  FCFS     |   640 cyl | [========================================] 100.0%
  SSTF     |   236 cyl | [==============                          ]  36.9% [OPT/BEST]
  SCAN     |   331 cyl | [====================                    ]  51.7%
  C-SCAN   |   382 cyl | [=======================                 ]  59.7%
  LOOK     |   299 cyl | [==================                      ]  46.7% [2nd]
  C-LOOK   |   322 cyl | [====================                    ]  50.3%
  F-SCAN   |   473 cyl | [=============================           ]  73.9%
----------------------------------------------------------------------------------------
```

#### Analytical Metrics Matrix:
```
========================================================================================================================
                                      COMPREHENSIVE PERFORMANCE ANALYSIS MATRIX                                        
========================================================================================================================
Algo      Total Seek   Avg Seek   Seek Time(ms) Svc Time(ms)   StdDev(Jitter) Starvation    Rank  
------------------------------------------------------------------------------------------------------------------------
FCFS      640          80.00      40.00         73.36          41.59          None          #7    
SSTF      236          29.50      19.80         53.16          26.77          High          #1    
SCAN      331          41.38      25.55         58.91          47.17          Moderate      #4    
C-SCAN    382          47.75      29.10         62.46          55.82          Low           #5    
LOOK      299          37.38      22.95         56.31          44.50          Moderate      #2    
C-LOOK    322          40.25      24.10         57.46          51.60          Low           #3    
F-SCAN    473          59.12      31.65         65.01          44.45          None          #6    
------------------------------------------------------------------------------------------------------------------------
* Mechanical Model Grounding: Seek Overhead = 1.0 ms | Track Traversal = 0.05 ms/cyl | Rotational Latency = 4.17 ms (7200 RPM)
Recommendation: Algorithm SSTF achieves optimal seek efficiency with 236 cylinders moved.
```

---

## 🔬 Core Algorithms Summary

| Algorithm | Meaning | Best Used For | Starvation Risk |
| :--- | :--- | :--- | :--- |
| **FCFS** | First-Come, First-Served | Benchmarking baseline, very light I/O | Zero (100% fair) |
| **SSTF** | Shortest Seek Time First | Localized throughput maximization | High (starves distant tracks) |
| **SCAN** | Elevator Algorithm | General multi-process I/O | None (bounded delay) |
| **C-SCAN** | Circular SCAN | Systems requiring uniform wait time | None (uniform distribution) |
| **LOOK** | Boundary-Optimized SCAN | General desktop / server OS | None |
| **C-LOOK** | Boundary-Optimized C-SCAN | High-load multi-threaded servers | None (uniform & efficient) |
| **F-SCAN** | Two-Queue Frozen Batch SCAN | Eliminates continuous elevator traps | Zero (hard deterministic bound) |

---

## 🎓 Academic Documents

- [ALGORITHMS_EXPLAINED.md](docs/ALGORITHMS_EXPLAINED.md): Mathematical formulations, timing models, and complexity proofs.
- [PROJECT_REPORT.md](docs/PROJECT_REPORT.md): Formal project report with methodology, test runs, and 7 essential Viva / Oral Exam Q&As.

---

## 📜 License
Developed for academic learning, operating systems coursework, and laboratory evaluations.
