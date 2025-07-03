import { groupBy } from '@/utils/fns';

import { Temperature } from '@/types';

// type TimeSeriesData = Temperature['delta'];

// function formatData(data: Temperature[]){
//     return data.map((v) => {
//         const {station} = v

//     })
// }

// export function downsampleWaterTemp(data: Temperature[]) {
//     return data.map({v} => )
// }

// export function movingAvg(data: Temperature[], interval: number){
//   let index = interval - 1;
//   const length = data.length + 1;
//   let results = [];

//   while (index < length) {
//     index = index + 1;
//     const intervalSlice = data.slice(index - interval, index);
//     const sum = intervalSlice.reduce((prev, curr) => prev + curr.delta, 0);
//     results.push(sum / interval);
//   }
//   console.log(results.length)
//   console.log(data.length)
//   return results;
//     }

export function movingAvg(mArray, mRange) {
  const k = 2 / (mRange + 1);
  // first item is just the same as the first item in the input
  const emaArray = [mArray[0].delta];
  // for the rest of the items, they are computed with the previous one
  for (let i = 1; i < mArray.length; i++) {
    emaArray.push(mArray[i].delta * k + emaArray[i - 1] * (1 - k));
  }
  console.log(mArray.length, emaArray.length);
  return emaArray;
}
