export type InputMode = 'excel' | 'preloaded' | 'manual';

export interface BeeParams {
  feedLimit: number;
  numBees: number;
  iterations: number;
  seed?: number;
}

export interface ExperimentInput {
  mode: InputMode;
  datasetName?: string;         // for preloaded
  matrix?: number[][];          // for manual
  fileMeta?: { name: string; type: string; rows: number; cols: number };
}

export interface KPI {
  label: string;
  value: number | string;
}

export interface ExperimentResultSeries {
  iteration: number;
  bestFitness: number;
  avgFitness?: number;
  stdFitness?: number;
}

export interface Experiment {
  id: string;
  name: string;
  createdAt: string;
  durationMs: number;
  params: BeeParams;
  input: ExperimentInput;
  kpis: KPI[];
  bestSolution?: number[];             // indices or values
  resultSeries: ExperimentResultSeries[];
}

// API Request/Response types
export interface ExperimentRunRequest {
  params: BeeParams;
  input: ExperimentInput;
}

export interface ExperimentRunResponse {
  durationMs: number;
  kpis: KPI[];
  bestSolution?: number[];
  resultSeries: ExperimentResultSeries[];
}

// Preloaded dataset options
export interface PreloadedDataset {
  name: string;
  description: string;
  matrix: number[][];
  alternatives: string[];
  criteria: string[];
}
