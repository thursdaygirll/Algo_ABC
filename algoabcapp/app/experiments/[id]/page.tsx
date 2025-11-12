'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Experiment } from '@/types/experiment';
import { useExperimentStore } from '@/lib/store';
import ExperimentMetaCard from '@/components/ExperimentMetaCard';
import StatCard from '@/components/StatCard';
import RadarChart from '@/components/charts/RadarChart';
import LineChart from '@/components/charts/LineChart';
import AreaChart from '@/components/charts/AreaChart';

export default function ExperimentResultsPage() {
  const params = useParams();
  const { experiments, setCurrentExperiment } = useExperimentStore();
  const [experiment, setExperiment] = useState<Experiment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const downloadExport = async () => {
    if (!params.id) return;
    try {
      const res = await fetch(`/api/export/${params.id}?format=xlsx`);
      if (!res.ok) {
        throw new Error(`Export failed: ${res.status}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `experiment-${params.id}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      // no-op; could add a toast here
      console.error(e);
    }
  };

  useEffect(() => {
    const exp = experiments.find(e => e.id === params.id);
    if (exp) {
      setExperiment(exp);
      setCurrentExperiment(exp);
    }
    setIsLoading(false);
  }, [params.id, experiments, setCurrentExperiment]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!experiment) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Experiment Not Found</h1>
          <p className="text-base-content/70">The requested experiment could not be found.</p>
        </div>
      </div>
    );
  }

  const bestFitness = experiment.kpis.find(kpi => kpi.label === 'Best fitness')?.value || 'N/A';
  const iterations = experiment.kpis.find(kpi => kpi.label === 'Iterations')?.value || 'N/A';
  const convergence = experiment.resultSeries.length > 1 
    ? (experiment.resultSeries[0].bestFitness - experiment.resultSeries[experiment.resultSeries.length - 1].bestFitness).toFixed(6)
    : '0';

  // Prepare radar chart data (mock data for demonstration)
  const radarData = experiment.bestSolution || [0.5, 0.6, 0.4, 0.7, 0.3];
  const radarLabels = experiment.input.matrix 
    ? Array.from({ length: experiment.input.matrix[0].length }, (_, i) => `C${i + 1}`)
    : ['C1', 'C2', 'C3', 'C4', 'C5'];

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{experiment.name}</h1>
          <p className="text-base-content/70">
            Experiment Results • {new Date(experiment.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Metadata and KPIs */}
          <div className="space-y-6">
            <ExperimentMetaCard experiment={experiment} />
            
            {/* KPI Cards */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Key Performance Indicators</h3>
              <StatCard
                title="Best Fitness"
                value={bestFitness}
                subtitle="Lowest fitness value achieved"
              />
              <StatCard
                title="Convergence"
                value={convergence}
                subtitle="Improvement from start to end"
              />
              <StatCard
                title="Iterations"
                value={iterations}
                subtitle="Total iterations completed"
              />
              <StatCard
                title="Duration"
                value={`${(experiment.durationMs / 1000).toFixed(2)}s`}
                subtitle="Total execution time"
              />
            </div>
          </div>

          {/* Right Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Fitness Over Time */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <LineChart
          data={experiment.resultSeries}
          showAverage={true}
                  title="Fitness Convergence Over Time"
                  height={300}
                />
              </div>
            </div>

            {/* Convergence Area Chart */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <AreaChart
                  data={experiment.resultSeries}
                  title="Convergence Progress"
                  height={300}
                />
              </div>
            </div>

            {/* Radar Chart */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <RadarChart
                  data={radarData}
                  labels={radarLabels}
                  title="Best Solution Components"
                  height={300}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div className="mt-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="text-lg font-medium mb-4">Export Results</h3>
              <div className="flex flex-wrap gap-4">
                <button className="btn btn-outline" onClick={() => downloadExport()}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
