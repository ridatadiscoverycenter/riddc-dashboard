import { PageProps } from '@/types';
import {
  MA_BUOY_VIEWER_VARIABLES,
  MaBuoyViewerVariable,
  RI_BUOY_VIEWER_VARIABLES,
  RiBuoyViewerVariable,
} from '../data/api/buoy';

type Param = Exclude<PageProps['searchParams'], undefined>[string];

type Params = {
  buoys: ReturnType<typeof parseBuoyIds>;
  start: ReturnType<typeof parseDate>;
  end: ReturnType<typeof parseDate>;
};

export const ERROR_CODES = {
  NO_SEARCH_PARAMS: 'no-search-params',
  MISSING_START_DATE: 'No start date given. Select a start date, and click "explore"!',
  INVALID_START_DATE_TYPE:
    'Received multiple start dates. Delete one from the URL to view the vizualiation.',
  BAD_START_DATE: "The given start date couldn't be parsed. Select a different start date.",
  MISSING_END_DATE: 'No end date given. Select an end date, and click "explore"!',
  INVALID_END_DATE_TYPE:
    'Received multiple end dates. Delete one from the URL to view the vizualiation.',
  BAD_END_DATE: "The given end date couldn't be parsed. Select a different end date.",
  BAD_DATE_ORDER: 'The end date needs to be after the start date. Select a valid pair of dates.',
  NO_BUOYS: 'No buoys selected for this visualization. Select a buoy, and click "explore"!',
  BAD_BUOYS:
    'Multiple different buoy parameters were given. Delete one from the URL to view the vizualization.',
  NO_VARS:
    'No variables were selected for this visualization. Select up to 4, and click "explore"!',
  BAD_VARS:
    'Multiple different variable parameters were given. Delete one from the URL to view the vizualization.',
  INVALID_VARS:
    'An invalid variable was selected for the visualization. Select a different variable to view the vizualization.',
};

function getParams(searchParams: PageProps['searchParams']): Params | string {
  try {
    if (searchParams === undefined) throw new Error(ERROR_CODES.NO_SEARCH_PARAMS);

    // Get relevant data from search params.
    const buoys = searchParams['buoys'];
    const variables = searchParams['vars'];
    const startDate = searchParams['start'];
    const endDate = searchParams['end'];
    if (
      buoys === undefined &&
      variables === undefined &&
      startDate === undefined &&
      endDate === undefined
    )
      throw new Error(ERROR_CODES.NO_SEARCH_PARAMS);

    const start = parseDate(startDate, 'start');
    const end = parseDate(endDate, 'end');
    if (start.valueOf() >= end.valueOf()) throw new Error(ERROR_CODES.BAD_DATE_ORDER);
    return {
      buoys: parseBuoyIds(buoys),
      start: parseDate(startDate, 'start'),
      end: parseDate(endDate, 'end'),
    };
  } catch (ex) {
    return (ex as { message: string }).message;
  }
}

export function getRiParams(
  searchParams: PageProps['searchParams']
): string | (Params & { vars: RiBuoyViewerVariable[] }) {
  try {
    if (searchParams === undefined) throw new Error(ERROR_CODES.NO_SEARCH_PARAMS);

    const params = getParams(searchParams);
    if (typeof params === 'string') return params;

    const variablesParam = searchParams['vars'];

    if (variablesParam === undefined) throw new Error(ERROR_CODES.NO_VARS);
    if (variablesParam instanceof Array) throw new Error(ERROR_CODES.BAD_VARS);
    const variables = variablesParam.split(',');

    if (variables.every((vari) => RI_BUOY_VIEWER_VARIABLES.includes(vari as RiBuoyViewerVariable)))
      return { ...params, vars: variables as RiBuoyViewerVariable[] };
    throw new Error(ERROR_CODES.INVALID_VARS);
  } catch (ex) {
    return (ex as { message: string }).message;
  }
}

export function getMaParams(
  searchParams: PageProps['searchParams']
): string | (Params & { vars: MaBuoyViewerVariable[] }) {
  try {
    if (searchParams === undefined) throw new Error(ERROR_CODES.NO_SEARCH_PARAMS);

    // Get relevant data from search params.
    const params = getParams(searchParams);
    if (typeof params === 'string') return params;

    const variablesParam = searchParams['vars'];

    if (variablesParam === undefined) throw new Error(ERROR_CODES.NO_VARS);
    if (variablesParam instanceof Array) throw new Error(ERROR_CODES.BAD_VARS);
    const variables = variablesParam.split(',');

    if (variables.every((vari) => MA_BUOY_VIEWER_VARIABLES.includes(vari as MaBuoyViewerVariable)))
      return { ...params, vars: variables as MaBuoyViewerVariable[] };
    throw new Error(ERROR_CODES.INVALID_VARS);
  } catch (ex) {
    return (ex as { message: string }).message;
  }
}

export function parseBuoyIds(buoysParam: Param) {
  if (buoysParam === undefined) throw new Error(ERROR_CODES.NO_BUOYS);
  if (buoysParam instanceof Array) throw new Error(ERROR_CODES.BAD_BUOYS);
  return buoysParam.split(',');
}

function parseDate(dateParam: Param, dateType: 'start' | 'end') {
  if (dateParam === undefined)
    throw new Error(
      dateType === 'start' ? ERROR_CODES.MISSING_START_DATE : ERROR_CODES.MISSING_END_DATE
    );
  if (dateParam instanceof Array)
    throw new Error(
      dateType === 'start' ? ERROR_CODES.INVALID_START_DATE_TYPE : ERROR_CODES.INVALID_END_DATE_TYPE
    );
  const parsedStartDate = new Date(dateParam);
  if (isNaN(parsedStartDate.valueOf()))
    throw new Error(dateType === 'start' ? ERROR_CODES.BAD_START_DATE : ERROR_CODES.BAD_END_DATE);
  return parsedStartDate;
}
