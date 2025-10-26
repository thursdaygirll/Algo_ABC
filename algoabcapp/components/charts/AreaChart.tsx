'use client';

import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { ExperimentResultSeries } from '@/types/experiment';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface AreaChartProps {
  data: ExperimentResultSeries[];
  title?: string;
  height?: number;
}

export default function AreaChart({ 
  data, 
  title = 'Convergence Progress', 
  height = 350 
}: AreaChartProps) {
  const iterations = data.map(d => d.iteration);
  const bestFitness = data.map(d => d.bestFitness);

  const options: ApexOptions = {
    chart: {
      type: 'area',
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
    colors: ['#10b981'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
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
      y: {
        formatter: (val: number) => val.toFixed(6)
      }
    },
    grid: {
      show: true,
      borderColor: '#e5e7eb',
      strokeDashArray: 1
    }
  };

  const series = [{
    name: 'Best Fitness',
    data: bestFitness
  }];

  return (
    <div className="w-full">
      <Chart
        options={options}
        series={series}
        type="area"
        height={height}
      />
    </div>
  );
}
