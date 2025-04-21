import { GraphErrorPanel, MaBuoySummary, Card } from '@/components';
import { PlanktonSummary } from '@/components/visualizations/Vega/PlanktonSummary';
import type { PageProps } from '@/types';
import { fetchPlanktonCoordinates, fetchPlanktonData } from '@/utils/data/api/buoy/plankton';
import { ERROR_CODES, getPlanktonParams } from '@/utils/fns';

export default async function Plankton({ searchParams }: PageProps) {
  const parsed = getPlanktonParams(searchParams);
  const buoyCoords = await fetchPlanktonCoordinates();
  // const data = await fetchPlanktonData(parsed)

  let graphBlock: React.ReactNode;
  if (typeof parsed === 'string') {
    graphBlock = (
      <GraphErrorPanel
        error={parsed === ERROR_CODES.NO_SEARCH_PARAMS ? undefined : parsed}
        links={ERROR_LINKS}
      ></GraphErrorPanel>
    );
  } else {
    const planktonData = await fetchPlanktonData(
      parsed.buoys,
      parsed.vars,
      parsed.start,
      parsed.end
    );

    if (planktonData.length === 0) {
      graphBlock = (
        <GraphErrorPanel
          error="No data is available given the selected parameters."
          links={ERROR_LINKS}
        />
      );
    } else {
      graphBlock = <PlanktonSummary data={planktonData}></PlanktonSummary>;
    }
  }
  return <Card className="bg-clear-900 col-span-2 items-center">{graphBlock}</Card>;
}
// TODO put real links here
const ERROR_LINKS = [
  {
    href: '/datasets/plankton?buoys=bid21&vars=WaterTempSurface,WaterTempBottom&start=2017-01-01&end=2018-12-31',
    description: 'Changes in Water Temperature from 2017-2018',
  },
];
