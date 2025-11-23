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

  // Build a single sheet combining data rows and metadata columns (Spanish) similar to provided screenshot.
  const headers = [
    'ExperimentName', 'Iteration', 'Fbest', 'Xbest', 'MeanFitness', 'WorstFitness', 'NumScouts', 'Diversity', 'Improvement', 'Time (s)', 'NumBees', 'TrialLimit', 'Seed'
  ];
  // Optional param columns
  if (experiment.params?.lowerBound !== undefined) headers.push('LowerBound');
  if (experiment.params?.upperBound !== undefined) headers.push('UpperBound');
  if (experiment.params?.objectiveFunction) headers.push('ObjectiveFunction');

  const rows: any[][] = [headers];
  const top = (experiment.resultSeries || []).length; // include all iterations
  const trialLimit = experiment.params?.numBees && experiment.input?.matrix?.[0]?.length
    ? experiment.params.numBees * experiment.input.matrix[0].length
    : '';

  for (let i = 0; i < top; i++) {
    const r = experiment.resultSeries[i];
    rows.push([
      experiment.name,
      r.iteration,
      r.bestFitness,
      experiment.bestSolution ? JSON.stringify(experiment.bestSolution) : '',
      r.avgFitness ?? '',
      r.stdFitness ?? '', // Using stdFitness as WorstFitness placeholder if not separately tracked
      '', // NumScouts (not tracked in simulation)
      '', // Diversity (not tracked currently)
      i === 0 ? 1 : (experiment.resultSeries[i - 1].bestFitness > r.bestFitness ? 1 : 0), // Improvement binary
      '', // Time (s) placeholder; could compute per iteration if available
      experiment.params?.numBees ?? '',
      trialLimit,
      experiment.params?.seed ?? '',
      ...(experiment.params?.lowerBound !== undefined ? [experiment.params.lowerBound] : []),
      ...(experiment.params?.upperBound !== undefined ? [experiment.params.upperBound] : []),
      ...(experiment.params?.objectiveFunction ? [experiment.params.objectiveFunction] : []),
    ]);
  }

  // Append metadata table at right side (O-Q) by adding rows with blanks until alignment if needed
  // Instead we will create a second section separated by an empty row.
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
    ...(experiment.params?.lowerBound !== undefined ? [['LowerBound', 'Límite inferior de variables.', 'Decimal']] : []),
    ...(experiment.params?.upperBound !== undefined ? [['UpperBound', 'Límite superior de variables.', 'Decimal']] : []),
    ...(experiment.params?.objectiveFunction ? [['ObjectiveFunction', 'Función objetivo utilizada.', 'Texto']] : []),
  ];
  meta.forEach(m => rows.push(m));

  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, 'Experiment');

  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
}

