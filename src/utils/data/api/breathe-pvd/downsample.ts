import { closestIndexTo, eachDayOfInterval, eachHourOfInterval } from 'date-fns';

import { groupBy } from '@/utils/fns';
import { BreathePmData } from './pm';

type Interval = 'hour' | 'day';

export function downsamplePmData(data: BreathePmData[], interval: Interval = 'hour') {
  const binIntervals = createDateInterval(
    data.map(({ time }) => time),
    interval
  );

  // TO_REVIEW this also needs to group by sensor
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
    .map(({ date, data }) => computeBinPoint(data, date))
    .flat()
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
function computeBinPoint(data: BreathePmData[], date: Date) {
  const grouped = Object.values(groupBy(data, ({ id }) => id));
  const downsampled = grouped
    .map((val) => val)
    .map((sensor) =>
      // TO_REVIEW this feels... stupid? Is there a way to do basically `...rest` in a reduce?
      sensor.reduce(
        (prev, next) => ({
          pm1: prev.pm1 + next.pm1,
          pm25: prev.pm25 + next.pm25,
          pm10: prev.pm10 + next.pm10,
          windspeed: prev.windspeed + next.windspeed,
          id: next.id,
          latitude: next.latitude,
          longitude: next.longitude,
          sensorName: next.sensorName,
          time: next.time,
        }),
        { pm1: 0, pm25: 0, pm10: 0, windspeed: 0 } as BreathePmData
      )
    )
    .map(({ pm1, pm25, pm10, windspeed, ...rest }) => ({
      pm1: pm1 / data.length,
      pm25: pm25 / data.length,
      pm10: pm10 / data.length,
      windspeed: windspeed / data.length,
      date,
      ...rest,
    }));
  return downsampled.flat();
}
