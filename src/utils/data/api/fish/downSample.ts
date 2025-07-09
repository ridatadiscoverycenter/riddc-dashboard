import { groupBy } from '@/utils/fns';

import { Temperature } from '@/types';

export function movingAvg(mArray: Temperature[], mRange: number) {
  const k = 2 / (mRange + 1);

  const grouped = groupBy(
    mArray.map((temp) => ({ ...temp, avg: temp.delta })),
    ({ station }) => station
  );
  const emaArray = Object.assign(
    {},
    ...Object.keys(grouped).map((group) => ({ [group]: [grouped[group][0]] }))
  );

  for (const group of Object.keys(grouped)) {
    for (let i = 1; i < grouped[group].length; i++) {
      emaArray[group].push({
        ...grouped[group][i],
        avg: grouped[group][i].delta * k + emaArray[group][i - 1].avg * (1 - k),
      });
    }
  }

  return emaArray;
}
