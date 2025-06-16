import { fetchInfo } from '@/utils/data/api/fish';

type InfoProps = { params: { species: string } };

export default async function SpeciesInfo({ params }: InfoProps) {
  // const info = await fetchInfo(params.species);
  // return <p>{params.species}</p>;
  return <p>Fish info coming soon!</p>;
}
