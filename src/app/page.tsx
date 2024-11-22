import { Card, Link } from '@/components';

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
  //<div className="flex flex-col items-center content-center gap-4 mx-2">
  return (
    <>
      <Link
        href="/datasets"
        className="font-header my-12 border-4 rounded-lg border-clear-300 dark:border-clear-600 bg-clear-800 dark:bg-clear-300 shadow-sm hodver:shadow-zinc-200 hover:shadow-lg hover:dark:shadow-slate-500 dark:shadow-white text-2xl py-12 px-6 max-w-[34rem] transition-all duration-500"
      >
        Explore our collection of present and historical data from the Narragansett Bay
      </Link>
      <h2 className="text-lg">Additional RIDDC Data and Visualizations</h2>
      <ul className="margin-auto max-w-[1000px] grid sm:grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {DATA_BETTER.map(({ title, description, href }) => (
          <li key={title}>
            <Card className="bg-clear-500 border-none dark:bg-clear-200">
              <h3 className="text-lg font-bold font-header">
                <Link href={href}>{title}</Link>
              </h3>
              <p className="text-sm">{description}</p>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
