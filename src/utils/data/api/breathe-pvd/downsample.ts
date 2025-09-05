import { closestIndexTo, eachDayOfInterval, eachHourOfInterval } from 'date-fns';

import { groupBy } from '@/utils/fns';
import { BreathePmData } from './pm';

type Interval = 'hour' | 'day';

export function downsamplePmData(data: BreathePmData[], interval: Interval = 'hour') {
  const binIntervals = createDateInterval(
    data.map(({ time }) => time),
    interval
  );

  return Object.entries(groupBy(data, (d) => closestIndexTo(d.time, binIntervals) || -1))
    .map(([dateIndexString, data]) => {
      const dateIndex = Number(dateIndexString);
      if (isNaN(dateIndex) || dateIndex === -1) return undefined;
      return {
        date: binIntervals[dateIndex],
        data,
      };
    })
    .filter((entry) => entry !== undefined)
    .map(({ data }) => computeBinPoint(data))
    .flat();
}

function createDateInterval(allDates: Date[], interval: Interval) {
  const datesAsValues = allDates.map((date) => date.valueOf());
  return (interval === 'hour' ? eachHourOfInterval : eachDayOfInterval)({
    start: Math.min(...datesAsValues),
    end: Math.max(...datesAsValues),
  }) as Date[];
}

/**
 * Average, just for now.
 * @param data
 * @returns
 */
function computeBinPoint(data: BreathePmData[]) {
  return data.filter((f, i) => i === 0);
}
