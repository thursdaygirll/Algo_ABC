import { promises as fs } from 'fs';
import path from 'path';
import { Experiment } from '@/types/experiment';

const DATA_DIR = path.join(process.cwd(), 'data');
const EXPERIMENTS_FILE = path.join(DATA_DIR, 'experiments.json');

export async function ensureDataDir(): Promise<void> {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

export async function readExperiments(): Promise<Experiment[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(EXPERIMENTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function writeExperiments(experiments: Experiment[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(EXPERIMENTS_FILE, JSON.stringify(experiments, null, 2));
}

export async function addExperiment(experiment: Experiment): Promise<void> {
  const experiments = await readExperiments();
  experiments.push(experiment);
  await writeExperiments(experiments);
}

export async function getExperimentById(id: string): Promise<Experiment | null> {
  const experiments = await readExperiments();
  return experiments.find(exp => exp.id === id) || null;
}
