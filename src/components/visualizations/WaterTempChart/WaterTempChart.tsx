'use client';
'use client';
import React from 'react';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { groupBy } from '@/utils/fns';
import { movingAvg } from '@/utils/data/api/fish/downSample';
import { compareAsc, formatDate } from 'date-fns';
import { Temperature } from '@/types';

ChartJS.register(LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LINE_COLOR_OPTIONS = [
  {
    border: 'rgba(237, 40, 130, 0.2)',
    background: 'rgba(237, 40, 130, 0.2)',
    borderLine: 'rgba(237, 40, 130, 0.8)',
    backgroundLine: 'rgba(237, 40, 130, 0.8)',
  },
  {
    border: 'rgba(121, 225, 100,0.2)',
    background: 'rgba(121, 225, 100, 0.2)',
    borderLine: 'rgba(121, 225, 100, 0.8)',
    backgroundLine: 'rgba(121, 225, 100, 0.8)',
  },
];

export function WaterTempChart({ data }: { data: Temperature[] }) {
  const avgData = movingAvg(data, 5);

  const { dates, datasets } = React.useMemo(() => {
    const sortedData = avgData.sort(({ timestamp: time1 }, { timestamp: time2 }) =>
      compareAsc(time1, time2)
    );
    return {
      dates: Array.from(new Set(sortedData.map(({ timestamp }) => timestamp))),
      datasets: groupBy(sortedData, ({ station }) => `${station}`),
    };
  }, [data]);

  const buoysInPlot = React.useMemo(() => getBuoysFromDatasetList(datasets), [datasets]);

  const lineGroups = React.useMemo(() => {
    const group = Object.entries(datasets);
    return group.map(([key, data]) => {
      const color = getStylesForGroup(buoysInPlot, key);
      console.log(color);
      const dataWithBlanks = Array.from(Array(dates.length), (_, i) => dates[i]).map(
        (date) => data.find(({ timestamp }) => timestamp.valueOf() === date.valueOf())?.avg
      );
      return {
        label: `Moving Average (${key})`,
        type: 'line',
        data: dataWithBlanks,
        borderColor: color.borderLine,
        backgroundColor: color.backgroundLine,
        cubicInterpolationMode: 'monotone',
        pointStyle: 'line',
        radius: 0,
      };
    });
  }, [datasets, buoysInPlot, dates]);
  const scatterGroups = React.useMemo(() => {
    const group = Object.entries(groupBy(avgData, ({ station }) => `${station}`));
    return group.map(([key, data]) => {
      const color = getStylesForGroup(buoysInPlot, key);
      const dataWithBlanks = Array.from(Array(dates.length), (_, i) => dates[i]).map((date) => {
        return {
          x: date,
          y: data.find(({ timestamp }) => timestamp.valueOf() === date.valueOf())?.delta,
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
  }, [avgData]);

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
