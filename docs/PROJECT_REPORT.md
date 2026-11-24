# Academic Project Report: Disc Scheduling Analyzer

**Subject:** Advanced Operating Systems (AOS) / Operating System Concepts  
**Language:** C (Standard C99)  
**Implementation:** Modular Architecture with Native ANSI Visualizer & Physical Hardware Modeling  

---

## Abstract

In secondary storage systems, mechanical disk head positioning constitutes the dominant latency penalty in I/O operations. Operating system I/O schedulers employ disk scheduling algorithms to reorder pending requests, minimizing physical arm traversal and preventing starvation. This project implements a comprehensive **Disc Scheduling Analyzer and Hardware Simulator** in C. The application simulates seven major scheduling policies: **FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK, and F-SCAN**. It models physical drive parameters including track seek delays, rotational latencies (RPM-based), and sector transfer rates. The analyzer features terminal-native ASCII trajectory visualizations, comparative efficiency bar charts, variance/fairness quantification, synthetic workload generation, and report export capabilities (TXT/CSV).

---

## 1. Objectives & Scope

1. **Algorithm Simulation**: Implement exact mathematical and mechanical traversal logic for all canonical disk scheduling algorithms.
2. **Physical Hardware Modeling**: Ground head movement in real-world disk drive physics:
   - Spindle speeds: 5400, 7200, 10000, and 15000 RPM.
   - Mechanical seek overhead: Base motor acceleration + track-to-track traversal rate.
   - Rotational latency and data transfer rate.
3. **Statistical & Fairness Analysis**: Compute seek distance variance, standard deviation ($\sigma$), and coefficient of variation ($CV$) to quantify starvation risks and jitter.
4. **Visual Analytics**: Provide live ASCII platter mapping, 2D trajectory timelines, and comparative horizontal bar charts directly in the terminal without external GUI dependencies.
5. **Workload Benchmarking**: Evaluate performance against standard textbook benchmarks (Silberschatz), clustered enterprise database workloads, oscillating thrash workloads, and random distributions.

---

## 2. System Architecture & Modular Structure

The project adheres to clean modular C programming principles:

```
AOS Project/
├── include/
│   ├── disk_scheduler.h       # Hardware configuration and metrics data structures
│   ├── algorithms.h           # Prototypes for all 7 scheduling policies
│   ├── metrics.h              # Statistical, mechanical, and latency calculations
│   ├── visualizer.h           # Terminal platter mapping, 2D graph, and bar charts
│   ├── utils.h                # File parsing, synthetic workload generation, presets
│   └── colors.h               # ANSI terminal color formatting and Windows API setup
├── src/
│   ├── main.c                 # Entry point, interactive menu & CLI argument parser
│   ├── algorithms.c           # Core algorithmic implementations
│   ├── metrics.c              # Metric computations and starvation risk classifier
│   ├── visualizer.c           # ASCII graph engines and tabular comparisons
│   └── utils.c                # Presets, random generators, TXT & CSV exporters
├── sample_inputs/             # Benchmark test suite files
├── docs/                      # Theory guide and academic project report
├── build.bat / build.ps1      # Windows build and test automations
├── Makefile                   # Multi-platform makefile
└── README.md                  # Quickstart and user manual
```

---

## 3. Physical Hardware Timing Model

The analyzer computes realistic I/O access times based on three physical stages:

1. **Seek Time ($T_{\text{seek}}$)**:
   $$T_{\text{seek}} = T_{\text{base}} + (\Delta \times T_{\text{track}})$$
   - $T_{\text{base}}$: Fixed mechanical actuator arm acceleration and head settling time (Default: $1.0\text{ ms}$).
   - $\Delta$: Cylinder distance traversed $|Cyl_{t} - Cyl_{t-1}|$.
   - $T_{\text{track}}$: Rate of radial arm travel per cylinder (Default: $0.05\text{ ms/cylinder}$).

2. **Average Rotational Latency ($T_{\text{rot}}$)**:
   $$T_{\text{rot}} = \frac{1}{2} \times \frac{60000}{\text{RPM}}\text{ ms}$$
   For a 7200 RPM disk: $T_{\text{rot}} = \frac{60000}{2 \times 7200} = 4.167\text{ ms}$.

3. **Sector Transfer Time ($T_{\text{xfer}}$)**:
   $$T_{\text{xfer}} = \frac{\text{Sector Size (Bytes)}}{\text{Transfer Rate (Bytes/ms)}}$$
   For 512-byte sectors at $150\text{ MB/s}$: $T_{\text{xfer}} \approx 0.00325\text{ ms}$.

4. **Total Service Time ($T_{\text{service}}$)**:
   $$T_{\text{service}} = \sum T_{\text{seek}} + N \times (T_{\text{rot}} + T_{\text{xfer}})$$

---

## 4. Benchmark Experimental Results

### Test Case 1: Silberschatz Operating Systems Textbook Benchmark
* **Parameters**: 200 Cylinders (0–199), Initial Head: 53, Direction: UP.
* **Request Queue (8 requests)**: `[98, 183, 37, 122, 14, 124, 65, 67]`

#### Results:
| Algorithm | Head Traversal Order | Total Head Movement | Avg Seek | Est. Seek Time | Svc Time | Std Dev ($\sigma$) | Starvation Risk | Rank |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **SSTF** | 53 $\to$ 65 $\to$ 67 $\to$ 37 $\to$ 14 $\to$ 98 $\to$ 122 $\to$ 124 $\to$ 183 | **236 cyl** | 29.50 cyl | 19.80 ms | 53.16 ms | 26.77 | High | **#1** |
| **LOOK** | 53 $\to$ 65 $\to$ 67 $\to$ 98 $\to$ 122 $\to$ 124 $\to$ 183 $\to$ 37 $\to$ 14 | **299 cyl** | 37.38 cyl | 22.95 ms | 56.31 ms | 44.50 | Moderate | **#2** |
| **C-LOOK** | 53 $\to$ 65 $\to$ 67 $\to$ 98 $\to$ 122 $\to$ 124 $\to$ 183 $\to$ 14 $\to$ 37 | **322 cyl** | 40.25 cyl | 24.10 ms | 57.46 ms | 51.60 | Low | **#3** |
| **SCAN** | 53 $\to$ 65 $\to$ ... $\to$ 183 $\to$ 199 $\to$ 37 $\to$ 14 | **331 cyl** | 41.38 cyl | 25.55 ms | 58.91 ms | 47.17 | Moderate | **#4** |
| **C-SCAN** | 53 $\to$ 65 $\to$ ... $\to$ 199 $\to$ 0 $\to$ 14 $\to$ 37 | **382 cyl** | 47.75 cyl | 29.10 ms | 62.46 ms | 55.82 | Low | **#5** |
| **F-SCAN** | Multi-queue frozen batch execution | **473 cyl** | 59.12 cyl | 31.65 ms | 65.01 ms | 44.45 | None | **#6** |
| **FCFS** | 53 $\to$ 98 $\to$ 183 $\to$ 37 $\to$ 122 $\to$ 14 $\to$ 124 $\to$ 65 $\to$ 67 | **640 cyl** | 80.00 cyl | 40.00 ms | 73.36 ms | 41.59 | None | **#7** |

---

### Test Case 2: Extreme Oscillating / Ping-Pong Stress Workload
* **Parameters**: 500 Cylinders (0–499), Initial Head: 250, Direction: UP.
* **Request Queue (12 requests)**: `[15, 485, 25, 475, 30, 460, 40, 450, 10, 490, 50, 440]`

#### Comparative Performance:
- **FCFS Seek Distance**: **5,070 cylinders** (Severe thrashing)
- **LOOK Seek Distance**: **720 cylinders** (85.8% reduction in arm movement!)
- **SSTF Seek Distance**: **720 cylinders**
- **Observation**: When I/O requests alternate between inner and outer platter tracks, FCFS wastes immense energy and introduces extreme latency. LOOK completely smooths out the sweep, reducing traversal by 85.8%.

---

## 5. Comprehensive Viva / Oral Examination Guide

### Q1: What is the main objective of disk scheduling?
**Answer:** The primary objective is to minimize physical seek time (the time required to move the actuator arm and read/write head to the desired cylinder) and rotational latency, thereby maximizing disk throughput and minimizing mean response time.

### Q2: Why is SSTF not used as the default scheduling algorithm in production operating systems?
**Answer:** Although SSTF yields low average seek times, it is inherently prone to **starvation**. If new requests continuously arrive near the current head position, requests waiting on distant tracks may be indefinitely postponed.

### Q3: What is the key difference between SCAN and LOOK?
**Answer:** In SCAN, the head moves in one direction until it hits the **physical boundary of the disk** ($0$ or $Max - 1$) before reversing. In LOOK, the head looks ahead and reverses immediately at the **last pending request** in that direction, saving unnecessary cylinder travel.

### Q4: Why is C-SCAN preferred over SCAN in time-sensitive or multi-user operating systems?
**Answer:** In SCAN, cylinders near the middle of the disk get visited twice per round-trip, whereas edge cylinders only get visited once. This introduces non-uniform wait times. C-SCAN always moves in a single direction and wraps around, providing uniform waiting times across all cylinders.

### Q5: How does rotational latency relate to spindle speed (RPM)?
**Answer:** Rotational latency is the time taken for the target sector to rotate underneath the head. On average, the head waits for half a revolution:
$$\text{Average Latency} = \frac{1}{2} \times \frac{60000}{\text{RPM}}\text{ ms}$$
For a 7200 RPM drive, this equals $4.167\text{ ms}$.

### Q6: What is F-SCAN and how does it prevent starvation?
**Answer:** F-SCAN (Freeze SCAN) partitions the request queue into two subqueues: an active queue and a frozen incoming queue. The head services only the active queue during a sweep; all requests arriving during the sweep are placed in the frozen queue. This guarantees that new arrivals cannot starve older requests.

### Q7: Do Solid State Drives (SSDs) benefit from disk scheduling algorithms?
**Answer:** No. SSDs use flash memory with no moving mechanical parts, resulting in near-constant access time across all flash blocks. Traditional disk scheduling (like SCAN or SSTF) adds CPU reordering overhead without mechanical benefit. Instead, SSDs use I/O schedulers like `none` / `noop` or `mq-deadline` focused on write amplification reduction and parallelism.

---

## 6. Conclusion

The developed **Disc Scheduling Analyzer** provides an end-to-end framework for modeling, evaluating, and visualizing disk scheduling algorithms in C. Through theoretical modeling and empirical benchmarks, the tool demonstrates that while **SSTF and LOOK** achieve superior seek efficiency, **C-LOOK and F-SCAN** provide the optimal balance between performance throughput and starvation resistance in realistic operating systems.
