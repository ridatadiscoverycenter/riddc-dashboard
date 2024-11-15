import { Card, DownloadBuoyData, ExploreForm, ExternalLink, Link } from '@/components';
import { RiBuoyMap, RiBuoySummary } from '@/components/visualizations';
import {
  fetchRiBuoyCoordinates,
  fetchRiBuoyVariables,
  fetchRiSummaryData,
} from '@/utils/erddap/api/buoy';

const EXPLORE_STYLES =
  'bg-cyan-300 hover:bg-cyan-400 focus:bg-cyan-400 dark:bg-cyan-700 hover:dark:bg-cyan-600 focus:dark:bg-cyan-600 p-2 rounded-md drop-shadow-md hover:drop-shadow-lg focus:drop-shadow-lg';

export default async function RhodeIslandBuoys() {
  const buoyData = await fetchRiSummaryData();
  const buoyCoords = await fetchRiBuoyCoordinates();
  const buoyVars = await fetchRiBuoyVariables();
  return (
    <>
      <div
        /*className="p-4 grid grid-cols-1 gap-4 max-w-[1500px]"*/ className="p-4 flex flex-col gap-4 max-w-[1500px]"
      >
        <Card className="bg-white text-black border-none  flex flex-col align-middle items-center">
          <RiBuoySummary data={buoyData} />
        </Card>
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4" /*className="flex md:flex-row flex-col gap-4 items-stretch justify-stretch"*/
        >
          <Card>
            <h2 className="text-xl font-header font-bold">Explore!</h2>
            <p className="text-sm">
              Generate a line plot to compare data points from buoys in the dataset! Select some
              buoys, up to four variables, and a time range to start exploring.
            </p>
            <ExploreForm buoys={buoyCoords} variables={buoyVars} />
          </Card>
          <Card>
            <h2 className="text-lg">Not sure what to explore?</h2>
            <p className="text-sm">
              Here&apos;s some pre-selected example scenarios to choose from.
            </p>
            <ul className="flex-1 flex flex-col justify-around gap-2">
              <li className="w-full flex">
                <Link href="#" className={EXPLORE_STYLES}>
                  Changes in Water Temperature at N. Prudence and Conimicut Pt. from 2010 - 2011
                </Link>
              </li>
              <li className="w-full flex">
                <Link href="#" className={EXPLORE_STYLES}>
                  Changes in Depth at Greenwich Bay and GSO Dock from 2008 - 2009
                </Link>
              </li>
            </ul>
          </Card>
          <Card className="hidden sm:flex flex-col justify-center items-center border-white dark:border-gray-500 bg-white dark:bg-black">
            <h2 className="text-xl font-header font-bold">Where are these buoys?</h2>
            <RiBuoyMap locations={buoyCoords} />
          </Card>
          <Card>
            <h2>This historical data also is made available to download!</h2>
            <DownloadBuoyData buoys={buoyCoords} variables={buoyVars} />
          </Card>
        </div>
        <div className="my-2 text-center">
          The historical data available on this site has been compiled from the{' '}
          <ExternalLink href="http://www.dem.ri.gov/programs/emergencyresponse/bart/stations.php">
            Narragansett Bay Fixed-Site Monitoring Network
          </ExternalLink>
          . See{' '}
          <ExternalLink href="https://data-explorer.riddc.brown.edu/nbfsmn_disclaimer.pdf">
            the disclaimer
          </ExternalLink>{' '}
          for more information on the data as well as how to cite it.
        </div>
      </div>
    </>
  );
}
