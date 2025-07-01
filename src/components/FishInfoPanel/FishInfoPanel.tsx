import { Header, Link } from '@/components';

type FishInfoProps = {
  species: string;
  info: {
    sciName?: string;
    href?: string;
    sectionData?: { IUCN?: string; Classification?: { Classification: string } };
    photoUrl?: string;
  };
};

export function FishInfoPanel({ species, info }: FishInfoProps) {
  return (
    <>
      <Header size="lg">{species}</Header>
      <div className="rounded-md border border-solid border-black">
        <div className="grid grid-cols-2 bg-blue-500 px-6 py-4">
          <p className="justify-self-start">Species Info</p>
          <p className="justify-self-end">
            {info.href ? (
              <Link href={info.href.replace('Summary', 'summary')}>Source: FishBase</Link>
            ) : (
              'Source: FishBase'
            )}
          </p>
        </div>
        <div className="grid grid-cols-3 m-4">
          <div className="col-span-2 space-y-2">
            <p>
              <strong>Scientific Name: </strong>
              <em>{info.sciName || 'Unknown'}</em>
            </p>
            <p>
              <strong>IUCN Status: </strong>
              {info.sectionData?.IUCN || 'Unknown'}
            </p>
            <p>
              <strong>Classification: </strong>
              {info.sectionData?.Classification?.Classification || 'Unknown'}
            </p>
          </div>
          {info.photoUrl ? (
            <img
              className="col-span-1 rounded-md self-center justify-self-end"
              src={info.photoUrl}
              alt={`Picture of ${species}`}
            />
          ) : undefined}
        </div>
      </div>
    </>
  );
}
