import { closestIndexTo, compareAsc, eachDayOfInterval, eachHourOfInterval } from 'date-fns';

import { groupBy } from '@/utils/fns';
import { BreathePmData } from './pm';

// import { StreamGageData } from './fetchStreamGageData';

// type TimeSeriesData = StreamGageData['values'];
// type TimeSeriesDataPoint = TimeSeriesData[number];
type Interval = 'hour' | 'day';

export function downsamplePmData(data: BreathePmData[], interval: Interval = 'hour') {
  const binIntervals = createDateInterval(
    data.map(({ time }) => time),
    interval
  );

  return (
    Object.entries(groupBy(data, (d) => closestIndexTo(d.time, binIntervals) || -1))
      .map(([dateIndexString, data]) => {
        const dateIndex = Number(dateIndexString);
        if (isNaN(dateIndex) || dateIndex === -1) return undefined;
        return {
          date: binIntervals[dateIndex],
          data,
        };
      })
      .filter((entry) => entry !== undefined)
      .map(({ date, data }) => computeBinPoint(data))
      // .sort((a, b) => compareAsc(a.time, b.time))
      .flat()
  );
  // Object.entries(groupBy(d, (dataPoint) => closestIndexTo(dataPoint.dateTime, binIntervals)))

  //   return data
  //     .filter(({ values }) => values.length > 0)
  //     .map((bouy) => ({
  //       ...bouy,
  //       values: Object.entries(
  //         // Group data based on proximity to each time interval entry
  //         groupBy(
  //           // USGS States that values of -9999 indicate that no data was reported by the Stream Gage at this time point.
  //           bouy.values.filter(({ value }) => value > -9990),
  //           (dataPoint: TimeSeriesDataPoint) => closestIndexTo(dataPoint.dateTime, binIntervals) || -1
  //         )

  //         // Attach a date to each of the data subsets.
  //       )
  //         .map(([dateIndexString, data]) => {
  //           // Object.entries parses Record keys as strings, despite them being
  //           // set as numberes in the callback passed to groupBy. Checking isNaN
  //           // guards against invalid inputs.
  //           const dateIndex = Number(dateIndexString);
  //           if (isNaN(dateIndex) || dateIndex === -1) return undefined;
  //           return {
  //             date: binIntervals[dateIndex],
  //             data,
  //           };
  //           // Filter undefined entries (a consequence of chaining groupBy into entries)
  //         })
  //         .filter((entry) => entry !== undefined)
  //         .map(({ date, data }) => ({ dateTime: date, value: computeBinPoint(data) }))
  //         .sort((a, b) => compareAsc(a.dateTime, b.dateTime)),
  //     }));
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
