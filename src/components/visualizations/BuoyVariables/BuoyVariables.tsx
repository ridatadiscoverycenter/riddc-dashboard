'use client';
import React from 'react';
import { compareAsc, formatDate } from 'date-fns';
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

import { groupBy } from '@/utils/fns';

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

const LINE_DASH_OPTIONS = [[], [1, 2], [2, 2], [4, 1]];

const LINE_COLOR_OPTIONS = [
  { border: 'rgba(237, 40, 130, 0.7)', background: 'rgba(237, 40, 130, 0.2)' },
  { border: 'rgba(121, 225, 100,0.7)', background: 'rgba(121, 225, 100, 0.2)' },
  { border: 'rgba(121, 203, 241, 0.7)', background: 'rgba(121, 203, 241, 0.2)' },
  { border: 'rgba(156, 237, 80, 0.7)', background: 'rgba(156, 237, 80, 0.2)' },
];

type BuoyDataAbstract = {
  value: number | undefined;
  stationName: string;
  time: Date;
  units: string;
  variable: string;
};

type BuoyVariablesProps = {
  data: BuoyDataAbstract[];
};

export function BuoyVariables({ data }: BuoyVariablesProps) {
  const { dates, datasets } = React.useMemo(() => {
    const sortedData = data.sort(({ time: time1 }, { time: time2 }) => compareAsc(time1, time2));
    return {
      dates: Array.from(new Set(sortedData.map(({ time }) => time.valueOf()))).map(
        (dateValue) => new Date(dateValue)
      ),
      datasets: groupBy(sortedData, ({ variable, stationName }) => `${stationName}~${variable}`),
    };
  }, [data]);

  const buoysInPlot = React.useMemo(() => getBuoysFromDatasetList(datasets), [datasets]);
  const varsInPlot = React.useMemo(() => getVariablesFromDatasetList(datasets), [datasets]);

  const dataGroups = React.useMemo(() => {
    const group = Object.entries(datasets);
    return group.map(([key, data]) => {
      const { color, dash } = getStylesForGroup(
        varsInPlot,
        buoysInPlot,
        key as `${string}~${string}`
      );
      const dataWithBlanks = Array.from(Array(dates.length), (_, i) => dates[i]).map(
        (date) => data.find(({ time }) => time.valueOf() === date.valueOf())?.value
      );
      return {
        label: key,
        data: dataWithBlanks,
        borderColor: color.border,
        backgroundColor: color.background,
        cubicInterpolationMode: 'monotone',
        borderDash: dash,
        pointStyle: false,
      };
    });
  }, [datasets, varsInPlot, buoysInPlot, dates]);

  return (
    <div className="h-80 w-full">
      <Line
        data={{
          labels: dates.map((date) => formatDate(date, 'P')),
          datasets: dataGroups as any,
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
}

function getBuoysFromDatasetList(datasets: Record<string | number, BuoyDataAbstract[]>) {
  const stationNames = Object.keys(datasets).map((key) => key.split('~')[0]);
  return stationNames;
}

function getVariablesFromDatasetList(datasets: Record<string | number, BuoyDataAbstract[]>) {
  const variables = Object.keys(datasets).map((key) => key.split('~')[1]);
  return variables;
}

function getStylesForGroup(
  variables: string[],
  stationNames: string[],
  key: `${string}~${string}`
) {
  const [stationNameInKey, variableInKey] = key.split('~');
  const stationNameIndex = stationNames.findIndex((name) => name === (stationNameInKey || ''));
  const variableIndex = variables.findIndex((variable) => variable === (variableInKey || ''));
  return {
    color:
      stationNameIndex < 0 || stationNameIndex >= LINE_COLOR_OPTIONS.length
        ? { border: 'rgba(0, 0, 0, 0.5)', background: 'rgba(0, 0, 0, 0.2)' }
        : LINE_COLOR_OPTIONS[stationNameIndex],
    dash:
      variableIndex < 0 || variableIndex >= LINE_DASH_OPTIONS.length
        ? []
        : LINE_DASH_OPTIONS[variableIndex],
  };
}
