'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useExperimentStore } from '@/lib/store';

export default function ExperimentsPage() {
  const { experiments, setLoading, removeExperiment } = useExperimentStore();

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const getBestFitness = (experiment: any) => {
    const kpi = experiment.kpis.find((kpi: any) => kpi.label === 'Best fitness');
    return kpi ? kpi.value : 'N/A';
  };

  if (experiments.length === 0) {
    return (
      <div className="min-h-screen bg-base-100 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Previous Experiments</h1>
            <p className="text-base-content/70">
              No experiments have been run yet. Start your first experiment to see results here.
            </p>
          </div>
          <Link href="/new-experiment" className="btn btn-primary btn-lg">
            Run First Experiment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Previous Experiments</h1>
          <p className="text-base-content/70">
            View and analyze your past Bee Algorithm experiments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiments.map((experiment) => (
            <div key={experiment.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="card-body">
                <h2 className="card-title text-lg mb-2">{experiment.name}</h2>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-base-content/70">Date:</span>
                    <span>{formatDate(experiment.createdAt)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-base-content/70">Duration:</span>
                    <span>{formatDuration(experiment.durationMs)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-base-content/70">Iterations:</span>
                    <span>{experiment.params.iterations}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-base-content/70">Best Fitness:</span>
                    <span className="font-medium">{getBestFitness(experiment)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-base-content/70">Input Mode:</span>
                    <span className="badge badge-sm badge-primary">{experiment.input.mode}</span>
                  </div>
                </div>

                <div className="card-actions justify-between items-center mt-2">
                  <Link 
                    href={`/experiments/${experiment.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    View Results
                  </Link>
                  <button
                    className="btn btn-error btn-sm"
                    onClick={async () => {
                      if (!confirm('Delete this experiment?')) return;
                      try {
                        const res = await fetch(`/api/experiments/${experiment.id}`, { method: 'DELETE' });
                        if (res.ok || res.status === 404) {
                          removeExperiment(experiment.id);
                        } else {
                          console.error('Failed to delete experiment');
                        }
                      } catch (e) {
                        console.error('Delete request failed', e);
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {experiments.length > 0 && (
          <div className="mt-8 text-center">
            <Link href="/new-experiment" className="btn btn-outline">
              Run New Experiment
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
