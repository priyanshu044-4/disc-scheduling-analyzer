# Disc Scheduling Algorithms - Comprehensive AOS Reference

In modern computing systems, the secondary storage subsystem (Hard Disk Drives - HDDs) represents one of the most significant I/O performance bottlenecks. Because moving mechanical parts (actuator arms, read/write heads) operate on millisecond timescales while CPU and main memory operate on nanosecond timescales, the operating system must minimize physical head movement to maximize I/O throughput.

---

## 1. Physical Disk Architecture & Timing Characteristics

A magnetic hard disk drive consists of:
- **Platters**: Flat circular disks coated with magnetic material rotating around a central spindle.
- **Tracks & Cylinders**: Concentric rings on each platter surface. A cylinder comprises all tracks aligned vertically across all platter surfaces.
- **Read/Write Head & Actuator Arm**: Moves radially across tracks using a voice coil actuator.

### Access Time Decomposition:
$$\text{Total Access Time} = T_{\text{seek}} + T_{\text{rotational}} + T_{\text{transfer}} + T_{\text{controller}}$$

1. **Seek Time ($T_{\text{seek}}$)**: The time required for the actuator arm to position the read/write head over the target cylinder. This is mechanically the most expensive component:
   $$T_{\text{seek}} = T_{\text{base\_overhead}} + (D \times T_{\text{per\_cylinder}})$$
   Where $D = |cyl_{\text{target}} - cyl_{\text{current}}|$.

2. **Rotational Latency ($T_{\text{rot}}$)**: The time waiting for the target sector to rotate underneath the head.
   $$\text{Average Rotational Latency} = \frac{1}{2} \times \left(\frac{60 \times 1000}{\text{RPM}}\right)\text{ ms}$$
   - At 5400 RPM: $\approx 5.56\text{ ms}$
   - At 7200 RPM: $\approx 4.17\text{ ms}$
   - At 10,000 RPM: $\approx 3.00\text{ ms}$
   - At 15,000 RPM: $\approx 2.00\text{ ms}$

3. **Transfer Time ($T_{\text{transfer}}$)**: The time required to transfer the data bits from the magnetic medium to the disk controller buffer:
   $$T_{\text{transfer}} = \frac{\text{Data Size (Bytes)}}{\text{Transfer Rate (Bytes/sec)}}$$

---

## 2. In-Depth Algorithm Formulations

### Algorithm 1: First-Come, First-Served (FCFS)
* **Mechanics**: Serves pending I/O requests strictly in chronological arrival order (FIFO queue).
* **Time Complexity**: $O(N)$
* **Space Complexity**: $O(1)$
* **Fairness**: Absolute 100% fairness; every request is guaranteed service in order.
* **Starvation**: Zero risk of starvation.
* **Drawback**: Severe head thrashing (wild swinging across the disk platters), leading to poor throughput and high average seek distances.

---

### Algorithm 2: Shortest Seek Time First (SSTF)
* **Mechanics**: Selects the request with the shortest seek distance from the head's current cylinder position:
  $$\text{Next Request} = \arg\min_{r \in \text{Unserviced}} |cyl(r) - cyl_{\text{current}}|$$
* **Time Complexity**: $O(N^2)$ (or $O(N \log N)$ with balanced search trees)
* **Space Complexity**: $O(N)$
* **Advantages**: Drastically reduces total head movement and seek time compared to FCFS.
* **Starvation**: **HIGH RISK**. If continuous requests arrive near the active head position, distant requests on the inner or outer platter edges may suffer indefinite postponement (starvation).

---

### Algorithm 3: SCAN (The Elevator Algorithm)
* **Mechanics**: The disk head moves in one direction (e.g., towards higher cylinders), serving all requests encountered along the way. Upon reaching the disk platter boundary ($0$ or $Max - 1$), the head reverses direction and serves requests on the return trip.
* **Time Complexity**: $O(N \log N)$ (due to sorting)
* **Space Complexity**: $O(N)$
* **Fairness**: Fair; provides an upper bound on wait times ($\le 2 \times \text{full sweep time}$).
* **Starvation**: Eliminates starvation.
* **Drawback**: Wastes seek time traveling all the way to the disk boundary even when no requests exist at the boundary.

---

### Algorithm 4: C-SCAN (Circular SCAN)
* **Mechanics**: Similar to SCAN, but moves in one direction only. When reaching the boundary, the head immediately jumps back to the opposite boundary ($0$) without servicing requests during the return jump, and resumes sweeping in the original direction.
* **Time Complexity**: $O(N \log N)$
* **Space Complexity**: $O(N)$
* **Advantages**: Delivers more uniform waiting times than standard SCAN. In SCAN, tracks near the center have a lower average wait time than tracks near the boundaries; C-SCAN treats all cylinders with uniform distribution.
* **Trade-off**: Incurs additional seek movement during the return jump.

---

### Algorithm 5: LOOK
* **Mechanics**: An optimization of SCAN. The head travels in the given direction only as far as the *last remaining request* in that direction. As soon as no further requests exist ahead, it immediately reverses direction without proceeding to the disk boundary.
* **Time Complexity**: $O(N \log N)$
* **Space Complexity**: $O(N)$
* **Advantages**: Avoids unnecessary trips to disk boundaries ($0$ and $Max-1$), delivering significantly lower total seek distances than SCAN while preserving starvation resistance.

---

### Algorithm 6: C-LOOK
* **Mechanics**: An optimization of C-SCAN. The head sweeps in one direction up to the highest requested cylinder, then jumps directly to the lowest requested cylinder (without touching $0$ or $Max-1$), and resumes sweeping upward.
* **Time Complexity**: $O(N \log N)$
* **Space Complexity**: $O(N)$
* **Advantages**: Combines uniform waiting times with optimal boundary avoidance. Considered one of the most effective general-purpose disk scheduling policies.

---

### Algorithm 7: F-SCAN (Freeze SCAN / Two-Queue Policy)
* **Mechanics**: Addresses the "elevator trap" where incoming requests continuous arriving just ahead of the head cause prolonged delays for requests on the opposite side. F-SCAN partitions the queue into two:
  1. **Active Queue**: Fixed set of requests processed in the current sweep.
  2. **Frozen Queue**: All new requests arriving during the sweep are placed here.
  Once the active queue is exhausted, the roles swap.
* **Advantages**: Guarantees zero starvation and enforces deterministic service batches.

---

## 3. Comparative Summary Matrix

| Algorithm | Total Seek Efficiency | Average Latency | Wait Time Variance (Jitter) | Starvation Risk | Complexity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **FCFS** | Very Low | High | Very High | **None (0%)** | $O(N)$ |
| **SSTF** | High | Low | High | **High** | $O(N^2)$ |
| **SCAN** | High | Moderate | Moderate | **None** | $O(N \log N)$ |
| **C-SCAN** | Moderate-High | Moderate | **Lowest (Uniform)** | **None** | $O(N \log N)$ |
| **LOOK** | **Optimal** | **Lowest** | Moderate | **None** | $O(N \log N)$ |
| **C-LOOK** | Very High | Low | Low (Uniform) | **None** | $O(N \log N)$ |
| **F-SCAN** | High | Moderate | Low | **None (Hard Bound)**| $O(N \log N)$ |
