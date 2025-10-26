import { NextRequest, NextResponse } from 'next/server';
import { getExperimentById } from '@/lib/fs';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const experiment = await getExperimentById(params.id);
    
    if (!experiment) {
      return NextResponse.json(
        { error: 'Experiment not found' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';

    if (format === 'csv') {
      // Generate CSV content
      const csvContent = generateCSV(experiment);
      
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="experiment-${experiment.id}.csv"`
        }
      });
    }

    if (format === 'xlsx') {
      // TODO(bee): Implement Excel export
      return NextResponse.json(
        { error: 'Excel export not yet implemented' },
        { status: 501 }
      );
    }

    if (format === 'pdf') {
      // TODO(bee): Implement PDF export
      return NextResponse.json(
        { error: 'PDF export not yet implemented' },
        { status: 501 }
      );
    }

    return NextResponse.json(
      { error: 'Unsupported format' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to export experiment' },
      { status: 500 }
    );
  }
}

function generateCSV(experiment: any): string {
  const lines = [];
  
  // Header
  lines.push('Experiment Results');
  lines.push(`Name,${experiment.name}`);
  lines.push(`Created,${experiment.createdAt}`);
  lines.push(`Duration (ms),${experiment.durationMs}`);
  lines.push(`Iterations,${experiment.params.iterations}`);
  lines.push(`Bees,${experiment.params.numBees}`);
  lines.push(`Feed Limit,${experiment.params.feedLimit}`);
  lines.push('');
  
  // KPIs
  lines.push('Key Performance Indicators');
  experiment.kpis.forEach((kpi: any) => {
    lines.push(`${kpi.label},${kpi.value}`);
  });
  lines.push('');
  
  // Result Series
  lines.push('Iteration,Best Fitness');
  experiment.resultSeries.forEach((result: any) => {
    lines.push(`${result.iteration},${result.bestFitness}`);
  });
  
  return lines.join('\n');
}
