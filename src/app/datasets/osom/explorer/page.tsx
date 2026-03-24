import { FullBleedColumn, Header, OsomExporerMap } from '@/components';

export default async function OsomExplorer() {
  return (
    <FullBleedColumn className="w-full mt-2 gap-4">
      <Header size="lg" variant="impact" tag="h1">
        OSOM Explorer
      </Header>
      <OsomExporerMap variable={'salt'} rasterIndex={0} />
    </FullBleedColumn>
  );
}
