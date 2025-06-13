import { BuoyLocationsMap, Button, Card, Link, Select } from '@/components';
import { FishTrawlSummary } from '@/components/visualizations/Vega/';
import { fetchCoordinates, fetchSamples, fetchSpecies } from '@/utils/data/api/fish';
import { fetchMulti } from '@/utils/fns';

export default async function FishTrawl() {
  const { fishCoordinates, fishSamples, fishSpecies } = await fetchMulti({
    fishCoordinates: fetchCoordinates(),
    fishSamples: fetchSamples(),
    fishSpecies: fetchSpecies(),
  });
  // return <BuoyLocationsMap locations={fishCoordinates} />;
  return (
    <div className="m-4 grid grid-cols-2 md:grid-cols-3 grid-flow-row gap-4">
      <Card className="bg-clear-900 md:col-span-3 col-span-3 flex flex-col items-center justify-around gap-3">
        <FishTrawlSummary data={fishSamples}></FishTrawlSummary>
      </Card>
      <div>
        <h2 className="text-xl font-header font-bold">Where are these buoys?</h2>
        <BuoyLocationsMap locations={fishCoordinates} />
      </div>
      <Card className="bg-clear-900 md:col-span-2 col-span-3 flex flex-col items-center justify-around gap-3">
        <h2 className="text-xl font-header font-bold">Learn more</h2>
        <Select forceLight options={fishSpecies} label="Select a species:" dataset="na"></Select>
        <Button
          href={`/species/${species}`}
          className="sm:px-[calc(theme(spacing.10)-1px)] sm:py-[calc(theme(spacing[5])-1px)] sm:text-xl"
        >
          About
        </Button>
      </Card>
    </div>
  );
}
