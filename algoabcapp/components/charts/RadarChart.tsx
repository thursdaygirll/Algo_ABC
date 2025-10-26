'use client';

import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface RadarChartProps {
  data: number[];
  labels: string[];
  title?: string;
  height?: number;
}

export default function RadarChart({ data, labels, title = 'Performance Metrics', height = 350 }: RadarChartProps) {
  const options: ApexOptions = {
    chart: {
      type: 'radar',
      toolbar: {
        show: false
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
      categories: labels
    },
    yaxis: {
      show: false
    },
    plotOptions: {
      radar: {
        size: 140,
        offsetX: 0,
        offsetY: 0
      }
    },
    colors: ['#3b82f6'],
    markers: {
      size: 4,
      colors: ['#3b82f6'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 6
      }
    },
    tooltip: {
      y: {
        formatter: (val: number) => val.toFixed(3)
      }
    },
    fill: {
      opacity: 0.1
    },
    stroke: {
      width: 2
    }
  };

  const series = [{
    name: 'Values',
    data: data
  }];

  return (
    <div className="w-full">
      <Chart
        options={options}
        series={series}
        type="radar"
        height={height}
      />
    </div>
  );
}
