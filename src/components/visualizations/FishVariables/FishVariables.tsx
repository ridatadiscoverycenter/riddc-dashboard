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
import { getTitleFromSpecies } from '@/utils/data/shared';

ChartJS.register(LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LINE_DASH_OPTIONS = [[], [4, 3], [3, 1]];

const LINE_COLOR_OPTIONS = [
  { border: 'rgba(237, 40, 130, 0.7)', background: 'rgba(237, 40, 130, 0.2)' },
  { border: 'rgba(72, 173, 105, 1.0)', background: 'rgba(72, 173, 105, 1.0)' },
];

type FishDataAbstract = {
  station: string;
  year: number;
  species: string;
  abun: number;
};

type FishDataProps = {
  data: FishDataAbstract[];
};

export function FishVariables({ data }: FishDataProps) {
  const { dates, datasets } = React.useMemo(() => {
    return {
      dates: Array.from(new Set(data.map(({ year }) => year))),
      datasets: groupBy(data, ({ species, station }) => `${station}~${species}`),
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
        (date) => data.find(({ year }) => year === date)?.abun
      );
      return {
        label: `${getTitleFromSpecies(key.split('~')[1])} at ${key.split('~')[0]}`,
        data: dataWithBlanks,
        borderColor: color.border,
        backgroundColor: color.background,
        borderWidth: 2,
        cubicInterpolationMode: 'monotone',
        borderDash: dash,
        pointStyle: 'line',
        radius: 0,
      };
    });
  }, [datasets, varsInPlot, buoysInPlot, dates]);

  return (
    <div className="h-80 w-full">
      <Line
        // @ts-expect-error cubicInterpolationMode gives a ts check error here even when correct
        data={{ labels: dates, datasets: dataGroups }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { labels: { boxHeight: 0.3 } }, tooltip: { intersect: false } },
        }}
      />
    </div>
  );
}

function getBuoysFromDatasetList(datasets: Record<string | number, FishDataAbstract[]>) {
  const stations = Object.keys(datasets).map((key) => key.split('~')[0]);
  return stations;
}

function getVariablesFromDatasetList(datasets: Record<string | number, FishDataAbstract[]>) {
  const species = Object.keys(datasets).map((key) => key.split('~')[1]);
  return species;
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
