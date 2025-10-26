import { NextRequest, NextResponse } from 'next/server';
import { readExperiments, addExperiment } from '@/lib/fs';
import { Experiment } from '@/types/experiment';

export async function GET() {
  try {
    const experiments = await readExperiments();
    return NextResponse.json(experiments);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch experiments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const experiment: Experiment = await request.json();
    await addExperiment(experiment);
    return NextResponse.json(experiment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save experiment' },
      { status: 500 }
    );
  }
}
