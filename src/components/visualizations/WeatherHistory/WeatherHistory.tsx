'use client';
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  BarElement,
  Legend,
  Filler,
  TimeScale,
} from 'chart.js';
import { compareAsc, formatDate } from 'date-fns';

import { WeatherData } from '@/utils/data';

type WeatherHistoryProps = {
  data: WeatherData[];
};

ChartJS.register(
  TimeScale,
  Filler,
  CategoryScale,
  BarElement,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function WeatherHistory({ data }: WeatherHistoryProps) {
  const { dates, maxTemp, minTemp, avgTemp, precipitation } = React.useMemo(() => {
    const sortedData = data.sort((a, b) => compareAsc(a.date, b.date));
    return {
      dates: sortedData.map(({ date }) => date),
      maxTemp: sortedData.map(({ maxTemp }) => maxTemp),
      minTemp: sortedData.map(({ minTemp }) => minTemp),
      avgTemp: sortedData.map(({ avgTemp }) => avgTemp),
      precipitation: sortedData.map(({ precipitation }) => precipitation),
    };
  }, [data]);
  const datasets = React.useMemo(
    () => ({
      labels: dates.map((date) => formatDate(date, 'P')),
      datasets: [
        {
          label: 'Average Temperature',
          data: avgTemp,
          borderColor: 'rgb(40, 40, 40)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          yAxisID: 'yTemp',
          pointStyle: false,
          cubicInterpolationMode: 'monotone',
        },
        {
          label: 'Max Temperature',
          data: maxTemp,
          borderColor: 'rgba(237, 40, 130, 0.2)',
          backgroundColor: 'rgba(237, 40, 130, 0.2)',
          yAxisID: 'yTemp',
          pointStyle: false,
          cubicInterpolationMode: 'monotone',
        },
        {
          label: 'Min Temperature',
          data: minTemp,
          borderColor: 'rgba(237, 40, 130, 0.2)',
          backgroundColor: 'rgba(237, 40, 130, 0.2)',
          yAxisID: 'yTemp',
          pointStyle: false,
          cubicInterpolationMode: 'monotone',
          fill: '-1',
        },
        {
          label: 'Precipitation',
          data: precipitation,
          borderColor: 'rgb(30, 177, 228)',
          backgroundColor: 'rgba(30, 177, 228, 0.5)',
          yAxisID: 'yPrecip',
          type: 'bar',
        },
      ],
    }),
    [dates, avgTemp, maxTemp, minTemp, precipitation]
  );
  return (
    <div className="h-80 w-full">
      <Line
        // Note (AM): TS Check doesn't like this, but it's fine actually, don't let the computer fool you.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data={datasets as any}
        options={{
          //spanGaps: false,
          plugins: {
            filler: {
              propagate: true,
            },
          },
          scales: {
            yTemp: {
              type: 'linear',
              display: true,
              position: 'left',
            },
            yPrecip: {
              type: 'linear',
              display: true,
              position: 'right',
              title: { display: true, text: 'Preciptiation in Units' },
            },
          },
          responsive: true,
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
}
