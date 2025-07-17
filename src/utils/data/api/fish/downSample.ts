import { groupBy } from '@/utils/fns';

import { Temperature } from '@/types';

export function movingAvg(mArray: Temperature[], k: number) {
  const grouped = groupBy(
    mArray.map((temp) => ({ ...temp, avg: temp.delta })),
    ({ station }) => station
  );
  const entries = Object.entries(grouped).map(([stationName, data]) => [
    stationName,
    average(data, k),
  ]);

  return Object.fromEntries(entries);
}

function average(mArray: Temperature[], k: number) {
  // first item is just the same as the first item in the input
  const emaArray = [{ ...mArray[0], avg: mArray[0].delta }];
  // for the rest of the items, they are computed with the previous one
  for (let i = 1; i < mArray.length; i++) {
    emaArray.push({ ...mArray[i], avg: mArray[i].delta * k + emaArray[i - 1].avg * (1 - k) });
  }
  return emaArray;
}
