import { closestIndexTo, compareAsc, eachDayOfInterval, eachHourOfInterval } from 'date-fns';

import { groupBy } from '@/utils/fns';

import { StreamGageData } from './fetchStreamGageData';

type TimeSeriesData = StreamGageData['values'];
type TimeSeriesDataPoint = TimeSeriesData[number];
type Interval = 'hour' | 'day';

export function downsampleStreamGageData(data: StreamGageData[], interval: Interval = 'hour') {
  const binIntervals = createDateInterval(
    data
      .map(({ values }) => values.map(({ dateTime }) => dateTime))
      .flat()
      .flat(),
    interval
  );
  return data
    .filter(({ values }) => values.length > 0)
    .map((bouy) => ({
      ...bouy,
      values: Object.entries(
        // Group data based on proximity to each time interval entry
        groupBy(
          bouy.values,
          (dataPoint: TimeSeriesDataPoint) => closestIndexTo(dataPoint.dateTime, binIntervals) || -1
        )

        // Attach a date to each of the data subsets.
      )
        .map(([dateIndexString, data]) => {
          // Object.entries parses Record keys as strings, despite them being
          // set as numberes in the callback passed to groupBy. Checking isNaN
          // guards against invalid inputs.
          const dateIndex = Number(dateIndexString);
          if (isNaN(dateIndex) || dateIndex === -1) return undefined;
          return {
            date: binIntervals[dateIndex],
            data,
          };
          // Filter undefined entries (a consequence of chaining groupBy into entries)
        })
        .filter((entry) => entry !== undefined)
        .map(({ date, data }) => ({ dateTime: date, value: computeBinPoint(data) }))
        .sort((a, b) => compareAsc(a.dateTime, b.dateTime)),
    }));
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
function computeBinPoint(data: TimeSeriesData) {
  return data.map(({ value }) => value).reduce((a, b) => a + b, 0) / data.length;
}
