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
  Legend,
  TimeScale,
} from 'chart.js';

import { BreatheSensorData } from '@/utils/data/api/breathe-pvd';
import { useColorMode } from '@/hooks/useColorMode';
import { groupBy } from '@/utils/fns';

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

type BreatheTimeSeriesProps = {
  dates: Date[];
  data: BreatheSensorData[];
  names: string[];
  variable: string;
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

export function BreatheTimeSeries({ dates, data, names, variable }: BreatheTimeSeriesProps) {
  const colorMode = useColorMode();
  const chartColors = React.useMemo(
    () => (colorMode === 'light' ? CHART_COLORS.light : CHART_COLORS.dark),
    [colorMode]
  );

  const { datasets } = React.useMemo(() => {
    return {
      datasets: groupBy(data, ({ sensorName }) => sensorName),
    };
  }, [data]);

  const dataGroups = React.useMemo(() => {
    const group = Object.entries(datasets);
    return group.map(([key, data]) => {
      const color = LINE_COLORS[names.findIndex((name) => name === (key || ''))] || {
        borderColor: 'rgb(71,71,71)',
        backgroundColor: 'rgba(71,71,71,0.5)',
      };
      const dataArray = Array.from(
        data.filter((d) => d[variable] !== null).map((d) => d[variable])
      );

      return {
        label: key,
        data: dataArray,
        borderColor: color.borderColor,
        backgroundColor: color.backgroundColor,
        borderWidth: 2,
        cubicInterpolationMode: 'monotone',
        pointStyle: 'line',
        radius: 0,
      };
    });
  }, [names, datasets, dates, variable]);
  return (
    <Line
      // @ts-expect-error cubicInterpolationMode gives a ts check error here even when correct
      data={{ labels: dates.map((date) => date.toLocaleDateString()), datasets: dataGroups }}
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
            text: 'Concentration',
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
              text: variable,
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
