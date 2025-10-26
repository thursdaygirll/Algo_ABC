import { PreloadedDataset } from '@/types/experiment';

export const PRELOADED_DATASETS: PreloadedDataset[] = [
  {
    name: 'toy-9x5',
    description: 'Small test case with 9 alternatives and 5 criteria',
    alternatives: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9'],
    criteria: ['C1', 'C2', 'C3', 'C4', 'C5'],
    matrix: [
      [0.048, 0.047, 0.070, 0.087, 0.190],
      [0.053, 0.052, 0.066, 0.081, 0.058],
      [0.057, 0.057, 0.066, 0.076, 0.022],
      [0.062, 0.062, 0.063, 0.058, 0.007],
      [0.066, 0.066, 0.070, 0.085, 0.004],
      [0.070, 0.071, 0.066, 0.058, 0.003],
      [0.075, 0.075, 0.066, 0.047, 0.002],
      [0.079, 0.079, 0.066, 0.035, 0.002],
      [0.083, 0.083, 0.066, 0.051, 0.000]
    ]
  },
  {
    name: 'sample-10x10',
    description: 'Medium test case with 10 alternatives and 10 criteria',
    alternatives: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10'],
    criteria: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10'],
    matrix: Array.from({ length: 10 }, () => 
      Array.from({ length: 10 }, () => Math.random())
    )
  },
  {
    name: 'large-20x15',
    description: 'Large test case with 20 alternatives and 15 criteria',
    alternatives: Array.from({ length: 20 }, (_, i) => `A${i + 1}`),
    criteria: Array.from({ length: 15 }, (_, i) => `C${i + 1}`),
    matrix: Array.from({ length: 20 }, () => 
      Array.from({ length: 15 }, () => Math.random())
    )
  }
];

export function getPreloadedDataset(name: string): PreloadedDataset | undefined {
  return PRELOADED_DATASETS.find(dataset => dataset.name === name);
}
