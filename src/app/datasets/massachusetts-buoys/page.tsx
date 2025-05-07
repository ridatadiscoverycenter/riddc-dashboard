import React from 'react';

import { ExternalLink, DefaultBuoyPage } from '@/components';
import { PageProps } from '@/types';
import { PageWrapper } from './PageWrapper';

export default async function MassachusettsBuoyData({ searchParams }: PageProps) {
  return (
    <React.Suspense fallback={<DefaultBuoyPage description={DESCRIPTION} />}>
      <PageWrapper
        params={searchParams}
        errorLinks={MA_BUOY_ERROR_LINKS}
        description={DESCRIPTION}
      />
    </React.Suspense>
  );
}

const MA_BUOY_ERROR_LINKS = [
  {
    href: '/datasets/massachusetts-buoys?buoys=bid101&vars=ChlorophyllSurface,ChlorophyllBottom&start=2017-06-01&end=2017-06-30',
    description: 'Changes in Chlorophyll at Cole in June 2017',
  },
  {
    href: '/datasets/massachusetts-buoys?buoys=bid102&vars=SalinityBottom,SalinitySurface&start=2018-05-01&end=2018-11-01',
    description: 'Changes in Salinity at Taunton from May through October 2018',
  },
];

const LINKS = {
  NBFSMN: () => (
    <ExternalLink href="https://dem.ri.gov/environmental-protection-bureau/water-resources/research-monitoring/narraganset-bay-assessment-fixed-site-monitoring">
      Narragansett Bay Fixed Station Monitoring Network (NBFSMN)
    </ExternalLink>
  ),
  MassDEP: () => (
    <ExternalLink href="https://www.mass.gov/orgs/massachusetts-department-of-environmental-protections">
      RIDEM-OWR
    </ExternalLink>
  ),
};

const DESCRIPTION = (
  <p>
    This dataset spans from 2017 to 2018 and was collected by the <LINKS.NBFSMN /> with{' '}
    <LINKS.MassDEP /> as the lead agency. The heatmap above summarizes the number of observations
    collected for each month for different variables. Use this heatmap to help you decide what data
    you want to visualize or download. When you have an idea, go ahead and select the buoys,
    variables and dates to explore. Or download the data in the most appropriate format for your
    analyses! To begin, select a variable to see what data is available.
  </p>
);
