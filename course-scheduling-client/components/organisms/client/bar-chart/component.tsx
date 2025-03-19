'use client';

import dynamic from 'next/dynamic';
import { Props as ChartConfigProps } from 'react-apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Props {
  series: { name: string; data: number[] }[];
  categories: (string | number)[];
}

export const BarChart: React.FC<Props> = ({ series, categories }) => {
  const chartDarkConfig: ChartConfigProps = {
    series,
    type: 'bar',
    height: 350,
    options: {
      legend: {
        labels: {
          colors: '#dddddd',
        },
      },
      chart: {
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      colors: ['#77A4D7', '#3e7cb1', '#2a5c8a', '#1a3d63', '#0f2640'],
      plotOptions: {
        bar: {
          columnWidth: '80%',
          borderRadius: 3,
        },
      },
      xaxis: {
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          style: {
            colors: '#dddddd',
            fontSize: '12px',
            fontFamily: 'inherit',
            fontWeight: 400,
          },
        },
        categories,
      },
      yaxis: {
        labels: {
          style: {
            colors: '#dddddd',
            fontSize: '12px',
            fontFamily: 'inherit',
            fontWeight: 400,
          },
        },
      },
      grid: {
        show: true,
        borderColor: '#575757',
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 5,
          right: 20,
        },
      },
      fill: { opacity: 0.8 },
      tooltip: {
        theme: 'dark',
      },
    },
  };
  const chartLightConfig: ChartConfigProps = {
    series,
    type: 'bar',
    height: 350,
    options: {
      chart: {
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      colors: ['#b7d0ed', '#77A4D7', '#3e7cb1', '#2a5c8a', '#1a3d63'],
      plotOptions: {
        bar: {
          columnWidth: '80%',
          borderRadius: 3,
        },
      },
      xaxis: {
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          style: {
            colors: '#616161',
            fontSize: '12px',
            fontFamily: 'inherit',
            fontWeight: 400,
          },
        },
        categories,
      },
      yaxis: {
        labels: {
          style: {
            colors: '#616161',
            fontSize: '12px',
            fontFamily: 'inherit',
            fontWeight: 400,
          },
        },
      },
      grid: {
        show: true,
        borderColor: '#dddddd',
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 5,
          right: 20,
        },
      },
      fill: { opacity: 0.8 },
      tooltip: {
        theme: 'light',
      },
    },
  };

  return (
    <div className="h-[350px]">
      <div className="dark:hidden">
        <Chart {...chartLightConfig} />
      </div>
      <div className="hidden dark:block">
        <Chart {...chartDarkConfig} />
      </div>
    </div>
  );
};
