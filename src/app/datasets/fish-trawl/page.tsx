import { BuoyLocationsMap, Card, Link } from '@/components';
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
      <Card className="text-black bg-clear-900 md:col-span-3 col-span-3 flex flex-col items-center justify-around gap-3 p-16 pt-8">
        <h1 className="text-2xl font-header font-bold">Narragansett Bay Fish Trawl</h1>
        <p>
          The University of Rhode Island Graduate School of Oceanography Fish Trawl Survey is a
          state funded survey of the bottom fish and invertebrate community in Narragansett Bay,
          Rhode Island. The survey was initiated in 1959 by Charles J. Fish, founder and director of
          the Narragansett Marine Laboratory, the precursor to the Graduate School of Oceanography.
          The Fish Trawl Survey was developed to quantify the seasonal occurrences of migratory fish
          populations, whereas scientists had previously relied on anecdotal information.
        </p>
        <p>
          The heatmap below shows the abundance by year of the most commonly found fish in the
          University of Rhode Island Graduate School of Oceanography Fish Trawl Survey. The icons
          are sized and colored by abundance. To learn more about a species, select one from the{' '}
          <Link href="#species-about">Explore Panel</Link>.
        </p>
      </Card>
      <Card className="bg-clear-900 md:col-span-3 col-span-3 flex flex-col items-center justify-around gap-3">
        <FishTrawlSummary
          data={fishSamples}
          options={[
            { label: 'Fox Island', value: 'Fox Island' },
            { label: 'Whale Rock', value: 'Whale Rock' },
          ]}
        ></FishTrawlSummary>
      </Card>
      <div className="flex flex-col items-center justify-around col-span-1">
        <h2 className="text-xl font-header font-bold">Where are these buoys?</h2>
        <BuoyLocationsMap locations={fishCoordinates} />
      </div>
      <div id="species-about" className="col-span-2">
        <Card className="text-black bg-clear-900 flex flex-col items-center justify-around gap-3 h-80">
          <AboutSpecies fishSpecies={fishSpecies}></AboutSpecies>
        </Card>
      </div>
    </div>
  );
}
