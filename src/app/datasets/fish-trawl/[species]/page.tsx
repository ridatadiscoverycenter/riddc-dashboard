// import { fetchInfo } from '@/utils/data/api/fish';

type InfoProps = { params: { species: string } };

export default async function SpeciesInfo({ params }: InfoProps) {
  return <p>Fish info for {params.species.replaceAll('%20', ' ')} coming soon!</p>;
}
