import { ExternalLink, Link } from '@/components';
import { HomeLink } from './HomeLink';
import { DatasetShortcut } from './DatasetShortcut';

const LINK_COLORS =
  'text-white dark:text-white hover:text-teal-400 dark:hover:text-teal-300 no-underline transition-colors duraiton-500';

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 flex flex-row w-full p-2 gap-4 items-center text-xl font-thin bg-cyan-800 dark:bg-inherit dark:border-b-slate-400 dark:border-b">
      <HomeLink className={LINK_COLORS} />
      <div className="flex-1" aria-hidden />
      <DatasetShortcut className={LINK_COLORS} />
      <h2 className="hidden sm:flex">
        <Link href="/glossary" className={LINK_COLORS}>
          Glossary
        </Link>
      </h2>
      <h2 className="hidden sm:flex">
        <ExternalLink
          className={LINK_COLORS}
          href="https://pricaimcit.services.brown.edu/erddap/index.html"
        >
          ERDDAP
        </ExternalLink>
      </h2>
    </nav>
  );
}
