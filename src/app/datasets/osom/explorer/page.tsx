import { FullBleedColumn, Header, OsomExporerMap } from '@/components';

export default async function OsomExplorer() {
  return (
    <FullBleedColumn className="w-full mt-2 gap-4">
      <Header size="lg" variant="impact" tag="h1">
        OSOM Explorer
      </Header>
      <OsomExporerMap rasterUrl="https://qa-tile-server.riddc.brown.edu/services/ocean_his_4384_temp@1/tiles/{z}/{x}/{y}.png" />
    </FullBleedColumn>
  );
}
