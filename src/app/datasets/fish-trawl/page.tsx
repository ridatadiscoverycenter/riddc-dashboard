import { FishGrid } from '@/components/visualizations/Fish/FishGrid';
import { fetchCoordinates, fetchSamples } from '@/utils/data/api/fish';
import { fetchMulti } from '@/utils/fns';

// fetch coordinates:
// [
//   {
//     station_name: 'Whale Rock',
//     longitude: -71.4208,
//     latitude: 41.4395,
//     stationName: 'Whale Rock'
//   },
//   {
//     station_name: 'Fox Island',
//     longitude: -71.4186,
//     latitude: 41.5542,
//     stationName: 'Fox Island'
//   }
// ]

// Samples:
// [
//   {
//     species: 'Alosa_spp',
//     title: 'Alewife',
//     station: 'Fox Island',
//     year: 1959,
//     abun: 0.141666667,
//     animal: 'fish'
//   },
//   {
//     species: 'Alosa_spp',
//     title: 'Alewife',
//     station: 'Fox Island',
//     year: 1960,
//     abun: 0.2625,
//     animal: 'fish'
//   },
// ]

export default async function FishTrawl() {
  const { fishCoordinates, fishSamples } = await fetchMulti({
    fishCoordinates: fetchCoordinates(),
    fishSamples: fetchSamples(),
  });
  return (
    <FishGrid
      fishSamples={fishSamples.filter((sample) => sample.station === 'Whale Rock')}
    ></FishGrid>
  );
}
