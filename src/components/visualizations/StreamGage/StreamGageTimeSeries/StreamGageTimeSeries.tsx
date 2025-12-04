'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import { formatDate } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';

import { StreamGageData } from '@/utils/data';
import { useColorMode } from '@/hooks/useColorMode';

ChartJS.register(
  TimeScale,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type StreamGageTimeSeriesProps = {
  dates: Date[];
  data: StreamGageData[];
};

const LINE_COLORS = [
  { borderColor: 'rgb(168, 92, 222)', backgroundColor: 'rgba(168, 92, 222, 0.5)' },
  { borderColor: 'rgb(59,84,227)', backgroundColor: 'rgba(59,84,227,0.5)' },
  { borderColor: 'rgb(41,166,255)', backgroundColor: 'rgba(41,166,255,0.5)' },
  { borderColor: 'rgb(86,208,232)', backgroundColor: 'rgba(86,208,232,0.5)' },
  { borderColor: 'rgb(28,255,221)', backgroundColor: 'rgba(28,255,221,0.5)' },
  { borderColor: 'rgb(8,212,83)', backgroundColor: 'rgba(8,212,83,0.5)' },
  { borderColor: 'rgb(123,232,39)', backgroundColor: 'rgba(123,232,39,0.5)' },
  { borderColor: 'rgb(240,227,91)', backgroundColor: 'rgba(240,227,91,0.5)' },
  { borderColor: 'rgb(247,177,47)', backgroundColor: 'rgba(247,177,47,0.5)' },
  { borderColor: 'rgb(232,87,14)', backgroundColor: 'rgba(232,87,14,0.5)' },
  { borderColor: 'rgb(181,22,22)', backgroundColor: 'rgba(181,22,22,0.5)' },
  { borderColor: 'rgb(212,36,141)', backgroundColor: 'rgba(212,36,141,0.5)' },
];

const CHART_COLORS = {
  light: {
    grid: 'oklch(92.9% 0.013 255.508)',
    text: 'oklch(27.9% 0.041 260.031)',
  },
  dark: {
    grid: 'oklch(44.6% 0.043 257.281)',
    text: 'oklch(70.4% 0.04 256.788)',
  },
};

export function StreamGageTimeSeries({ dates, data }: StreamGageTimeSeriesProps) {
  const colorMode = useColorMode();
  const chartColors = React.useMemo(
    () => (colorMode === 'light' ? CHART_COLORS.light : CHART_COLORS.dark),
    [colorMode]
  );
  const datasets = React.useMemo(
    () =>
      data.map(({ siteName, values }, index) => ({
        ...(LINE_COLORS[index] || {
          borderColor: 'rgb(71,71,71)',
          backgroundColor: 'rgba(71,71,71,0.5)',
        }),
        label: siteName,
        pointStyle: false,
        data: values.map(({ value }) => value),
      })),
    [data]
  );
  if (data.length === 0)
    return (
      <div className="flex h-full text-xl md:text-2xl place-items-center justify-around">
        Select a circle on the left to view time series data.
      </div>
    );
  return (
    <Line
      data={{
        labels: dates.map((date) => formatDate(date, 'P p')),
        // Note (AM): TS doesn't like `pointStyle: false`, even though that's in the expected union.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        datasets: datasets as any,
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top' as const,
            labels: {
              color: chartColors.text,
            },
          },
          title: {
            display: true,
            text: 'Stream Gage Height',
            color: chartColors.text,
          },
        },
        scales: {
          x: {
            grid: {
              color: chartColors.grid,
            },
            title: {
              display: true,
              text: 'Time',
              color: chartColors.text,
            },
            ticks: {
              autoSkip: true,
              color: chartColors.text,
              maxTicksLimit: 3,
            },
          },
          y: {
            grid: {
              color: chartColors.grid,
            },
            title: {
              display: true,
              text: 'Height (ft.)',
              color: chartColors.text,
            },
            ticks: {
              color: chartColors.text,
            },
          },
        },
      }}
    />
  );
}
