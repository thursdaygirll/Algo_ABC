'use client';

import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { ExperimentResultSeries } from '@/types/experiment';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface LineChartProps {
  data: ExperimentResultSeries[];
  title?: string;
  height?: number;
  showAverage?: boolean;
}

export default function LineChart({ 
  data, 
  title = 'Fitness Over Iterations', 
  height = 350,
  showAverage = false 
}: LineChartProps) {
  const iterations = data.map(d => d.iteration);
  const bestFitness = data.map(d => d.bestFitness);
  const avgFitness = data.map(d => d.avgFitness || d.bestFitness);
  const stdFitness = data.map(d => d.stdFitness || 0);

  const options: ApexOptions = {
    chart: {
      type: 'line',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      }
    },
    title: {
      text: title,
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 'bold'
      }
    },
    xaxis: {
      title: {
        text: 'Iteration'
      },
      categories: iterations
    },
    yaxis: {
      title: {
        text: 'Fitness Value'
      }
    },
    colors: ['#3b82f6', '#ef4444'],
    stroke: {
      // support multiple series stroke widths when rendering band
      width: [0, 2, 0, 2],
      curve: 'smooth'
    },
    markers: {
      size: 4,
      hover: {
        size: 6
      }
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val: number) => val.toFixed(6)
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right'
    },
    grid: {
      show: true,
      borderColor: '#e5e7eb',
      strokeDashArray: 1
    }
  };

  // build series: Upper band, Average, Lower band, Best
  const series: any[] = [];
  const hasAvg = data.some(d => d.avgFitness !== undefined);
  if (showAverage && hasAvg) {
    const upper = avgFitness.map((a, i) => +(a + stdFitness[i]).toFixed(6));
    const lower = avgFitness.map((a, i) => +(Math.max(0, a - stdFitness[i])).toFixed(6));

    series.push({ name: 'Upper', data: upper });
    series.push({ name: 'Average Fitness', data: avgFitness });
    series.push({ name: 'Lower', data: lower });
  }

  // Best is always shown
  series.push({ name: 'Best Fitness', data: bestFitness });

  return (
    <div className="w-full">
      <Chart
        options={options}
        series={series}
        type="line"
        height={height}
      />
    </div>
  );
}
