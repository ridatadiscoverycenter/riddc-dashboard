import { z } from 'zod';
import { ExternalLink, FullBleedColumn, Header, OsomExporerMap } from '@/components';
import {
  OsomExplorerDatasetSchema,
  OsomExplorerVariableSchema,
  type OsomExplorerDataset,
  type OsomExplorerVariable,
  type PageProps,
} from '@/types';

export default async function OsomExplorer(props: PageProps) {
  const searchParams = await props.searchParams;
  const { dataset, variable, timepoint } = parseSearchParams(searchParams);
  return (
    <FullBleedColumn className="w-full mt-2 gap-4">
      <Header size="lg" variant="impact" tag="h1">
        OSOM Explorer
      </Header>
      <p>
        The Ocean State Ocean Model (OSOM) outputs data for the entire model area at every hour and
        a half between January 2005 and December 2022. Specific timepoints and subsets of this
        dataset have been excerpted here for you to explore. Use this map and the controls below to
        see how the temperature, water salinity, and kinetic energy change over space and time.
      </p>
      <p style={{ marginTop: '1rem' }}>
        NetCDF files for the entire OSOM dataset are available for download from a{' '}
        <ExternalLink href="https://app.globus.org/file-manager?origin_id=660ecb5a-b446-4a71-9518-a98da0c12252&origin_path=%2F">
          Globus Collection.
        </ExternalLink>
      </p>
      <OsomExporerMap dataset={dataset} variable={variable} timepoint={timepoint} />
      <p>
        To explore more,{' '}
        <ExternalLink href="https://erddap.riddc.brown.edu/erddap/griddap/osom_v2_9429_72b1_b541.html">
          download the raw data
        </ExternalLink>{' '}
        or{' '}
        <ExternalLink href="https://erddap.riddc.brown.edu/erddap/griddap/osom_v2_9429_72b1_b541.graph">
          view individual timepoints
        </ExternalLink>{' '}
        on ERDDAP.
      </p>
    </FullBleedColumn>
  );
}

const DEFAULT_PARAMS: {
  dataset: OsomExplorerDataset;
  variable: OsomExplorerVariable;
  timepoint: number;
} = {
  dataset: 'monthly_avg',
  variable: 'WaterTempSurface',
  timepoint: 0,
};

function parseSearchParams(params: PageProps['searchParams']): {
  dataset: OsomExplorerDataset;
  variable: OsomExplorerVariable;
  timepoint: number;
} {
  if (!params) return DEFAULT_PARAMS;
  const rawDataset = params['dataset'];
  const rawVariable = params['var'];
  const rawTimepoint = params['index'];

  if (rawVariable === undefined && rawTimepoint === undefined && rawDataset === undefined)
    return DEFAULT_PARAMS;

  const dataset = OsomExplorerDatasetSchema.safeParse(rawDataset);
  const variable = OsomExplorerVariableSchema.safeParse(rawVariable);
  const timepoint = z
    .string()
    .transform((string) => parseInt(string))
    .safeParse(rawTimepoint);

  if (dataset.success && variable.success && timepoint.success) {
    return { dataset: dataset.data, variable: variable.data, timepoint: timepoint.data };
  }
  console.error('failed to parse search params', params);
  return DEFAULT_PARAMS;
}
