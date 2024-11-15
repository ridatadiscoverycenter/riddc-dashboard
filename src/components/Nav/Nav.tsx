import { ExternalLink, Link, RiddcLogo } from '@/components';

const LINK_COLORS = 'text-white dark:text-white hover:text-teal-400 dark:hover:text-teal-300';

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 flex flex-row w-full p-2 gap-4 items-center text-xl bg-cyan-800 dark:bg-inherit dark:border-b-slate-400 dark:border-b">
      <Link href="/" className={LINK_COLORS}>
        <h1 className="flex flex-row items-center gap-4 font-bold font-header">
          <RiddcLogo size={3} />
          <span className="sm:flex hidden">Rhode Island Data Discovery Center</span>
          <span className="sm:hidden">RIDDC</span>
        </h1>
      </Link>
      <div className="flex-1" aria-hidden />
      <h2 className="hidden sm:flex">
        <Link href="/about" className={LINK_COLORS}>
          About
        </Link>
      </h2>
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
      <h2>
        <Link className={LINK_COLORS} href="/datasets">
          Datasets
        </Link>
      </h2>
    </nav>
  );
}
