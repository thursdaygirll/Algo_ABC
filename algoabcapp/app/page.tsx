import Link from 'next/link';
import FeatureCard from '@/components/cards/FeatureCard';
import StatCard from '@/components/StatCard';
import { Rocket, Folder, BarChart2, Download } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero */}
        <section className="grid gap-8 lg:grid-cols-2 items-center mb-12">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-black dark:text-zinc-50">
              Bee Algorithm Platform
            </h1>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-xl">
              Run, visualize and export Artificial Bee Colony experiments. Upload your data,
              configure algorithm parameters, and explore convergence with interactive charts.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/new-experiment" className="btn btn-primary">
                New experiment
              </Link>
              <Link href="/experiments" className="btn btn-ghost">
                Previous experiments
              </Link>
            </div>
          </div>

          
        </section>

        {/* Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">What you can do</h2>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<Rocket className="inline-block w-12 h-12" />}
              title={'Run experiments'}
              description={'Configure ABC parameters and run optimization jobs locally or via the API.'}
            />

            <FeatureCard
              icon={<Folder className="inline-block w-12 h-12" />}
              title={'Upload datasets'}
              description={'Upload Excel or CSV files, or use built-in sample datasets to get started.'}
            />

            <FeatureCard
              icon={<BarChart2 className="inline-block w-12 h-12" />}
              title={'Interactive charts'}
              description={'View convergence, KPIs and detailed result series with ApexCharts.'}
            />

            <FeatureCard
              icon={<Download className="inline-block w-12 h-12" />}
              title={'Export results'}
              description={'Download results as CSV or Excel for further analysis and reporting.'}
            />
          </div>
        </section>

        

        
      </main>
    </div>
  );
}
