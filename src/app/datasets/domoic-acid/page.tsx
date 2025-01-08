import { DomoicAcidMap } from '@/components';
import { fetchDomoicAcidCoordinates, fetchDomoicAcidSample } from '@/utils/data/api/da';

export default async function DomoicAcid() {
  const samples = await fetchDomoicAcidSample();
  const stations = await fetchDomoicAcidCoordinates();
  return (
    <>
      <h1>Domoic Acid</h1>
      <DomoicAcidMap samples={samples} stations={stations} />
    </>
  );
}
