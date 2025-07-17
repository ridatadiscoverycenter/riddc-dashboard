import { groupBy } from '@/utils/fns';

import { Temperature } from '@/types';

export function movingAvg(mArray: Temperature[], mRange: number) {
  const k = 2 / (mRange + 1);

  // group by location and add avg field
  const grouped = groupBy(
    mArray.map((temp) => ({ ...temp, avg: temp.delta })),
    ({ station }) => station
  );

  // get exponential moving average
  // see https://stackoverflow.com/questions/40057020/calculating-exponential-moving-average-ema-using-javascript/40057355#40057355
  for (const group of Object.keys(grouped)) {
    for (let i = 1; i < grouped[group].length; i++) {
      grouped[group][i].avg = grouped[group][i].delta * k + grouped[group][i - 1].avg * (1 - k)
  }}

  return grouped;
}
