import { Card } from '@/components/Card';
import Link from 'next/link';

const DATA_BETTER = [
  {
    title: 'ERDDAP',
    description: 'The database that stores raw data for RIDDC.',
    href: 'https://pricaimcit.services.brown.edu/erddap/index.html',
  },
  {
    title: 'Narragansett Bay Volume Viewer',
    description:
      'An accessible and interactive environment to explore and showcase volumetric Narragansett Bay data.',
    href: 'https://bay-viewer.riddc.brown.edu/',
  },
  {
    title: 'RIDDC Data Articles',
    description:
      'Articles and jupyter notebooks with stories, exploratory data analyses, and code examples using data stored in ERDDAP.',
    href: 'https://riddc-jupyter-book.web.app/notebooks/fox-kemper/first_example_aquarius.html',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center content-center gap-4 mx-2">
      <button className="my-12 border-4 rounded-lg border-cyan-800 dark:border-teal-100 shadow-sm hodver:shadow-zinc-200 hover:shadow-lg hover:dark:shadow-slate-500 dark:shadow-white text-2xl py-12 px-6 max-w-[34rem] transition-all duration-500">
        Explore our collection of present and historical data from the Narragansett Bay
      </button>
      <h2 className="text-lg">Additional RIDDC Data and Visualizations</h2>
      <ul className="margin-auto max-w-[1000px] grid sm:grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {DATA_BETTER.map(({ title, description, href }) => (
          <li key={title}>
            <Link href={href} className="flex-1">
              <Card>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="text-sm">{description}</p>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <>
      <div className="flex items-center justify-center w-full h-[50vh] text-lg italic">
        artificial space
      </div>
    </>
  );
}
