import { NextRequest, NextResponse } from 'next/server';
import { getExperimentById } from '@/lib/fs';
import * as XLSX from 'xlsx';

// Ensure this route runs on the Node.js runtime (PDFKit requires Node streams)
export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const experiment = await getExperimentById(id);
    
    if (!experiment) {
      return NextResponse.json(
        { error: 'Experiment not found' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    // Only XLSX export supported now
    const buffer = generateXLSX(experiment);
    return new Response(buffer as any, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="experiment-${experiment.id}.xlsx"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to export experiment' },
      { status: 500 }
    );
  }
}

function generateXLSX(experiment: any): Buffer {
  const wb = XLSX.utils.book_new();

  // Summary sheet (concise)
  const summaryRows = [
    ['Bee Algorithm Experiment'],
    ['Name', experiment.name],
    ['Created', new Date(experiment.createdAt).toLocaleString()],
    ['Duration (ms)', experiment.durationMs],
    ['Iterations', experiment.params?.iterations],
    ['Bees', experiment.params?.numBees],
    ...(experiment.params?.lowerBound !== undefined ? [['Lower Bound (lb)', experiment.params.lowerBound]] : []),
    ...(experiment.params?.upperBound !== undefined ? [['Upper Bound (ub)', experiment.params.upperBound]] : []),
    ...(experiment.params?.objectiveFunction ? [['Objective Function (fobj)', experiment.params.objectiveFunction]] : []),
    [],
    ['Key Performance Indicators'],
    ...(experiment.kpis || []).map((k: any) => [k.label, k.value]),
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

  // Series sheet (top N for brevity)
  const top = Math.min(50, (experiment.resultSeries || []).length);
  const seriesRows = [['Iteration', 'Best Fitness', 'Avg Fitness', 'Std Fitness']];
  for (let i = 0; i < top; i++) {
    const r = experiment.resultSeries[i];
    seriesRows.push([r.iteration, r.bestFitness, r.avgFitness ?? '', r.stdFitness ?? '']);
  }
  const wsSeries = XLSX.utils.aoa_to_sheet(seriesRows);
  XLSX.utils.book_append_sheet(wb, wsSeries, 'Results');

  // Metadata sheet (Spanish column descriptions)
  const metadata: [string, string, string][] = [
    ['ExperimentName', 'Identificador único del experimento.', 'Texto'],
    ['Iteration', 'Número de iteración actual (1..max_iter).', 'Entero'],
    ['Fbest', 'Mejor valor de la función objetivo encontrado hasta ahora.', 'Decimal'],
    ['Xbest', 'Vector con los valores de la mejor solución.', 'Lista o string'],
    ['MeanFitness', 'Promedio del fitness en la población.', 'Decimal'],
    ['WorstFitness', 'Peor valor en la población.', 'Decimal'],
    ['NumScouts', 'Cuántas abejas se convirtieron en scouts en esta iteración.', 'Entero'],
    ['Diversity', 'Desviación estándar de la población (mide exploración).', 'Decimal'],
    ['Improvement', '1 si mejoró el Fbest respecto a la iteración anterior, 0 si no.', 'Binario'],
    ['Time (s)', 'Tiempo que tardó esta iteración en ejecutarse.', 'Decimal'],
    ['NumBees', 'Número total de abejas (población).', 'Entero'],
    ['TrialLimit', 'Límite de intentos antes de volverse scout (auto-calculado N*D).', 'Entero'],
    ['Seed', 'Semilla usada para reproducibilidad.', 'Entero o vacío'],
    ['Lower Bound (lb)', 'Valor mínimo permitido para las variables.', 'Decimal o vacío'],
    ['Upper Bound (ub)', 'Valor máximo permitido para las variables.', 'Decimal o vacío'],
    ['Objective Function (fobj)', 'Nombre de la función objetivo.', 'Texto'],
  ];
  const wsMeta = XLSX.utils.aoa_to_sheet([
    ['Columna', 'Descripción', 'Tipo de dato'],
    ...metadata
  ]);
  XLSX.utils.book_append_sheet(wb, wsMeta, 'Metadata');

  // Write to buffer
  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
  return buffer;
}

