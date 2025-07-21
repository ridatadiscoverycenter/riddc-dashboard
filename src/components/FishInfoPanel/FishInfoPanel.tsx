import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { Info } from '@/types';
import { ExternalLink, Header } from '@/components';

type FishInfoProps = {
  species: Info | undefined;
};

export function FishInfoPanel({ species }: FishInfoProps) {
  if (species === undefined) throw new Error('No species defined');
  return (
    <>
      <div className="flex justify-between place-items-center bg-cyan-800 dark:bg-black text-white px-6 py-4">
        <Header size="lg" className="font-bold" colorMode="dark">
          {species.name}
        </Header>

        {species.href ? (
          <ExternalLink href={species.href} className="inline-flex hover:opacity-50">
            Source{<ArrowTopRightOnSquareIcon className="size-4" />}
          </ExternalLink>
        ) : (
          <p>Source: FishBase</p>
        )}
      </div>
      <div className="grid grid-cols-3 m-4">
        <div className="col-span-2 space-y-2 flex flex-col gap-3">
          <p>
            <strong className="font-bold">Scientific Name: </strong>
            <em>{species.sciName || 'Unknown'}</em>
          </p>
          <p>
            <strong className="font-bold">IUCN Status: </strong>
            {species?.IUCN || 'Unknown'}
          </p>
          <p>
            <strong className="font-bold">Classification: </strong>
            {species.Classification || 'Unknown'}
          </p>
        </div>
        {species.photoUrl ? (
          <>
            {species.photoUrl}
            {/* <img
              className="col-span-1 rounded-md self-center justify-self-end"
              src={species.photoUrl}
              alt={`Picture of ${species.name}`}
            /> */}
          </>
        ) : undefined}
      </div>
    </>
  );
}
