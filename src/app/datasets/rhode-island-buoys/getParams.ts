import { PageProps } from '@/types';
import { RI_BUOY_VIEWER_VARIABLES, RiBuoyViewerVariable } from '@/utils/erddap/api/buoy';

type Param = Exclude<PageProps['searchParams'], undefined>[string];

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
  BAD_DATE_ORDER: "The end date needs to be after the start date. Select a valid pair of dates.",
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

export function getParams(searchParams: PageProps['searchParams']) {
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
      vars: parseVariables(variables),
      start: parseDate(startDate, 'start'),
      end: parseDate(endDate, 'end'),
    };
  } catch (ex) {
    return (ex as { message: string }).message;
  }
}

function parseBuoyIds(buoysParam: Param) {
  if (buoysParam === undefined) throw new Error(ERROR_CODES.NO_BUOYS);
  if (buoysParam instanceof Array) throw new Error(ERROR_CODES.BAD_BUOYS);
  return buoysParam.split(',');
}

function parseVariables(variablesParam: Param) {
  if (variablesParam === undefined) throw new Error(ERROR_CODES.NO_VARS);
  if (variablesParam instanceof Array) throw new Error(ERROR_CODES.BAD_VARS);
  const variables = variablesParam.split(',');
  if (variables.every((vari) => RI_BUOY_VIEWER_VARIABLES.includes(vari as RiBuoyViewerVariable)))
    return variables as RiBuoyViewerVariable[];
  throw new Error(ERROR_CODES.INVALID_VARS);
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
