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
    const format = (searchParams.get('format') || 'xlsx').toLowerCase();

    if (format === 'xlsx') {
      const buffer = generateXLSX(experiment);
      return new Response(buffer as any, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="experiment-${experiment.id}.xlsx"`,
        },
      });
    }

    if (format === 'pdf') {
      const buffer = await generatePDF(experiment);
      return new Response(buffer as any, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="experiment-${experiment.id}.pdf"`,
        },
      });
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
    ['Feed Limit', experiment.params?.feedLimit],
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

  // Write to buffer
  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
  return buffer;
}

async function generatePDF(experiment: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    // Dynamically require pdfkit via CommonJS to avoid ESM bundling issues with fontkit/@swc/helpers
    // This keeps pdfkit out of the xlsx-only path and plays nicer with Turbopack.
  // Use eval('require') to avoid Turbopack static analysis pulling ESM build (fontkit/module.mjs)
  // and force the CommonJS build explicitly.
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const dynamicRequire: NodeRequire = eval('require');
  // Force CJS entry to avoid pdfkit.es.js and fontkit ESM path
  const PDFDocument = dynamicRequire('pdfkit/js/pdfkit');

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Uint8Array[] = [];

    // Theme colors approximating the bumblebee palette
    const primary = '#facc15'; // yellow-400
    const baseContent = '#1f2937'; // gray-800
    const border = '#e5e7eb'; // gray-200

    doc.on('data', (c: Uint8Array) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header bar
    doc.rect(0, 0, doc.page.width, 60).fill(primary);
    doc
      .fillColor('#111827')
      .fontSize(20)
      .text('Bee Algorithm Experiment', 50, 20, { align: 'left' });

    doc.moveTo(50, 80).lineTo(doc.page.width - 50, 80).strokeColor(border).stroke();

    // Summary block
    doc.fillColor(baseContent).fontSize(12);
    const leftX = 50;
    let y = 100;

    const addKV = (k: string, v: any) => {
      doc.font('Helvetica-Bold').text(`${k}:`, leftX, y);
      doc.font('Helvetica').text(String(v ?? ''), leftX + 150, y);
      y += 18;
    };

    doc.font('Helvetica-Bold').fontSize(14).text('Summary', leftX, y);
    y += 24;

    addKV('Name', experiment.name);
    addKV('Created', new Date(experiment.createdAt).toLocaleString());
    addKV('Duration (ms)', experiment.durationMs);
    addKV('Iterations', experiment.params?.iterations);
    addKV('Bees', experiment.params?.numBees);
    addKV('Feed Limit', experiment.params?.feedLimit);

    y += 8;
    doc.moveTo(leftX, y).lineTo(doc.page.width - 50, y).strokeColor(border).stroke();
    y += 16;

    // KPIs
    doc.font('Helvetica-Bold').fontSize(14).text('KPIs', leftX, y);
    y += 24;
    doc.font('Helvetica').fontSize(12);
    (experiment.kpis || []).forEach((k: any) => {
      doc.text(`• ${k.label}: ${k.value}`, leftX, y);
      y += 16;
    });

    // Results (concise top N)
    y += 8;
    doc.font('Helvetica-Bold').fontSize(14).text('Results (Top 20)', leftX, y);
    y += 20;
    doc.font('Helvetica').fontSize(11);
    const top = Math.min(20, (experiment.resultSeries || []).length);
    for (let i = 0; i < top; i++) {
      const r = experiment.resultSeries[i];
      doc.text(`It ${r.iteration}: Best ${r.bestFitness}` , leftX, y);
      y += 14;
      if (y > doc.page.height - 60) {
        doc.addPage();
        y = 50;
      }
    }

    doc.end();
  });
}
