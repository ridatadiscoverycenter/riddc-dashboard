'use client';
import React from 'react';
import { compareAsc, formatDate } from 'date-fns';
import { Line } from 'react-chartjs-2';
import {
  BarController,
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  BarElement,
  Legend,
  TimeScale,
} from 'chart.js';

import { groupBy } from '@/utils/fns';
import { variableToLabel } from '@/utils/data/shared/variableConverter';
import { Dataset } from '@/utils/data/api/buoy/types';

ChartJS.register(
  BarController,
  TimeScale,
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

const SUPPLEMENTAL_LINE_COLOR_OPTIONS = [
  { border: 'rgba(128, 11, 64, 0.7)', background: 'rgba(128, 11, 64, 0.2)' },
  { border: 'rgba(45, 136, 26, 0.7)', background: 'rgba(45, 136, 26, 0.2)' },
  { border: 'rgba(17, 117, 164, 0.7)', background: 'rgba(17, 117, 164, 0.2)' },
  { border: 'rgba(77, 144, 15, 0.7)', background: 'rgba(77, 144, 15, 0.2)' },
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
  supplementalData: BuoyDataAbstract[];
  dataset: Dataset;
};

function formatDatasets(data: BuoyDataAbstract[]) {
  const sortedData = data.sort(({ time: time1 }, { time: time2 }) => compareAsc(time1, time2));
  return {
    dates: Array.from(new Set(sortedData.map(({ time }) => time.valueOf()))).map(
      (dateValue) => new Date(dateValue)
    ),
    datasets: groupBy(sortedData, ({ variable, stationName }) => `${stationName}~${variable}`),
  };
}

function generateDataGroups(
  datasets: ReturnType<typeof formatDatasets>['datasets'],
  buoys: string[],
  vars: string[],
  dates: Date[],
  dataset: Dataset,
  supplemental: boolean
) {
  const groups = Object.entries(datasets);
  return groups.map(([key, data]) => {
    const { color, dash } = getStylesForGroup(
      vars,
      buoys,
      key as `${string}~${string}`,
      supplemental
    );
    const dataWithBlanks = Array.from(Array(dates.length), (_, i) => dates[i]).map(
      (date) => data.find(({ time }) => time.valueOf() === date.valueOf())?.value
    );
    const [stationName, variable] = key.split('~');
    const supplementalLabel = supplemental ? (dataset === 'osom' ? ' (Observed)' : ' (OSOM)') : '';
    return {
      label: `${stationName} ~ ${variableToLabel(variable, dataset)}${supplementalLabel}`,
      data: dataWithBlanks,
      borderColor: color.border,
      backgroundColor: color.background,
      cubicInterpolationMode: 'monotone',
      borderDash: dash,
      pointStyle: false,
    };
  });
}

export function BuoyVariables({ data, supplementalData, dataset }: BuoyVariablesProps) {
  const [displaySupplemental, setDisplaySupplemental] = React.useState(true);
  const { dates, datasets } = React.useMemo(() => formatDatasets(data), [data]);
  const { dates: supplementalDates, datasets: supplementalDatasets } = React.useMemo(
    () => formatDatasets(supplementalData),
    [supplementalData]
  );

  const joinedDates = React.useMemo(
    () =>
      Array.from(
        new Set(
          dates
            .map((date) => date.valueOf())
            .concat(supplementalDates.map((date) => date.valueOf()))
        )
      )
        .sort((valueA, valueB) => valueA - valueB)
        .map((value) => new Date(value)),
    [dates, supplementalDates]
  );

  const buoysInPlot = React.useMemo(() => getBuoysFromDatasetList(datasets), [datasets]);
  const varsInPlot = React.useMemo(() => getVariablesFromDatasetList(datasets), [datasets]);

  const dataGroups = React.useMemo(
    () => generateDataGroups(datasets, buoysInPlot, varsInPlot, joinedDates, dataset, false),
    [datasets, buoysInPlot, varsInPlot, joinedDates, dataset]
  );
  const supplementalDataGroups = React.useMemo(
    () =>
      generateDataGroups(supplementalDatasets, buoysInPlot, varsInPlot, joinedDates, dataset, true),
    [supplementalDatasets, buoysInPlot, varsInPlot, joinedDates, dataset]
  );

  /*
  const dataGroups = React.useMemo(() => {
    const group = Object.entries(datasets);
    return group.map(([key, data]) => {
      const { color, dash } = getStylesForGroup(
        varsInPlot,
        buoysInPlot,
        key as `${string}~${string}`,
        false
      );
      const dataWithBlanks = Array.from(Array(joinedDates.length), (_, i) => joinedDates[i]).map(
        (date) => data.find(({ time }) => time.valueOf() === date.valueOf())?.value
      );
      const [stationName, variable] = key.split('~');
      return {
        label: `${stationName} ~ ${variableToLabel(variable, dataset)}`,
        data: dataWithBlanks,
        borderColor: color.border,
        backgroundColor: color.background,
        cubicInterpolationMode: 'monotone',
        borderDash: dash,
        pointStyle: false,
      };
    });
  }, [datasets, varsInPlot, buoysInPlot, joinedDates, dataset]);
*/

  return (
    <div className="h-80 w-full">
      <button onClick={() => setDisplaySupplemental((c) => !c)}>view supplemental data</button>
      <Line
        data={{
          labels: dates.map((date) => formatDate(date, 'P')),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          datasets: dataGroups.concat(displaySupplemental ? supplementalDataGroups : []) as any,
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
  key: `${string}~${string}`,
  supplemental: boolean
) {
  const [stationNameInKey, variableInKey] = key.split('~');
  const stationNameIndex = stationNames.findIndex((name) => name === (stationNameInKey || ''));
  const variableIndex = variables.findIndex((variable) => variable === (variableInKey || ''));
  return {
    color:
      stationNameIndex < 0 ||
      stationNameIndex >=
        (supplemental ? SUPPLEMENTAL_LINE_COLOR_OPTIONS : LINE_COLOR_OPTIONS).length
        ? { border: 'rgba(0, 0, 0, 0.5)', background: 'rgba(0, 0, 0, 0.2)' }
        : (supplemental ? SUPPLEMENTAL_LINE_COLOR_OPTIONS : LINE_COLOR_OPTIONS)[stationNameIndex],
    dash:
      variableIndex < 0 || variableIndex >= LINE_DASH_OPTIONS.length
        ? []
        : LINE_DASH_OPTIONS[variableIndex],
  };
}
