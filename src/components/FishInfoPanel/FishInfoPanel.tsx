import { Info } from '@/types';
import { Header, Link } from '@/components';

type FishInfoProps = {
  species: Info | undefined;
};

export function FishInfoPanel({ species }: FishInfoProps) {
  if (species === undefined) throw new Error('No species defined');
  return (
    <div className="text-black">
      <Header size="lg" colorMode="light">
        {species.name}
      </Header>
      <div className="rounded-md border border-solid border-black">
        <div className="grid grid-cols-2 bg-blue-500 px-6 py-4">
          <p className="justify-self-start">Species Info</p>
          <p className="justify-self-end">
            {species.href ? (
              <Link href={species.href.replace('Summary', 'summary')}>Source: FishBase</Link>
            ) : (
              'Source: FishBase'
            )}
          </p>
        </div>
        <div className="grid grid-cols-3 m-4">
          <div className="col-span-2 space-y-2">
            <p>
              <strong>Scientific Name: </strong>
              <em>{species.sciName || 'Unknown'}</em>
            </p>
            <p>
              <strong>IUCN Status: </strong>
              {species.sectionData?.IUCN || 'Unknown'}
            </p>
            <p>
              <strong>Classification: </strong>
              {species.sectionData?.Classification?.Classification || 'Unknown'}
            </p>
          </div>
          {species.photoUrl ? (
            <img
              className="col-span-1 rounded-md self-center justify-self-end"
              src={species.photoUrl}
              alt={`Picture of ${species.name}`}
            />
          ) : undefined}
        </div>
      </div>
    </div>
  );
}
