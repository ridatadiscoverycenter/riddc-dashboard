import { Card, ExternalLink, Link } from '@/components';

const DATASETS = [
  {
    name: 'Rhode Island Buoys',
    href: '/datasets/rhode-island-buoys',
    description: () => (
      <>
        Collected over 16 years by the{' '}
        <ExternalLink href="https://dem.ri.gov/environmental-protection-bureau/water-resources/research-monitoring/narraganset-bay-assessment-fixed-site-monitoring">
          Fixed-Site Monitoring Stations and Data in Narragansett Bay
        </ExternalLink>
        . Records 19 values from 13 buoys across Narragansett Bay.
      </>
    ),
  },
  {
    name: 'Massachusetts Buoys',
    href: '/datasets/massachusetts-buoys',
    description: () => (
      <>
        Two years of data from two buoys in Narragansett Bay. Collected by the{' '}
        <ExternalLink href="https://dem.ri.gov/environmental-protection-bureau/water-resources/research-monitoring/narraganset-bay-assessment-fixed-site-monitoring">
          Fixed-Site Monitoring Stations and Data in Narragansett Bay
        </ExternalLink>{' '}
        with{' '}
        <ExternalLink href="https://www.mass.gov/orgs/massachusetts-department-of-environmental-protection">
          MassDEP
        </ExternalLink>{' '}
        as the lead
      </>
    ),
  },
  {
    name: 'Real Time Data',
    href: '/datasets/real-time',
    description: () => <>Coming Soon!</>,
  },
  {
    name: 'Ocean State Ocean Model',
    href: '/datasets/osom',
    description: () => <>Coming Soon!</>,
  },
  {
    name: 'Plankton Time Series',
    href: '/datasets/plankton',
    description: () => <>Coming Soon!</>,
  },
  {
    name: 'Domoic Acid',
    href: '/datasets/domoic-acid',
    description: () => <>Coming Soon!</>,
  },
  {
    name: 'Fish Trawl Survey',
    href: '/datasets/fish-trawl',
    description: () => <>Coming Soon!</>,
  },
];

export default function Datasets() {
  return (
    <>
      <h2 className="text-lg mt-4">The Datasets</h2>
      <ul className="max-w-[1000px] grid sm:grid-cols-2 md:grid-cols-3 gap-8 p-4">
        {DATASETS.map(({ name, href, description }) => (
          <li key={href}>
            <Card className="bg-clear-300 hover:bg-clear-800 dark:bg-clear-100 hover:dark:bg-clear-300">
              <h3 className="text-lg font-bold font-header">
                <Link href={href}>{name}</Link>
              </h3>
              <p className="text-sm">{description()}</p>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
