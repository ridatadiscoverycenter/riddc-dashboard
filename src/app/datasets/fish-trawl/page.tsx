import { BuoyLocationsMap, Card } from '@/components';
import { FishTrawlSummary } from '@/components/visualizations/Vega/';
import { fetchCoordinates, fetchSamples, fetchSpecies } from '@/utils/data/api/fish';
import { fetchMulti } from '@/utils/fns';
import { AboutSpecies } from './AboutSpecies';

export default async function FishTrawl() {
  const { fishCoordinates, fishSamples, fishSpecies } = await fetchMulti({
    fishCoordinates: fetchCoordinates(),
    fishSamples: fetchSamples(),
    fishSpecies: fetchSpecies(),
  });

  return (
    <div className="m-4 grid grid-cols-2 md:grid-cols-3 grid-flow-row gap-4">
      <Card className="bg-clear-900 md:col-span-3 col-span-3 flex flex-col items-center justify-around gap-3">
        <FishTrawlSummary data={fishSamples}></FishTrawlSummary>
      </Card>
      <div className="flex flex-col items-center justify-around col-span-1 row-span-2">
        <h2 className="text-xl font-header font-bold">Where are these buoys?</h2>
        <BuoyLocationsMap locations={fishCoordinates} />
      </div>
      <Card className="text-black bg-clear-900 col-span-2 flex flex-col items-center justify-around gap-3">
        <AboutSpecies fishSpecies={fishSpecies}></AboutSpecies>
      </Card>
      <Card className="text-black bg-clear-900 col-span-2 flex flex-col items-center justify-around gap-3">
        obviously something else needs to go here
        <AboutSpecies fishSpecies={fishSpecies}></AboutSpecies>
      </Card>
    </div>
  );
}
