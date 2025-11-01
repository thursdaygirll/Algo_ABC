import { ExperimentRunRequest, ExperimentRunResponse } from '@/types/experiment';

const BEE_API_URL = process.env.NEXT_PUBLIC_BEE_API || 'http://localhost:8001';

export async function runBeeExperiment(body: ExperimentRunRequest): Promise<ExperimentRunResponse> {
  const res = await fetch(`${BEE_API_URL}/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Run failed: ${res.status} ${errorText}`);
  }
  
  return res.json();
}

export async function saveExperiment(experiment: any) {
  const res = await fetch(`${BEE_API_URL}/experiments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(experiment),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to save experiment');
  }
  return res.json();
}

export async function fetchExperiments() {
  const res = await fetch(`${BEE_API_URL}/experiments`);
  if (!res.ok) return [];
  return res.json();
}

export async function checkBeeAPIHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${BEE_API_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
}
