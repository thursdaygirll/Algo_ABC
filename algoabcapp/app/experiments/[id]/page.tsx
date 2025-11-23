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
import * as XLSX from 'xlsx';

export default function ExperimentResultsPage() {
  const params = useParams();
  const { experiments, setCurrentExperiment } = useExperimentStore();
  const [experiment, setExperiment] = useState<Experiment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const generateClientSideExcel = (exp: Experiment) => {
    const wb = XLSX.utils.book_new();

    const headers = [
      'ExperimentName', 'Iteration', 'Fbest', 'Xbest', 'MeanFitness', 'WorstFitness', 
      'NumScouts', 'Diversity', 'Improvement', 'Time (s)', 'NumBees', 'TrialLimit', 'Seed'
    ];
    
    if (exp.params?.lowerBound !== undefined) headers.push('LowerBound');
    if (exp.params?.upperBound !== undefined) headers.push('UpperBound');
    if (exp.params?.objectiveFunction) headers.push('ObjectiveFunction');

    const rows: any[][] = [headers];
    const trialLimit = exp.params?.numBees && exp.input?.matrix?.[0]?.length
      ? exp.params.numBees * exp.input.matrix[0].length
      : '';
    
    const timePerIteration = exp.durationMs / 1000.0 / exp.resultSeries.length;

    for (let i = 0; i < exp.resultSeries.length; i++) {
      const r = exp.resultSeries[i];
      
      // Use real algorithm data if available, otherwise calculate estimates
      const numScouts = (r as any).numScouts ?? (
        i === 0 ? 0 : (exp.resultSeries[i - 1].bestFitness > r.bestFitness ? 0 : Math.floor((exp.params?.numBees || 20) * 0.1))
      );
      const diversity = (r as any).diversity ?? r.stdFitness ?? '';
      const worstFitness = (r as any).worstFitness ?? r.stdFitness ?? '';
      const improvement = (r as any).improvement ?? (
        i === 0 ? 1 : (exp.resultSeries[i - 1].bestFitness > r.bestFitness ? 1 : 0)
      );
      
      rows.push([
        exp.name,
        r.iteration,
        r.bestFitness,
        exp.bestSolution ? JSON.stringify(exp.bestSolution) : '',
        r.avgFitness ?? '',
        worstFitness,
        numScouts,
        diversity,
        improvement,
        Number(timePerIteration.toFixed(6)),
        exp.params?.numBees ?? '',
        trialLimit,
        exp.params?.seed ?? '',
        ...(exp.params?.lowerBound !== undefined ? [exp.params.lowerBound] : []),
        ...(exp.params?.upperBound !== undefined ? [exp.params.upperBound] : []),
        ...(exp.params?.objectiveFunction ? [exp.params.objectiveFunction] : []),
      ]);
    }

    rows.push([]);
    rows.push(['Columna', 'Descripción', 'Tipo de dato']);
    const meta = [
      ['ExperimentName', 'Identificador único del experimento.', 'Texto'],
      ['Iteration', 'Número de iteración actual (1..max_iter).', 'Entero'],
      ['Fbest', 'Mejor valor encontrado hasta ahora.', 'Decimal'],
      ['Xbest', 'Vector de la mejor solución.', 'Lista o string'],
      ['MeanFitness', 'Promedio del fitness en la población.', 'Decimal'],
      ['WorstFitness', 'Peor valor en la población.', 'Decimal'],
      ['NumScouts', 'Abejas convertidas en scouts en la iteración.', 'Entero'],
      ['Diversity', 'Desviación estándar (mide exploración).', 'Decimal'],
      ['Improvement', '1 si mejoró respecto a Fbest previo, 0 si no.', 'Binario'],
      ['Time (s)', 'Tiempo de ejecución de la iteración.', 'Decimal'],
      ['NumBees', 'Tamaño de la población.', 'Entero'],
      ['TrialLimit', 'Límite de intentos (auto N*D).', 'Entero'],
      ['Seed', 'Semilla para reproducibilidad.', 'Entero o vacío'],
      ...(exp.params?.lowerBound !== undefined ? [['LowerBound', 'Límite inferior de variables.', 'Decimal']] : []),
      ...(exp.params?.upperBound !== undefined ? [['UpperBound', 'Límite superior de variables.', 'Decimal']] : []),
      ...(exp.params?.objectiveFunction ? [['ObjectiveFunction', 'Función objetivo utilizada.', 'Texto']] : []),
    ];
    meta.forEach(m => rows.push(m));

    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'Experiment');

    return XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
  };
  
  const downloadExport = async () => {
    if (!experiment) return;
    
    try {
      // Try server-side export first (if backend is running, it will have better formatting)
      const res = await fetch(`/api/export/${params.id}?format=xlsx`);
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `experiment-${params.id}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        return;
      }
    } catch (e) {
      console.warn('Server export failed, using client-side generation:', e);
    }
    
    // Fallback: Generate Excel client-side using the loaded experiment data
    try {
      const buffer = generateClientSideExcel(experiment);
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `experiment-${experiment.id}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Client-side export failed:', e);
      alert('Failed to export experiment. Please try again.');
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
              {experiment.params.lowerBound !== undefined && (
                <StatCard title="Lower Bound (lb)" value={String(experiment.params.lowerBound)} subtitle="Límite inferior" />
              )}
              {experiment.params.upperBound !== undefined && (
                <StatCard title="Upper Bound (ub)" value={String(experiment.params.upperBound)} subtitle="Límite superior" />
              )}
              {experiment.params.objectiveFunction && (
                <StatCard title="Objective Function" value={String(experiment.params.objectiveFunction)} subtitle="Función objetivo" />
              )}
              {experiment.input.matrix && (
                <StatCard title="Trial Limit (N*D)" value={String(experiment.params.numBees * experiment.input.matrix[0].length)} subtitle="Auto-calculado" />
              )}
              {experiment.params.seed !== undefined && (
                <StatCard title="Seed" value={String(experiment.params.seed)} subtitle="Reproducibilidad" />
              )}
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
