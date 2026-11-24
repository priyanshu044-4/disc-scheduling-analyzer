export type Direction = 'UP' | 'DOWN';

export interface DiskConfig {
  totalCylinders: number;
  initialHead: number;
  direction: Direction;
  rpm: number;
  seekPerCylinder: number;
  baseOverhead: number;
  transferRateMbps: number;
  sectorSizeBytes: number;
}

export interface ScheduleStep {
  stepNum: number;
  fromCylinder: number;
  toCylinder: number;
  seekDistance: number;
  isService: boolean;
  requestId: number;
}

export interface AlgorithmResult {
  name: string;
  sequence: number[];
  steps: ScheduleStep[];
  totalHeadMovement: number;
  requestsServiced: number;
  avgSeekDistance: number;
  estSeekTimeMs: number;
  avgRotationalLatencyMs: number;
  estTransferTimeMs: number;
  totalServiceTimeMs: number;
  varianceSeek: number;
  stdDevSeek: number;
  coefficientOfVariation: number;
  starvationRisk: 'None' | 'Low' | 'Moderate' | 'High';
  rank: number;
}

export type AlgorithmType = 'FCFS' | 'SSTF' | 'SCAN' | 'C-SCAN' | 'LOOK' | 'C-LOOK' | 'F-SCAN';

export interface PresetWorkload {
  name: string;
  description: string;
  cylinders: number;
  head: number;
  direction: Direction;
  requests: number[];
}
