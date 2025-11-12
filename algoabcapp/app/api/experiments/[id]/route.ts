import { NextRequest, NextResponse } from 'next/server';
import { deleteExperimentById, getExperimentById } from '@/lib/fs';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    // Idempotent delete: attempt removal and return 204 regardless of prior existence
    await deleteExperimentById(id);
    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const experiment = await getExperimentById(id);
    if (!experiment) {
      return NextResponse.json({ error: 'Experiment not found' }, { status: 404 });
    }
    return NextResponse.json(experiment);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch experiment' }, { status: 500 });
  }
}
