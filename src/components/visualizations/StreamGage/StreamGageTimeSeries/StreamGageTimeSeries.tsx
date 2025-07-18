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

import './streamgage.modules.css';

import { type StreamGageData } from '@/utils/data';

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

const COLORS = [
  { borderColor: 'rgb(129,24,204)', backgroundColor: 'rgba(129,24,204,0.5)' },
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

export function StreamGageTimeSeries({ dates, data }: StreamGageTimeSeriesProps) {
  const datasets = React.useMemo(
    () =>
      data.map(({ siteName, values }, index) => ({
        ...(COLORS[index] || {
          borderColor: 'rgb(71,71,71)',
          backgroundColor: 'rgba(71,71,71,0.5)',
        }),
        label: siteName,
        data: values.map(({ value }) => value),
      })),
    [data]
  );
  return (
    <Line
      className="invert-dark"
      data={{
        labels: dates.map((date) => formatDate(date, 'P p')),
        datasets,
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: 'Stream Gage Height',
            color: 'black',
            font: {
              size: 18,
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time',
              color: 'black',
              font: {
                size: 16,
              },
            },
            ticks: {
              autoSkip: true,
              maxTicksLimit: 3,
              color: 'black',
              font: {
                size: 14,
              },
            },
          },
          y: {
            title: {
              display: true,
              text: 'Height (ft.)',
              color: 'black',
              font: {
                size: 16,
              },
            },
            ticks: {
              color: 'black',
              font: {
                size: 14,
              },
            },
          },
        },
      }}
    />
  );
}
