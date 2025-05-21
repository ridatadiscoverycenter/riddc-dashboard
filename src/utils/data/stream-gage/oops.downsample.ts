import { StreamGageData } from './fetchStreamGageData';

/**
 * Implementation of the "Largest Triangle Three Buckets" algorithm to downsample stream gage data.
 * https://skemman.is/handle/1946/15343
 * https://skemman.is/bitstream/1946/15343/3/SS_MSthesis.pdf
 * @param data Fetched Stream Gage Data
 * @param interval Time interval for buckets in milliseconds
 * @param timestamp The method by which downsampled datapoints are timestamped.
 */
export function downsampleStreamGageData(
  data: StreamGageData[],
  interval: number,
  timestamp: DownsampleTimestampOptions
) {
  return data.map((buoy) => ({
    ...buoy,
    values: reduceBuckets(
      downsampleBuckets(separateDataIntoBuckets(buoy.values, interval)),
      timestamp
    ),
  }));
}

type TimeSeriesData = StreamGageData['values'];
type TimeSeriesDataPoint = TimeSeriesData[number];
type Bucket = { raw: TimeSeriesData; average: TimeSeriesDataPoint };
type DownsampledBucket = Bucket & { sample: TimeSeriesDataPoint };
type DownsampleTimestampOptions = 'first-point' | 'average' | 'selected';

/**
 * Takes time series data and divides it into buckets, each bucket lasting {interval} miliseconds.
 * The first and last buckets contain only one point, as per the LTTB Algorithm Definition.
 * @param data Raw data for each stream gage
 * @param interval Interval in milliseconds that make up each bucket.
 */
function separateDataIntoBuckets(data: TimeSeriesData, interval: number): Bucket[] {
  if (data.length < 2) return [];
  const firstBucket: Bucket = { raw: [data[0]], average: computeAverageForBucket([data[0]]) };
  const lastBucket: Bucket = {
    raw: [data[data.length - 1]],
    average: computeAverageForBucket([data[data.length - 1]]),
  };

  const buckets = [firstBucket];

  let timeCounter: number | undefined = undefined;
  let pointsForBucket: TimeSeriesData = [];
  for (let i = 1; i < data.length - 1; i += 1) {
    const dataPoint = data[i];

    if (timeCounter === undefined) timeCounter = dataPoint.dateTime.valueOf();

    if (dataPoint.dateTime.valueOf() - timeCounter > interval) {
      buckets.push({
        raw: [...pointsForBucket],
        average: computeAverageForBucket([...pointsForBucket]),
      });
      pointsForBucket = [];
    }
    pointsForBucket.push(dataPoint);
  }

  if (pointsForBucket.length > 0) {
    buckets.push({
      raw: [...pointsForBucket],
      average: computeAverageForBucket([...pointsForBucket]),
    });
  }
  buckets.push(lastBucket);
  return buckets;
}

/**
 * Using the data assigned to each bucket, determine the average point for each bucket.
 * @param dataInBucket The data collected for the bucket in the specific time interval.
 */
function computeAverageForBucket(dataInBucket: TimeSeriesData): TimeSeriesDataPoint {
  const values = dataInBucket.map(({ value }) => value);
  const dateTimes = dataInBucket.map(({ dateTime }) => dateTime.valueOf());
  return {
    value: values.reduce((v1, v2) => v1 + v2, 0) / values.length,
    dateTime: new Date(Math.floor(dateTimes.reduce((d1, d2) => d1 + d2, 0) / dateTimes.length)),
  };
}

/**
 * Computes the area of the "triangle" defined by the value from the previous bucket, a selected point from the center bucket, and the average in the right bucket.
 * Used to select the most impactful point in each bucket.
 *
 * Determines the length of each triangle side and computes the area using Heron's Formula: https://en.wikipedia.org/wiki/Heron%27s_formula
 * @param left Point select from previous bucket.
 * @param center Selected point from current bucket.
 * @param right Average point from subsequent bucket.
 */
function computeTriangleArea(
  left: TimeSeriesDataPoint,
  center: TimeSeriesDataPoint,
  right: TimeSeriesDataPoint
): number {
  const sideLeftCenter = triangleSideLength(left, center);
  const sideCenterRight = triangleSideLength(center, right);
  const sideRightLeft = triangleSideLength(right, left);
  const semiperimeter = (sideLeftCenter + sideCenterRight + sideRightLeft) / 2;
  return Math.sqrt(
    semiperimeter *
      (semiperimeter - sideLeftCenter) *
      (semiperimeter - sideCenterRight) *
      (semiperimeter - sideRightLeft)
  );
}

function triangleSideLength(one: TimeSeriesDataPoint, two: TimeSeriesDataPoint) {
  const valueDiff = Math.abs(one.value - two.value);
  const timeDiff = Math.abs(one.dateTime.valueOf() - two.dateTime.valueOf());
  return Math.sqrt(Math.pow(valueDiff, 2) + Math.pow(timeDiff, 2));
}
/**
 * Selects the most impactful point in each bucket by computing relative ranks.
 * @param left Point select from previous bucket.
 * @param bucket Current bucket being compared against.
 * @param right Average point from subsequent bucket.
 */
function selectDownsamplePoint(
  left: TimeSeriesDataPoint,
  bucket: Bucket,
  right: TimeSeriesDataPoint
): TimeSeriesDataPoint {
  const pointsSortedByArea = bucket.raw
    .map((point) => ({ ...point, area: computeTriangleArea(left, point, right) }))
    .sort((point1, point2) => point2.area - point1.area);
  const selectedPoint = pointsSortedByArea[0];
  return { value: selectedPoint.value, dateTime: selectedPoint.dateTime };
}

/**
 * Finds the most impactful point in each bucket for a set of sequential buckets.
 * @param buckets
 */
function downsampleBuckets(buckets: Bucket[]): DownsampledBucket[] {
  if (buckets.length < 1) return [];
  const downsampledBuckets: DownsampledBucket[] = [];
  downsampledBuckets.push({ ...buckets[0], sample: buckets[0].average });
  for (let i = 1; i < buckets.length - 1; i += 1) {
    const previousBucket = buckets[i - 1];
    const currentBucket = buckets[i];
    const nextBucket = buckets[i + 1];

    const sample = selectDownsamplePoint(previousBucket.average, currentBucket, nextBucket.average);
    downsampledBuckets.push({ ...currentBucket, sample: sample });
  }
  downsampledBuckets.push({
    ...buckets[buckets.length - 1],
    sample: buckets[buckets.length - 1].average,
  });
  return downsampledBuckets;
}

/**
 * Extracts selected points from each bucket into a single array of time series data.
 * @param buckets
 */
function reduceBuckets(
  buckets: DownsampledBucket[],
  timestamp: DownsampleTimestampOptions
): TimeSeriesData {
  return buckets.map((bucket) => ({
    value: bucket.sample.value,
    dateTime:
      timestamp === 'first-point'
        ? bucket.raw[0].dateTime
        : timestamp === 'average'
          ? bucket.average.dateTime
          : bucket.sample.dateTime,
  }));
}
