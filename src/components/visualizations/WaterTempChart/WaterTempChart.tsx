'use client';
'use client';
import React from 'react';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  ScatterController,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { formatDate } from 'date-fns';
import { movingAvg } from '@/utils/data/api/fish/downSample';
import { type Temperature, AverageTemperature } from '@/types';

ChartJS.register(LinearScale, PointElement, LineElement, ScatterController, Title, Tooltip, Legend);

const LINE_COLOR_OPTIONS = [
  {
    border: 'rgba(237, 40, 130, 0.2)',
    background: 'rgba(237, 40, 130, 0.2)',
    borderLine: 'rgba(237, 40, 130, 0.8)',
    backgroundLine: 'rgba(237, 40, 130, 0.8)',
  },
  {
    border: 'rgba(72, 173, 105, 0.2)',
    background: 'rgba(72, 173, 105, 0.2)',
    borderLine: 'rgba(72, 173, 105, 1.0)',
    backgroundLine: 'rgba(72, 173, 105, 1.0)',
  },
];

export function WaterTempChart({ data }: { data: Temperature[] }) {
  const avgData = movingAvg(data, 0.3);

  const { dates, datasets } = React.useMemo(() => {
    return {
      dates: Array.from(
        new Set(
          avgData[Object.keys(avgData)[0]].map(({ timestamp }: { timestamp: Date }) => timestamp)
        )
      ) as Date[],
      datasets: avgData as Record<string, AverageTemperature[]>,
    };
  }, [avgData]);

  const buoysInPlot = React.useMemo(() => getBuoysFromDatasetList(datasets), [datasets]);

  const lineGroups = React.useMemo(() => {
    const group = Object.entries(datasets);
    return group.map(([key, data]) => {
      const color = getStylesForGroup(buoysInPlot, key);
      const dataWithBlanks = Array.from(Array(dates.length), (_, i) => dates[i]).map(
        (date) => data.find(({ timestamp }) => timestamp.valueOf() === date.valueOf())?.avg
      );
      return {
        label: `Moving Average (${key})`,
        type: 'line',
        data: dataWithBlanks,
        borderColor: color.borderLine,
        backgroundColor: color.backgroundLine,
        borderWidth: 2,
        cubicInterpolationMode: 'monotone',
        pointStyle: 'line',
        radius: 0,
      };
    });
  }, [datasets, buoysInPlot, dates]);
  const scatterGroups = React.useMemo(() => {
    const group = Object.entries(datasets);
    return group.map(([key]) => {
      const color = getStylesForGroup(buoysInPlot, key);
      const dataWithBlanks = Array.from(Array(dates.length), (_, i) => dates[i]).map((date) => {
        return {
          x: date,
          y: avgData[key].find(
            ({ timestamp }: { timestamp: Date }) => timestamp.valueOf() === date.valueOf()
          )?.delta,
          legend: false,
        };
      });
      return {
        label: `${key}`,
        type: 'scatter',
        data: dataWithBlanks,
        backgroundColor: color.background,
        borderColor: color.border,
        pointStyle: true,
        options: { plugins: { legend: { usePointStyle: true }, tooltip: { intersect: false } } },
      };
    });
  }, [avgData, buoysInPlot, dates, datasets]);

  return (
    <div className="h-80 w-full">
      <Line
        data={{
          labels: dates.map((date) => formatDate(date, 'yyyy')),
          datasets: [...lineGroups, ...scatterGroups] as any,
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { labels: { usePointStyle: true } } },
          scales: { y: { title: { display: true, text: '∆ °C from Seasonal Average' } } },
        }}
      />
    </div>
  );
}

function getBuoysFromDatasetList(datasets: Record<string | number, Temperature[]>) {
  const stations = Object.keys(datasets).map((key) => key.split('~')[0]);
  return stations;
}

function getStylesForGroup(stationNames: string[], key: string) {
  const stationNameIndex = stationNames.findIndex((name) => name === (key || ''));
  return stationNameIndex < 0 || stationNameIndex >= LINE_COLOR_OPTIONS.length
    ? {
        border: 'rgba(0, 0, 0, 0.5)',
        background: 'rgba(0, 0, 0, 0.5)',
        borderLine: 'rgba(0, 0, 0, 0.5)',
        backgroundLine: 'rgba(0, 0, 0, 0.5)',
      }
    : LINE_COLOR_OPTIONS[stationNameIndex];
}
