import React from 'react';

import {
  BuoyLocationsMap,
  Card,
  DefaultBuoyPage,
  ExploreForm,
  ExternalLink,
  FullBleedColumn,
  Header,
  Link,
} from '@/components';
import { FishTrawlSummary } from '@/components/visualizations/Vega/';
import { fetchCoordinates, fetchSamples, fetchTemperatures } from '@/utils/data/api/fish';
import {
  ERROR_CODES,
  extractParams,
  fetchMulti,
  makeCommaSepList,
  parseParamBuoyIds,
  parseParamDate,
  parseParamSamples,
} from '@/utils/fns';
import { PageProps } from '@/types';
import { FishVariablesCard } from '@/components/visualizations/FishVariablesCard/FishVariablesCard';

export default async function FishTrawl({ searchParams }: PageProps) {
  return (
    <React.Suspense fallback={<DefaultBuoyPage description={DESCRIPTION} />}>
      <PageWrapper params={searchParams} errorLinks={ERROR_LINKS} />
    </React.Suspense>
  );
}

async function PageWrapper({
  params,
  errorLinks,
}: {
  params: PageProps['searchParams'];
  errorLinks: { href: string; description: string }[];
}) {
  const { buoyData, summaryData, temperatures } = await fetchMulti({
    buoyData: fetchCoordinates(),
    summaryData: fetchSamples(),
    temperatures: fetchTemperatures(),
  });

  const paramsOrError = extractParams(
    {
      buoys: parseParamBuoyIds(params ? params['buoys'] : undefined),
      vars: parseParamSamples(params ? params['vars'] : undefined),
      start: parseParamDate(params ? params['start'] : undefined, 'start'),
      end: parseParamDate(params ? params['end'] : undefined, 'end'),
    },
    [
      ERROR_CODES.NO_BUOYS,
      ERROR_CODES.NO_VARS,
      ERROR_CODES.MISSING_START_DATE,
      ERROR_CODES.MISSING_END_DATE,
    ]
  );

  return (
    <FullBleedColumn>
      <Header size="xl" variant="normal" className="mt-4">
        Narragansett Bay Fish Trawl
      </Header>
      <p className="my-5">
        The University of Rhode Island Graduate School of Oceanography Fish Trawl Survey is a state
        funded survey of the bottom fish and invertebrate community in Narragansett Bay, Rhode
        Island. The survey was initiated in 1959 by Charles J. Fish, founder and director of the
        Narragansett Marine Laboratory, the precursor to the Graduate School of Oceanography. The
        Fish Trawl Survey was developed to quantify the seasonal occurrences of migratory fish
        populations, whereas scientists had previously relied on anecdotal information.
      </p>
      <p>
        The heatmap below shows the abundance by year of the most commonly found fish in the
        University of Rhode Island Graduate School of Oceanography Fish Trawl Survey. The icons are
        sized and colored by abundance. To learn more about a species, select one from the{' '}
        <Link href="#species-about">Explore Panel</Link>.
      </p>
      <div className="full-bleed ">
        <div className="grid grid-cols-2 md:grid-cols-3 grid-flow-row gap-4 m-4">
          <Card className="bg-white/90 md:col-span-2 col-span-3 row-span-2 flex flex-col items-center justify-around gap-3">
            <FishVariablesCard
              params={paramsOrError}
              data={summaryData}
              errorLinks={errorLinks}
              weatherData={temperatures}
              description={
                typeof paramsOrError === 'string' ? undefined : (
                  <>
                    This plot compares {makeCommaSepList(paramsOrError.vars)} between{' '}
                    {paramsOrError.start.toLocaleDateString()} and{' '}
                    {paramsOrError.end.toLocaleDateString()} at{' '}
                    {makeCommaSepList(
                      paramsOrError.buoys.map(
                        (bid) => buoyData.find(({ buoyId }) => buoyId === bid)?.stationName || '???'
                      )
                    )}
                    . You can hover over the lines to see more specific data. The weather data below
                    is sourced from{' '}
                  </>
                )
              }
            />
          </Card>
          <ExploreForm
            buoys={buoyData}
            dataset="fish"
            dateBounds={{
              startDate: '1950',
              endDate: '2018',
            }}
            init={typeof paramsOrError === 'string' ? undefined : paramsOrError}
          />
          <div className="flex flex-col items-center justify-around col-span-1">
            <h2 className="text-xl font-header font-bold">Where are these buoys?</h2>
            <div className="h-96 w-96 max-w-full">
              <BuoyLocationsMap locations={buoyData} />
            </div>
          </div>
          <Card className="bg-white/90 col-span-3">
            <FishTrawlSummary
              data={summaryData}
              options={[
                { label: 'Fox Island', value: 'Fox Island' },
                { label: 'Whale Rock', value: 'Whale Rock' },
              ]}
            />
          </Card>
        </div>
      </div>
      <div className="col-span-3 flex flex-col items-center justify-center">
        <Header size="lg">About this Dataset</Header>
        {DESCRIPTION}
      </div>
    </FullBleedColumn>
  );
}

const LINKS = {
  URI: () => (
    <ExternalLink href="https://web.uri.edu/gso/research/fish-trawl/">
      University of Rhode Island Graduate School of Oceanography Fish Trawl Survey
    </ExternalLink>
  ),
  fishTrawl: () => (
    <ExternalLink href="https://web.uri.edu/gso/research/fish-trawl/data/">
      Fish Trawl Data Page
    </ExternalLink>
  ),
};

const DESCRIPTION = (
  <p>
    The data available on this site has been compiled from the <LINKS.URI />. To cite this data, see{' '}
    <LINKS.fishTrawl />
  </p>
);

const ERROR_LINKS = [
  {
    href: '/datasets/fish-trawl?buoys=Fox%20Island&vars=Alewife,Fourspot%20Flounder&start=1959-01-01&end=2018-12-31',
    description:
      'Alewife and Fourspot Flounder populations at Fox Island across the time series from 1959 to 2018',
  },
  {
    href: '/datasets/fish-trawl?buoys=Whale%20Rock,Fox%20Island&vars=Cancer%20Crab,Atlantic%20Herring&start=1999-01-01&end=2005-12-31',
    description: 'Cancer Crab and Atlantic Herring populations across sites from 1999 to 2005',
  },
];
