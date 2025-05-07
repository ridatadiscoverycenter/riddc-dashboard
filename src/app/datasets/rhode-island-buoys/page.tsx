import React from 'react';

import { ExternalLink, DefaultBuoyPage } from '@/components';
import { PageProps } from '@/types';
import { PageWrapper } from './PageWrapper';

export default async function MassachusettsBuoyData({ searchParams }: PageProps) {
  return (
    <React.Suspense fallback={<DefaultBuoyPage description={DESCRIPTION} />}>
      <PageWrapper
        params={searchParams}
        errorLinks={RI_BUOY_ERROR_LINKS}
        description={DESCRIPTION}
      />
    </React.Suspense>
  );
}

const RI_BUOY_ERROR_LINKS = [
  {
    href: '/datasets/rhode-island-buoys?buoys=bid2,bid3&vars=temperatureBottom,temperatureSurface&start=2010-01-22&end=2011-01-22',
    description: 'Changes in Water Temperature at N. Prudence and Conimicut Pt. from 2010 - 2011',
  },
  {
    href: '/datasets/rhode-island-buoys?buoys=bid15,bid17&vars=depthBottom,depthSurface&start=2008-01-22&end=2009-01-22',
    description: 'Changes in Depth at Greenwich Bay and GSO Dock from 2008 - 2009',
  },
];

const LINKS = {
  NBFSMN: () => (
    <ExternalLink href="https://dem.ri.gov/environmental-protection-bureau/water-resources/research-monitoring/narraganset-bay-assessment-fixed-site-monitoring">
      Narragansett Bay Fixed Station Monitoring Network (NBFSMN)
    </ExternalLink>
  ),
  RIDEM_OWR: () => (
    <ExternalLink href="https://dem.ri.gov/environmental-protection-bureau/water-resources">
      RIDEM-OWR
    </ExternalLink>
  ),
  URI_GSO_MERL: () => (
    <ExternalLink href="https://web.uri.edu/gso/research/marine-ecosystems-research-laboratory">
      URI/GSO MERL
    </ExternalLink>
  ),
  NBC: () => <ExternalLink href="https://www.narrabay.com/">NBC</ExternalLink>,
  NBNERR: () => <ExternalLink href="http://nbnerr.org/">NBNERR</ExternalLink>,
  MASS_DEP: () => (
    <ExternalLink href="https://www.mass.gov/orgs/massachusetts-department-of-environmental-protection">
      MassDEP
    </ExternalLink>
  ),
};

const DESCRIPTION = (
  <p>
    This dataset spans from 2003 to 2019 and was collected by the <LINKS.NBFSMN /> with{' '}
    <LINKS.RIDEM_OWR /> as the lead agency. Agencies involved in collection and maintenance of the
    data are:
    <LINKS.RIDEM_OWR />, <LINKS.URI_GSO_MERL />
    , <LINKS.NBC />, <LINKS.NBNERR />, and <LINKS.MASS_DEP />. The heatmap below summarizes the
    number of observations collected for each month for different variables. Use this heatmap to
    help you decide what data you want to visualize or download. When you have an idea, go ahead and
    select the buoys, variables and dates to explore. Or download the data in the most appropriate
    format for your analyses! To begin, select a variable to see what data is available.
  </p>
);
