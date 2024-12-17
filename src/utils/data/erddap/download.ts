import {
  CONFIG,
  VARIABLE_CONVERTER,
  type RiBuoyViewerVariable,
} from '@/utils/data/api/buoy';

const BASE_URL = 'https://pricaimcit.services.brown.edu/erddap/tabledap';

export const DATA_FORMATS = [
  'htmlTable',
  'csv',
  'nc',
  'geoJson',
  'mat',
  'xhtml',
  'graph',
  'tsv',
  'html',
  'dataTable',
] as const;

export type DF = (typeof DATA_FORMATS)[number];

export function createDownloadUrl(datasetId: string, fileFormat: DF, params = '') {
  return `${BASE_URL}/${datasetId}.${fileFormat}${params && `?${params}`}`;
}

type StartAndOrEndDate =
  | { start: Date; end: Date }
  | { start: Date; end?: Date }
  | { start?: Date; end: Date }
  | { start?: Date; end?: Date };

export function createRiBuoyDownloadUrl(
  fileFormat: DF,
  variables: RiBuoyViewerVariable[],
  buoys: string[],
  time: StartAndOrEndDate | undefined = undefined
) {
  const vars = [
    ...variables.map(VARIABLE_CONVERTER.viewerToErddap),
    'time',
    'latitude',
    'longitude',
    'station_name',
  ].join(',');
  const stations = buoys.join('|');
  const start = time && time.start ? `&time>=${time.start.toISOString().split('T')[0]}` : '';
  const end = time && time.end ? `&time<=${time.end.toISOString().split('T')[0]}` : '';
  return createDownloadUrl(
    CONFIG['ri-buoy'].datasetId,
    fileFormat,
    `${vars}&station_name=~"(${stations})"${start}${end}`
  );
}
