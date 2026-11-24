import type { DiskConfig, ScheduleStep, AlgorithmResult, AlgorithmType } from './types';

export const DEFAULT_CONFIG: DiskConfig = {
  totalCylinders: 200,
  initialHead: 53,
  direction: 'UP',
  rpm: 7200,
  seekPerCylinder: 0.05,
  baseOverhead: 1.0,
  transferRateMbps: 150.0,
  sectorSizeBytes: 512,
};

function computeMetrics(
  name: string,
  sequence: number[],
  steps: ScheduleStep[],
  config: DiskConfig
): AlgorithmResult {
  let totalHeadMovement = 0;
  let requestsServiced = 0;

  for (const step of steps) {
    totalHeadMovement += step.seekDistance;
    if (step.isService) requestsServiced++;
  }

  const avgSeekDistance = requestsServiced > 0 ? totalHeadMovement / requestsServiced : 0;

  // Mechanical Seek Time (ms)
  let estSeekTimeMs = 0;
  for (const step of steps) {
    if (step.seekDistance > 0) {
      estSeekTimeMs += config.baseOverhead + (step.seekDistance * config.seekPerCylinder);
    }
  }

  // Rotational Latency (ms): half a revolution
  const fullRevMs = (60.0 * 1000.0) / (config.rpm > 0 ? config.rpm : 7200);
  const avgRotationalLatencyMs = 0.5 * fullRevMs;

  // Transfer Time (ms)
  const bytesPerMs = (config.transferRateMbps * 1048576.0) / 1000.0;
  const perSectorTransferMs = config.sectorSizeBytes / (bytesPerMs > 0 ? bytesPerMs : 157286.4);
  const estTransferTimeMs = requestsServiced * perSectorTransferMs;

  // Total Service Time
  const totalServiceTimeMs = estSeekTimeMs + (requestsServiced * (avgRotationalLatencyMs + perSectorTransferMs));

  // Variance & Standard Deviation
  let varianceSeek = 0;
  let stdDevSeek = 0;
  let coefficientOfVariation = 0;

  if (steps.length > 1) {
    const meanSeek = totalHeadMovement / steps.length;
    let sumSqDiff = 0;
    for (const step of steps) {
      const diff = step.seekDistance - meanSeek;
      sumSqDiff += diff * diff;
    }
    varianceSeek = sumSqDiff / steps.length;
    stdDevSeek = Math.sqrt(varianceSeek);
    coefficientOfVariation = meanSeek > 0.001 ? stdDevSeek / meanSeek : 0;
  }

  // Starvation Risk
  let starvationRisk: 'None' | 'Low' | 'Moderate' | 'High' = 'Moderate';
  if (name === 'SSTF') starvationRisk = 'High';
  else if (name === 'FCFS' || name === 'F-SCAN') starvationRisk = 'None';
  else if (name === 'C-SCAN' || name === 'C-LOOK') starvationRisk = 'Low';
  else starvationRisk = 'Moderate';

  return {
    name,
    sequence,
    steps,
    totalHeadMovement,
    requestsServiced,
    avgSeekDistance,
    estSeekTimeMs,
    avgRotationalLatencyMs,
    estTransferTimeMs,
    totalServiceTimeMs,
    varianceSeek,
    stdDevSeek,
    coefficientOfVariation,
    starvationRisk,
    rank: 1,
  };
}

export function runFCFS(requests: number[], config: DiskConfig): AlgorithmResult {
  const sequence: number[] = [config.initialHead];
  const steps: ScheduleStep[] = [];
  let current = config.initialHead;

  requests.forEach((req, idx) => {
    const dist = Math.abs(req - current);
    steps.push({
      stepNum: steps.length + 1,
      fromCylinder: current,
      toCylinder: req,
      seekDistance: dist,
      isService: true,
      requestId: idx,
    });
    sequence.push(req);
    current = req;
  });

  return computeMetrics('FCFS', sequence, steps, config);
}

export function runSSTF(requests: number[], config: DiskConfig): AlgorithmResult {
  const sequence: number[] = [config.initialHead];
  const steps: ScheduleStep[] = [];
  const serviced = new Array(requests.length).fill(false);
  let current = config.initialHead;
  let servicedCount = 0;

  while (servicedCount < requests.length) {
    let bestIdx = -1;
    let minSeek = Infinity;

    for (let i = 0; i < requests.length; i++) {
      if (!serviced[i]) {
        const dist = Math.abs(current - requests[i]);
        if (dist < minSeek) {
          minSeek = dist;
          bestIdx = i;
        } else if (dist === minSeek && bestIdx !== -1) {
          const currDir = config.direction === 'UP' ? 1 : -1;
          if ((requests[i] - current) * currDir > 0) {
            bestIdx = i;
          }
        }
      }
    }

    if (bestIdx !== -1) {
      serviced[bestIdx] = true;
      servicedCount++;
      const target = requests[bestIdx];
      const dist = Math.abs(target - current);
      steps.push({
        stepNum: steps.length + 1,
        fromCylinder: current,
        toCylinder: target,
        seekDistance: dist,
        isService: true,
        requestId: bestIdx,
      });
      sequence.push(target);
      current = target;
    } else {
      break;
    }
  }

  return computeMetrics('SSTF', sequence, steps, config);
}

export function runSCAN(requests: number[], config: DiskConfig): AlgorithmResult {
  const sequence: number[] = [config.initialHead];
  const steps: ScheduleStep[] = [];

  const left: number[] = [];
  const right: number[] = [];

  requests.forEach(r => {
    if (r < config.initialHead) left.push(r);
    else right.push(r);
  });

  left.sort((a, b) => a - b);
  right.sort((a, b) => a - b);

  let current = config.initialHead;

  if (config.direction === 'UP') {
    for (const r of right) {
      const dist = Math.abs(r - current);
      steps.push({
        stepNum: steps.length + 1,
        fromCylinder: current,
        toCylinder: r,
        seekDistance: dist,
        isService: true,
        requestId: requests.indexOf(r),
      });
      sequence.push(r);
      current = r;
    }

    if (left.length > 0) {
      const upperBoundary = config.totalCylinders - 1;
      if (current !== upperBoundary) {
        steps.push({
          stepNum: steps.length + 1,
          fromCylinder: current,
          toCylinder: upperBoundary,
          seekDistance: Math.abs(upperBoundary - current),
          isService: false,
          requestId: -1,
        });
        sequence.push(upperBoundary);
        current = upperBoundary;
      }
      for (let i = left.length - 1; i >= 0; i--) {
        const r = left[i];
        steps.push({
          stepNum: steps.length + 1,
          fromCylinder: current,
          toCylinder: r,
          seekDistance: Math.abs(r - current),
          isService: true,
          requestId: requests.indexOf(r),
        });
        sequence.push(r);
        current = r;
      }
    }
  } else {
    for (let i = left.length - 1; i >= 0; i--) {
      const r = left[i];
      steps.push({
        stepNum: steps.length + 1,
        fromCylinder: current,
        toCylinder: r,
        seekDistance: Math.abs(r - current),
        isService: true,
        requestId: requests.indexOf(r),
      });
      sequence.push(r);
      current = r;
    }

    if (right.length > 0) {
      if (current !== 0) {
        steps.push({
          stepNum: steps.length + 1,
          fromCylinder: current,
          toCylinder: 0,
          seekDistance: Math.abs(0 - current),
          isService: false,
          requestId: -1,
        });
        sequence.push(0);
        current = 0;
      }
      for (const r of right) {
        steps.push({
          stepNum: steps.length + 1,
          fromCylinder: current,
          toCylinder: r,
          seekDistance: Math.abs(r - current),
          isService: true,
          requestId: requests.indexOf(r),
        });
        sequence.push(r);
        current = r;
      }
    }
  }

  return computeMetrics('SCAN', sequence, steps, config);
}

export function runCSCAN(requests: number[], config: DiskConfig): AlgorithmResult {
  const sequence: number[] = [config.initialHead];
  const steps: ScheduleStep[] = [];

  const left: number[] = [];
  const right: number[] = [];

  requests.forEach(r => {
    if (r < config.initialHead) left.push(r);
    else right.push(r);
  });

  left.sort((a, b) => a - b);
  right.sort((a, b) => a - b);

  let current = config.initialHead;

  if (config.direction === 'UP') {
    for (const r of right) {
      steps.push({
        stepNum: steps.length + 1,
        fromCylinder: current,
        toCylinder: r,
        seekDistance: Math.abs(r - current),
        isService: true,
        requestId: requests.indexOf(r),
      });
      sequence.push(r);
      current = r;
    }

    if (left.length > 0) {
      const upperBoundary = config.totalCylinders - 1;
      if (current !== upperBoundary) {
        steps.push({
          stepNum: steps.length + 1,
          fromCylinder: current,
          toCylinder: upperBoundary,
          seekDistance: Math.abs(upperBoundary - current),
          isService: false,
          requestId: -1,
        });
        sequence.push(upperBoundary);
        current = upperBoundary;
      }

      steps.push({
        stepNum: steps.length + 1,
        fromCylinder: current,
        toCylinder: 0,
        seekDistance: Math.abs(0 - current),
        isService: false,
        requestId: -1,
      });
      sequence.push(0);
      current = 0;

      for (const r of left) {
        steps.push({
          stepNum: steps.length + 1,
          fromCylinder: current,
          toCylinder: r,
          seekDistance: Math.abs(r - current),
          isService: true,
          requestId: requests.indexOf(r),
        });
        sequence.push(r);
        current = r;
      }
    }
  } else {
    for (let i = left.length - 1; i >= 0; i--) {
      const r = left[i];
      steps.push({
        stepNum: steps.length + 1,
        fromCylinder: current,
        toCylinder: r,
        seekDistance: Math.abs(r - current),
        isService: true,
        requestId: requests.indexOf(r),
      });
      sequence.push(r);
      current = r;
    }

    if (right.length > 0) {
      if (current !== 0) {
        steps.push({
          stepNum: steps.length + 1,
          fromCylinder: current,
          toCylinder: 0,
          seekDistance: Math.abs(0 - current),
          isService: false,
          requestId: -1,
        });
        sequence.push(0);
        current = 0;
      }

      const upperBoundary = config.totalCylinders - 1;
      steps.push({
        stepNum: steps.length + 1,
        fromCylinder: current,
        toCylinder: upperBoundary,
        seekDistance: Math.abs(upperBoundary - current),
        isService: false,
        requestId: -1,
      });
      sequence.push(upperBoundary);
      current = upperBoundary;

      for (let i = right.length - 1; i >= 0; i--) {
        const r = right[i];
        steps.push({
          stepNum: steps.length + 1,
          fromCylinder: current,
          toCylinder: r,
          seekDistance: Math.abs(r - current),
          isService: true,
          requestId: requests.indexOf(r),
        });
        sequence.push(r);
        current = r;
      }
    }
  }

  return computeMetrics('C-SCAN', sequence, steps, config);
}

export function runLOOK(requests: number[], config: DiskConfig): AlgorithmResult {
  const sequence: number[] = [config.initialHead];
  const steps: ScheduleStep[] = [];

  const left: number[] = [];
  const right: number[] = [];

  requests.forEach(r => {
    if (r < config.initialHead) left.push(r);
    else right.push(r);
  });

  left.sort((a, b) => a - b);
  right.sort((a, b) => a - b);

  let current = config.initialHead;

  if (config.direction === 'UP') {
    for (const r of right) {
      steps.push({
        stepNum: steps.length + 1,
        fromCylinder: current,
        toCylinder: r,
        seekDistance: Math.abs(r - current),
        isService: true,
        requestId: requests.indexOf(r),
      });
      sequence.push(r);
      current = r;
    }
    for (let i = left.length - 1; i >= 0; i--) {
      const r = left[i];
      steps.push({
        stepNum: steps.length + 1,
        fromCylinder: current,
        toCylinder: r,
        seekDistance: Math.abs(r - current),
        isService: true,
        requestId: requests.indexOf(r),
      });
      sequence.push(r);
      current = r;
    }
  } else {
    for (let i = left.length - 1; i >= 0; i--) {
      const r = left[i];
      steps.push({
        stepNum: steps.length + 1,
        fromCylinder: current,
        toCylinder: r,
        seekDistance: Math.abs(r - current),
        isService: true,
        requestId: requests.indexOf(r),
      });
      sequence.push(r);
      current = r;
    }
    for (const r of right) {
      steps.push({
        stepNum: steps.length + 1,
        fromCylinder: current,
        toCylinder: r,
        seekDistance: Math.abs(r - current),
        isService: true,
        requestId: requests.indexOf(r),
      });
      sequence.push(r);
      current = r;
    }
  }

  return computeMetrics('LOOK', sequence, steps, config);
}

export function runCLOOK(requests: number[], config: DiskConfig): AlgorithmResult {
  const sequence: number[] = [config.initialHead];
  const steps: ScheduleStep[] = [];

  const left: number[] = [];
  const right: number[] = [];

  requests.forEach(r => {
    if (r < config.initialHead) left.push(r);
    else right.push(r);
  });

  left.sort((a, b) => a - b);
  right.sort((a, b) => a - b);

  let current = config.initialHead;

  if (config.direction === 'UP') {
    for (const r of right) {
      steps.push({
        stepNum: steps.length + 1,
        fromCylinder: current,
        toCylinder: r,
        seekDistance: Math.abs(r - current),
        isService: true,
        requestId: requests.indexOf(r),
      });
      sequence.push(r);
      current = r;
    }
    for (const r of left) {
      steps.push({
        stepNum: steps.length + 1,
        fromCylinder: current,
        toCylinder: r,
        seekDistance: Math.abs(r - current),
        isService: true,
        requestId: requests.indexOf(r),
      });
      sequence.push(r);
      current = r;
    }
  } else {
    for (let i = left.length - 1; i >= 0; i--) {
      const r = left[i];
      steps.push({
        stepNum: steps.length + 1,
        fromCylinder: current,
        toCylinder: r,
        seekDistance: Math.abs(r - current),
        isService: true,
        requestId: requests.indexOf(r),
      });
      sequence.push(r);
      current = r;
    }
    for (let i = right.length - 1; i >= 0; i--) {
      const r = right[i];
      steps.push({
        stepNum: steps.length + 1,
        fromCylinder: current,
        toCylinder: r,
        seekDistance: Math.abs(r - current),
        isService: true,
        requestId: requests.indexOf(r),
      });
      sequence.push(r);
      current = r;
    }
  }

  return computeMetrics('C-LOOK', sequence, steps, config);
}

export function runFSCAN(requests: number[], config: DiskConfig): AlgorithmResult {
  if (requests.length === 0) {
    return computeMetrics('F-SCAN', [config.initialHead], [], config);
  }

  const mid = Math.floor((requests.length + 1) / 2);
  const batch1 = requests.slice(0, mid);
  const batch2 = requests.slice(mid);

  const res1 = runLOOK(batch1, config);
  let currentHead = res1.steps.length > 0 ? res1.steps[res1.steps.length - 1].toCylinder : config.initialHead;

  const res2 = batch2.length > 0 ? runLOOK(batch2, { ...config, initialHead: currentHead }) : null;

  const sequence = [...res1.sequence];
  const steps: ScheduleStep[] = [...res1.steps];

  if (res2) {
    for (const s of res2.steps) {
      steps.push({
        stepNum: steps.length + 1,
        fromCylinder: s.fromCylinder,
        toCylinder: s.toCylinder,
        seekDistance: s.seekDistance,
        isService: s.isService,
        requestId: s.requestId >= 0 ? s.requestId + mid : -1,
      });
      sequence.push(s.toCylinder);
    }
  }

  return computeMetrics('F-SCAN', sequence, steps, config);
}

export function runAllAlgorithms(requests: number[], config: DiskConfig): AlgorithmResult[] {
  const results: AlgorithmResult[] = [
    runFCFS(requests, config),
    runSSTF(requests, config),
    runSCAN(requests, config),
    runCSCAN(requests, config),
    runLOOK(requests, config),
    runCLOOK(requests, config),
    runFSCAN(requests, config),
  ];

  // Rank by lowest total head movement
  for (let i = 0; i < results.length; i++) {
    let rank = 1;
    for (let j = 0; j < results.length; j++) {
      if (results[j].totalHeadMovement < results[i].totalHeadMovement) {
        rank++;
      }
    }
    results[i].rank = rank;
  }

  return results;
}

export function runSingleAlgorithm(
  algo: AlgorithmType,
  requests: number[],
  config: DiskConfig
): AlgorithmResult {
  switch (algo) {
    case 'FCFS': return runFCFS(requests, config);
    case 'SSTF': return runSSTF(requests, config);
    case 'SCAN': return runSCAN(requests, config);
    case 'C-SCAN': return runCSCAN(requests, config);
    case 'LOOK': return runLOOK(requests, config);
    case 'C-LOOK': return runCLOOK(requests, config);
    case 'F-SCAN': return runFSCAN(requests, config);
  }
}
