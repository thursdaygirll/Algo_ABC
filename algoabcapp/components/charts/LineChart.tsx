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
      width: 2,
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

  const series = [
    {
      name: 'Best Fitness',
      data: bestFitness
    }
  ];

  if (showAverage && data.some(d => d.avgFitness !== undefined)) {
    series.push({
      name: 'Average Fitness',
      data: avgFitness
    });
  }

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
