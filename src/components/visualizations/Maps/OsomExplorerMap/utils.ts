import { format } from 'date-fns';
import { UTCDate } from '@date-fns/utc';

import { TILE_URL_TEMPLATE, TIMEPOINTS_HURRICANE_IRENE, TIMEPOINTS_MONTHLY_AVG } from './constants';
import { OsomExplorerVariable, OsomExplorerDataset } from '@/types';

export function getRasterUrl(
  dataset: OsomExplorerDataset,
  timepoint: number,
  variable: OsomExplorerVariable
) {
  const timepoints =
    dataset === 'monthly_avg' ? TIMEPOINTS_MONTHLY_AVG : TIMEPOINTS_HURRICANE_IRENE;
  const urlTemplate = TILE_URL_TEMPLATE;
  const boundedTimepoint =
    timepoint < 0 ? 0 : timepoint >= timepoints.length ? timepoints.length - 1 : timepoint;
  return urlTemplate
    .replace('<DATASET>', dataset)
    .replace('<TIMEPOINT>', timepoints[boundedTimepoint])
    .replace('<VARIABLE>', variable);
}

export function formatTimepointString(timepoint: string, dataset: OsomExplorerDataset): string {
  if (dataset === 'monthly_avg') {
    return format(new UTCDate(timepoint), 'MMMM yyyy');
  }
  if (dataset === 'hurricane_irene') {
    const [year, month, day, hours, minutes] = timepoint.split('-');
    return format(new Date(`${year}-${month}-${day}T${hours}:${minutes}`), 'yyyy-MM-dd HH:mm');
  }
  return timepoint;
}

export function updateUrlParams(
  dataset: OsomExplorerDataset,
  variable: OsomExplorerVariable,
  timepoint: number
) {
  const url = new URL(window.location.href);
  url.searchParams.set('dataset', dataset);
  url.searchParams.set('var', variable);
  url.searchParams.set('index', timepoint.toString());
  window.history.replaceState({}, '', url);
}
