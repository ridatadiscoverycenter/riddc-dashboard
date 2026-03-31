import { z } from 'zod';
import { ExternalLink, FullBleedColumn, Header, OsomExporerMap } from '@/components';

import { PageProps } from '@/types';

export default async function OsomExplorer(props: PageProps) {
  const searchParams = await props.searchParams;
  const { dataset, variable, rasterIndex } = parseSearchParams(searchParams);
  return (
    <FullBleedColumn className="w-full mt-2 gap-4">
      <Header size="lg" variant="impact" tag="h1">
        OSOM Explorer
      </Header>
      <p>
        The Ocean State Ocean Model (OSOM) outputs data for the entire model area at every hour and
        a half between January 2005 and December 2022. Specific timepoints and subsets of this
        dataset have been exerpted here for you to explore. Use this map to see how the temperature,
        salinity, and water velocity* change over space and time.
      </p>
      <OsomExporerMap dataset={dataset} variable={variable} rasterIndex={rasterIndex} />
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
  dataset: 'annual-jan' | 'annual-jul';
  variable: 'salt' | 'temp';
  rasterIndex: number;
} = {
  dataset: 'annual-jan',
  variable: 'temp',
  rasterIndex: 0,
};

function parseSearchParams(params: PageProps['searchParams']): {
  dataset: 'annual-jan' | 'annual-jul';
  variable: 'salt' | 'temp';
  rasterIndex: number;
} {
  if (!params) return DEFAULT_PARAMS;
  const rawDataset = params['dataset'];
  const rawVariable = params['var'];
  const rawRasterIndex = params['index'];

  if (rawVariable === undefined && rawRasterIndex === undefined && rawDataset === undefined)
    return DEFAULT_PARAMS;

  const dataset = z.union([z.literal('annual-jan'), z.literal('annual-jul')]).safeParse(rawDataset);
  const variable = z.union([z.literal('salt'), z.literal('temp')]).safeParse(rawVariable);
  const rasterIndex = z
    .string()
    .transform((string) => parseInt(string))
    .safeParse(rawRasterIndex);

  if (dataset.success && variable.success && rasterIndex.success) {
    return { dataset: dataset.data, variable: variable.data, rasterIndex: rasterIndex.data };
  }
  console.error('failed to parse search params', params);
  return DEFAULT_PARAMS;
}
