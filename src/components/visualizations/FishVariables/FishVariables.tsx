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
  TimeScale,
} from 'chart.js';

import { groupBy } from '@/utils/fns';

ChartJS.register(
  //   TimeScale,
  //   CategoryScale,
  //   BarElement,
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
];

type FishDataAbstract = {
  value: number | undefined;
  station: string;
  year: string;
  variable: string;
};

type FishDataProps = {
  data: FishDataAbstract[];
};

export function FishVariables({ data }: FishDataProps) {
  const { dates, datasets } = React.useMemo(() => {
    return {
      dates: Array.from(new Set(data.map(({ year }) => year))),
      datasets: groupBy(data, ({ variable, station }) => `${station}~${variable}`),
    };
  }, []);
  console.log(dates, datasets);

  return (
    <div className="h-80 w-full">
      <Line
        data={{
          labels: dates.map((date) => formatDate(date, 'P')),
          datasets: datasets as any,
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
}
