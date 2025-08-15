import { fetchBreatheData } from '@/utils/data/api/breathe-pvd/sensors';

export default async function BreathePvd() {
  const fetchedData = await fetchBreatheData(
    ['250', '254'],
    new Date('2025-01-01'),
    new Date('2025-09-02')
  );
}
